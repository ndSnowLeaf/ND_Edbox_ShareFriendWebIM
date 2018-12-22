
var config = {
    port: 3001,   
    // 进程数，系统自动获取或手工配置
    processNum: 1,//require('os').cpus().length,
    // log
    log: {
        //log level:DEBUG,INFO,WARNING,ERROR,FATAL
        local: { 
            level: 'DEBUG',
            pattern: "_yyyyMMdd.log",
            filename: 'log.txt' 
        }
    },
    lifecycleServer:'http://esp-lifecycle.web.sdp.101.com'
}

module.exports = config;
module.exports.config = config;