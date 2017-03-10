var express = require('express');
var async = require('async');
var router = express.Router();
var ownerModel  =  require("../model/Owner.js");
var userModel  =  require("../model/User.js");
var groupMemberModel  =  require("../model/Groupmember.js");
var pageModel  =  require("../model/Page.js");
var NodeGeocoder = require('node-geocoder');

var multer  = require('multer')
var upload = multer({ dest:'public/uploads/' });


var options = {
  	provider: 'google',
  	httpAdapter: 'https', // Default 
  	apiKey: null, // for Mapquest, OpenCage, Google Premier 
  	formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);

router.get('/dashboard', function(req, res, next) {
  var response={};
  var countApp = {};
	ownerModel.count({},function(err,ownerData){
		groupMemberModel.count({},function(err,groupMemberData){
			pageModel.count({},function(err,pageData){
				if (err)
					response = {"error" : true,"message" : "Error fetching data"};

				countApp = {'owner':ownerData,'groupMember':groupMemberData,'page':pageData};
				response = {"error" : false,"message" : countApp};
				res.json(response);
			});	
		});	
	});	
});

module.exports = router;
