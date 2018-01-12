var login=require('./login');
var signup=require('./signup');
var User=require('../models/users');

module.exports=function(passport){
	passport.serializeUser(function(user,done){
		console.log("Serailizing user:"+user.username);
		console.log(user);
		done(null,user._id);
	});
	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
		console.log("deserializeUser:"+user);
		done(err,user);
		});
	});
	login(passport);
	signup(passport);
}