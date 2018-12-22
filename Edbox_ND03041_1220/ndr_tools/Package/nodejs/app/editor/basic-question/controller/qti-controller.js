define(['require','question-module','ckeditor'],function(require,module){
    module.controller("qtiController",['$scope','$i18n','$qti','$url','$requestInfo','$context','$window','$console','$q','$filter','$config','$messenger',
                                       '$timeout','$stateParams','$security','$anchorScroll','$identifier','$espChapter','$document','$location',
                                       function($scope,$i18n,$qti,$url,$requestInfo,$context,$window,$console,$q,$filter,$config,$messenger,$timeout,$stateParams,
												$security,$anchorScroll,$identifier,$espChapter,$document,$location){
		window.CKEDITOR_BASEPATH = '/lib/ckeditor/4.4.7/';
		window.$iconFolder=$config.csIconFolder;
		CKEDITOR.config.extraAllowedContent='textentryinteraction[*];inlinechoiceinteraction[*];video[*];audio[*];span{*};div[*]{*};';
		CKEDITOR.config.disallowedContent="a";
		CKEDITOR.config.extraPlugins = 'insertpre,simplebox,background,sharedspace,image2,video,audio,textEntryInteraction,inlinechoiceinteraction,mathjax,clearfloat,linebreakbefore,linebreakafter,jme,confighelper';
		CKEDITOR.disableAutoInline = true;
		CKEDITOR.config.sharedSpaces={
			top:'topSpace',
			bottom : 'bottomSpace'
		};
		CKEDITOR.config.toolbar=[
		    [ 'Source','Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ],
		    ['Find','Replace','-','SelectAll','SpellChecker'],
		    ['Image','video','audio','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Mathjax','clearFloat',"Simplebox","InsertPre"],
		    '/',
		    ['Bold','Italic','Subscript','Superscript','-','RemoveFormat','Underline','Background'],
		    ['NumberedList','BulletedList','-','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','linebreakbefore','linebreakafter'],
		    ['Styles','Format','Font','FontSize'],
		    ['TextColor','BGColor']
		];

		CKEDITOR.config.resourceSpace=$context.resourceSpace;
		$scope.lang = $context.getLang();
		$scope.disableEditor=function(name){
			alert(name);
		};
		$scope.noinsert = $requestInfo.params.noinsert; 
		$scope.assessments=[];
		$scope.data={};		
		$scope.isEmbed=!!$stateParams.id;
		$scope.disalbeButtons={};
		if($requestInfo.params.disableInsert){
			$scope.disalbeButtons.insert=true;
		}		
		
		
		$scope.itemTypes=$qti.getSubItemTypes();		
		$scope.addingType='choice';
		$scope.addAssessment=function(type){
			if($scope.assessments.length>20){
				$console.message($i18n('qti.validate.max.item',20));
				return;
			}
			if(type){
				var assessment={type:type,metadata:$scope.metadata};
				if(assessment.type=='textentrymultiple'){
					assessment.cardinality='ordered';
				}
				$scope.assessments.push(assessment);
				parsePosition(assessment);
				$timeout(function(){
					$scope.selectAssessment(assessment,$scope.assessments.length-1);
				});
				return assessment;
			}
		};
		$scope.validData = function(){
			return  $scope.itemType&&($scope.itemType.name!='data' || $scope.assessments.length>1);
		}
		$scope.removeAssessment=function(assessment){
			$console.confirm($i18n('qti.hint.delete.item'),function(){
				var deleteIndex=-1;
				for(var i=0;i<$scope.assessments.length;i++){
					if($scope.assessments[i]==assessment){
						deleteIndex=i;
						break;
					}
				}
				if(deleteIndex!=-1){
					$scope.assessments.splice(deleteIndex,1);
					$scope.selectAssessment();
				}
			});
		};
		
		$scope.selectAssessment=function(assessment,$index){
			if($scope.activedAssessment){
				$scope.activedAssessment._active=false;
			}
			if($scope.editingAssessment){
				$scope.editingAssessment._editing=false;
				delete $scope.editingAssessment;
			}
			$scope.activedAssessment=assessment;
			if($scope.activedAssessment){
				$scope.activedAssessment._active=true;
			}
			$anchorScroll("assessment_"+$index);

		};
		$scope.beginEditAssessment=function(assessment){
			$scope.selectAssessment(assessment);
			$scope.editingAssessment=assessment && assessment._editable ? assessment : null;
			if($scope.editingAssessment){
				$scope.editingAssessment._editing=true;
				if($scope.editingAssessment._defaultEditorName){
					var editor=CKEDITOR.instances[$scope.editingAssessment._defaultEditorName];
					if(editor){
						editor.focus();
					}
				}
			}
		};
		
		$scope.onKeydown=function(assessment,$event){
			if($event.keyCode==46 || $event.keyCode==8){
				$scope.removeAssessment(assessment);
			}else if($event.keyCode==27){
				$scope.selectAssessment();
			}
			$event.preventDefault();
			$event.stopPropagation();
		};
		
		var currentWidth,currentHeight;
		$scope.onResizeStart=function(assessment){
			currentWidth = parseInt(assessment._width);
			currentHeight = parseInt(assessment._height);
		};
		$scope.onResize=function(assessment,$event){
			assessment._width = Math.min(Math.max(100,5-assessment._left,currentWidth + $event.incrementX),$scope.areaWidth-10)+'';
			assessment._height = Math.min(Math.max(100,5-assessment._top,currentHeight + $event.incrementY),$scope.areaHeight-10)+'';
		};
		
		$scope.areaWidth=960;
		$scope.areaHeight=640;
		var currentLeft,currentTop;
		$scope.onDragStart=function(assessment){
			currentLeft = parseInt(assessment._left);
			currentTop = parseInt(assessment._top);
		};
		$scope.onDrag=function(assessment,$event){
			assessment._left = Math.min(Math.max(5-assessment._width,currentLeft + $event.incrementX),$scope.areaWidth-5)+'';
			assessment._top = Math.min(Math.max(5-assessment._height,currentTop + $event.incrementY),$scope.areaHeight-5)+'';
		};
		
		$scope.beforeCommand=function(commandName){
			if($scope.itemType.name=='specialcomplextext'){
				if(commandName && commandName.indexOf('item_')==0){
					$scope.addAssessment(commandName.substring(5));
					return false;
				}
				if(!$scope.editingAssessment){
					if(commandName=='image' || commandName=='video' || commandName=='audio'){
						var assessment = $scope.addAssessment('data');
						if(assessment){
							return $timeout(function(){
								$scope.beginEditAssessment(assessment);
								return assessment._defaultEditorName;
							});
						}
					}
					return false;
				}
			}
		};
		
		//$scope.addingType='graphicgapmatch';
		//$scope.addAssessment();
		//return;
		
		var QUESTION_SAVED_MESSAGE='QuestionSaved',
			QUESTION_PREVIEW_MESSAGE='QuestionPreview',
			QUESTION_ADD_MESSAGE='QuestionAdd',
			QUESTION_EDIT_CANCEL_MESSAGE='QuestionEditCancel';
		var postMessageToParent=function(message,id,action){
			var isEdit =  $location.search()['noinsert'] == 'true';
			var lastId = $location.search()['old_identifier'];
			var isReplace = lastId;
			var message = '';
			if(isReplace&&action != 'insert'){
				message = 'question_replace';
			}
			else if(isEdit){
				message = 'question_saved';
			}
			else if(action == 'insert') {
				message = "question_insert";
			}
			else{
				message = "question_saved";
			}
			var data = {
				message:message,
				question_id: id,
				question_online: false,
				question_tags:'basic_question',
				question_type:$scope.itemType.name,
				question_code:$scope.itemType.code,
				question_titile:$scope.itemType.label,
				question_path:$scope.metadata.physic_path
			};
			if(isReplace){
				data.old_question_id = lastId;
				var path = $location.search()['old_file_path'];
				data['old_question_path'] = path;
			}
			try{
				console.log("data is ",data);
				PCInterface.questionAction(JSON.stringify(data));
			}
			catch(ex){
				//alert(ex);
			}
			/*


			$messenger.send(JSON.stringify({
				message:message, 
				id: id, 
				action:action,
				question_type:$scope.itemType.name,
				question_code:$scope.itemType.code,
				file_path:$scope.metadata.physic_path
			}));*/
		};
		var  handleResponseSequence = function(data){
			for(var i=0;i<data.feedbacks.length;i++){
				data.feedbacks[i].outcomeIdentifier="FEEDBACK";
			}
			var sequenceCount = new Date().getTime();		
			var rs = {};			 
			for(var i=0;i<data.responses.length;i++){
				rs[data.responses[i].identifier]=data.responses[i];
			}			
			for(var i=0;i<data.items.length;i++){
				var item = data.items[i];
				var step = data.items.length>1 ? 0 : 1;
				var isTextentry = item.type=='handwrite'||item.type=='textentry'||item.type=='data';
				if(isTextentry){
					var startSequence = item.type=='handwrite' ? 1 : 0;
					var idCache = [];
					var texts = $("<div></div>").html(item.prompt).find("textentryinteraction");					
					for(var j=0;j<texts.length;j++){
						var responseId = $(texts[j]).attr("responseidentifier");						
						var tempId = "temp_"+ (sequenceCount++);
						var newId = "RESPONSE_"+(i+step)+"-"+(j+1+startSequence);
						item.prompt = item.prompt.replace(responseId,tempId);
						idCache.push({oid:tempId,nid:newId});
						var response = rs[responseId];
						if(response){
							response.identifier = newId;
						}
					}
					for(var j=0;j<idCache.length;j++){					
						item.prompt = item.prompt.replace(idCache[j].oid,idCache[j].nid);
					}
				}

				var id = item.response_identifier;
				var response = rs[id];
				if(response){
					var newId = "RESPONSE_"+response.sequence;
					response.identifier = newId;
					item.response_identifier = newId;
				}

			} 
			return data;
		}
		var trimNbsp = function(text){
			var nbsp = '&nbsp;';
			if(!text) return '';
			text = text.trim();
			while(text.indexOf(nbsp)==0){
				text = text.substring(nbsp.length).trim();
			}
			while(text.lastIndexOf(nbsp)!=-1&&text.lastIndexOf(nbsp)==text.length-nbsp.length){
				text = text.substring(0,text.length-nbsp.length).trim();
			}
			return text;
		}
		var handleTextentryResponse = function(response){
			if(response.base_type == 'multipleString'&&response.corrects.length>0){
				var correct = response.corrects[0];
				var arr = correct.split("|");
				var result = '';
				for(var i=0;i<arr.length;i++){
					arr[i]=trimNbsp(arr[i]);
				}
				result = arr.join("|");
				response.corrects[0]=result;
			}
		};
		$scope.doSave=function(){
			var deferred = $q.defer();
			if($scope.form.$invalid||!$scope.validData()){
				deferred.reject();
			}else{
				var canceled=false,errors=[];
				$scope.data.items=[];
				$scope.data.responses=[];
				$scope.data.feedbacks=[];
				var basesequence = 1;
				for(var i=0,len=$scope.assessments.length;i<len;i++){
					var a=$scope.assessments[i];
					if(angular.isFunction(a.beforeCommit)){
						var result=a.beforeCommit(a,errors);
						if(result===false){
							canceled=true;
							break;
						}
						if(angular.isObject(result)){
							a=result;
						}
					}
					formatPosition(a);
					$scope.data.items.push(a.item);
					var res = a.response;
					if(res){
						if(angular.isArray(res)){
							for(var j=0;j<res.length;j++){
								res[j].sequence = basesequence+"-"+(j+1);
								handleTextentryResponse(res[j]);
								$scope.data.responses.push(res[j]);
							}
						}else{
							res.sequence = basesequence+"-1";
							handleTextentryResponse(res);
							$scope.data.responses.push(res);
						}
						
						if(a.feedbackHint){
							a.feedbackHint.sequence = basesequence;
							$scope.data.feedbacks.push(a.feedbackHint);
						}
						if(a.feedbackAnswer){
							a.feedbackAnswer.sequence = basesequence;
							$scope.data.feedbacks.push(a.feedbackAnswer);
						}
						
						basesequence++;
					}			
				}
				if(errors.length>0){
					var firstError=errors[0];
					$console.message(firstError.message || firstError);
					canceled=true;
				}
				if(canceled){
					deferred.reject(errors);
				}else{
					$scope.data = handleResponseSequence($scope.data);
					$qti.saveAssessmentItemContent($scope.metadata.identifier, $scope.data).success(function(data){
						for(var i=0,len=$scope.assessments.length;i<len;i++){
							var a=$scope.assessments[i];
							if(angular.isFunction(a.afterSave)){
								a.afterSave(data);
							}
						}
						deferred.resolve();
					}).error(function(data,status){
						if(console){
							console.log($i18n('common.hint.save.failed',(data?data.message:'')+'('+status+')'));
						}
						deferred.reject();
					}).finally($console.wait($i18n('common.wait.save')));;
				}
			}
			return deferred.promise;
		};
		$scope.save=function(){
			$timeout(function(){
				$scope.doSave().then(function(){
					$console.message($i18n('common.label.save.success'));
					postMessageToParent(QUESTION_SAVED_MESSAGE,$scope.metadata.identifier,'save');
				});	
			});			
		};
		$scope.preview=function(){
			$timeout(function(){
				$scope.realPreview();
			});
		}
		var calculatePreviewSize = function(){
			var titleHeight = 82;
			var rate = 16/9.0;
			var screenHeight = $(window).height();;
			var screenWidth = $(window).width();
			var width;
			var height;
			if($scope.itemType.name=='gapmatch'){
				height = Math.min(900,screenHeight-50)+"px";
				width = Math.min(1500,screenWidth-100)+"px";
			}
			else{
				height = Math.min(900,screenHeight-50);
				width =  Math.min(1280,screenWidth-100);
			}


			var rwidth = width/rate >(height -titleHeight) ? (height-titleHeight)*rate : width;
			var rheight = width/rate >(height -titleHeight) ?  height:width/rate+titleHeight;
			return {
				width: rwidth,height:rheight
			}
		}
		$scope.realPreview = function(){

			$scope.doSave().then(function(metadata){
				$console.message($i18n('common.label.save.success'));
				postMessageToParent(QUESTION_SAVED_MESSAGE,$scope.metadata.identifier,'save');
                var language= $requestInfo.params._lang_||"zh_CN";
				var qtiplayerurl ="/prepare/player.html?isPreview=true&file_path="+encodeURIComponent($url.file_path)+ "&hidePage=toolbar&_lang_="+language+"&hidePage=footer&sys=pptshell";
				//预览时添加isPreview=true参数
				var previewSize = calculatePreviewSize();

				postMessageToParent(QUESTION_PREVIEW_MESSAGE,$scope.metadata.identifier,'preview');
				var dialog=$scope.previewDialog.open({
					title:$filter('dict')($scope.itemType.name,$qti.getAllItemTypes(),'name','label'),
					width:previewSize.width,
					height:previewSize.height
				});
				dialog.openPromise.then(function(d){
					d.element.find('iframe').attr('src',qtiplayerurl);
				});
				dialog.closePromise.then(function(d){
					d.element.find('iframe').attr('src','about:blank');
				});

				
			});
		};
		$scope.insert=function(){
			$timeout(function(){
				$scope.doSave().then(function(){
					$console.message($i18n('common.label.insert.success'));
					postMessageToParent(QUESTION_ADD_MESSAGE,$scope.metadata.identifier,'insert');
				});			
			});
		};
		$scope.cancel=function(){
			postMessageToParent(QUESTION_EDIT_CANCEL_MESSAGE,$scope.metadata.identifier,'cancel');
		};
	   $scope.showStartAddQuestion =function($event){
		   $scope.startAddQuestion = true;
		   $event.preventDefault();
		   $event.stopPropagation();
	   }
	   $($document).on('click',function(){
		   $scope.startAddQuestion = false;
	   })
		var init = function(){
			var id = $stateParams.id; 
			if(!id){
				$console.alert($i18n('qti.validate.require.identifier'));
				return;
			}
			$qti.loadAssessmentItem(id).success(function(metadata){
				$scope.metadata=$qti.formatItem(metadata);
				$url.file_path = metadata.physic_path;
				$scope.itemType=$qti.getItemType(metadata.question_type.taxoncode); 		
				$scope.defaultKeyword = metadata.relations&&metadata.relations.length>0 ? metadata.relations[0].source_title : '';

				//3b0ce4f8-fee4-4404-848a-5f5153e7eebb
				var chapter_id =  metadata.relations&&metadata.relations.length>0 ? metadata.relations[0].source : $stateParams.chapter_id||'';
				$scope.initChapterId = chapter_id;
				$qti.loadAssessmentItemContent(metadata.identifier).success(function(data){
					$scope.data=data;

					var items=data.items,responses=data.responses,feedbacks=data.feedbacks;
					if(items && items.length){
						for(var i=0,len=items.length;i<len;i++){
							var assessment={type:items[i].type, item:items[i], metadata:metadata};
							if(assessment.type=='data' && $scope.itemType.name=='textentry'){
								assessment.type = 'textentry';
							}
							if(assessment.type=='textentry' || assessment.type=='inlinechoice' || ($scope.itemType.name!='specialcomplextext' && assessment.type=='handwrite')){
								for(var k=0;k<feedbacks.length;k++){
									var f=data.feedbacks[k];
									if(f.identifier=='showHint'){
										assessment.feedbackHint=f;
									}else if(f.identifier=='showAnswer'){
										assessment.feedbackAnswer=f;
									}
								}
							}else{
								for(var j=0;j<responses.length;j++){
									if(responses[j].identifier == items[i].response_identifier){
										assessment.response=responses[j];
										var sequence=assessment.response.sequence||'1-1';
										var indexOf=sequence.indexOf('-1');
										if(indexOf==sequence.length-2){
											sequence=sequence.substring(0,indexOf);
										}else{
											sequence='';
										}
										for(var k=0;k<feedbacks.length;k++){
											var f=data.feedbacks[k];
											if(f.sequence==sequence){
												if(f.identifier=='showHint'){
													assessment.feedbackHint=f;
												}else if(f.identifier=='showAnswer'){
													assessment.feedbackAnswer=f;
												}
											}
										}
										break;
									}
								}
							}
							$scope.assessments[i] = assessment;
							parsePosition(assessment);
						}
					}
				});
			}).finally($console.block()); 
		};
		init();
		var parsePosition=function(assessment){
			var styles={};
			if(assessment.item && assessment.item.style){
				var pairs=assessment.item.style.replace(/\s|(px)/g, '').split(';');
				for(var i=0;i<pairs.length;i++){
					var css=pairs[i].split(':');
					if(css.length==2){
						styles[css[0]]=css[1];
					}
				}
			}
			assessment._left=parseInt(styles.left)||10;
			assessment._top=parseInt(styles.top)||10;
			assessment._width=parseInt(styles.width);
			assessment._height=parseInt(styles.height);
		};
		var formatPosition=function(assessment){
			if($scope.itemType.name=='specialcomplextext'){
				var style='position:absolute;overflow:hidden';
				style+=';width:'+(assessment._width?assessment._width+'px':'auto');
				style+=';height:'+(assessment._height?assessment._height+'px':'auto');
				style+=';top:'+(assessment._top?assessment._top+'px':'0px');
				style+=';left:'+(assessment._left?assessment._left+'px':'0px');
				assessment.item.style=style;
			}
		};

		$scope.downAssessment = function(assessment){
			var index = $scope.assessments.indexOf(assessment);
			if(index>0&&index<$scope.assessments.length-1){
				$scope.assessments.splice(index,1);
				$scope.assessments.splice(index+1,0,assessment);
				$timeout(function(){
					$scope.selectAssessment(assessment,index+1);
				});
			}
		}
	   $scope.upAssessment = function(assessment){
		   var index = $scope.assessments.indexOf(assessment);
		   if(index>1){
			   $scope.assessments.splice(index,1);
			   $scope.assessments.splice(index-1,0,assessment);
			   $timeout(function(){
				   $scope.selectAssessment(assessment,index-1);
			   });
		   }
	   }
	   $scope.startQuestionSelect = function(){
		   var previewSize = calculatePreviewSize();
		   $scope.questionDialog.open({
			   width:previewSize.width,
			   height:previewSize.height
		   }).openPromise.then(function(){
			   //$scope.questionSelector.refresh();
		   });
	   }
       var formatNewItem = function(item){
           var items = item.items;
           var feedbacks = item.feedbacks;
           var responses = item.responses;
           var i=0;
           var assessment={type:items[0].type, item:items[0], metadata:$scope.metadata,response:{}};

           if(assessment.type=='data' || assessment.type=='textentry' || assessment.type=='inlinechoice' || ($scope.itemType.name!='specialcomplextext' && assessment.type=='handwrite')){
               for(var k=0;k<feedbacks.length;k++){
                   var f=feedbacks[k];
                   if(f.identifier=='showHint'){
                       assessment.feedbackHint=f;
                   }else if(f.identifier=='showAnswer'){
                       assessment.feedbackAnswer=f;
                   }
               }
           }else{
               for(var j=0;j<responses.length;j++){
                   if(responses[j].identifier == items[i].response_identifier){
                       assessment.response=responses[j];
                       var sequence=assessment.response.sequence||'1-1';
                       var indexOf=sequence.indexOf('-1');
                       if(indexOf==sequence.length-2){
                           sequence=sequence.substring(0,indexOf);
                       }else{
                           sequence='';
                       }
                       for(var k=0;k<feedbacks.length;k++){
                           var f=feedbacks[k];
                           if(f.sequence==sequence){
                               if(f.identifier=='showHint'){
                                   assessment.feedbackHint=f;
                               }else if(f.identifier=='showAnswer'){
                                   assessment.feedbackAnswer=f;
                               }
                           }
                       }
                       break;
                   }
               }
           }
           if(assessment.type=='data' || assessment.type == 'textentry'){
               assessment.type = "textentrymultiple";
			   assessment.item.type = "textentrymultiple";
               assessment.response = {
                   "cardinality": "ordered",
                   "base_type": "multipleString",
                   "corrects": []
               };
               //rename textentry id &&set responses value
               var prompt = $("<div></div>").html(item.items[0]? item.items[0].prompt : '');
               var ts = prompt.find("textentryinteraction");
               for(var k=0;k<ts.length;k++){
                   var rid = $(ts[k]).attr("responseidentifier");
                   for(var l=0;l<responses.length;l++){
                       if(responses[l].identifier == rid){
                           assessment.response.corrects.push(responses[l].corrects[0]);
                       }
                   }
                   ts[i].responseidentifier = 's-'+$identifier.guid();
               }
           }
           var id = 's-'+$identifier.guid();
           assessment.item.response_identifier = id;
           assessment.response.identifier = id;
           return assessment;
       	}
       $scope.showSample = $stateParams.hideSample != 'true';
	   	$scope.onQuestionSelect=function(item){
		   if(item.selected){
			   if($scope.assessments.length>20){
				   item.selected = false;
				   $console.message($i18n('qti.validate.max.item',20));
				   return;
			   }
			   var types = item.categories.res_type;
			   var newHandwrite = false;
			   for(var i=0;i<types.length;i++){
				   if(types[i].taxoncode=='$RE0445'){
					   newHandwrite = true;
				   }
			   }
               $qti.mergeQuestion({
                   target_file_path : $scope.metadata.physic_path,
                   source_file_path: item.physic_path,
                   source_identifier : item.identifier,
				   newhandwrite : newHandwrite
               }).then(function(result){
				   var assessment = formatNewItem(result.data);
				   assessment.item.identifier = item.identifier;
                   $scope.assessments.push(assessment);
               },function(){
				   item.selected = false;
               })['finally']($console.wait($i18n("question.data.wait.insert")))

		   }
		   else{
			   for(var i=0;i<$scope.assessments.length;i++){
				   if($scope.assessments[i].item.identifier == item.identifier){
					   $scope.assessments.splice(i,1);
					   return;
				   }
			   }
		   }
	   }
	}]);

	module.filter("chineseFirstCharacter",['$qti',function($qti){
		return function(value){
			var type = $qti.getItemTypeByName(value);
			return type ? type.fchar:'';
		};
	}]);
});