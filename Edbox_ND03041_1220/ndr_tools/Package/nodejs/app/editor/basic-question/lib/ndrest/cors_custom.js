var CORSCustom={};!function(){var t,e,n;__indexOf=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1},__slice=[].slice,CORSCustom.isIELower=function(){return window.XDomainRequest&&window.XMLHttpRequest&&void 0==(new window.XMLHttpRequest).withCredentials},CORSCustom.isIELower()&&(t=window.XMLHttpRequest,null==(e=window.location).origin&&(e.origin=window.location.protocol+"//"+window.location.host),n=function(t){try{t=JSON.parse(t)}catch(t){throw new Error("反序列号失败")}return t},CORSCustom.encodeData=function(t,e,n){var o={};return o.$method=t,o.$body=e,o.$headers=n,JSON.stringify(o)},CORSCustom.isXDomain=function(t){var e=window.location.origin.replace("http://","").replace("https://","");return!(t.indexOf(e)>-1)&&!(t.indexOf("http://")<0&&t.indexOf("https://")<0)},window.XMLHttpRequest=function(){function e(){}return e.prototype.open=function(){var e,o,i,r,s,a,u,p,d,m,l,c=this;if(o=arguments[0],i=arguments[1],CORSCustom.isXDomain(i)){for(i=i+(-1==i.indexOf("?")?"?":"&")+"$proxy=body",this.implementation=new XDomainRequest,this.implementation.onload=function(){var t=n(c.implementation.responseText);if(c.responseText=t.$body,c.readyState=4,c.statusText=t.$statusText,c.status=parseInt(t.$status),c.getAllResponseHeaders=function(){return t.$headers},c.onreadystatechange)return c.onreadystatechange()},this.implementation.onerror=function(){if(c.responseText=c.implementation.responseText,c.readyState=4,c.statusText="error",c.status=500,c.onreadystatechange)return c.onreadystatechange()},this.implementation.onprogress=function(){},this.abort=function(){var t;return(t=this.implementation).abort.apply(t,arguments)},this.send=function(){var t;return(t=c.implementation).send.apply(t,arguments)},l=["getResponseHeader","getAllResponseHeaders","setRequestHeader","onprogress","ontimeout"],s=function(t){return c[t]=function(){}},u=0,d=l.length;u<d;u++)e=l[u],s(e);return this.implementation.open("POST",i)}for(this.implementation=new t,this.implementation.onreadystatechange=function(){var t,e,n,o;if(4===c.implementation.readyState)for(o=["readyState","status","responseText"],e=0,n=o.length;e<n;e++)t=o[e],c[t]=c.implementation[t];if(c.onreadystatechange)return c.onreadystatechange()},m=["abort","getAllResponseHeaders","getResponseHeader","send","setRequestHeader"],r=function(t){return c[t]=function(){var e;return(e=this.implementation)[t].apply(e,arguments)}},a=0,p=m.length;a<p;a++)e=m[a],r(e);return this.implementation.open(o,i)},e}())}();