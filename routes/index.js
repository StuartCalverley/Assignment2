var express = require('express');
var rp = require('request-promise');
var GoogleAuth = require('google-auth-library');
const pg = require('pg');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const connectionString = 'postgres://postgres:Nexxis13@localhost:5433/assignment2';
var value = new pg.Client(connectionString);
var auth = new GoogleAuth;
var client = new auth.OAuth2("814887631651-l5qk9hi208r2d6hcntta572599df2rbv.apps.googleusercontent.com", '', '');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/twitterStuff', function(req,res,next) {
	var options = {
		uri: "https://freemusicarchive.org/api/get/tracks.json?api_key=ANAJV1P5QUYZME80"
	};

	rp(options).then(function (result) {
		res.status(200).json(result);
	}).catch(function(error) {
		console.log("error: "+error);
	});
});

router.get('/auth', function(req,res,next) {
	var token = req.query.token;
	client.verifyIdToken(
    token,
    "814887631651-l5qk9hi208r2d6hcntta572599df2rbv.apps.googleusercontent.com",
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function(e, login) {
      var payload = login.getPayload();
      var userid = payload['sub'];
      res.send(userid);	
      // If request specified a G Suite domain:
      //var domain = payload['hd'];
    });
	rp.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamids=76561198056800639", function(error, steamHttpResponse, steamHttpBody) {
		//console.log(steamHttpBody);
	});
});

router.get('/signUp', function(req,res,next) {
	res.render('signup');
});

router.get('/registerUser', function(req,res,next) {
	var name = req.query.userName;
	var email = req.query.emailAcc;
	var password = req.query.pass;
	var hash = bcrypt.hashSync(password, salt);
	pg.connect(connectionString, function(err, clients, done) {
		done();
		if(err) {
			res.redirect('/');
		}
		clients.query("INSERT INTO users(password, email, username) VALUES ($1, $2, $3);", [hash, email, name], function(err, result) {
			
			if(err) {
				res.sendStatus(500);
			}
			res.sendStatus(200);
		})
	})
})

router.get('/application', function(req,res, next) {
	var googleSignIn = true;
	var email = req.query.param1;
	var password = req.query.param2;
	try {
		client.verifyIdToken(
	    req.query.param1,
	    "814887631651-l5qk9hi208r2d6hcntta572599df2rbv.apps.googleusercontent.com",
	    // Or, if multiple clients access the backend:
	    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
	    function(e, login) {
	    	try {
	    		var payload = login.getPayload();
	      		var userid = payload['sub'];
	    	} catch (err) {
	    		googleSignIn = false;
	    		pg.connect(connectionString, function (err, clients, done) {
	    			done();
	    			if(err) {
	    				console.log("NOPE");
	    				res.redirect('/');
	    			} else {
	    				clients.query("SELECT * FROM users WHERE email='"+email+"';", function(error, result) {
		    				if(error) {
		    					console.log("DAMN");
		    					res.redirect('/');
		    				}
		    				if(result == undefined) {
		    					res.redirect('/');
		    				} else {
		    					try {
		    						bcrypt.compare(password, result.rows[0].password, function(err, ser) {
				    					if(ser) {
				    						try{
				    							res.render('application');
				    						} catch (e) {
				    							res.redirect('/');
				    						}
				    					} else {
				    						res.redirect('/');
				    					}
				    				})
		    					} catch (errors) {
		    						res.redirect('/');
		    					}
		    					
		    				}
		    				
	    				})
	    			}
	    		})
	    	}

	    	if(googleSignIn) {
	    		res.render('application');
	    	}
	    });
	} catch (err) {
		res.redirect('/');
	}
	

});

module.exports = router;

//KEY = ANAJV1P5QUYZME80
