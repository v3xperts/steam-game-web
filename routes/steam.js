var express = require('express');
var async = require('async');
var router = express.Router();
var Steam = require('steam-webapi');

Steam.key = "68B8261C1AFE36CA4628BDD4623B625D";

router.get('/check', function(req, res, next) {
	Steam.ready(function(err) {
	    if (err) return console.log(err);

	    var steam = new Steam();

	    // Retrieve the steam ID from a steam username/communityID
	    steam.resolveVanityURL({vanityurl:'logindharam'}, function(err, data) {
	        console.log(data);
	        
	        // data -> { steamid: '76561197968620915', success: 1 }

	        // Get the Player's TF2 Backpack items
	        data.gameid = Steam.TF2;
	        // getPlayerItems requires { gameid, steamid }

	        steam.getPlayerItems(data, function (err, data) {
	            if (err) {
	            	res.send(err);
	            };
	            res.json(data);
	        });
	    });
	});
});

module.exports = router;
