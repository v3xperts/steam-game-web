var express = require('express');
var async = require('async');
var router = express.Router();
var groupMemberModel  =  require("../model/Groupmember.js");
var ownerModel  =  require("../model/Owner.js");

// add group

function getGroups (res) {
	groupMemberModel.find({}).populate('user').exec(function (err, groups) {
		if (err) {
			res.send(err);
		};
		res.json(groups);
	});
};

function getGroupUnique (res,data) {
	ownerModel.find({_id:{"$nin":data}},function (err, owners) {
		if (err) {
			res.send(err);
		};
		res.json(owners);
	});
};

function getGroup(res,id) {
	groupMemberModel.findById(id).populate('user').exec(function (err, group) {
		if (err) {
			res.send(err);
		};
		res.json(group);
	});
};

function getUser(res,userArray) {
	ownerModel.find({_id:{"$in":userArray}},function (err, owners) {
		if (err) {
			res.send(err);
		};
		res.json(owners);
	});
};

router.get('/groups',function  (req,res) {
	getGroups(res);
});

router.get('/auth-groups',function  (req,res) {
	var userId = req.session.userData._id;
	groupMemberModel.find({user:userId},function  (err, groups) {
		res.json(groups);
	});
});

router.get('/auth-group-member',function  (req,res) {
	var userId = req.session.userData._id;
	groupMemberModel.find({user:userId},function  (err, groups) {
		if (groups.length>0) {
			var groupIdObjArray = [];
			for (var j = 0; j < groups[0].members.length; j++) {
				if (groups[0].members[j].status) {
					groupIdObjArray.push(groups[0].members[j].user);
				};
			};
			if (groupIdObjArray.length>0) {
				getUser(res,groupIdObjArray);
			}else{
				res.json([]);
			};
		};
	});
});

router.get('/auth-group-member-invite',function  (req,res) {
	var userId = req.session.userData._id;
	groupMemberModel.find({user:userId},function  (err, groups) {
		if (groups.length>0) {
			var groupIdObjArray = [];
			for (var j = 0; j < groups[0].members.length; j++) {
				if (groups[0].members[j].status == false) {
					groupIdObjArray.push(groups[0].members[j].user);
				};
			};
			if (groupIdObjArray.length>0) {
				getUser(res,groupIdObjArray);
			}else{
				res.json([]);
			};
		};
	});
});

router.get('/groups/:id',function  (req,res) {
	getGroup(res,req.params.id);
});

router.get('/unique',function  (req,res) {
	var groupIdObjArray = [];
	groupMemberModel.find({},function  (err, groups) {
		if (err) {
			res.send(err);
		};
		for (var i = 0; i < groups.length; i++) {
			groupIdObjArray.push(groups[i].user);
		};
		getGroupUnique(res,groupIdObjArray);
	});
});

router.get('/uniquemember',function  (req,res) {
	var groupIdObjArray = [];
	ownerModel.find({},function  (err, users) {
		if (err) {
			res.send(err);
		};
		res.json(users)
	});
});

router.get('/invite-request',function  (req,res) {
	var groupIdObjArray = [];
	var userId = req.session.userData._id;
	groupMemberModel.find({}).populate('user').exec(function (err, groups) {
		if (err) {
			res.send(err);
		};
		for (var i = 0; i < groups.length; i++) {
			for (var j = 0; j < groups[i].members.length; j++) {
				if (groups[i].members[j].user == userId) {
					groupIdObjArray.push(groups[i]);
				};
			};
		};
		res.json(groupIdObjArray);
	});
});

router.get('/invite-reject/:id',function  (req,res) {
	var userId = req.session.userData._id;
	groupMemberModel.findById(req.params.id).populate('user').exec(function (err, groups) {
		if (err) {
			res.send(err);
		};
		for (var i = 0; i < groups.members.length; i++) {
			if (groups.members[i].user == userId) {
				groups.members.splice(i,1);
			};
		};
		groups.save();
		res.json({status:true});
	});
});

router.get('/invite-accept/:id',function  (req,res) {
	var userId = req.session.userData._id;
	groupMemberModel.findById(req.params.id).populate('user').exec(function (err, groups) {
		if (err) {
			res.send(err);
		};
		for (var i = 0; i < groups.members.length; i++) {
			if (groups.members[i].user == userId) {
				groups.members[i].status = true;
			};
		};
		console.log(groups.members);
		var updObj = {};
		updObj.members = groups.members;
		groupMemberModel.findByIdAndUpdate(groups._id, updObj, function(err, groupUpdate) {
			console.log(groupUpdate);
			res.json({status:true});
		});
	});
});

router.post('/groups',function (req,res) {
	var group = new groupMemberModel(req.body);
	group.save(function (err) {
		if (err) {
			res.send(err);
		};

		getGroups(res);	
	});
});

router.put('/groups/:id',function (req, res) {
	groupMemberModel.findByIdAndUpdate(req.params.id, req.body, function(err, group) {
		if (err) {
			res.send(err);
		};
		getGroup(res,req.params.id);
	});
});

router.delete('/groups/:id',function(req,res){
	groupMemberModel.remove({_id:req.params.id},function(err,group){
		if (err) {
			res.send(err)
		} 
		res.json(group);
	});	
});

module.exports = router;