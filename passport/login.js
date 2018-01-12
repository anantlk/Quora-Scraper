var localStrategy=require('passport-local').Strategy;
var User=require('../models/users.js');
var bCrypt=require('bcrypt-nodejs');

module.exports=function(passport)
{
	passport.use('login',new localStrategy({
		passReqToCallback:true
	},
	function(req,username,password,done)
	{
		User.findOne(function(err,user)
		{
			console.log("User Object is:"+user);
			if(err)
			{
				console.log("error is:"+err);
				return done(err);
			}
			if(!user)
			{
				console.log("User Not Found");
				return done(null,false,req.flash('message','User Not Found'));
			}
			if(!isValidPassword(user,password))
			{
				console.log("Invalid Password");
				return done(null,false,req.flash('message','Password Incorrect'));
			}

			return done(null,user);
		});
	})
	)
	var isValidPassword=function(user,password)
	{
		return bCrypt.compareSync(password,user.password);
	}
}