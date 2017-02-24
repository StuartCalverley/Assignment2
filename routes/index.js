var express = require('express');
var rp = require('request-promise');
var GoogleAuth = require('google-auth-library');
const pg = require('pg');
var mysql = require('mysql')
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const connectionString = 'postgres://stuartCalverley:Nexxis13@assignment2db.cqoihnr68do8.us-west-2.rds.amazonaws.com:5432/assign2';
var auth = new GoogleAuth;
var client = new auth.OAuth2("221094573610-0ckr2a3h0d8rpa18fbpsh09381qpn25c.apps.googleusercontent.com", '', '');
var router = express.Router();

var connection = mysql.createPool({
	host: 'us-cdbr-iron-east-04.cleardb.net',
	user: 'bf23a0d88f3f72',
	password: 'b078956a',
	database: 'heroku_29cbaaca721eebf'
})

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
    "221094573610-0ckr2a3h0d8rpa18fbpsh09381qpn25c.apps.googleusercontent.com",
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function(e, login) {
    	try {
    		var payload = login.getPayload();
     		var userid = payload['sub'];
      		res.send(userid);	
    	} catch (error) {
    		res.send(error);
    	}
      	
      // If request specified a G Suite domain:
      //var domain = payload['hd'];
    });
});

router.get('/signUp', function(req,res,next) {
	res.render('signup');
});

router.get('/registerUser', function(req,res,next) {
	var name = req.query.userName;
	var active = 0;
	var email = req.query.emailAcc;
	var password = req.query.pass;
	var hash = bcrypt.hashSync(password, salt);	
	var post = {password, email, name, active	};

	connection.getConnection(function(err,conn) {
		if(!err) {
			conn.query("INSERT INTO users (password, email, username, active) VALUES ('"+hash+"','"+email+"', '"+name+"', "+active+")", function(err, result) {
				try {
					if(err) {
						res.send(err);
					} else {
						res.send("OK");
					}
				} catch (e) {
					res.send("ERROR");
				}
			})
		} else {
			res.send("NOPE");
		}
	})
})


router.get('/logout', function(req,res,next) {
	var email = req.query.email;
	console.log(email);
	pg.connect(connectionString, function(err,clients, done) {
		
		if(err) {
			done();
			res.send("ERROR");
		} else {
			clients.query("UPDATE users SET active = FALSE WHERE email = ($1);",[email],function(error,resulter) {
			if(error) {
				done();
				res.send("ERROR");
			} else {
				done();
				res.send("SUCCESS");	
			}
		})
		}		
	})
})

router.get('/update', function(req,res,next) {
	var email = req.query.email;	
	console.log("updating active");
	pg.connect(connectionString, function(err,clients, done) {
		
		if(err) {
			done();
			res.send(err);
		} else {
			clients.query("UPDATE users SET active=TRUE WHERE email=($1);",[email],function(error,resulter) {
			if(error) {
				done();
				res.send(error);
			} else {
				done();
				res.send(resulter);
			}
		})
		}
	})
})

router.get('/application', function(req,res, next) {
	var googleSignIn = true;
	var email = req.query.param1;
	var password = req.query.param2;
	try {
		client.verifyIdToken(
	    req.query.param1,
	    "221094573610-0ckr2a3h0d8rpa18fbpsh09381qpn25c.apps.googleusercontent.com",
	    // Or, if multiple clients access the backend:
	    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
	    function(e, login) {
	    	try {
	    		var payload = login.getPayload();
	      		var userid = payload['sub'];
	    	} catch (err) {
	    		googleSignIn = false;
	    		pg.connect(connectionString, function (err, clients, done) {
	    			if(err) {
	    				done();
	    				console.log(err);
	    				res.redirect('/');
	    			} else {
	    				clients.query("SELECT * FROM users WHERE email='"+email+"';", function(error, result) {
		    				if(error) {
		    					done();
		    					console.log("DAMN");
		    					res.redirect('/');
		    				}
		    				if(result == undefined) {
		    					done();
		    					res.redirect('/');
		    				} else {
		    					done();
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
