/**
 * 题型标题指令插件
 * 
 */
define(['angularAMD', 'components/site-services/utils.service'], function (angularAMD) {
    angularAMD.directive('contenteditable', ['UtilsService', function (UtilsService) {
        return {
        	require:"?ngModel",
			restrict: 'A',
            link: function(scope, element, attr, ngModel) {
            	// do nothing if no ng-model
            	if (!ngModel || 
            		attr.contenteditable!=="true" ||
            		element.is('input') || element.is('textarea')) {
            		return;
            	}
            	
            	// Specify how UI should be updated
                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || '');
                };

				//ngModel.$viewChangeListeners.push(function() {
				//	console.log("ngModel.$viewChangeListeners:" + ngModel.$viewValue);
				//});
                
                // Listen for change events to enable binding
                element.on('blur keyup change', function(event) {
                	//TODO 中文输入时,按下空格event.which=='32',但是按下回车时,却没有触发该事件
					var html = element.html();
					html = html.replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]/g,'');
					element.html(html);
                	if(event.type =='blur' || !isPinyin || (isPinyin && event.which == '32')) {
                		if(event.which < 37 || event.which > 40) {

                			UtilsService.safeApply(scope, readViewText);
                		}
                	}
                });
                
                var isPinyin, onPurePaste = false;
                element.on("keydown",function(event) {
                	isPinyin = (event.which == 229 || event.which == 197);
            		if(isExceedMaxLen(true)) {
            			var selection = window.getSelection();
            			if(selection.isCollapsed){
            				if(event.which != 8 && event.which != 46         //后退键(8), 删除键(46)
            				   && (event.which < 112 || event.which > 123)   //F1-F12
	            			   && (event.which < 37 || event.which > 40)){   //方向键: 上下左右
            					
	                			event.cancelable = true;
	                    		event.preventDefault();
	                    		return false;
	                		}
            			}
            		}
                }).on("paste", function(event) {
//                    var clipboardData = window.clipboardData || event.originalEvent.clipboardData;
//                    var textToClipboard = clipboardData.getData("Text");
//                    clipboardData.clearData();
//                    clipboardData.setData("Text", textToClipboard);
                	if(element.text() === "") {
                		onPurePaste = true;
                	}
                });
                
                // Write data to the model
                function readViewText() {
					var html = element.html();
                	if(attr.escapseHtml === 'true' || attr.escapseHtml === true) {
                		var isMaxLen = isExceedMaxLen(false);
                		var text = element.text();
                		if(isMaxLen) {
                			text = text.substr(0, maxLength);
                		}
						ngModel.$setViewValue(text);
						if(text != element.html()) {
							ngModel.$render();
						}
						
						if(onPurePaste || isMaxLen) {
							onPurePaste = false;
							UtilsService.moveCursor2End(element[0]);
	                	}
					} else {
						var html = element.html();
						ngModel.$setViewValue(html);
					}
                }
                
                // To check whether the element text' length exceeds the max-length
                var maxLength = attr.maxlength;
                function isExceedMaxLen(includeEqual) {
                	if(maxLength) {
                		var textlength = element.text().length;
                		return textlength > maxLength || (textlength >= maxLength && includeEqual);
                	}
                	
                	return false;
                }
            }
        };
    }]);
});
