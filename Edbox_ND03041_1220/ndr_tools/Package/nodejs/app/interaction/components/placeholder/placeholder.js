define(["angular","css!components/placeholder/placeholder"],function(e){return{init:function(){function n(e){var e=e||window.event;return e.target||e.srcElement}function t(n){return e.element(n).val()}function r(e){return 0===t(e).length}function i(e){if(e&&("INPUT"==e.tagName||"TEXTAREA"==e.tagName)){var n=e.__emptyHintEl;n&&(r(e)?n.style.display="":n.style.display="none")}}function a(){i(this)}function o(t){if("placeholder"==window.event.propertyName){var r=n(t),i=r.getAttribute("placeholder");i&&e.element(r).prev().text(i)}}function c(e,n){var t=arguments;return function(){return e.apply(n,t)}}if(!("placeholder"in document.createElement("input")))for(var l=[document.getElementsByTagName("input"),document.getElementsByTagName("textarea")],u=9===document.documentMode,d=0;d<2;d++)for(var m=l[d],p=0;p<m.length;p++){var f=m[p],s=f.getAttribute("placeholder");if(s){var v=f.__emptyHintEl;if(v||(v=document.createElement("label"),s&&(v.innerHTML=s),v.className="ipt-placeholder",v.onclick=function(e){return function(){try{e.focus()}catch(e){}}}(f),f.value&&(v.style.display="none"),f.parentNode.insertBefore(v,f),f.__emptyHintEl=v),document.addEventListener?e.element(f).bind("input",a):e.element(f).bind("propertychange",a),u){e.element(f).bind("keyup",function(e){1==e.ctrlKey&&90==e.keyCode&&i(n(e))});var h;e.element(f).bind("focus",function(e){h=c(a,this,f),document.addEventListener("selectionchange",h)}),e.element(f).bind("blur",function(e){document.removeEventListener("selectionchange",h)})}window.attachEvent?f.attachEvent("onpropertychange",o):e.element(f).bind("change",o)}}}}});