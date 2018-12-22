define(["angular","i18n!","angular-slides","css!./style.css"],function(angular,i18n){return function(){var page,stage,config,panelModule,writeModule;this.init=function(p,s,c){page=p,stage=s,config=c,panelModule=page.getModuleByPresenterId("Panel",!0),writeModule=page.getModuleByPresenterId("Write",!0)};var _scope;this.save=function(){if(!_scope.panelTitle)return i18n.translate("common.title.prompt");panelModule.setPropertyValue("text",_scope.panelTitle),writeModule.setPropertyValue("id",stage.coursewareobjectId),writeModule.setPropertyValue("writer_background",_scope.boardBackground,"json")},this.render=function(contentEl){function Controller($scope,$q,$prompter){_scope=$scope,$scope.panelTitle=panelModule.getPropertyValue("text"),$scope.boardBackground=writeModule.getPropertyValue("writer_background")||{url:"",type:2,left:0,top:0,right:0,bottom:0,width:1e3,height:600};$scope.setBackground=function(){$q.proxy(stage.selectResource(null,{check:function(result,success,item){if(!success)return!0;if(!item)return stage.prompter.message(i18n.translate("common.hint.select")),!1;var href=(item.format,item.href);-1==href.indexOf("?")?href+="?size=1200":href+="&size=1200",item.href=href}})).then(function(item){var resolution=item.resolution;if(resolution){var width=1*resolution.split("*")[0],height=1*resolution.split("*")[1],bg=$scope.boardBackground;if(bg.left+bg.right+width>1620&&(bg.right=Math.max(0,1620-bg.left-width)),bg.left+bg.right+width>1620&&(bg.left=Math.max(0,1620-width)),bg.top+bg.bottom+height>1350&&(bg.bottom=Math.max(0,1350-bg.top-height)),bg.top+bg.bottom+height>1350&&(bg.top=Math.max(0,1350-height)),bg.left+bg.right+width<1620){var differ=1620-bg.left-bg.right-width;bg.left=bg.left+differ/2,bg.right=bg.right+differ/2}if(bg.top+bg.bottom+height<1350){var differ=1350-bg.top-bg.bottom-height;bg.top=bg.top+differ/2,bg.bottom=bg.bottom+differ/2}}calculateWidthAndHeight();item.actualHref;$scope.boardBackground.type=2,$scope.boardBackground.url=item.href})},$scope.cancelBackground=function(){$scope.boardBackground.url=""};var calculateWidthAndHeight=function(){$scope.boardBackground.width=1620-$scope.boardBackground.right-$scope.boardBackground.left,$scope.boardBackground.height=1350-$scope.boardBackground.bottom-$scope.boardBackground.top};calculateWidthAndHeight();var cureentBackground={},calculatePosition=function(value,min,max){return value<=min?min:value>=max?max:value},handleDrag=function($event,type){"right-bottom"==type?($scope.boardBackground.right=calculatePosition(cureentBackground.right-$event.moveX,0,1620-$scope.boardBackground.left-100),$scope.boardBackground.bottom=calculatePosition(cureentBackground.bottom-$event.moveY,0,1350-$scope.boardBackground.top-100)):"right-top"==type?($scope.boardBackground.right=calculatePosition(cureentBackground.right-$event.moveX,0,1620-$scope.boardBackground.left-100),$scope.boardBackground.top=calculatePosition(cureentBackground.top+$event.moveY,0,1350-$scope.boardBackground.bottom-100)):"left-bottom"==type?($scope.boardBackground.left=calculatePosition(cureentBackground.left+$event.moveX,0,1620-$scope.boardBackground.right-100),$scope.boardBackground.bottom=calculatePosition(cureentBackground.bottom-$event.moveY,0,1350-$scope.boardBackground.top-100)):"left-top"==type?($scope.boardBackground.left=calculatePosition(cureentBackground.left+$event.moveX,0,1620-$scope.boardBackground.right-100),$scope.boardBackground.top=calculatePosition(cureentBackground.top+$event.moveY,0,1350-$scope.boardBackground.bottom-100)):"move"==type&&($scope.boardBackground.left=calculatePosition(cureentBackground.left+$event.moveX,0,1620-$scope.boardBackground.width),$scope.boardBackground.top=calculatePosition(cureentBackground.top+$event.moveY,0,1350-$scope.boardBackground.height),$scope.boardBackground.right=1620-$scope.boardBackground.left-$scope.boardBackground.width,$scope.boardBackground.bottom=1350-$scope.boardBackground.top-$scope.boardBackground.height),calculateWidthAndHeight()},onResizeStart=function(){cureentBackground.top=parseInt($scope.boardBackground.top),cureentBackground.bottom=parseInt($scope.boardBackground.bottom),cureentBackground.left=parseInt($scope.boardBackground.left),cureentBackground.right=parseInt($scope.boardBackground.right)},resetSize=function(){$scope.boardBackground.top=cureentBackground.top,$scope.boardBackground.bottom=cureentBackground.bottom,$scope.boardBackground.left=cureentBackground.left,$scope.boardBackground.right=cureentBackground.right,calculateWidthAndHeight()};$scope.onResize=function($event,type){0==$event.dragType?onResizeStart():1==$event.dragType?handleDrag($event,type):-1==$event.dragType&&resetSize()},$scope.$on("htmlEditorFocus",function($event,htmlEditor){stage.currentEditable("htmlEditor",htmlEditor)}),$scope.$on("htmlEditorBlur",function($event,htmlEditor){})}angular.quickstart(contentEl,{templateUrl:page.editorRepository.getResourceUrl("template.html"),controller:Controller},["slides",{translate:i18n,prompter:stage.prompter}]),Controller.$inject=["$scope","$q","$prompter"]}}});