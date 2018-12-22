define([
    'jquery',
    'angular',
    'i18n!',
    'text!./templates/index.html',
    './js/LaModule.js',
    './js/LaServices.js',
    './js/LaDirectives.js',
    './js/LaController.js',
  'css!./common/common_wood.css',
  'css!./common/common_edit_new_wood.css',
  'css!./common/ui_top_tips/ui_top_tips.css',
    'css!./style.css',
    'css!./custom.css'
], function ($, angular, i18n, indexTpl) {
    function LaEditor() {
        var module, stage, config;

        /** The interface of Editor */
        /**
         * ��ʼ��
         * @param module module ģ�Ͷ���
         * @param stage ��̨����
         * @param config config.json �е�����
         */
        this.init = function (m, s, c) {
            module = m;
            stage = s;
            config = c;
        };

        /**
         *
         * @param moduleWrap
         */
        this.initDefault = function (moduleWrap) {
            moduleWrap.setPosition({top: 0, left: 0});
            moduleWrap.setSize({width: '100%', height: '100%'});

        };

        /**
         * ��Ⱦ����༭̬
         * @param moduleWrap һ����������,����ͨ������ȡ����ĸ�DOMԪ�أ��Լ������������ص��¼���
         */
        this.render = function (moduleWrap) {
            angular.quickstart(moduleWrap.getElement(), {
                template: indexTpl,
                controller: 'LaController',
                locals: {
                    editor: this,
                    module: module,
                    stage: stage,
                    config: config
                }
            }, ['slides', 'LaModule', {translate: config.i18n, prompter: stage.prompter}]);
        };

        /**
         * ���������ǰ������ݣ��Լ����һЩ�¼�������
         * @param moduleWrap һ����������,����ͨ������ȡ����ĸ�DOMԪ�أ��Լ������������ص��¼���
         */
        this.clean = function (moduleWrap) {
        };

        /**
         * ���ڱ����ⲿ�������ݣ����Է���false��һ���ַ�������ֹ�������б���
         */
        this.save = function () {
        };

        /**
         * ���������̨ȷ������ɾ���󣬽����ⲿ������������
         */
        this.destroy = function () {
        };

        /**
         * ����ӿڣ����Թ������������
         * ����һ�����󣬱�ʾ��ʵ�ֵĽӿڣ�����
         * {
         *       '.': {
         *           a: function () {}
         *       },
         *       'A':{
         *           getX: function () {}
         *       }
         *   }
         *  ���� '.' ��ʾ�Ը�����������������Ľӿ�
         */
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
                    stage.trigger("Timer", {type: "type", value: t});
                },
                setDuration: function (d) {
                    module.setPropertyValue("TimeLimit", d);
                    stage.trigger("Timer", {type: "limit", value: d});
                }
            }];
        };
    }

    return LaEditor;
});