define(["jquery","angular","i18n!","angular-prompter","angular-slides","css!./style.css"],function($,angular,i18n){return function(){return{name:"nd.esp.workspace.CategoryExplorerView",title:i18n.translate("resource.type"),render:function(view,viewConfig){angular.quickstart(view.element,{templateUrl:"bundles/nd.esp.workspace/CategoryExplorerView/template.html",controller:["$scope","$prompter","$q","$timeout",function($scope,$prompter,$q,$timeout){function findCategory(name){for(var i=0;i<$scope.categories.length;i++){var c=$scope.categories[i];if(c.name===name)return c}}$scope.categories=[];var categories=viewConfig.categories?angular.isArray(viewConfig.categories)?viewConfig.categories:[viewConfig.categories]:[];angular.forEach(categories,function(c){var category=angular.extend({title:i18n.translate("resource.type.unknown"),order:1,getDataList:function(params){return[]},getTemplateList:function(){return[]},openEditor:function(workbench,data){}},c);c.paging&&(category.pagination={page:1,size:parseInt(c.paging)||20}),$scope.categories.push(category)}),$scope.categories.sort(function(a,b){var a=parseFloat(a.order),b=parseFloat(b.order);return(isNaN(a)?1:a)-(isNaN(b)?1:b)}),angular.forEach($scope.categories,function(category){$q.proxy(category.getTemplateList()).then(angular.bind(category,function(templates){this.templates=templates||[]}))}),$scope.currentCategory,$scope.doSearch=function(page){var category=$scope.currentCategory;category||$q.reject(),category.loaded=!0;var params=angular.extend({words:$scope.keyword});return category.pagination&&(params.page=category.pagination.page=page||category.pagination.page,params.size=category.pagination.size),category.searchPromise=$q.proxy(category.getDataList(params)).then(function(result){return category.pagination?(category.datas=result.items,category.pagination.totalSize=result.total_count):category.datas=result?angular.isArray(result)?result:[result]:[],category},$prompter.errorIf()),category.searchPromise.finally($prompter.wait(i18n.translate("resource.type.loading"),!1)),category.searchPromise},$scope.switchCategory=function(category){return $scope.currentCategory=category,category&&!category.loaded?$scope.doSearch():category?category.searchPromise:$q.reject()},$timeout(function(){$scope.switchCategory($scope.categories[0])},0),$scope.selectData=function(category,data,isNewly){category.selectedData=data,category.openEditor(view.workbench,data,isNewly)},$scope.create=function(){view.workbench.activeView("nd.esp.workspace.CategoryTemplateChoiceView")},view.ctrl={addData:function(category,data,select){var category=findCategory(category);$scope.switchCategory(category).then(function(c){var existsData;angular.forEach(c.datas,function(d){if(d.id==data.id)return console.log("exists",data.identifier),existsData=d,!1}),existsData||c.datas.unshift(data),!0===select&&$scope.selectData(c,existsData||data,!0)})},selectData:function(category,data){var category=findCategory(category);$scope.switchCategory(category).then(function(c){$scope.selectData(c,data)})}}}]},["slides","prompter",{translate:i18n}])}}}});