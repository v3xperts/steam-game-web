var express = require('express');
var async = require('async');
var router = express.Router();
var pageModel  =  require("../model/Page.js");

function getPages (res) {
	pageModel.find(function  (err, pages) {
		if (err) {
			res.send(err);
		};
		res.json(pages);
	});
};

function getPage(res,id) {
	pageModel.findById(id, function  (err, page) {
		if (err) {
			res.send(err);
		};
		res.json(page);
	});
};

router.get('/',function  (req,res) {
	getPages(res);
});

router.get('/:id',function  (req,res) {
	getPage(res,req.params.id);
});

router.post('/',function (req,res) {
	var page = new pageModel(req.body);
	page.save(function (err) {
		if (err) {
			res.send(err);
		};

		getPages(res);	
	});
});

router.put('/:id',function (req, res) {
	pageModel.findByIdAndUpdate(req.params.id, req.body, function(err, page) {
		if (err) {
			res.send(err);
		};
		getPage(res,req.params.id);
	});
});

router.delete('/:id',function(req,res){
	pageModel.remove({_id:req.params.id},function(err,page){
		if (err) {
			res.send(err)
		} 
		res.json(page);
	});	
});	

module.exports = router;