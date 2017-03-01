var express = require('express');
var rp = require('request-promise');
var GoogleAuth = require('google-auth-library');
var mysql = require('mysql')
const connectionString = 'postgres://stuartCalverley:Nexxis13@assignment2db.cqoihnr68do8.us-west-2.rds.amazonaws.com:5432/assign2';
var auth = new GoogleAuth;
var client = new auth.OAuth2("221094573610-0ckr2a3h0d8rpa18fbpsh09381qpn25c.apps.googleusercontent.com", '', '');
var router = express.Router();


//Calls the steam API to get the friends list of the id provided
router.get('/', function(req,res,next) {
	var id = req.query.id;
	rp.get("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamid="+id+"&relationship=friend", function(error, steamHttpResponse, steamHttpBody) {
		//Returns list of friends id
		res.send(steamHttpBody);
	});
})

//Calls the steam API to get the detailed infomration of the id provided
router.get('/userInfo', function(req,res,next) {
	var id = req.query.id;
	rp.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamids="+id, function(error, steamHttpResponse, steamHttpBody) {
		//Returns to the ajax call the users information
		res.send(steamHttpBody);
	});
})

//Calls teh steam API to get the game library of the id provided
router.get('/gameLib', function(req,res,next) {
	var id = req.query.id;
	rp.get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamid="+id+"&format=json&include_appinfo=1",function(error, steamHttpResponse, steamHttpBody) {
		//A list of all the games the user owns with details of the game based off the user
		res.send(steamHttpBody);
	});
})

//Calls teh steam API to get the games recently played of the id provided
router.get('/recentGame', function(req,res,next) {
	var id = req.query.id;
	rp.get(" http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=E92B9E4AA98BA8FB1DB0C9132D275ED7&steamid="+id+"&format=json&count=5", function(error, steamHttpResponse, steamHttpBody) {
		//A list of recently played games is returned
		res.send(steamHttpBody);
	})
})






module.exports = router;