define(['require','question-module','jquery','ckeditor','messenger','css!./style.css'],function(require,module){
	module.directive("lcCkeditor", ['$document','$i18n','$timeout','$console',function($document,$i18n,$timeout,$console){
		return {
			restrict : 'A',
			require : '?ngModel',
			scope : {
				type : '@lcCkeditor',
				onCreated : '&',
				onDataChange : '&',
				enableTextentryInteraction:'@?'
			},			
			link : function(scope, iElement, attrs, ngModel) {		
				var calculateCkeditorCount = function(html){					
					var div =  $("<div></div>").html(html);
					return div.find("img.cke_textEntryInteraction").length+div.find('textentryinteraction').length;
				};
				
				if(attrs.lcCkeditor!=='false'){
					var ckeditor;
					var config = {language:$i18n.getLanguage()};
					if(attrs.pasteType){
						config.pasteFilter = attrs.pasteType;
					}
					if(!scope.type || scope.type=='inline'){
						if(iElement){
							iElement.attr("contenteditable",false);
						}
						ckeditor= CKEDITOR.inline(iElement[0], config);
					}else{
						ckeditor= CKEDITOR.replace(iElement[0],config);
					}
					if(attrs.autoFocus==='true'){
						CKEDITOR.last_editor = ckeditor;
					}
					if(attrs.oneline=='true'){
						ckeditor.on('key',function(evt){
							if(evt.data.keyCode == 13){
								evt.cancel();
							}
						});
						ckeditor.on('paste',function(evt){
							var value = $("<div></div>").html(evt.data.dataValue).text();
							evt.data.dataValue = value;
							evt.data.type="text";
						});

					}
					if (!ngModel) {
						return;
					}
					if(!scope.enableTextentryInteraction){
						ckeditor.on('paste',function(event){
							var type = event.data.type;
							var value = event.data.dataValue;
							if(type=='html'&&calculateCkeditorCount(value)>0){
								$console.alert($i18n('qti.textentry.insert.notallowed'));
								event.data.dataValue = '';
								event.stop();
							}
						});
					}
					ckeditor.on('instanceReady', function() {						
						var value = ngModel.$viewValue || ngModel.$modelValue || "";					
						if(value=='null'){
							value = "";
						}
						setData(value); 						
					});
					var getData=function(){
						try{
							return ckeditor.getData();
						}catch(e){
							return ckeditor.getData();
						}
					};
					var setData=function(data){
						if(data==""){
							var read = getData();
							if(read==""){
								return;
							}
						}
						try{
							ckeditor.setData(data);
						}catch(e){
							ckeditor.setData(data);
						}
					};
					ckeditor.on('pasteState', function() {
						if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
						    scope.$apply(function() {
						    	var data = getData();
								ngModel.$setViewValue(data);
								scope.onDataChange({
									data:data,
									element:iElement,
									attrs:attrs
								});
							});
						}else{
							var data = getData();
							ngModel.$setViewValue(data);
							
							scope.onDataChange({
								data:data,
								element:iElement,
								attrs:attrs
							});
						}
					});
					ckeditor.on("activeEnterModeChange",function(evt ){
						//console.log(evt);
					});
					ngModel.$render = function(value) {						
						setData(ngModel.$viewValue);													
					};
					scope.onCreated({name:ckeditor.name,ckeditor:ckeditor});

					var textLength=function(){
						var text=ckeditor.element.getText().replace(/(^\s*)|(\s*$)/g, "");
						var len=0;
						for(var i=0;i<text.length;i++){
							if(text.charCodeAt(i)!=8203){
								len++;
							}
						}
						return len;
					};
					if (attrs.ndMaxlength) {
					    var maxlength = parseInt(attrs.ndMaxlength);
					    var maxLengthValidator = function(value) {
					      	if(!isNaN(maxlength) && !ngModel.$isEmpty(value) && textLength()>maxlength){
								ngModel.$setValidity('maxlength', false);
								return;
							}else{
								ngModel.$setValidity('maxlength', true);
								return value;
							}
					    };

					    ngModel.$parsers.push(maxLengthValidator);
					    ngModel.$formatters.push(maxLengthValidator);
					}
				}else{
					attrs.editorDisable='$all';
				}
				var disableChange = function(){
					var disableButtons=(attrs.editorDisable||'').split(',');
					if(angular.isFunction(window.disableButtons))	{
						window.disableButtons(disableButtons);
					}
				} 
				iElement.on('focus',function(){
					disableChange();
				});
				attrs.$observe('editorDisable', function() {
					if(document.activeElement==iElement[0]){
						disableChange();
					}
				});

				ngModel.$isEmpty = function(value) {
					if(angular.isUndefined(value) || value === '' || value === null || value !== value){
						return true;
					}
					value=value.replace(/(&nbsp;)|\s|(<div class=\"background_image\"[^>]*>)/g,'');
					return value=='<p></p>'||value=='<p></p></div>'||value=='</div>';
				}
			}
		};
	}]);
});