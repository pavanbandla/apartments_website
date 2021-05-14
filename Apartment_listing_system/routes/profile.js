const express = require('express');
const router = express.Router();

const data = require("../data");
const userData = data.users;

const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
    try{
        if (req.session.auth) {
            res.render("profile", { authenticated: true, auth: req.session.auth});
        } else {
            res.status(404).json({error: "User Not found"});
        }
    }
    catch(e){
        let error = e.toString();
        console.log(error)
        res.status(404).json({error: e});
    }
});

router.post("/upload_avatar", async (req, res) => {
    try {
        if(!req.files) {
            console.log('Error: Pdf file must be supplied while uploading.')
            res.status(403).send ({message: 'Error: Select the upload file.'});
        } else {
            let file = req.files.file;

            let new_file_name =  Date.now() + path.extname(file.name)
            file.mv('./public/avatar/' + new_file_name);
            res.status(200).send({flag: true, profile_picture: new_file_name});
        }
    } catch (err) {
        console.log('Error occured while upload :', err);
        res.status(500).end({flag: false, message: err});
    }
});

router.post("/update_profile", async (req, res) => {
    try {
        let user_id = req.session.auth._id;

        let obj = {
            user_id: user_id,
            profile_picture: req.body.profile_picture_path? req.body.profile_picture_path : "",
            username: req.body.username ? req.body.username : "",
            preference: req.body.preference ? req.body.preference : "",
            contact_info: req.body.contact_info ? req.body.contact_info: "",
            preferred_location: req.body.preferred_location ? req.body.preferred_location: ""
        }

        if(obj.profile_picture != req.session.auth.profile_picture && req.session.auth.profile_picture != '') {
            let path = './public/avatar/' + req.session.auth.profile_picture;
            if (fs.existsSync(path)) {
                fs.unlink(path, (err, files) => {
                    if(err) 
                    {
                        console.error(`Error occured while delete files ${err}`);
                        res.status(404).send({flag: false, error: err});
                    }
                });
            }
        }
        
        let result = await userData.updateProfile(obj);

        if(result.error) {
            res.status(200).json({ flag: false, msg: result.message });
        }
        else {
            req.session.auth.profile_picture = obj.profile_picture;
            req.session.auth.username = obj.username;
            req.session.auth.preference = obj.preference;
            req.session.auth.contact_info = obj.contact_info;
            req.session.auth.preferred_location = obj.preferred_location;

            res.status(200).json({ flag: true, msg: "Ok", auth: req.session.auth });
        }
    } catch (e) {
        let error = e.toString();
        console.log(error)
        res.status(404).json({ flag: false, msg: error });
    }
});

router.post("/change_password", async (req, res) => {
    
    try {
        
        let user_id = req.session.auth._id;

        let obj = {
            user_id: user_id,
            password: req.body.password   
        }

        let result = await userData.changePassword(obj);

        if(result.error) {
            res.status(200).json({ flag: false, msg: result.message });
        }
        else {
            req.session.auth.password = obj.password;
            res.status(200).json({ flag: true, msg: "Ok", auth: req.session.auth });
        }
    } catch (e) {
        let error = e.toString();
        console.log(error)
        res.status(404).json({ flag: false, msg: error });
    }

});


module.exports = router;