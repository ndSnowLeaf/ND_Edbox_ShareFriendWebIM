var config=require("../config").config,Q=require("q"),log=require("./log"),util=require("./util"),redis=require("redis"),client=redis.createClient(config.redisPort,config.redisHost);client.select(config.redisDatabase,function(e){if(e){var r="select database - "+config.redisDatabase+" - "+e;log.error("redis",r)}});var errorFun=function(e){var r="error event - "+client.host+":"+client.port+" - "+e;log.error("redis",r),e&&setTimeout(function(){log.info("redis","redis auto_reselectdb------!"),client=redis.createClient(config.redisPort,config.redisHost),client.select(config.redisDatabase,function(e){e?log.info("redis","redis auto_reselectdb fail!"):log.info("redis","redis auto_reselectdb success!")}),client.on("error",errorFun)},config.dbreconnettime)};client.on("error",errorFun),exports.client=client;var getObj=function(e){var r=Q.defer();return client.get(e,function(e,t){if(e)return void r.reject(e);try{if(null==t||""==t)return r.resolve(null);var n=JSON.parse(t);r.resolve(n)}catch(e){r.reject(e)}}),r.promise},getStr=function(e){return Q.ninvoke(client,"get",e)};exports.otherCmd=function(e,r){return Q.ninvoke(client,e,r)};var setObj=function(e,r,t){return setStr(e,JSON.stringify(r),t).then(function(){return r})},setStr=function(e,r,t){return t?Q.ninvoke(client,"set",e,r).then(function(){return expire(e,t)}).then(function(){return r}):Q.ninvoke(client,"set",e,r).then(function(){return r})},expire=function(e,r){return Q.ninvoke(client,"expire",e,r)},remove=function(e){client.del(e)};exports.getObj=getObj,exports.getStr=getStr,exports.setObj=setObj,exports.setStr=setStr,exports.expire=expire,exports.remove=remove;