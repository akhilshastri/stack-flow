var http = require("http");
var format = require('string-format');
var cheerio = require("cheerio");
var ent = require('ent');
format.extend(String.prototype);
var jsonfile = require('jsonfile');

var url = "http://stackoverflow.com/questions/tagged/{}?page={}&sort=votes&pagesize=50";//.format('angularjs',1);
var tags = ['angularjs'/*,'javascript','java','spring','hibernate','ruby','groovy','html','html5'*/];

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
    http.get(url, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
        callback(null);
    });
}

function pluckData (html){
    if(!html){
        return  [] ;
    }
    var $ = cheerio.load(html);
    var $questions =$("#questions");
    var votes = $("#questions .statscontainer .votes strong");
    var questions =$("#questions .question-summary .summary>h3 a") ;
    var asked =$("#questions .question-summary .summary span.relativetime") ;
    var cnt = votes.length;
    var result = new Array(cnt);
    var i=0;
    for(;i<cnt;i++){
        var question = questions.get(i);
        var vote = votes.get(i);
        var ask = asked.get(i);
        var time;
        if(ask){
            time= ask.attribs.title ;
        }
        result[i] = {
            vote:$(vote).html(),
            question:ent.decode( $(question).html()),
            link:question.attribs.href,
            time:time
        } ;

    }
    /*
     $("#mainbar .question-summary").each(function(i, e) {
     //console.log($(e).attr("src"));
     $("#questions").find(".summary>h3 a:first").attr('href')
     var data = $(e).find(".summary>h3 a").html();
     console.log( ent.decode( data));
     });
     */
 //   console.log(JSON.stringify(result));
    return result
}

var data = {};
tags.forEach( function(item){
    var tag = item;
    download(url.format(tag,1), function(page){
         var result =   pluckData(page);
        if(data[tag]){
            data[tag].push(result)
        }else{
            data[tag] = result;

        }
        console.log(tag);

        jsonfile.writeFile(tag +".json", result, function (err) {
            console.error(err)
        })
    } ) ;
}) ;

