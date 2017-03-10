var express = require('express');
var router = express.Router();
var userModel  =  require("../model/User.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
	var response={};
	userModel.find({},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


router.get('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	userModel.findById(req.params.id,function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

// user register
router.post('/',function(req, res){
	var response={};
	// user.email = req.body.email;
	// user.name = req.body.name;
	req.body.password =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
    var user = new userModel(req.body);
	
    user.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : "Error adding data"};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

// login API
router.post('/login',function(req,res){
	var response={};
	var epassword = require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
	userModel.find({username:req.body.username,password:epassword},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data[0]};
		};
		res.json(response);
	});	
});

router.put('/:id',function(req, res){
	var response={};
	if (req.body.npassword) {
		req.body.password = require('crypto')
                          	.createHash('sha1')
                          	.update(req.body.password)
                          	.digest('base64');
	};
	userModel.findByIdAndUpdate(req.params.id, req.body, function(err, owner) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});

router.get('/userdetail/:username',function(req,res){
	var response={};
	console.log(req.params.username);
	userModel.find({username:req.params.username},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data[0]};
		};
		res.json(response);
	});	
});

module.exports = router;
