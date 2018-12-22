define(['require','question-module'],function(require,module){
	var itemType='gapmatch';
	var choiceIdentifiers=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
	var createChoice=function(identifier){
		return {"identifier":identifier,"text":"","fixed":false,"group_id":"","match_max":0};
	};
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"multiple","base_type":"directedPair","corrects":[]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,"choices":[],
			"table":{"column_names":[{"title":"","size":0},{"title":"","size":0}],"row_names":[{"title":"","size":0},{"title":"","size":0},{"title":"","size":0}],"prefix":"G"}
		};
	};
	module.directive("lcGapmatchItem",  ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcGapmatchItem.html',
			controller:['$scope',function($scope){
				var maxRow=5,minRow=2,maxCol=5,minCol=1;
				$scope.increaseRow=function(){
					if($scope.table.rows.length>=maxRow){
						$console.message($i18n('qti.gapmatch.validate.max.row',maxRow));
						return;
					}
					$scope.table.rows.push({title:'',size:0});
				};
				$scope.decreaseRow=function(){
					if($scope.table.rows.length<=minRow){
						$console.message($i18n('qti.gapmatch.validate.min.row',minRow));
						return;
					}
					$console.confirm($i18n('qti.gapmatch.hint.delete.row'),function(){
						$scope.table.rows.length=$scope.table.rows.length-1;
						$scope.choices.length=$scope.table.rows.length;
					});
				};
				$scope.increaseCol=function(){
					if($scope.table.cols.length>=maxCol){
						$console.message($i18n('qti.gapmatch.validate.max.column',maxCol));
						return;
					}
					$scope.table.cols.push({title:'',size:0});
				};
				$scope.decreaseCol=function(){
					if($scope.table.cols.length<=minCol){
						$console.message($i18n('qti.gapmatch.validate.min.column',minCol));
						return;
					}
					$console.confirm($i18n('qti.gapmatch.hint.delete.column'),function(){
						$scope.table.cols.length=$scope.table.cols.length-1;
						for(var i=0;i<$scope.choices.length;i++){
							$scope.choices[i].length=$scope.table.cols.length;
						}
					});
				};

				$scope.addTextChoice=function(rowIndex,colIndex){
					$scope.getCell(rowIndex,colIndex).push({identifier:'s-'+$identifier.guid(),type:'text',value:''});
				};
				$scope.addImageChoice=function(rowIndex,colIndex){
					$scope.currentRowIndex=rowIndex;
					$scope.currentColIndex=colIndex;
					$scope.imageDialog.open().openPromise.then(function(){
						$scope.imageSelector.refresh();
					});
				};
				$scope.onImageSelect=function(item){
					var href=item.actualHref;
					$scope.getCell($scope.currentRowIndex,$scope.currentColIndex).push({identifier:'s-'+$identifier.guid(),type:'image',value:href});
					$scope.imageDialog.close();
				};
				$scope.removeChoice=function(rowIndex,colIndex,item){
					$console.confirm($i18n('qti.gapmatch.hint.delete.choice'),function(){
						var array=$scope.getCell(rowIndex,colIndex);
						for(var i=0;i<array.length;i++){
							if(array[i]==item){
								array.splice(i,1);
								break;
							}
						}
					});
				};
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
				scope.table={
					rows:scope.assessment.item.table.row_names,
					cols:scope.assessment.item.table.column_names
				};
				scope.choices=[];

				scope.getCell=function(rowIndex,colIndex){
					var row = scope.choices[rowIndex];
					if(!row){
						row=scope.choices[rowIndex]=[];
					}
					var cell=row[colIndex];
					if(!cell){
						cell=row[colIndex]=[];
					}
					return cell;
				};

				var choicesMapping={};
				for(var i=0;i<scope.assessment.item.choices.length;i++){
					var c=scope.assessment.item.choices[i];
					var choice={
						identifier:c.identifier
					};
					var el=angular.element('<div>'+c.text+'</div>');
					var src=el.find('img').attr('src');
					if(src){
						choice.type='image';
						choice.value=src;
					}else{
						choice.type='text';
						choice.value=el.find('p').html();
					}
					choicesMapping[choice.identifier]=choice;
				}
				for(var i=0;i<scope.assessment.response.corrects.length;i++){
					var c=scope.assessment.response.corrects[i];
					var split = c.split(' ');
					var identifier=split[0],cellIndexStr=split[1];
					var cellIndex = cellIndexStr.substring(scope.assessment.item.table.prefix.length).split('_');
					scope.getCell(parseInt(cellIndex[0])-1,parseInt(cellIndex[1])-1).push(choicesMapping[identifier]);
				}
				
				scope.assessment.beforeCommit=function(a,errors){
					for(var i=0;i<scope.table.rows.length;i++){
						if(!scope.table.rows[i].title){
							errors.push({message:$i18n('qti.gapmatch.validate.require.row_title',i+1)});
							return false;
						}
					}
					for(var i=0;i<scope.table.cols.length;i++){
						if(!scope.table.cols[i].title){
							errors.push({message:$i18n('qti.gapmatch.validate.require.column_title',i+1)});
							return false;
						}
					}
					scope.assessment.item.choices.length=0;
					scope.assessment.response.corrects.length=0;
					for(var i=0;i<scope.choices.length;i++){
						var row=scope.choices[i];
						if(row){
							for(var j=0;j<row.length;j++){
								var cell=row[j];
								if(cell){
									for(var k=0;k<cell.length;k++){
										var c=cell[k];
										var choice = createChoice(c.identifier);
										if(c.type=='text'){
											choice.text='<p>'+c.value+'</p>';
										}else{
											choice.text='<img src="'+c.value+'"/>';
										}
										scope.assessment.item.choices.push(choice);
										scope.assessment.response.corrects.push(choice.identifier+' '+scope.assessment.item.table.prefix+(i+1)+'_'+(j+1));
									}
								}
							}
						}
					}
				};
			}
		};
	}]);
});