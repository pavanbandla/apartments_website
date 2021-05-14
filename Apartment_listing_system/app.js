require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

var hbs = exphbs.create({
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        for: function (n, rating, block) {
			var accum = '';
			for(var i = 1; i <= n; i++) {
				if(rating >= i) {
					accum += '<span class="active"><i class="icofont-star"></i></span>';
				}
				else {
					accum += '<span><i class="icofont-star "></i></span>';
				}
			}
				
			return accum;
		},
		forRating: function (total_count, current_page, block) {
			var accum = '';
			let n;
			if(total_count/5 == 0 ) {
				n = 1;
			}
			else if(total_count%5 == 0) {
				n = total_count/5;
			}	
			else {
				n = total_count/5 + 1;
			}
			
			for(var i = 1; i <= n; i++) {
				if(current_page == i) {
					accum += `<li class="pagenation active" data-val="${i}"><a href="javascript:void(0);">${i}</a></li>`;
				}
				else {
					accum += `<li class="pagenation" data-val="${i}"><a href="javascript:void(0);">${i}</a></li>`;
				}
			}
				
			return accum;
		},
		ifCondEqual: function(v1, v2, options) {
			if(v1 == v2) {
			  return options.fn(this);
			}
			return options.inverse(this);
		},
		ifCondBigger: function(v1, v2, options) {
			if((v1/5) > v2) {
			  return options.fn(this);
			}
			return options.inverse(this);
		},
    }
});

app.use('/', static);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session({
	name: 'AuthCookie',
	secret: 'some secret string!',
	resave: false,
	saveUninitialized: true,
	cookie: {
        httpOnly: true,
        // secure: true,
		maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(fileUpload({
    createParentPath: true
}));

// app.use(cors());
app.use('/', async (req, res, next) => {
	if (!req.session.auth && req.url != '/signin' && req.url != '/signup') {
		res.redirect('/signin');
	}
	else {
		next();
	}
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});