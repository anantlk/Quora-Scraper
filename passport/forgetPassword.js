var crypto=require('crypto');	
var async=require('async');
var nodemailer=require('nodemailer');
var User=require('../models/users.js');

module.exports=function(req,res)
{
	console.log("I have been called!!");
	async.waterfall([
		function(done)
		{
			crypto.randomBytes(20,function(err,buf){
				var token=buf.toString('hex');
				done(err,token);
			});
		},
		function(token,done)
		{
			console.log(req.body.email);
			User.findOne({email:req.body.email},function(err,user){
				if(!user)
				{
					console.log("No account with that email address exists");
					req.flash('error','No account with that email address exists');
					return res.redirect("/forget");
				}

				user.resetPasswordToken=token;
				user.resetPasswordExpiry=Date.now()+3600000;

				user.save(function(err){
					console.log("token saved");
					done(err,token,user);
				});
			});
		},
		function(token,user,done)
		{
			console.log("sending mail...");
			var smtpTransport=nodemailer.createTransport({
				service:"gmail",
				host:'smtp.gmail.com',
				port:465,
				auth:
				{
					user:"anant.lk.1997@gmail.com",
					pass:"iabxkxhsxrkuhixl"
				},
				secure:true
			});
			var mailOptions={
				to:"kakraniapincy@gmail.com",
				from:"anant.lk.1997@gmail.com",
				subject:"Account Password Reset",
				text:"You are reciveing this because you have requested the reset of you password.Please click on the following link to complete the process.\n\n"+
				"http://"+req.headers.host+'/reset/'+token+"\n\n"+"If you did not request this please ignore the mail."
			};
			smtpTransport.sendMail(mailOptions,function(err){
				console.log("email sent");
				req.flash('info','An email has been sent to '+user.email+ " with further instructions!!");
				done(err,'done');
			});
		}
		],function(err)
		{
			if(err)
				return console.log(err);
			res.redirect("/forget");
		});
}






