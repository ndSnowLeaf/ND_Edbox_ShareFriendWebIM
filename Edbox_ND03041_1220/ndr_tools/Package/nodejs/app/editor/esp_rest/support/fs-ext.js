var fs=require("fs"),path=require("path"),Q=require("q"),walk=function(n,t){var r=[];Q.nfcall(fs.stat,n).then(function(){fs.readdir(n,function(a,i){if(a)return t(a);var u=0;!function a(){var f=i[u++];if(!f)return t(null,r);f=path.join(n,f),fs.stat(f,function(n,t){t&&t.isDirectory()?walk(f,function(n,t){r=r.concat(t),a()}):(r.push(f),a())})}()})},function(n){t(null,r)})};module.exports.walk=walk;