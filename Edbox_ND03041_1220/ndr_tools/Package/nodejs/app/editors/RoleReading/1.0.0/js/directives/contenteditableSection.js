define(['../sectionsModule.js', '../../templates/all_template.js'], function(module, tpls) {

	var sectionsModule = angular.module('SectionsModule');

	//div contenteditable指令
	sectionsModule.directive('contenteditableSection', ['$timeout', function ($timeout) {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				function deleteChinese(sHtml) {
					if(sHtml.length > 150){
						sHtml = sHtml.substring(0, 150);
					}
					/*匹配汉字，中文标点符号，html标签*/
					//var pattern = /([\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]*)(<\/?[^>]*?\/?>)?/gm;
					var pattern = /([\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]*)/gm;

					return sHtml.replace(pattern,"");
				}
				// view -> model
				// element.bind('input', function () {
				// 	scope.$apply(function () {
				// 		//console.log(element.text());
				
				// 		//element.html(deleteChinese(element.text()));
				// 		ctrl.$setViewValue(element.text());
				// 		ctrl.$render();
				// 	});
				// });
				/*去掉头尾空格,转换isEdit状态*/
				scope.setVal = function(){
					scope.$apply(function () {
						//console.log(element.text());
						var text = $.trim(element.text());
						element.html(text);
						ctrl.$setViewValue(text);
						scope.changeEdit(false);					
					});
					
				};
				element.bind('blur', function () {				
					scope.setVal();				
				});
				element.bind('keyup', function($event){
					var keycode =$event.keyCode || $event.which;//获取按键编码  
		            if (keycode == 13) {  
		                scope.setVal();	;//如果等于回车键编码执行方法  
		            }else{
		            	scope.$apply(function () {
							//console.log(element.text());
					
							//element.html(deleteChinese(element.text()));
							ctrl.$setViewValue(element.text());
							ctrl.$render();
						});
		            }
				});
				element.bind('paste', function () {
					var el, el2, range, sel, startContainer;
					el = element[0]
					range = document.createRange()
          			sel = window.getSelection()
          			//startContainer = range.startContainer;
          			var start = sel.anchorOffset;
          			console.log('paste='+start);
          			var oldText = element.text();
          			$timeout(function(){
          				element.text(deleteChinese(element.text()));
          				var newText = element.text();    
						range.setStart(el.childNodes[0], start + newText.length - oldText.length);        				
          				range.collapse(true)
			          	sel.removeAllRanges()
			          	sel.addRange(range)
          			}, 0);
				});

				/*enter键*/

				// model -> view
				ctrl.$render = function () {
					// console.log('render');
					var el, range, sel, oldText, newText, start;
					el = element[0];
					sel = window.getSelection();
					//range = document.createRange();
          			range = sel.getRangeAt(0);
          			element.focus();
          			start = sel.anchorOffset;
					oldText = element.text();
					$timeout(function(){
						var text = deleteChinese(ctrl.$viewValue || '');
						
						element.text(text);
						newText = text;
						if (el.childNodes.length > 0) {
				            range.setStart(el.childNodes[el.childNodes.length-1], start + newText.length - oldText.length)
			          	} else {
			            	range.setStartAfter(el)
			          	}
						
					
          				range.collapse(true);
			          	sel.removeAllRanges();
			          	sel.addRange(range);
          			}, 0);
					
					
					//if(html.length === 150){
						// var el, el2, range, sel;
						// el = element[0]
						// range = document.createRange()
	     //      			sel = window.getSelection()
	      
	     //      			if (el.childNodes.length > 0) {
				  //           el2 = el.childNodes[el.childNodes.length - 1]
				  //           range.setStartAfter(el2)
			   //        	} else {
			   //          	range.setStartAfter(el)
			   //        	}
			          	
			   //        	range.collapse(true)
			   //        	sel.removeAllRanges()
			   //        	sel.addRange(range)
				//	}
				};

				// load init value from DOM
				ctrl.$render();
			}
		};
	}]);
});