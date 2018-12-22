define([
    'angular',
    './noUse/LaModule.js'
], function (angular, LaModule) {
    LaModule.service('LaService', Service);
    Service.$inject = ['$http'];

    function Service($http) {
        var NDR_HOST = 'http://esp-lifecycle.web.sdp.101.com/v0.6',                                          //资源平台服务地址
            CS_HOST = 'http://cs.101.com/v0.1/static',                                                        //内容服务地址
            LOCAL_HOST = window.location.origin || (window.location.protocol + '//' + window.location.host);  //本地服务地址

        return {
            /**
             * HTTP GET请求
             * @param url 请求url
             * @returns {*}
             * @private
             */
            _$httpGet: function (url) {
                return $http({url: url, method: 'GET'});
            }
        }
    }
});

