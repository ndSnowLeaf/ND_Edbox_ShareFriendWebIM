define([
    'jquery',
    'angular',
    'i18n!',
    'text!./templates/container.html',
    './js/LaModule.js',
    './js/LaController.js',
    './js/LaDirectives.js',
    'css!./resource/style.css',
    'css!./resource/style_dev.css'
], function ($, angular, i18n, containerTemplate) {
    function LaEditor() {
        var module, stage, config, element;

        this.init = function (m, s, c) {
            module = m;
            stage = s;
            config = c;
        };

        this.initDefault = function (moduleWrap) {
            moduleWrap.setPosition({top: 0, left: 0});
            moduleWrap.setSize({width: '100%', height: '100%'});
        };

        this.render = function (moduleWrap) {
            element = this.element = $(moduleWrap.getElement());
            angular.quickstart(moduleWrap.getElement(), {
                template: containerTemplate,
                controller: 'LaController',
                locals: {
                    editor: this,
                    module: module,
                    stage: stage,
                    config: config
                }
            }, ['slides', 'LaModule', {translate: config.i18n, prompter: stage.prompter}]);
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
