/**
 * Created by chenyoudong on 2015/12/30.
 */
define([
    'jquery',
	'angular',
	'i18n!',
	'./js/freecombination.js',
    'text!./templates/container.html',
	'./js/fc_tools.js',
	'./js/fc_stage.js',
    './js/directives/all_directives.js',
    'css!./common/common_wood.css',
    'css!./style.css',
    'css!./program.css',
],function($,angular,i18n,freecombination,containerTemplate){
	function FreeCombinationEditor(){
        var module, stage, config,element;
        this.init = function(m,s,c){
            module = m;
            stage = s;
            config = c;
        };
        this.initDefault = function(moduleWrap){            
            moduleWrap.setPosition({top:0,left:0});
            moduleWrap.setSize({width:'100%',height:'100%'});             
            
        };
        this.save=function(){
        	var result = freecombination.save();
        	return result == '' ? true : result;
        };
		var controller = function($rootScope,$scope,$stage){
			freecombination.init($scope,module,stage,config,element);
            $stage.setStage(stage);
		};
        this.render = function(moduleWrap){ 
            element = this.element =  $(moduleWrap.getElement());
			angular.quickstart(moduleWrap.getElement(),{
				template:containerTemplate,
				controller:['$rootScope','$scope','$stage',controller ],
			},['slides','fctools','fcstage',{translate: i18n, prompter: stage.prompter}]);
		};
        this.getInterfaceDefinition = function(){
            var _this = this;
            return ['Timer', {
                getType: function(){
                    return module.getPropertyValue("timer_type");
                },
                getDuration: function(){
                    return module.getPropertyValue("timer_time");
                },
                setType: function (t) {
                    module.setPropertyValue("timer_type",t);
                },
                setDuration: function (d) {
                    module.setPropertyValue("timer_time",d);
                }
            }];
        };
    }
    return FreeCombinationEditor;
});