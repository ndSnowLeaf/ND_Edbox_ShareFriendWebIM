define(['jquery', 'angular', 'espEnvironment'], function (jquery, angular, espEnvironment) {
    var Utils = {
        /**
         * 获取上下文参数
         * @param paramName
         * @returns {*}
         * @private
         */
        __getContextParams: function (paramName) {
            return espEnvironment.location.params[paramName];
        },
        /**
         * 获取上下文
         * @returns {*}
         */
        getContext: function () {
            return espEnvironment.location.params;
        },
        /**
         * 获取当前教材ID
         * @returns {*}
         */
        getCurrentBookId: function () {
            return this.__getContextParams('book_id');
        },
        /**
         * 获取当前颗粒地址
         * @returns {*}
         */
        getCoursewareFilePath: function () {
            return this.__getContextParams('file_path');
        },
        /**
         * Angular Scope Apply
         * @param scope
         * @param fn
         */
        safeApply: function (scope, fn) {
            if (angular.isFunction(fn)) {
                var phase = scope.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    fn();
                } else {
                    scope.$apply(function () {
                        fn();
                    });
                }
            }
        },
        /**
         * Encode HTML
         * @param text
         * @returns {*|jQuery}
         */
        encodeHTML: function (text) {
            return jquery('<div/>').text(text).html().replace(/"/g, "&quot;").replace(/'/g, "&apos;");
        },
        /**
         * Decode HTML
         * @param text
         * @returns {*|jQuery}
         */
        decodeHTML: function (text) {
            return jquery('<div/>').html(text).text();
        },
        /**
         * 非空数组判断
         * @param array 数组
         * @returns {*}
         */
        isNotEmptyArray: function (array) {
            return angular.isArray(array) && array.length > 0;
        },
        /**
         * 赋值对象属性
         * @param object  对象
         * @param propertyName 属性名
         * @param propertyValue 属性值
         */
        setObjectProperty: function (object, propertyName, propertyValue) {
            if (angular.isArray(object)) {
                angular.forEach(object, function (item) {
                    if (angular.isObject(item)) {
                        item[propertyName] = propertyValue;
                    }
                });
            } else if (angular.isObject(object)) {
                object[propertyName] = propertyValue;
            }
        },
        /**
         * 将源数组中的元素添加到目标数据中，条件中对象的属性值必须要满足等于目标值
         * @param src 源数组
         * @param dist 目标数据
         * @param property 属性名
         * @param value 目标值
         */
        pushToArray: function (src, dist, property, value) {
            if (Utils.isNotEmptyArray(src) && angular.isArray(dist)) {
                if (value === undefined) {
                    value = true;
                }
                angular.forEach(src, function (item) {
                    if (angular.isObject(item) && item[property] === value) {
                        dist.push(item);
                    }
                });
            }

            return dist;
        }
    };

    return Utils;
});	