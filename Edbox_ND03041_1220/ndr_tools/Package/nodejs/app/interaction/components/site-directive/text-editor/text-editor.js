define(["angularAMD"],function(e){e.directive("textEditor",[function(){return{require:"?ngModel",restrict:"A",scope:{},link:function(e,t,n,l){n.maxlength&&t.on("keydown",function(e){var t=e.target;if(t.value.length>=n.maxlength&&8!=e.keyCode&&46!=e.keyCode&&(e.which<37||e.which>40)&&t.selectionStart===t.selectionEnd)return e.cancelable=!0,e.preventDefault(),!1}),n.placeholder&&(t.on("focus",function(e){t.attr("placeholder","")}),t.on("blur",function(e){t.attr("placeholder",n.placeholder)})),!l||"true"!==n.escapseBlank&&!0!==n.escapseBlank||t.on("blur",function(t){""===$.trim(t.target.value)&&(t.target.value="",e.$apply(function(){l.$setViewValue("")}))})}}}])});