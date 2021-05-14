const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const data = require("../data");
const apartmentlisting = data.apartmentlistings;
const commentlisting = data.comments;

router.get('/', async (req, res) => {
    try{ 
        let result = await apartmentlisting.getAllApartments();
        if (result.flag == true) {
            
            res.render("apartment_list", { authenticated: true, auth: req.session.auth, apartments: result.allapartments });
        } else {
            res.status(404).json({error: err});
        }
    }
    catch(e){
        let error = e.toString();
        console.log(error)
        res.status(404).json({error: e});
    }
});

router.get('/detail/:id', async (req, res) => {
    try{
        var listing_id = req.params.id;
        let result = await apartmentlisting.getApartmentDetailByID(listing_id);
        if(result.flag == true) {
            res.render("apartment_detail", {authenticated: true, auth: req.session.auth, apartment: result.apartment})
        }
    }catch(e){
        let error = e.toString();
        console.log(error)
        res.status(404).json({error: e});
    }
});

router.get('/add', async (req, res) => {
    try{    
        res.render("apartment_add", {authenticated: true, auth: req.session.auth})
    }catch(e){
        let error = e.toString();
        console.log(error)
        res.status(404).json({error: e});
    }
});

router.get('/edit/:id', async (req, res) => {
    try{
        var listing_id = req.params.id;
        let result = await apartmentlisting.getApartmentByID(listing_id);
        if(result.flag == true) {
            res.render("apartment_edit", {authenticated: true, auth: req.session.auth, apartment: result.apartment})
        }
    }catch(e){
        let error = e.toString();
        console.log(error)
        res.status(404).json({error: e});
    }
});

router.get('/delete/:id', async (req, res) => {
    try{
        var listing_id = req.params.id;
        let result = await apartmentlisting.deleteApartmentByID(listing_id);
        if(result.flag == true) {
            res.redirect("/apartment");
        }
    }catch(e){
        let error = e.toString();
        console.log(error)
        res.status(404).json({error: e});
    }
});

router.post("/register", async (req, res) => {
    try {
        let utilities = 0;
        if(req.body.utilities) {
            utilities = 1;
        }

        let photos = [];
        if(req.body.file_name) {
            photos = req.body.file_name;
        }

        let user_id = req.session.auth._id;

        let obj = {
            user_id: user_id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            photos: photos,
            utilities_included: utilities
        }
        
        let result = await apartmentlisting.addApartment(obj);

        if(result.error) {
            res.status(200).json({ flag: false, msg: result.message });
        }
        else {
            res.status(200).json({ flag: true, msg: "Ok", new_id: result.new_id });
        }
    } catch (e) {
        let error = e.toString();
        console.log(error)
        res.status(404).json({ flag: false, msg: error });
    }
});

router.post("/update", async (req, res) => {
    try {
        let utilities = 0;
        if(req.body.utilities) {
            utilities = 1;
        }

        let photos = [];
        if(req.body.file_name) {
            photos = req.body.file_name;
        }

        let user_id = req.session.auth._id;

        let obj = {
            listing_id: req.body.listing_id,
            user_id: user_id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            photos: photos,
            utilities_included: utilities
        }
        
        let result = await apartmentlisting.updateApartment(obj);

        if(result.error) {
            res.status(200).json({ flag: false, msg: result.message });
        }
        else {
            res.status(200).json({ flag: true, msg: "Ok"});
        }
    } catch (e) {
        let error = e.toString();
        console.log(error)
        res.status(404).json({ flag: false, msg: error });
    }
});

router.post("/review", async (req, res) => {
    try {
        let user_id = req.session.auth._id;

        let obj = {
            user_id: user_id,
            listing_id: req.body.listing_id,
            review_text: req.body.review_text,
            review_score: req.body.review_score
        }
        
        let result = await apartmentlisting.addReview(obj);

        if(result.error) {
            res.status(200).json({ flag: false, msg: result.message });
        }
        else {
            res.status(200).json({ flag: true, msg: "Ok" });
        }
    } catch (e) {
        let error = e.toString();
        console.log(error)
        res.status(404).json({ flag: false, msg: error });
    }
});

router.post("/comment", async (req, res) => {
    try {
        let user_id = req.session.auth._id;

        let obj = {
            user_id: user_id,
            review_id: req.body.review_id,
            comment: req.body.comment,
        }
        
        let result = await commentlisting.addComment(obj);

        if(result.error) {
            res.status(200).json({ flag: false, msg: result.message });
        }
        else {
            res.status(200).json({ flag: true, msg: "Ok" });
        }
    } catch (e) {
        let error = e.toString();
        console.log(error)
        res.status(404).json({ flag: false, msg: error });
    }
})


router.post("/upload", async (req, res) => {
    try {
        if(!req.files) {
            console.log('Error: Pdf file must be supplied while uploading.')
            res.status(403).send ({message: 'Error: Select the upload file.'});
        } else {
            let file = req.files.file;

            let new_file_name =  Date.now() + path.extname(file.name)
            file.mv('./public/uploads/' + new_file_name);
            res.status(200).send({flag: true, file_name: new_file_name});
        }
    } catch (err) {
        console.log('Error occured while upload :', err);
        res.status(500).end({flag: false, message: err});
    }
});

router.post("/delete_file", async (req, res) => {
    try {
        if(!req.body.file_name) {
            console.log('Error: file must be supplied while deleteing.')
            res.status(403).send ({message: 'Error: Select the delete file.'});
        } else {
            //Use the name of the input field (i.e. "file") to retrieve the deleted file
            let file = req.body.file_name;
            let listing_id = req.body.listing_id;

            if(listing_id && listing_id != '') {
                let obj = {
                    listing_id: listing_id,
                    file: file,
                }
                
                let result = await apartmentlisting.updatePhoto(obj);
                if(result.error) {
                    res.status(200).json({ flag: false, error: result.message });
                }
                else {
                    let path = './public/uploads/' + file
                    if (fs.existsSync(path)) { 
                        fs.unlink(path, (err, files) => {
                            if(err) 
                            {
                                console.error(`Error occured while delete files ${err}`);
                                res.status(404).send({flag: false, error: err});
                            }
                            else {
                                console.log('Delete success.');
                                res.status(200).send({flag: true});
                            }
                        });
                    }
                }
            }
            else {
                let path = './public/uploads/' + file
                if (fs.existsSync(path)) { 
                    fs.unlink(path, (err, files) => {
                        if(err) 
                        {
                            console.error(`Error occured while delete files ${err}`);
                            res.status(404).send({flag: false, error: err});
                        }
                        else {
                            console.log('Delete success.');
                            res.status(200).send({flag: true});
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.log('Error occured while delete :', err);
        res.status(500).end({message: err});
    }
});

module.exports = router;