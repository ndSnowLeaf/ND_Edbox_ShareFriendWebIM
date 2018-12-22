define([
    'jquery',
    'angular',
    './modules/module_creator.js'],function(jquery,angular,moduleCreator){
        return function($scope){
            return {
                addNewElement:function(options,group){
                    var module = moduleCreator.create(options,$scope.modules);
                    if(group){
                        if(!$scope.modules.contains(group)){
                            $scope.modules.addItem(moduleCreator.createGroup(group));
                        }
                    };
                    if(!Array.isArray(module)){
                        module = [module];
                    }
                    $scope.modules.addAll(module,group);
                    return module;
                }
            }
        }
    }
);
