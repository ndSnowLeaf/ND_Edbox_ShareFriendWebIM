(function(){function r(r,e,n){var t=e&&n||0,u=0;for(e=e||[],r.toLowerCase().replace(/[0-9a-f]{2}/g,function(r){u<16&&(e[t+u++]=l[r])});u<16;)e[t+u++]=0;return e}function e(r,e){var n=e||0,t=s;return t[r[n++]]+t[r[n++]]+t[r[n++]]+t[r[n++]]+"-"+t[r[n++]]+t[r[n++]]+"-"+t[r[n++]]+t[r[n++]]+"-"+t[r[n++]]+t[r[n++]]+"-"+t[r[n++]]+t[r[n++]]+t[r[n++]]+t[r[n++]]+t[r[n++]]+t[r[n++]]}function n(r,n,t){var u=n&&t||0,o=n||[];r=r||{};var a=null!=r.clockseq?r.clockseq:p,f=null!=r.msecs?r.msecs:(new Date).getTime(),i=null!=r.nsecs?r.nsecs:g+1,c=f-m+(i-g)/1e4;if(c<0&&null==r.clockseq&&(a=a+1&16383),(c<0||f>m)&&null==r.nsecs&&(i=0),i>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");m=f,g=i,p=a,f+=122192928e5;var s=(1e4*(268435455&f)+i)%4294967296;o[u++]=s>>>24&255,o[u++]=s>>>16&255,o[u++]=s>>>8&255,o[u++]=255&s;var l=f/4294967296*1e4&268435455;o[u++]=l>>>8&255,o[u++]=255&l,o[u++]=l>>>24&15|16,o[u++]=l>>>16&255,o[u++]=a>>>8|128,o[u++]=255&a;for(var v=r.node||y,d=0;d<6;d++)o[u+d]=v[d];return n||e(o)}function t(r,n,t){var o=n&&t||0;"string"==typeof r&&(n="binary"==r?new c(16):null,r=null),r=r||{};var a=r.random||(r.rng||u)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,n)for(var f=0;f<16;f++)n[o+f]=a[f];return n||e(a)}var u,o=this;if("function"==typeof o.require)try{var a=o.require("crypto").randomBytes;u=a&&function(){return a(16)}}catch(r){}if(!u&&o.crypto&&crypto.getRandomValues){var f=new Uint8Array(16);u=function(){return crypto.getRandomValues(f),f}}if(!u){var i=new Array(16);u=function(){for(var r,e=0;e<16;e++)0==(3&e)&&(r=4294967296*Math.random()),i[e]=r>>>((3&e)<<3)&255;return i}}for(var c="function"==typeof o.Buffer?o.Buffer:Array,s=[],l={},v=0;v<256;v++)s[v]=(v+256).toString(16).substr(1),l[s[v]]=v;var d=u(),y=[1|d[0],d[1],d[2],d[3],d[4],d[5]],p=16383&(d[6]<<8|d[7]),m=0,g=0,w=t;if(w.v1=n,w.v4=t,w.parse=r,w.unparse=e,w.BufferClass=c,"undefined"!=typeof module&&module.exports)module.exports=w;else if("function"==typeof define&&define.amd)define(function(){return w});else{var h=o.uuid;w.noConflict=function(){return o.uuid=h,w},o.uuid=w}}).call(this);