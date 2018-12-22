define([
    'jquery',
    'angular',
    'i18n!',
    'text!./templates/container.html',
    './js/sectionsModule.js',
    './js/controller.js',
    './js/jquery-ui.js',
    './js/sortable.js',
    './js/directives/all_directive.js',
    './js/utils.js',
    './js/canvas-to-blob.min.js',
    './js/requestAnimationFrame.js',
    'css!./common/common_wood.css',
    'css!./common/common_edit_new_wood.css',
    'css!./common/ui_top_tips/ui_top_tips.css',
    'css!./style.css',
], function ($, angular, i18n, containerTemplate) { 
    function LaEditor() {       
        var module, stage, config, element, controllerInterface;
        this.init = function (m, s, c) {
            module = m;
            stage = s;
            config = c;
            
        };
        
        this.initDefault = function (moduleWrap) {
            moduleWrap.setPosition({top: 0, left: 0});
            moduleWrap.setSize({width: '100%', height: '100%'});

        };
        // this.save = function () {
        //      var result = Controller.save();

        //      return !result ? true : result;
        // };
        this.render = function (moduleWrap) {
            element = this.element = $(moduleWrap.getElement());
            controllerInterface = angular.quickstart(moduleWrap.getElement(), {
                template: containerTemplate + '?datestamp=' + (new Date()).getTime(),
                controller: 'SectionsController',
                locals: {
                    editor: this,
                    module : module,
                    stage : stage,
                    config : config
                }
            }, ['slides', 'ui.sortable', 'SectionsModule', 'cropper', {translate: config.i18n, prompter: stage.prompter}]);
        
        };
        this.getInterfaceDefinition = function () {
            return ['Timer', {
                getType: function () {
                    return module.getPropertyValue("TimerType");
                },
                getDuration: function () {
                    return module.getPropertyValue("TimeLimit");
                },
                setType: function (t) {
                    module.setPropertyValue("TimerType", t);
                    stage.trigger('Timer', {type: 'type', value: t});
                },
                setDuration: function (d) {
                    module.setPropertyValue("TimeLimit", d);
                    stage.trigger('Timer', {type: 'limit', value: d});
                }
            }];
        };
    }

    return LaEditor;
});