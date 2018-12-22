define([
    'jquery',
    'angular',
    './modules/module_creator.js'],function(jquery,angular,moduleCreator){
        return function($scope){
            return {
                addNewElement:function(options){
                    var module = moduleCreator.create(options,$scope.modules);
                    if(module.length>0){
                        for(var i=0;i<module.length;i++){
                            $scope.modules.push(module[i]);
                        }
                    }
                    else{
                        $scope.modules.push(module);
                    }
                    return module;
                }
            }
        }
    }
);
