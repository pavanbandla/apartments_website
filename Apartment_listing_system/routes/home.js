const express = require('express');
const router = express.Router();

const data = require("../data");
const apartmentlisting = data.apartmentlistings;

router.get('/', async (req, res) => {
    try{
        let flag = req.query.flag;
        
        let filter = {
            page: req.query.page,
            term: req.query.term,
            min_price: req.query.min_price,
            max_price: req.query.max_price,
            rating: req.query.rating,
        };
        
        let result = await apartmentlisting.searchApartments(filter);
        if (result.flag == true) {
            if(flag == 'ajax') {
                res.render("partials/search", {
                    layout : false,
                    searchapartments: result.searchapartments, 
                    total_count: result.total_count, 
                    current_page: result.current_page
                });
            }
            else {
                res.render("home", { authenticated: true, auth: req.session.auth, searchapartments: result.searchapartments, total_count: result.total_count, current_page: result.current_page });
            }
        } else {
            res.status(404).json({error: result.err});
        }
    }
    catch(e){
        let error = e.toString();
        console.log(error)
        res.status(404).json({error: e});
    }
});

module.exports = router;