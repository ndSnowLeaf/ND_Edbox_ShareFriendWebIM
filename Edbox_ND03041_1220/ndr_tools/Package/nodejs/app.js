//var domain = require('domain');
var express = require('express');
var bodyParser = require('body-parser');
var cluster = require('cluster');
var path = require('path');
var errorHandler = require('errorhandler');
var i18n = require("i18n");
var appConfig = require('./app/editor/esp_rest/config');
var config = appConfig.config;
var log = require('./app/editor/esp_rest/common/log');
var routes = require('./app/editor/esp_rest/routes');
var routesExtend = null;
try {
	routesExtend = require('./app/editor/esp_rest/routes-extensions');
} catch(e){}

var app = express();
app.use(function(req, res, next) {
    log.info("recevie url : ",req.originalUrl);
    var language = null;
    if(!language){
        language = req.query._lang_;
    }
    if(language){
        language = appConfig.getLanguage(language);
        i18n.setLocale(language);
    }
    next();
});
app.set('query parser fn',config.queryOption);
//app.use(bodyParser());
app.use(bodyParser({limit: '10mb'})); //设置最大请求数据, 针对图形切割数据, 默认的太小, 引发Payload too large
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static(path.dirname(process.execPath) + '/app'));
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

routes(app);
!!routesExtend && routesExtend(app);

if (config.processNum > 1 && cluster.isMaster) {
    log.info("app", "master start...");
    // Fork workers.
    for (var i = 0; i < config.processNum; i++) {
        var worker_process = cluster.fork();
    }
    cluster.on('listening', function(worker, address) {
        log.info("app", 'listening: worker ' + worker.process.pid + ', Address: ' + address.address + ":" + address.port);
    });
    cluster.on('exit', function(worker, code, signal) {
        log.info("app", 'worker ' + worker.process.pid + ' died');
    });
} else {
    app.listen(config.port, function(e) {
        log.info("app", "listening on port " + config.port);
    });
}
var logError = function(err){
    if(err.stack){
        console.error(err.stack.split("\n"));
    }
    else{
        console.log(err);
    }
}
process.on("uncaughtException",function(err,req,resp){
    logError(err);
});

//添加手机-ppt同步服务器
var sync = require('./app/editor/esp_rest/sync/server');
sync.run(); 

exports = app;
log.info("init", "app init ok.");