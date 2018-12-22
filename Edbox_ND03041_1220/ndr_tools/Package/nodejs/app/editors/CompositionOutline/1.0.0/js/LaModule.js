define([
    'jquery',
    'angular',
    './utils.js',
    'json!../data/mMOption.json',
    'json!../data/version.json'
], function (jquery, angular, Utils, mMOption, dataVersion) {
    var module = angular.module('LaModule', []);

    // 当前语言环境
    var context = Utils.getContext();
    var EVN_LANG = context["_lang_"];
    var creator = context["creator"];
    if (typeof EVN_LANG === "undefined") {
        EVN_LANG = "zh_CN";
    }
    console.log('creator：' + creator + ' , lang：' + EVN_LANG);

    // 本地服务地址
    var LOCAL_HOST = window.location.origin || (window.location.protocol + '//' + window.location.host);

    // 获取本地checkList数据API
    var LOCAL_CHECK_LIST_API = '/v0.1/archives/:composition_outline_checklist_' + creator + '_' + EVN_LANG;

    require([
        'json!../editors/CompositionOutline/' + dataVersion.version + '/data/' + EVN_LANG + '/checkListItems.json',
        'json!../editors/CompositionOutline/' + dataVersion.version + '/data/' + EVN_LANG + '/minderMapData.json',
        'json!../editors/CompositionOutline/' + dataVersion.version + '/data/' + EVN_LANG + '/referenceExample.json'
    ], function (checkListItems, minderMapData, referenceExample) {

        module.service('DataService', ['$http', '$q', '$stage', '$filter', function ($http, $q, $stage, $filter) {

            //国际化处理minderMapOption and outlineExampleMinderMapOption
            var langData = {
                "mdnode_branchname": $filter('translate')('minderMap.branchName'),
                "mdnode_addchildtip": $filter('translate')('minderMap.addChildTip'),
                "mdmenu_edit": $filter('translate')('minderMap.edit'),
                "mdmenu_copy": $filter('translate')('minderMap.copy'),
                "mdmenu_cut": $filter('translate')('minderMap.cut'),
                "mdmenu_paste": $filter('translate')('minderMap.paste'),
                "mdmenu_delete": $filter('translate')('minderMap.delete')
            };

            mMOption["minderMapOption"]["langData"] = mMOption["outlineExampleMinderMapOption"]["langData"] = langData;

            return {
                // 缓存用户提纲节点数据
                __userMinderMapData: undefined,
                setUserMinderMapData: function (userMinderMapData) {
                    this.__userMinderMapData = userMinderMapData;
                },
                getUserMinderMapData: function () {
                    return this.__userMinderMapData;
                },
                updateUserMinderMapData: function (nodes) {
                    this.__userMinderMapData.minderMapNodes = nodes;
                },
                /**
                 * 根据当前语言环境获取当前选中文体的作文范例
                 * @param compositionStyle
                 * @returns {*}
                 */
                getSystemCompositionExample: function (compositionStyle) {
                    return referenceExample[compositionStyle]["compositionContent"];

                },
                /**
                 * 根据当前语言环境获取默认的检查清单数据项
                 * @return {[type]} [description]
                 */
                getDefaultCheckListItems: function () {
                    return checkListItems;
                },
                /**
                 * 获取思维导图渲染配置
                 * @return {[type]} [description]
                 */
                getMinderMapOption: function () {
                    return mMOption["minderMapOption"];
                },
                /**
                 * 获取提纲范例思维导图渲染配置
                 * @return {[type]} [description]
                 */
                getOutlineExampleMinderMapOption: function () {
                    return mMOption["outlineExampleMinderMapOption"];
                },
                /**
                 * 根据当前语言环境获取默认的思维导图节点渲染数据
                 * @param  {[type]} compositionStyle [description]
                 * @param  {[type]} level            [description]
                 * @return {[type]}                  [description]
                 */
                getDefaultMinderMapData: function (compositionStyle, level) {
                    if (this.__userMinderMapData && this.__userMinderMapData.compositionStyle === compositionStyle && this.__userMinderMapData.outlineLevel === level) {
                        return this.__userMinderMapData.minderMapNodes;
                    }
                    return minderMapData[compositionStyle][level];
                },
                /**
                 * 根据当前语言环境获取系统内置的提纲范例思维导图节点渲染数据
                 * @param  {[type]} compositionStyle [description]
                 * @param  {[type]} level            [description]
                 * @return {[type]}                  [description]
                 */
                getDefaultOutlineExampleMinderMapData: function (compositionStyle, level) {
                    return referenceExample[compositionStyle]["outlineNodes"][level];
                },
                /**
                 * 持久化检查清单数据到本地硬盘
                 * @param  {[type]} checkListData [description]
                 * @return {[type]}               [description]
                 */
                persistCheckListData: function (checkListData) {
                    var deferred = $q.defer(),
                        url = LOCAL_HOST + LOCAL_CHECK_LIST_API;
                    checkListData = JSON.stringify(checkListData);
                    this.__$httpPost(url, checkListData)
                        .success(function (msg) {
                            deferred.resolve();
                        })
                        .error(function () {
                            deferred.reject();
                        });
                    return deferred.promise;
                },
                /**
                 * 从硬盘反序列化检查清单数据
                 * @return {[type]} [description]
                 */
                deserializeCheckListData: function () {
                    var deferred = $q.defer(),
                        self = this,
                        url = LOCAL_HOST + LOCAL_CHECK_LIST_API;
                    this.__$httpGet(url)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (e) {
                            deferred.reject(e);
                        });
                    return deferred.promise;
                },
                /**
                 * HTTP GET请求
                 * @param url 请求url
                 * @returns {*}
                 * @private
                 */
                __$httpGet: function (url) {
                    return $http({
                        url: url,
                        method: 'GET'
                    });
                },
                /**
                 * HTTP GET请求
                 * @param url 请求url
                 * @returns {*}
                 * @private
                 */
                __$httpPost: function (url, data) {
                    return $http({
                        url: url,
                        method: 'POST',
                        data: data
                    });
                }
            }
        }]);
    });

    return module;
});
