function getSubImageFileName(e,r,i,t,o){for(var u=1,n="sf-"+(o||1)+u+r+i+path.extname(e);fs.existsSync(t+"/"+n);)u+=1,n="sf-"+(o||1)+u+r+i+path.extname(e);return n}function split(e,r,i,t,o){for(var u=Q.defer(),n=sizeOf(e),a=n.width,p=n.height,f=a/i,s=p/r,c=[],h=[],m=0;m<r;m++){for(var l=[],g=0;g<i;g++){var d=g*f,v=m*s,q=(g+1)*f,x=(m+1)*s,b=getSubImageFileName(e,m,g,t,o),j=t+"/"+b;l.push({left:d,top:v,right:q,bottom:x,width:f,height:s,fileName:b,path:j}),h.push(crop(e,j,d,v,f,s))}c.push(l)}return Q.all(h).then(function(){u.resolve(c)},function(e){u.reject(e)}),u.promise}function crop(e,r,i,t,o,u){var n=Q.defer();return Jimp.read(e).then(function(e){e.crop(i,t,o,u).write(r,function(){n.resolve()})}).catch(function(e){console.log("crop[Jimp] image error",e),n.reject(e)}),n.promise}var Q=require("q"),path=require("path"),uuid=require("uuid"),fs=require("fs"),Jimp=require("jimp"),sizeOf=require("image-size");module.exports={split:split};