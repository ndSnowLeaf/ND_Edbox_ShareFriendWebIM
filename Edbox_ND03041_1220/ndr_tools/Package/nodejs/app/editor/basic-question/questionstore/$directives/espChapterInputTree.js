define(['question-module'],function(module){
	module.directive('espChapterInputTree',['$espChapter','$console','$document',function($espChapter,$console,$document){
		return {
			restrict:'EA',
			replace:true,
			templateUrl:'questionstore/$directives/esp-chapter-input-tree.html',
			require:'?ngModel',
			scope:{
				initChapterId:'@',
				expandAll:'@',
				selectedMulti:'@',
				includeLesson:'@',
				onSelect:'&'
			},
			link:function($scope,$element,iAttrs,ngModel){

				var lastRequest=0;
				$scope.chapters=[];
				$scope.isload=false;
				$scope.isdata=false;
				$scope.isChange=false;
				$scope.$watch('chapterId',function(newValue,oldValue){
					var chapter_id = $scope.initChapterId;
					if(chapter_id){
						$espChapter.getCategories(chapter_id).then(function(result){
							var data = result.data;
							$scope.category = $espChapter.formatCategory(data);
							$scope.chapters=[];
							$scope.isload=false;
							$espChapter.list({category:$scope.category},true).then(function(result){
								$scope.isload=true;
								$scope.chapters=result.data;
							},function(result){
								$scope.isload=true;
							});
						});
					}
				});

				var documentHandler=function(event){
					var target = $(event.target);
					if (target.closest(".esp-chapter-input-tree").length == 0) {
						$document.off('click',documentHandler);
						$scope.$apply(function(){
							$scope.showChapterTree=!$scope.showChapterTree;
						});
					}
				};
				$scope.showChapterTree=false;
				$scope.showPicker=function(){
					$scope.showChapterTree=!$scope.showChapterTree;
					$document.on('click',documentHandler);
				}
				$scope.pickAll=function(){
					$document.off('click',documentHandler);
					$scope.showChapterTree=false;
					$scope.pickall=true;
					$scope.chapter=null;
					ngModel.$setViewValue(null);
					$scope.isChange=!$scope.isChange;
				}
				if(ngModel){
					ngModel.$render=function(){
						var identifier=ngModel.$modelValue;
						if(identifier){
							$espChapter.get(identifier).success(function(chapter){
								$scope.chapter=chapter;
							});
						}else if(identifier===""){
							$scope.pickAll();
						}
					};
				}
				$scope.onPick=function(chapter){
					$document.off('click',documentHandler);
					$scope.pickall=false;
					if(ngModel){
						if(chapter===undefined||(chapter!==undefined&&chapter.identifier===ngModel.$modelValue)){
							$scope.showChapterTree=true;
						}else {
							$scope.showChapterTree=false;
						}
						ngModel.$setViewValue(chapter&&chapter.identifier);
					}else{
						if(chapter===undefined){
							$scope.showChapterTree=true;
							
						}else{
							$scope.showChapterTree=false;
						}
					}
					$scope.showChapterTree=false;
					$scope.chapter=chapter;
					$scope.onSelect({chapter:chapter});
				};
			}
		};
	}]);
});
