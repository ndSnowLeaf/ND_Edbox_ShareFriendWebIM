define(["angularAMD"],function(e){"use strict";e.service("UtilsService",[function(){return{getAngle:function(e,t,n,a){var o=Math.abs(e-n),r=Math.abs(t-a),c=Math.sqrt(Math.pow(o,2)+Math.pow(r,2)),i=Math.asin(r/c)/Math.PI*180;return e>n?t>a?i-=180:i=180-i:t>a&&(i*=-1),i},translateMatrixPoint:function(e,t){return!angular.isArray(e)||e.length<6?t:{x:e[0]*t.x+e[2]*t.y+e[4],y:e[1]*t.x+e[3]*t.y+e[5]}},getElementMatrix:function(e){var t=e.css("transform");if(t){t=t.toLowerCase().replace(/\s/g,"");var n=t.indexOf("matrix(");if(n>-1){var a=t.substring(n+"matrix(".length,t.indexOf(")",n)),o=[];return angular.forEach(a.split(","),function(e){o.push(parseFloat(e))}),o}}return null},getScalePercent:function(e){var t=this.getElementMatrix(e);return t?t[0]:1},getQuadrantIndex:function(e,t,n){var a=t/2,o=n/2;return e.y<o?e.x<a?1:2:e.x<a?3:4},isPointInsidePoly:function(e,t){for(var n=t.length,a=!1,o=-1,r=n-1;++o<n;r=o)(t[o].y<=e.y&&e.y<t[r].y||t[r].y<=e.y&&e.y<t[o].y)&&e.x<(t[r].x-t[o].x)*(e.y-t[o].y)/(t[r].y-t[o].y)+t[o].x&&(a=!a);return a},checkRectsCross:function(e,t){return Math.abs(t.right+t.left-e.right-e.left)<=e.right-e.left+t.right-t.left&&Math.abs(t.bottom+t.top-e.bottom-e.top)<=e.bottom-e.top+t.bottom-t.top},checkCircleCross:function(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))<2*(e.radius+t.radius)},calTwoPointDistance:function(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))},calPointToLineDistance:function(e,t){return Math.abs(t.a*e.x+t.b*e.y+t.c)/Math.sqrt(t.a*t.a+t.b*t.b)},getEquation:function(e,t){return{a:t.y-e.y,b:t.x-e.x,c:t.x*e.y-e.x*t.y}},shuffleArray:function(e,t){if($.isArray(e)&&e.length>0){(void 0===t||t<0)&&(t=e.length);for(var n=e.length,a=0;a<t&&a<n-1;a++){var o=Math.max(Math.floor(Math.random()*(n-a)),1)+a;if(o!=a){var r=e[a];e[a]=e[o],e[o]=r}}}return e},moveCursor2End:function(e){var t,n;window.getSelection&&document.createRange?(n=document.createRange(),n.selectNodeContents(e),n.collapse(!0),n.setEnd(e,e.childNodes.length),n.setStart(e,e.childNodes.length),t=window.getSelection(),t.removeAllRanges(),t.addRange(n)):document.body.createTextRange&&(n=document.body.createTextRange(),n.moveToElementText(e),n.collapse(!0),n.select())},positionCaret:function(e,t){if(e.setSelectionRange)e.setSelectionRange(t,t);else if(e.createTextRange){var n=e.createTextRange();n.moveStart("character",-textLength),n.moveEnd("character",-textLength),n.moveStart("character",t),n.moveEnd("character",0),n.select()}else{var a=document.createRange();a.setStart(e,t),a.collapse(!0);var o=window.getSelection();o.removeAllRanges(),o.addRange(a)}},getCaretPosInfo:function(e){if(e.setSelectionRange)return[e.selectionStart,e.selectionEnd-e.selectionStart];var t=window.getSelection();return[Math.min(t.anchorOffset,t.extentOffset),Math.abs(t.anchorOffset-t.extentOffset)]},removeStyleFromClipboard:function(e){e.preventDefault();var t=null;if(t=window.clipboardData&&clipboardData.setData?window.clipboardData.getData("text"):(e.originalEvent||e).clipboardData.getData("text/plain")||prompt("Input text here."),document.body.createTextRange){var n;if(document.selection)n=document.selection.createRange();else if(window.getSelection){var a=window.getSelection(),o=a.getRangeAt(0),r=document.createElement("span");r.innerHTML="&#FEFF;",o.deleteContents(),o.insertNode(r),n=document.body.createTextRange(),n.moveToElementText(r),r.parentNode.removeChild(r)}n.text=t,n.collapse(!1),n.select()}else document.execCommand("insertText",!1,t)},selectAllText:function(e){if(e.select)e.select(),e.focus();else if(document.body.createTextRange){var t=document.body.createTextRange();t.moveToElementText(e),t.select()}else if(window.getSelection){var n=window.getSelection(),t=document.createRange();t.selectNodeContents(e),n.removeAllRanges(),n.addRange(t)}},safeApply:function(e,t){if(e&&t){var n;n=e.$root?e.$root.$$phase:e.$$phase,"$apply"==n||"$digest"==n?t&&"function"==typeof t&&t():e.$apply(t)}}}}])});