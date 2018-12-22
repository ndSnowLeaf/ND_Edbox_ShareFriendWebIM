define(['require','question-module'],function(require,module){
    module.controller("metadataController",['$scope','$i18n','$qti','$category',
       '$materialAPI','$resourceStatus','$context','$url','$console','$timeout',
		'$messenger','$stateParams','$isoDate',"$state","$filter",
			function($scope,$i18n,$qti,$category,$material,$resourceStatus,$context,$url,$console,$timeout,$messenger,$stateParams,$isoDate,$state,$filter){
		$scope.itemTypes=$qti.getIndependentItemTypes();
		$scope.itemStatus=$resourceStatus;
		{
			$scope.itemTypeOptions=[{value:'',label:$i18n('common.label.all')}];
			for(var i=0;i<$scope.itemTypes.length;i++){
				var itemType=$scope.itemTypes[i];
				$scope.itemTypeOptions.push({value:itemType.name,label:itemType.label});
			}
			$scope.isDisableStatusOption=function(status,editItemStatus){
				if(editItemStatus=='CREATING' || status=='CREATING') return true;
				if(status=='CREATED' && editItemStatus!='CREATED') return true;
				return false;
			};
		}
		{
			$scope.itemStatusOptions=[{value:'',label:$i18n('common.label.all')}];
			for(var i=0;i<$scope.itemStatus.length;i++){
				var itemStatus=$scope.itemStatus[i];
				$scope.itemStatusOptions.push({value:itemStatus.name,label:itemStatus.label});
			}
		}
		{
		$scope.difficultyOptions=[{
				value:'none',label:$i18n('qti.label.difficulty.none')
			},{
				value:'very easy',label:$i18n('qti.label.difficulty.veryeasy')
			},{
				value:'easy',label:$i18n('qti.label.difficulty.easy')
			},{
				value:'medium',label:$i18n('qti.label.difficulty.medium')
			},{
				value:'difficult',label:$i18n('qti.label.difficulty.difficult')
			},{
				value:'very difficult',label:$i18n('qti.label.difficulty.verydifficult')
			}];
		}
		$scope.questionType='';
		$scope.status='';
		
		$scope.options={};
		$category.loadCategoryDatas($category.codes.subject).success(function(data){
			$scope.options.subject=data.items;
		});
		$category.loadCategoryDatas($category.codes.source).success(function(data){
			$scope.options.source=data.items;
		});
		$scope.pagination = {
			size : 20,
			page : 1,
			totalItems : 0
		};	
		
		var formatItem = function(item){
			return $qti.formatItem(item);
		};
		var beforeSave = function(item){
			item.categories.source = [];
			for(var i=0;i<item.source.length;i++){
				item.categories.source[i]={taxoncode:item.source[i]};
			}
			if(item.language){
				item.language = item.language.replace("-","_");
			}
			item.categories.subject=[];
			for(var i=0;i<item.subject.length;i++){
				item.categories.subject[i]={taxoncode:item.subject[i]};
			}			 
			return item;
		}
		$scope.createMetadata=function(){
			$scope.itemStatus = [ {
				name : 'CREATING',
				label : $i18n("common.status.CREATING")
			}];
			$scope.editItem=formatItem({
				source:[],
				subject:[],
				chapter_ids:$scope.selectedChapter?[$scope.selectedChapter.identifier]:[],
				categories:{
					res_type:[{taxcode:''}],
					source:[]
				},
				creator:$context.currentCreator(),
				publisher:'NetDragon',
				status:'CREATING'
			});			
		};
		
		$scope.editMetadata=function(id){
			$scope.itemStatus=$resourceStatus;
			$qti.loadAssessmentItem(id).success(function(editItem){
				if(!editItem){
					$console.error($i18n('common.hint.noexists'));
					return;
				}
				console.log(editItem);
				$scope.editItem=formatItem(editItem);
				$scope.editItemType=$qti.getItemType($scope.editItem.question_type);		 
			}).finally($console.wait($i18n('common.wait.load')));
		};
		var init = function(){ 
			var id = $stateParams.id; 
			if(id){
				$scope.editMetadata(id);
			}
			else{
				$scope.createMetadata();
			}
		};
		init();
		var QUESTION_SAVED_MESSAGE='QuestionSaved',
			QUESTION_PREVIEW_MESSAGE='QuestionPreview',
			QUESTION_ADD_METADATA_MESSAGE='QuestionMetadataAdd',
			QUESTION_UPDATE_METADATA_MESSAGE='QuestionMetadataUpdate',
			QUESTION_EDIT_CANCEL_MESSAGE='QuestionEditCancel';
		var postMessageToParent=function(message,id,action){
			$messenger.send({message:message, id: id, action:action});
		};
		$scope.editContent=function(id){
			$state.go("questions.edit",{id:id})
		};
		$scope.saveMetadata=function(gotoEditor){
			/*
			if(!$scope.editItem.chapter_ids || !$scope.editItem.chapter_ids.length){
				$console.message($i18n('common.validate.require.select','material.chapter.title',true));
				return;
			};*/
			$scope.editItem = beforeSave($scope.editItem);
			if($scope.editItem.identifier){
				$qti.updateAssessmentItem($scope.editItem).success(function(data){					
					if(gotoEditor===true){
						$scope.editContent($scope.editItem);
					}else{
						postMessageToParent(QUESTION_UPDATE_METADATA_MESSAGE,$scope.editItem.identifier,'insert');
					}
				}).finally($console.wait($i18n('common.wait.save')));
			}else{
				$qti.createAssessmentItem($scope.editItem).success(function(data){
					if(gotoEditor===true){
						$scope.editContent(data);
					}
					else{
						postMessageToParent(QUESTION_ADD_METADATA_MESSAGE,data.identifier,'insert');
					}
				}).finally($console.wait($i18n('common.wait.save')));
			}
		}; 
	}]);
});