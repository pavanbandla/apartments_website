const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require("../data");
const signin = data.signin;

//var salt = bcrypt.genSaltSync(16);

router.get("/", async (req, res) => {
    try {
        res.render("signin");
        
    } catch (e) {
        res.send(404).json({ error: e });
    }
});

router.post("/", async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        
        let result = await signin.authenticateUser(email, password);

        if(result.error) {
            res.status(200).json({ flag: false, msg: result.message });
        }
        else {
            req.session.auth = result.user;
            res.status(200).json({ flag: true, msg: "Ok", account_type: result.user.account_type });
        }
    } catch (e) {
        let error = e.toString();
        res.status(404).json({ flag: false, msg: error });
    }
});

module.exports = router;