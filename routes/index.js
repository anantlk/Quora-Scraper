var express = require('express');
var scrape = require("../passport/scrape.js");
var router = express.Router();
var request=require('request');
var cheerio=require('cheerio');
var User=require("../models/users.js");

var isAuthenticated=function(req,res,next)
{
	if(req.isAuthenticated())
		return next();
	res.redirect("/");
}

module.exports=function(passport)
{
	router.get('/', function(req, res, next) {
	  res.render('index',{message:req.flash('message')});
	});

	router.post("/login",passport.authenticate('login',{
		successRedirect:'/home',
		failureRedirect:'/',
		failureFlash:true
	})
	);

	router.get("/signup",function(req,res){
		res.render('register',{message:req.flash('message')});
	});

	router.post("/signup",passport.authenticate("signup",{
		successRedirect:'/home',
		failureRedirect:"/signup",
		failureFlash:true
	}));
	router.get("/home",function(req,res){
		console.log("get request to home:");
		console.log(req.user);
		res.render('home',{user:req.user});
	});
	router.post("/home",function(req,res){
		var answers=[]
		console.log("Post request to home");
		console.log(req.body.ques);
		 request({
		uri:'https://www.quora.com/'+req.body.ques,
		method: 'get'
		}, function (err, response, body) {

		var $=cheerio.load(body);
		$('.ui_qtext_expanded').each(function(){
		  answers.push($(this).text());
		});
		console.log(answers);
		res.send(answers);
		});
	})
	router.get("/signout",function(req,res){
		req.logout();
		req.session.destroy(function(err){
			if(err)
			{
				console.log("error:"+err);
			}
			req.session.clear.cookies;
			return res.send({authenticated:req.isAuthenticated()});
		});
		res.redirect("/");
	});

	return router;
}
/* GET home page. */
