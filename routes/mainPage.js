var express = require('express');
var rp = require('request-promise');
var GoogleAuth = require('google-auth-library');
const pg = require('pg');
const connectionString = 'postgres://postgres:Nexxis13@localhost:5433/assignment2';
var value = new pg.Client(connectionString);
var auth = new GoogleAuth;
var client = new auth.OAuth2("814887631651-l5qk9hi208r2d6hcntta572599df2rbv.apps.googleusercontent.com", '', '');
var router = express.Router();

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
	pg.connect(connectionString, function(err,clients,done) {
		if(err) {
			done();
			res.send("ERROR");
		} else {
			clients.query("SELECT * FROM users WHERE active=TRUE;", function(error, result) {
				if(error) {
					done();
					res.send("ERROR");
				} else {
					done();
					res.send(["SUCCESS", result.rows.length]);
				}
			})
		}	
	})
})

module.exports = router;