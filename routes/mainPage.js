var express = require('express');
var rp = require('request-promise');
var GoogleAuth = require('google-auth-library');
var mysql = require('mysql')
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

router.get('/', function(req,res,next) {
	var id = req.query.id;
	rp.get("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamid="+id+"&relationship=friend", function(error, steamHttpResponse, steamHttpBody) {
		res.send(steamHttpBody);
	});
})

router.get('/userInfo', function(req,res,next) {
	var id = req.query.id;
	rp.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamids="+id, function(error, steamHttpResponse, steamHttpBody) {
		res.send(steamHttpBody);
	});
})

router.get('/gameLib', function(req,res,next) {
	var id = req.query.id;
	rp.get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamid="+id+"&format=json&include_appinfo=1",function(error, steamHttpResponse, steamHttpBody) {
		res.send(steamHttpBody);
	});
})

router.get('/recentGame', function(req,res,next) {
	var id = req.query.id;
	rp.get(" http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamid="+id+"&format=json&count=5", function(error, steamHttpResponse, steamHttpBody) {
		res.send(steamHttpBody);
	})
})

router.get('/currentUsers', function(req,res,next) {

	connection.getConnection(function(err,conn) {
				if(!err) {
					conn.query("SELECT * FROM users WHERE active=1;", function(error, result) {
						try {
							if(error) {
								res.send("ERROR");
							} else {
								//console.log(result.length);
								res.send("Number of current Users: "+ result.length);
							}
						} catch (e) {
							res.send("ERROR");
						}
					})
				} else {
					res.send("ERROR");
				}
			})
})




module.exports = router;