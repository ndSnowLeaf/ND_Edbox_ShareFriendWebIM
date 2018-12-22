define(['require','question-module'],function(require,module){
	var itemType='drawing';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"file","corrects":[]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt_object":{title:'',content:'',assets:['','']},"shuffle":false,
			"papertype":"1","titletype":"1"
		};
	};
	module.directive("lcDrawingItem", ['$identifier','$console','$i18n','$stateParams','$url','$timeout','$filter','$document',function($identifier,$console,$i18n,$stateParams,$url,$timeout,$filter,$document){
		var papers=[
            {type:'1',title:$i18n('qti.drawing.label.paper_1')},
            {type:'5',title:$i18n('qti.drawing.label.paper_5')},
            {type:'2',title:$i18n('qti.drawing.label.paper_2')},
            {type:'3',title:$i18n('qti.drawing.label.paper_3')},
			{type:'6',title:$i18n('qti.drawing.label.paper_6')},
			{type:'7',title:$i18n('qti.drawing.label.paper_7')},
            {type:'4',title:$i18n('qti.drawing.label.paper_4')}
        ];
		var subjectPapers={
			'$DEFAULT':['1','6','7','4'],//默认
			'$SB0100':['1','6','7+','4'],//语文
			'$SB0300':['6','7','4','5+']//英语
		};
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				subject:'='
			},
			templateUrl:'qti/$directives/lcDrawingItem.html',
			controller:['$scope',function($scope){
				$scope.createDefaultTitle = function(){
					var index =0;
					var name = $i18n("qti.drawing.label.asset")+(index+1);
					while(existTitle(name)){
						index++;
						name = $i18n("qti.drawing.label.asset")+(index+1);
					}
					return name;
				}
				$scope.insertTextEntryInteraction=function(){
					if($scope.assessment.response.length>=10){
						$console.alert($i18n('qti.drawing.validate.max.interaction',10));
						return;
					}
					var editor=CKEDITOR.instances[$scope.titleEditorName];
					if(editor){
						try{
				            editor.execCommand('textEntryInteraction');
						}catch(e){
							editor.execCommand('textEntryInteraction');
						}
					}
				};
				$scope.setPromptEditorName=function(name){
					$scope.titleEditorName=name;
				};

				$scope.addAsset=function(){
					if($scope.assets.length>=20){
						$console.alert($i18n('qti.drawing.validate.max.asset',20));
						return;
					}
					var asset={content:'',title:$scope.createDefaultTitle()};
					$scope.assets.push(asset);
					$scope.selectedTab=asset;
					if($scope.assets.length>$scope.MAX_IN_ONEPAGE+$scope.startTabIndex){
						$scope.startTabIndex = $scope.assets.length-$scope.MAX_IN_ONEPAGE;
					}
				};
				$scope.textentryCount = function(){
					var count = $(CKEDITOR.instances[$scope.titleEditorName].element.$).find(".cke_textEntryInteraction").length;
					return count;
				}
				$scope.assettitle = function(asset,$index){
				 	return asset.title;
				}

				$scope.changeAssetName=function(asset,$event){
					if($scope.stopEdit()){
						asset.editing = true;
						asset.lastTitle = asset.title;
						if($event){
							$event.stopPropagation();
						}
					}
				}
				var existTitle = function(name){
					for(var i=0;i<$scope.assets.length;i++){
						var item = $scope.assets[i];
						if(item.title == name){
							return true;
						}
					}
					return false;
				}
				var hasSameTitle = function(asset,assetIndex){
					for(var i=0;i<$scope.assets.length;i++){
						var item = $scope.assets[i];
						if(item!=asset&&$scope.assettitle(item,i)==$scope.assettitle(asset,assetIndex)){
							return true;
						}
					}
					return false;
				}
				$scope.saveAssetName=function(asset,index){
					if(asset.title==''){
						asset.title = asset.lastTitle;
					}
					if(hasSameTitle(asset,index)){
						$console.message($i18n("qti.drawing.asset.title.unique"));
						return false;
					}
					else {
						asset.editing = false;
						return true;
					}
				}
				$scope.stopEvent=function($event){
					console.log("stop click event ");
					$event.stopPropagation();
				}
				$scope.stopEdit = function(){
					var result = true;
					for(var i=0;i<$scope.assets.length;i++){
						if($scope.assets[i].editing){
							var one = $scope.saveAssetName($scope.assets[i],i);
							if(!one){
								result = false;
							}
						}
					}
					return result;
				}
				$scope.alttitle = {};
				$scope.showTitleByMouse = function($event,title){
					$scope.alttitle.show = true;
					$scope.alttitle.title = title;
					var element = $event.currentTarget;
					if($(element).hasClass("att_title")){
						var offset = $(element).offset();
						$scope.alttitle.top = offset.top+$(element).height()-$($scope.root).offset().top;
						$scope.alttitle.left = offset.left+$(element).height()/2-$($scope.root).offset().left;
					}
				}
				$scope.hideTitleByMouse = function(){
					console.log("hide title by mouse");
					$scope.alttitle.show = false;
				}
				$scope.removeAsset=function(asset,$event){
					var deleteIndex=-1;
					for(var i=0;i<$scope.assets.length;i++){
						if(asset==$scope.assets[i]){
							deleteIndex=i;
							break;
						}
					}
					if(deleteIndex!=-1){
						$console.confirm($i18n('qti.drawing.hint.delete_asset',$scope.assettitle(asset,deleteIndex)),function(){
							$scope.assets.splice(i,1);
							if($scope.selectedTab==asset){
								$scope.selectedTab=$scope.assets[i];
								if(!$scope.selectedTab && i>0){
									$scope.selectedTab=$scope.assets[i-1];
								}
							}
						});
					}
					if($event){
						$event.stopPropagation();
					}
				};
				$scope.startTabIndex=0;
				$scope.previousTab=function(){
					if($scope.startTabIndex>0){
						$scope.startTabIndex--;
					}
				};
				$scope.nextTab=function(){
					if($scope.startTabIndex<$scope.assets.length-1){
						$scope.startTabIndex++;
					}
				};
				$scope.changePaperType = function($event,paper){
					$scope.assessment.item.papertype=paper.type
					$event.preventDefault();
					$event.stopPropagation();
				}

			}],
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
				if(!scope.assessment.response){
					scope.assessment.response=createResponse('s-'+$identifier.guid());
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem(scope.assessment.response.identifier);
				}
				var paperTypes=[];			
				if(scope.subject && scope.subject.length){
					for(var i=0;i<scope.subject.length;i++){
						paperTypes = paperTypes.concat(subjectPapers[scope.subject[i]]||[]);
					}
				}
				if(!paperTypes.length){
					paperTypes = paperTypes.concat(subjectPapers['$DEFAULT']);
				}
				scope.papers=[];
				var defaultPaperType;
				for(var i=0,pm={};i<paperTypes.length;i++){
					var pt=paperTypes[i];
					if(pt.indexOf('+')==pt.length-1){
						pt=pt.substring(0,pt.length-1);
						defaultPaperType=pt;
					}
					if(pm[pt]) continue;
					pm[pt]=true;
					for(var j=0;j<papers.length;j++){
						if(pt==papers[j].type){
							papers[j].order=j;
							scope.papers.push(papers[j]);
						}
					}
				}
				scope.papers.sort(function(a,b){
					return a.order-b.order;
				});
				if(!scope.assessment.item.papertype){
					scope.assessment.item.papertype=defaultPaperType || scope.papers[0].type;
				}

				scope.assets=[];
				if(scope.assessment.item.prompt_object && scope.assessment.item.prompt_object.assets){
					var as=scope.assessment.item.prompt_object.assets;
					for(var i=0;i<as.length;i++){
						var title = scope.assessment.item.prompt_object.asset_titles ? scope.assessment.item.prompt_object.asset_titles[i] : scope.createDefaultTitle();
						scope.assets.push({content:as[i],title:title});
					}
				}
				if(scope.assets.length){
					scope.selectedTab=scope.assets[0];
				}

				scope.hasSameTitle = function(){
					var titleSet = {};
					for(var i=0;i<scope.assets.length;i++) {
						if (titleSet[scope.assets[i].title]) {
							return true;
						}
						titleSet[scope.assets[i].title] = true;
					}
					return false;
				}


				scope.assessment.beforeCommit=function(a,errors){
					if(scope.hasSameTitle()){
						errors.push($i18n("qti.drawing.asset.title.unique"));
						return false;
					}

					var as = scope.assessment.item.prompt_object.assets=[];
					var titles = scope.assessment.item.prompt_object.asset_titles=[];

					for(var i=0;i<scope.assets.length;i++){
						as.push(scope.assets[i].content);
						titles.push(scope.assets[i].title||'')
					}
					if(scope.assessment.item.titletype=='1' && !scope.assessment.item.prompt_object.title){
						errors.push({message:$i18n('qti.drawing.validate.require.title')});
						return false;
					}else if(scope.assessment.item.titletype=='2'){
						scope.assessment.item.prompt_object.title='';
					}
					if(!scope.assessment.item.papertype){
						errors.push({message:$i18n('qti.drawing.validate.require.paper')});
						return false;
					}
					if(!scope.assessment.item.titletype){
						errors.push({message:$i18n('qti.drawing.validate.require.titletype')});
						return false;
					}
					scope.assessment.item.object = {
							data:$url.staticFiles("papertype_"+ scope.assessment.item.papertype + '.png',$stateParams.id),
							type: 'image/png'
					};
				};

				//计算一页最多放多少个tab
				scope.MAX_IN_ONEPAGE = 5;
				$(window).resize(function(){
					$timeout(function(){
						scope.changeElementWidth();
					});
				})
				scope.changeElementWidth = function(){
					var itemWidth = 298;
					var width = $(iElement).find(".asset_wrapper").width();
					scope.MAX_IN_ONEPAGE = Math.floor(width/itemWidth)-1;
					return scope.MAX_IN_ONEPAGE;
				}
				$timeout(function(){
					scope.changeElementWidth();
				});
				scope.root = iElement;
			}
		};
	}]);
});