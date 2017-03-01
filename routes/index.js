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



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

//Loads the signup page
router.get('/signUp', function(req,res,next) {
	res.render('signup');
});

//Queries the database to get the current number of users connected
router.get('/currentUsers', function(req,res,next) {

	//Connects to the postgres databasese
	pg.connect(connectionString, function(err,clients,done) {
		if(err) {
			done();
			res.send("ERROR");
		} else {
			//Selects all users that are active on the website
			clients.query("SELECT * FROM users WHERE active=TRUE;", function(error, result) {
				if(error) {
					done();
					res.send("ERROR");
				} else {
					done();
					//Returns the number of users to the frontend of the website
					res.send(["SUCCESS", result.rows.length]);
				}
			})
		}	
	})
})

//Inserts a user into the database
router.get('/registerUser', function(req,res,next) {
	var name = req.query.userName;
	var active = 0;
	var email = req.query.emailAcc;
	var password = req.query.pass;
	//Hashes the users password
	var hash = bcrypt.hashSync(password, salt);	
	var post = {password, email, name, active	};

	pg.connect(connectionString, function(err, clients, done) {
		
		if(err) {
			done();
			res.redirect('/');
		} else {
			//Inserts the user into the database
			clients.query("INSERT INTO users(password, email, username) VALUES ($1, $2, $3);", [hash, email, name], function(err, result) {
				if(err) {
					done();
					//Returns that the insert into the database failed
						res.sendStatus(500);
				} else {
					done();
					//If the insert was successful return to the user that it was
					res.send("OK");
				}
			})
		}
		
	})
})

//When a user clicks the sign out button it sets their active tag to false
router.get('/logout', function(req,res,next) {
	var email = req.query.email;
	console.log(email);
	
	pg.connect(connectionString, function(err,clients, done) {
		
		if(err) {
			done();
			res.send("ERROR");
		} else {
			//Updates the users active status to false
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

//Updates the user's active feild to true
router.get('/update', function(req,res,next) {
	var email = req.query.email;	
	console.log("updating active");

	pg.connect(connectionString, function(err,clients, done) {
		
		if(err) {
			done();
			res.send(err);
		} else {
			//When a user logs in set their active tag to true
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

//Reidrects the user to the application page if their authentication is successful
router.get('/application', function(req,res, next) {
	var googleSignIn = true;
	var email = req.query.param1;
	var password = req.query.param2;
	//Tries to verify the google auth token
	try {
		client.verifyIdToken(
	    req.query.param1,
	    "221094573610-0ckr2a3h0d8rpa18fbpsh09381qpn25c.apps.googleusercontent.com",

	    function(e, login) {
	    	try {
	    		var payload = login.getPayload();
	      		var userid = payload['sub'];
	      		//If their is an error trying to store any information it will be caught
	    	} catch (err) {
	    		googleSignIn = false;
	    		//Connects to the database to see if the info the user provided is stored in the database
	    		pg.connect(connectionString, function (err, clients, done) {
	    			if(err) {
	    				done();
	    				console.log(err);
	    				//If the database connection fails they get redirected back to the home page
	    				res.redirect('/');
	    			} else {
	    				//Selects the row from the database that matches the email the user provided
	    				clients.query("SELECT * FROM users WHERE email='"+email+"';", function(error, result) {
		    				if(error) {
		    					done();
		    					console.log("DAMN");
		    					//If the query failed then redirect them back to the home page
		    					res.redirect('/');
		    				}
		    				//If nothing in the DB is found enter this statemeent
		    				if(result == undefined) {
		    					done();
		    					//No match redirect them back to the home page
		    					res.redirect('/');
		    				} else {
		    					done();
		    					try {
		    						//Compare the password the user provided with the one stored in the database
		    						bcrypt.compare(password, result.rows[0].password, function(err, ser) {
				    					if(ser) {
				    						try{
				    							//If the password match send them to the application page
				    							res.render('application');
				    						} catch (e) {
				    							res.redirect('/');
				    						}
				    					} else {
				    						//If the passwords do not match redirect them back to the home page
				    						res.redirect('/');
				    					}
				    				})
		    					} catch (errors) {
		    						//If at any point in the password comparision encounters an error redirect the user to the home page
		    						res.redirect('/');
		    					}
		    					
		    				}
		    				
	    				})
	    			}
	    		})
	    	}

	    	//If the google sign in was successful then load the application page
	    	if(googleSignIn) {
	    		res.render('application');
	    	}
	    });
	} catch (err) {
		res.redirect('/');
	}
	

});

module.exports = router;

