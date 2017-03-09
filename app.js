/*var http=require('http');


http.createServer(function(req,res){
	res.write("hello world!");
	res.write(JSON.stringify(process.env));
	res.end();
}).listen(process.env.VCAP_APP_PORT || 3000);
console.log('listen ...');*/

var express=require('express');
/*var bodyParser = require('body-parser');
var routes=require(process.cwd()+"/server/routes.js");
var filterSession=require(process.cwd()+"/server/sessions.js");*/




// see https://github.com/expressjs/body-parser
// 添加 body-parser 中间件就可以了
var app=express();

/*app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

filterSession.setSession(app);
filterSession.setWarningSession(app);
routes.setRoutes(app);*/


app.use(express.static(process.cwd() + '/web'));

app.listen((process.env.VCAP_APP_PORT || 80), null);
console.log('listen in '+(process.env.VCAP_APP_PORT || 80));