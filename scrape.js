var querystring = require('querystring');
var request = require('request');
var cheerio=require('cheerio');
var answers=[]  
module.exports=function(ques){
  request({
    uri:'https://www.quora.com/Is-Vellore-Institute-of-Technology-a-good-college',
    method: 'get'
  }, function (err, res, body) {
    
    var $=cheerio.load(body);
    $('.ui_qtext_expanded').each(function(){
      answers.push($(this).text());
      console.log(answers);
    });
  });
}