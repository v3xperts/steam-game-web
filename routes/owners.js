var express = require('express');
var router = express.Router();
var ownerModel  =  require("../model/Owner.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
	var response={};
	ownerModel.find({}, null, {sort: {firstname: 1}},function(err,data){
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
	req.body.password =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
    var owner = new ownerModel(req.body);
	
    owner.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : owner};
        }
        res.json(response);
    });
});

// Owner update
router.put('/:id',function(req, res){
	var response={};
	ownerModel.findById(req.params.id, function(err, owner) {
            if (err)
                res.send(err);
            owner.firstname = req.body.firstname;  // update the owners info
            owner.lastname = req.body.lastname;  // update the owners info
            owner.email = req.body.email;  // update the owners info
            owner.username = req.body.username;  // update the owners info
            // save the owner
			owner.save(function(err){
		    	if(err) {
		            response = {"error" : true,"message" : err};
		        } else {
		            response = {"error" : false,"message" : "Data Update"};
		        }
		        res.json(response);
		    });
        });
});

// login API
router.post('/login',function(req,res){
	var response={};
	var epassword = require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
	ownerModel.find({username:req.body.username,password:epassword},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data[0]};
		};
		res.json(response);
	});	
});

router.get('/userdetail/:username',function(req,res){
	var response={};
	console.log(req.params.username);
	ownerModel.find({username:req.params.username},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data[0]};
		};
		res.json(response);
	});	
});

router.get('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	ownerModel.find({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data[0]};
		};
		res.json(response);
	});	
});


// dish Detail
router.get('/active/:id',function(req,res){
	var response={};
	req.body.status = true;
	ownerModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data Update"};
        }
        res.json(response);
    });
});

// dish Detail
router.get('/deactive/:id',function(req,res){
	var response={};
	req.body.status = false;
	ownerModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data Update"};
        }
        res.json(response);
    });
});


router.delete('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	ownerModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});

module.exports = router;
