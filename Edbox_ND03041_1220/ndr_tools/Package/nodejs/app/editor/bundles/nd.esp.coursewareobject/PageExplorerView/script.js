define(["angular"],function(angular){return function(){return{name:"nd.esp.coursewareobject.PageExplorerView",title:"Page Explorer",render:function(view){angular.quickstart(view.getElement(),{templateUrl:"bundles/nd.esp.coursewareobject/PageExplorerView/template.html",controller:["$scope",function($scope){var editor,key=1;$scope.openEditor=function(){view.getWorkbench().getViewByName("nd.esp.resource.ResourceExplorerView");editor=view.getWorkbench().openEditor({type:"page",key:key++,data:{name:"U",age:20,remark:"No Remark"}},"nd.esp.coursewareobject.InteractionQPageEditor")},$scope.closeEditor=function(){view.getWorkbench().closeEditorByName("nd.esp.coursewareobject.GeneralPageEditor")},$scope.changeEditorValue=function(){editor.ctrl.setValue("Mary")}}]})}}}});