define([
    'jquery',
    'angular',
    '../LaModule.js'
], function(jquery,angular,LaModule) {
    /**
     * 处理标签text的国际化指令
     * 用法：
     * 在需要国际化的标签上使用属性指令：i18n-render 
     * 并指明国际化文件中的key：i18n-key="mindermap_location"
     */
    LaModule.directive('i18nRender', ['$filter', function($filter) {
        return {
            restrict: 'A',
            replace: true,
            link:function(scope,element,attrs) {
                element.text($filter('translate')(attrs.i18nKey));
            }
        }
    }]);

    /**
     * 处理标签placeholder的国际化指令
     * 用法：
     * 在需要国际化的标签上使用属性指令：i18n-placeholder
     * 并指明国际化文件中的key：i18n-key="mindermap_location"
     */
    LaModule.directive('i18nPlaceholder', ['$filter', function($filter) {
        return {
            restrict: 'A',
            replace: true,
            link:function(scope,element,attrs) {
                element.attr('placeholder',$filter('translate')(attrs.i18nKey));
            }
        }
    }]);
});
