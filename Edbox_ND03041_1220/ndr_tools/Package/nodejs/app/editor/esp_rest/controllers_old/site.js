var config=require("../config").config;exports.index=function(e,n,i){return console.log("site","index in."),n.send("welcome to lcms local service.")},exports.config=function(e,n,i){var o={icplayer_path:config.icplayer_path};return n.send(o)};