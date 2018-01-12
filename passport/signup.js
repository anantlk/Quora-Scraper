var localStrategy=require('passport-local').Strategy;
var User=require('../models/users.js');
var bCrypt=require('bcrypt-nodejs');

 
module.exports = function(passport)
{
	passport.use('signup',new localStrategy({

		passReqToCallback:true
	},
	function(req,username,password,done)
	{
		createUser=function()
		{
			User.findOne({'username':username},function(err,user){
				if(err)
				{
					console.log("Error in signup:"+err);
					return done(err);
				}
				else if(user)
				{
					console.log('user alredy exists with usename:'+username);
					return done(null,false,req.flash('message','User Already Exists'));
				}
				else
				{
					var newUser=new User();

					newUser.username=username;
					newUser.password=createHash(password);
					newUser.email=req.param('email');
					newUser.firstName=req.param('firstName');
					newUser.lastName=req.param('lastName');

					newUser.save(function(err)
					{
						if(err)
						{
							console.log('Error in saving user:'+err);
							throw err;
						}
						console.log('User Registered Successfully');

					});
					return done(null,newUser);
				}
			});
		};
		process.nextTick(createUser);
	})
	);
	var createHash=function(password)
	{
		return bCrypt.hashSync(password,bCrypt.genSaltSync(10),null);
	}
}