define(['question-module','ztree'],function(module, $){
	module.directive('espTree',[function(){
		return {
			restrict:'EA',
			replace:true,
			template:'<div class="ztree"></div>',
			require:'?ngModel',
			scope:{
				idKey:'@',
				childrenKey:'@',
				nameKey:'@',
				titleKey:'@',
				expandAll:'@',
				selectedMulti:'@',
				data:'=espTree',
				simpleData:'@',
				onSelect:'&',
				onInit:'&',
				showLine:'@',
				peripheralData:'@' 
			},
			link:function($scope,iElement,iAttrs,ngModel){
				var setting = {
					view: {
						dblClickExpand: false,
						showLine: $scope.showLine==='false'?false:true,
						selectedMulti: $scope.selectedMulti==='true',
						showIcon:false
					},
					data: {
						simpleData: {
							enable:$scope.simpleData!=='false',
							idKey: $scope.idKey||'identifier',
							pIdKey: 'parent',
							rootPId: 'root'
						},
						key:{
							children:$scope.childrenKey||'children',
							name:$scope.nameKey||'title',
							title:$scope.titleKey||'title'
						}
					},
					check:{
						autoCheckTrigger: $scope.selectedMulti==='true',
						enable:false,
						chkboxType:{'Y':'','N':''},
						chkStyle:'checkbox',
						nocheckInherit: false,
						chkDisabledInherit: false,
						radioType: 'all'
					},
					callback: {
						onClick: function(event, treeId, treeNode) {
							var value=setting.view.selectedMulti?ztree.getSelectedNodes():treeNode;
							if(treeNode.isParent){
								if(setting.view.selectedMulti){
									if(value.length){
										for(var i=0;i<value.length;i++){
											ztree.cancelSelectedNode(value[i]);
										}
									}	
								}else{
									ztree.cancelSelectedNode(value);
								}
								return;
							}
							if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
							    $scope.$apply(function() {
									if(ngModel){
										ngModel.$setViewValue(value);
									}
									$scope.onSelect({node:value});
								});
							}else{
								if(ngModel){
									ngModel.$setViewValue(value);
								}
								$scope.onSelect({node:value});
							}
						}
					}
				};
				var ztree;
				var setTreeValue=function(value){
					if(ztree && value){
						if(angular.isArray(value)){
							for(var i=0;i<value.length;i++){
								setTreeValue(value[i]);
							}
						}else if(angular.isString(value)){
							var nodes=ztree.getNodesByParam(setting.data.simpleData.idKey,value);
							if(nodes[0]) ztree.selectNode(nodes[0]);
						}else{
							ztree.selectNode(value);
						}
					}else if(ztree){
						var nodes=ztree.getSelectedNodes();
						if(nodes.length){
							for(var i=0;i<nodes.length;i++){
								ztree.cancelSelectedNode(nodes[i]);
							}
						}
					}
				};
				if(ngModel){
					ngModel.$render = function(value) {
						$scope.viewValue=ngModel.$viewValue;
					};
				}
				var S4=function(){
					return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
				};
				$scope.$watch('peripheralData',function(newData,oldData){
					if(newData!==oldData){
						if($scope.viewValue===null){
							setTreeValue(null);
						}
					}
				});
				$scope.$watch('data',function(newData,oldData){
					if(newData==oldData){
						return;
					}
					if(!iElement.attr('id')){
						iElement.attr('id',(S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()));
					}
					ztree=$.fn.zTree.init($(iElement[0]),setting,newData);
					if($scope.expandAll==='true'){
						ztree.expandAll(true);
					}
					if($scope.viewValue!==undefined){
						setTreeValue($scope.viewValue.identifier);
					}
					$scope.onInit({instance:ztree});
				});
			}
		};
	}]);
});
