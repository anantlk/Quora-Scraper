var async=require("async");
var nodemailer=require("nodemailer");
var User=require("../models/users.js");

module.exports=function(req,res){
		async.waterfall([
			function(done)
			{
				User.findOne({resetPasswordToken:req.params.token,resetPasswordExpiry:{$gt:Date.now()}},function(err,user){
					if(!user)
					{
						req.flash("Token is has expired");
						return res.redirect("back");
					}

					user.password=req.body.password;
					user.resetPasswordToken=undefined;
					user.resetPasswordExpiry=undefined;

					user.save(function(err)
					{
						req.logIn(user,function(err)
						{
							done(err,user);
						});
					});
				});
			},
			function(done,user)
			{
				var smtpTransport=nodemailer.createTransport('SMTP',{
					service:'Gmail',
					auth:
					{
						user:'anant.lk.1997@gmail.com',
						pas:'-----'
					}
				});
				var maiOptions={
					to:user.email,
					from:"anant.lk.1997@gmail.com",
					subject:"Password Changed",
					text:"Hello!!This is confirmation that the password for your account "+user.email+" has been changed successfully"
				};
				smtpTransport.sendMail(mailOptions,function(err){
					req.flash("success","Success!You password has been changed");
					done(err);
				});
			}
			],function(err){
				res.redirect("/");
			});
	}