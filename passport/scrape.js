var querystring = require('querystring');
var request = require('request');
var cheerio=require('cheerio');
var answers=[]  
module.exports=function(ques){
  console.log("Hello I am here");
  request({
    uri:'https://www.quora.com/'+ques,
    method: 'get'
  }, function (err, res, body) {
    
    var $=cheerio.load(body);
    $('.ui_qtext_expanded').each(function(){
      answers.push($(this).text());
    });
    console.log(answers);
    console.log("I am returning it");
  });
}