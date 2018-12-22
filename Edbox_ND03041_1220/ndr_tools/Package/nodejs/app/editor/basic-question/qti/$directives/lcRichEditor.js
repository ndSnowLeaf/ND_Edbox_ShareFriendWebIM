define(['require','question-module','jquery'],function(require,module){
	var $=require('jquery');
	module.directive("lcRichEditor", ['$i18n','$document','$timeout','$config','$url','$console','$q','$asset','$stateParams','$location','$context',
		function($i18n,$document,$timeout,$config,$url,$console,$q,$asset,$stateParams,$location,$context){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				beforeCommand:'&',
				showItemCommand:'@',
				assetChapterIds:'=',
				defaultKeyword:'='
					
			},
			templateUrl:'qti/$directives/lcRichEditor.html',
			link : function(scope, iElement, iAttrs) {
				scope.lang = $context.getLang();
				var executeCommand=function(commandName,fn){
					var editor = scope.beforeCommand({commandName:commandName});
					executeCommandFn(editor,fn);
				};
				var executeCommandFn=function(editor,fn){
					if(editor===false){
						return;
					}else if(!editor){
						editor = CKEDITOR.last_editor;
					}else if(angular.isString(editor)){
						editor = CKEDITOR.instances[editor];
					}
					if(editor){
						if(editor.then){
							editor.then(function(ed){
								executeCommandFn(ed,fn);
							});
						}else{
							if(editor.status=='ready'){
								fn(editor);
							}else{
								editor.on('instanceReady',function(){
									fn(editor);
								});
							}							
							CKEDITOR.last_editor=editor;
						}
					}
				};
				scope.onImageSelect=function(item){
					item = $asset.processItem(item,'image');
					var width = item.width || 200;
					var height = item.height || 0;	
					var rate = 300.0/item.width;
					
					if(width>300){
						width = width * rate;
						height = height * rate;
					}					
					var href=item.actualHref;
					executeCommand('image',function(editor){
						insert_image(editor,{filename: item.title,type:'image',url:href,width:width,height:height});						
						editor.focus();
					});
					scope.imageDialog.close();
				};
				
				var checkVideo=function(item){
					var deferred=$q.defer();
					var href=item.tech_info.href;
					var size=parseInt(href.size)||0;
					var sizeError=size>$config.maxfilesize.video;
					var code;
					if(href.requirements){
						for(var i=0;i<href.requirements.length;i++){
							if(href.requirements[i].name=='code'){
								code = href.requirements[i].value;
								break;
							}
						}
					}
					var codeError=false;
					if(sizeError || codeError){
						var message;
						if(sizeError && codeError){
							message=$i18n("resource.upload.video.maxsize_and_emptycode");
						}else if(sizeError){
							message=$i18n("resource.upload.video.maxsize");
						}else{
							message=$i18n("resource.upload.video.formaterror");
						}
						$console.confirm(message,function(){
							deferred.resolve();
						},function(){
							deferred.reject();
						});
					}else{
						deferred.resolve();
					}
					return deferred.promise;
				};
				var checkAudio=function(item){
					var deferred=$q.defer();
					var href=item.tech_info.href;
					var size=parseInt(href.size)||0;
					var sizeError=size>$config.maxfilesize.audio;
					if(sizeError){
						var message=i18n("resource.upload.audio.maxsize");
						$console.confirm(message,function(){
							deferred.resolve();
						},function(){
							deferred.reject();
						});
					}else{
						deferred.resolve();
					}
					return deferred.promise;
				};
				scope.onVideoSelect=function(item){
					checkVideo(item).then(function(){
						var href=item.actualHref;
						var preview = $url.staticFiles("default_video.png",$stateParams.id);
						executeCommand('video',function(editor){
							insert_video_or_audio(editor,{filename: item.title,type:'video',url:href,poster:preview,width:300,height:300});
							editor.focus();
						});
						scope.videoDialog.close();
					});
				};
				scope.onAudioSelect=function(item){ 
					checkAudio(item).then(function(){
						var href=item.actualHref;
						var preview = $url.staticFiles("default_audio.png",$stateParams.id);
						executeCommand('audio',function(editor){
							insert_video_or_audio(editor,{filename: item.title,type:'audio',url:href,poster:preview,width:50,height:30});
							editor.focus();
						});
						scope.audioDialog.close();
					});
				};
				
				scope.clickButton=function(btn,$event){
					if(btn.disabled) return;
					if(angular.isFunction(btn.click)){
						btn.click($event);
					}
				};
				
				var command=function(name){
					return function(){
						executeCommand(name,function(editor){
							editor.execCommand(name);
							editor.focus();
						});
						return false;
					};
				};
				var noop=function(name){
					return function(){
						executeCommand(name,angular.noop);
					};
				};
				
				scope.colorPicker={
					left:88,
					top:43,
					show:false
				};
				var typeForColorSet;
				var hideColorPicker=function(){
					scope.colorPicker.show=false;
					$document.find('body').off('click',hideColorPicker);
					scope.$digest();
				};
				var showColorPicker = function(type){
					return function($event){
						$document.find('body').off('click',hideColorPicker);
						typeForColorSet=type;						
						scope.colorPicker.show=true;
						var pos=$($event.target).position();
						scope.colorPicker.top=pos.top;
						scope.colorPicker.left=pos.left;
						var editor =  CKEDITOR.last_editor;
						if(editor){editor.focus();};
						$timeout(function(){
							$document.find('body').on('click',hideColorPicker);
						});
						return false;
					}
				};
				function isUnstylable( ele ) {
					return ( ele.getAttribute( 'contentEditable' ) == 'false' ) || ele.getAttribute( 'data-nostyle' );
				}

				scope.onColorSelect=function(color){					
					if(typeForColorSet){
						var type = typeForColorSet;						
						executeCommand(type=='back'?'bgcolor':'textcolor',function(editor){
							var config = editor.config;						 
							// Clean up any conflicting style within the range.
							editor.removeStyle( new CKEDITOR.style( config[ 'colorButton_' + type + 'Style' ], { color: 'inherit' } ) );
							if ( color ) {
								var colorStyle = config[ 'colorButton_' + type + 'Style' ];
								colorStyle.childRule = type == 'back' ?
								function( element ) {
									// It's better to apply background color as the innermost style. (#3599)
									// Except for "unstylable elements". (#6103)
									return isUnstylable( element );
								} : function( element ) {
									// Fore color style must be applied inside links instead of around it. (#4772,#6908)
									return !( element.is( 'a' ) || element.getElementsByTag( 'a' ).count() ) || isUnstylable( element );
								};
								editor.applyStyle( new CKEDITOR.style( colorStyle, { color: color } ) );
							}
							editor.focus();
						});
					}
				};
				
				scope.pixelPicker={
					left:0,
					top:0,
					show:false
				};
				var hidePixelPicker=function(){
					scope.pixelPicker.show=false;
					$document.find('body').off('click',hidePixelPicker);
					scope.$digest();
				};
				var showPixelPicker = function(){
					return function($event){
						$document.find('body').off('click',hidePixelPicker);
						scope.pixelPicker.show=true;
						var pos=$($event.target).position();
						scope.pixelPicker.top=pos.top;
						scope.pixelPicker.left=pos.left;
						var editor =  CKEDITOR.last_editor;
						if(editor){editor.focus();};
						$timeout(function(){
							$document.find('body').on('click',hidePixelPicker);
						});
						return false;
					}
				};
				scope.onPixelSelect=function(value){
					if(!value){
						return;
					}
					executeCommand('fontsize',function(editor){						
						var config = editor.config;
						editor.focus();
						if(editor.getSelection().getSelectedText()==''){
							$console.message(i18n('common.select.font-size'));
							return;
						}
						var style = new CKEDITOR.style( config.fontSize_style, {size:value+"px"});					
						style.apply( editor.document ); 
						editor.focus();						 
					});
				};
				var toUrl = function(url,params){
					url = url+"?";
					for(var key in params){
						url += key+"="+encodeURIComponent(params[key])+"&";
					}
					return url;
				}
				var calculatePreviewSize = function(){
					var titleHeight = 82;
					var rate = 16/9.0;
					var screenHeight = $(window).height();;
					var screenWidth = $(window).width();


					var	 height = Math.min(900,screenHeight-50);
					var	 width =  Math.min(1280,screenWidth-100);

					var rwidth = width/rate >(height -titleHeight) ? (height-titleHeight)*rate : width;
					var rheight = width/rate >(height -titleHeight) ?  height:width/rate+titleHeight;
					return {
						width: rwidth,height:rheight
					}
				}
				var size = calculatePreviewSize();
				scope.sampleUrl = function(){
					var params = angular.copy($location.search());
					params.old_identifier =$stateParams.id;
					params.old_file_path = params.file_path;
					params.width = size.width;
					params.height = size.height;
					delete params.file_path;
					return toUrl("question.html#/import_sample",params);
				}
				var openDialog = function(type){
					return function(){
						if(type=='image'){
							scope.imageDialog.open().openPromise.then(function(){
								scope.imageSelector.refresh();
							});
						}else if(type=='video'){
							scope.videoDialog.open().openPromise.then(function(){
								scope.videoSelector.refresh();
							});
						}else if(type=='audio'){
							scope.audioDialog.open().openPromise.then(function(){
								scope.audioSelector.refresh();
							});
						}
						else if(type=='math'){
							executeCommand('mathjax',function(editor){
								editor.execCommand('mathjax');
							});
						}
						else if(type=='sample'){

							scope.sampleDialog.open({width:size.width+'px',height:size.height+'px'}).openPromise.then(function(){

							});
						}
						return false;
					}
				}
				var showSample = $stateParams.hideSample != 'true' && $stateParams.isSample != 'true';
				scope.btns=[[
				    {name:'bold',title:$i18n('qti.editor.label.tools.bold'),dimension:'small',on:false,click:command('bold')},
				    {name:'italic',title:$i18n('qti.editor.label.tools.italic'),dimension:'small',on:false,click:command('italic')},
				    {name:'underline',title:$i18n('qti.editor.label.tools.underline'),dimension:'small',on:false,click:command('underline')},
				    {name:'through',title:$i18n('qti.editor.label.tools.through'),dimension:'small',on:false,click:command('removeFormat')},
				    {name:'fontsize',title:$i18n('qti.editor.label.tools.fontsize'),dimension:'small',on:false,click:showPixelPicker()},
				    '/',
				    {name:'superscript',title:$i18n('qti.editor.label.tools.superscript'),dimension:'small',on:false,click:command('superscript')},
				    {name:'subscript',title:$i18n('qti.editor.label.tools.subscript'),dimension:'small',on:false,click:command('subscript')},
				    {name:'textcolor',title:$i18n('qti.editor.label.tools.textcolor'),dimension:'small',on:false,click:showColorPicker('fore')},
				    {name:'bgColor',title:$i18n('qti.editor.label.tools.bgColor'),dimension:'small',on:false,click:showColorPicker('back')}/*,
				    {name:'background',title:$i18n('qti.editor.label.tools.background'),dimension:'small',on:false,click:command('background')}*/
			    ],[
			       {name:'table',title:$i18n('qti.editor.label.tools.table'),dimension:'small',on:false,click:command('table')},
			       '/',
			       {name:'horizontalrule',title:$i18n('qti.editor.label.tools.horizontalrule'),dimension:'small',on:false,click:command('horizontalrule')}
				],[
				    {name:'imageleft',title:$i18n('qti.editor.label.tools.imageleft'),dimension:'small',disabled:true,on:false,click:command('justifyleft')},
				    '/',
				    {name:'imageright',title:$i18n('qti.editor.label.tools.imageright'),dimension:'small',disabled:true,on:false,click:command('justifyright')}
			    ],[
			       	{name:'justifyright',title:$i18n('qti.editor.label.tools.justifyright'),dimension:'small',on:false,click:command('justifyright')},
			       	{name:'justifyblock',title:$i18n('qti.editor.label.tools.justifyblock'),dimension:'small',on:false,click:command('justifyblock')},
			       '/',
				    {name:'justifyleft',title:$i18n('qti.editor.label.tools.justifyleft'),dimension:'small',on:false,click:command('justifyleft')},
				    {name:'justifycenter',title:$i18n('qti.editor.label.tools.justifycenter'),dimension:'small',on:false,click:command('justifycenter')}
				],[
				    {name:'image',title:$i18n('asset.label.insert.image_b'),dimension:'large',on:false,click:openDialog('image')},
			    ],[
				    {name:'video',title:$i18n('asset.label.insert.video_b'),dimension:'large',on:false,click:openDialog('video')},
			    ],[
				    {name:'audio',title:$i18n('asset.label.insert.audio_b'),dimension:'large',on:false,click:openDialog('audio')}
				],[
				    {name:'math',title:$i18n('asset.label.insert.math_b'),dimension:'large',on:false,click:openDialog('math')}
			    ],[
					{name:'sample',title:$i18n('asset.label.insert.sample_b'),dimension:'large',hide:!showSample,on:false,click:openDialog('sample')}
				],[
			        {name:'item_data',title:$i18n('asset.label.insert.item_data'),dimension:'large',isItem:true,on:false,click:noop('item_data')}
		        ],[
		           	{name:'item_textentry',title:$i18n('asset.label.insert.item_textentry'),dimension:'large',isItem:true,on:false,click:noop('item_textentry')}
		        ],[
		           	{name:'item_handwrite',title:$i18n('asset.label.insert.item_handwrite'),dimension:'large',isItem:true,on:false,click:noop('item_handwrite')}
				]];




				var disableChange = function(){
					var disableButtons=(iAttrs.editorDisable||'').split(',');
					for(var i=0;i<disableButtons.length;i++){
						for(var j=0;j<scope.btns.length;j++){
							for(var k=0;k<scope.btns[j].length;k++){								
								if(disableButtons[i]==scope.btns[j][k].name){
									scope.btns[j][k].hide = true;									
								}
							}
						}
					}
				} 
				disableChange();
				window.setButtonStatus=function(commandName,status){
					for(var i=0;i<scope.btns.length;i++){
						for(var j=0;j<scope.btns[i].length;j++){
							var button = scope.btns[i][j];
							if(button&&button.name&&button.name==commandName.toLowerCase()){
								button.on = status==1;
							}
						}
					};
				};
				window.disableButtons2=function(disabled){
					var names=['imagetop','imagebottom','imageleft','imageright'];		
					var names2=['justifyleft','justifycenter','justifyright','justifyblock'];	
					for(var i=0;i<scope.btns.length;i++){
						for(var j=0;j<scope.btns[i].length;j++){
							var button = scope.btns[i][j];
							if(button&&button.name&&names.indexOf(button.name)!=-1){
								button.disabled = disabled; 
							}
							if(button&&button.name&&names2.indexOf(button.name)!=-1){ 
								button.disabled = !disabled;								
							}
						}
					}; 
				};
				window.disableButtons=function(dis){
					for(var i=0;i<scope.btns.length;i++){
						for(var j=0;j<scope.btns[i].length;j++){
							var button = scope.btns[i][j];
							if(!angular.isObject(button)){
								continue;
							}
							button.disabled=false;
							for(var k=0;k<dis.length;k++){
								if(dis[k]=='$all' || dis[k]==button.name){
									button.disabled=true;
									break;
								}
							}
						}
					};
					if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
						scope.$digest();
					}
				};
			}
		};
	}]);
});