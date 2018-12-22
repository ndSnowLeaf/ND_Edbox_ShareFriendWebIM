define([
    'jquery',
    'angular',
    'espEnvironment'
], function ($, angular, espEnvironment) {

    var Utils = {
        /**
         * 获取上下文参数
         * @param paramName
         * @returns {*}
         * @private
         */
        __GetContextParams: function (paramName) {
            return espEnvironment.location.params[paramName];
        },
        /**
         * 获取上下文
         * @returns {*}
         */
        GetContext: function () {
            return espEnvironment.location.params;
        },
        /**
         * 获取当前颗粒ID
         * @returns {*}
         */
        GetCurrentId: function () {
            return this.__GetContextParams('id');
        },
        /**
         * 获取当前颗粒地址
         * @returns {*}
         */
        GetCoursewareObjectPath: function () {
            return this.__GetContextParams('file_path');
        },
        /**
         * Angular Scope Apply
         * @param scope
         * @param fn
         */
        SafeApply: function (scope, fn) {
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
           * 非空数组判断
           * @param array 数组
           * @returns {*}
           */
          isNotEmptyArray: function (array) {
            return angular.isArray(array) && array.length > 0;
          },
          /**
           * 判断字符数（中文2个字符，英文1个字符）
           * @returns {*}
           */
          GetStrLen: function (str) {
            ///<summary>获得字符串实际长度，中文2，英文1</summary>
            ///<param name="str">要获得长度的字符串</param>
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
              charCode = str.charCodeAt(i);
              if (charCode >= 0 && charCode <= 128) realLength += 1;
              else realLength += 2;
            }
            return realLength;
          }
    };

    return Utils;
});	