define(['require','question-module','./convert'],function(require,module,convert) {
    module.factory('$questionTemplates', ['$http', '$url', '$i18n', '$stateParams', '$location', function ($http, $url, $i18n, $stateParams, $location) {
        return {
            getTemplates:function(type){
				var language = $location.search()["_lang_"] || 'zh_CN';
                if(type == 'basic_question'){
                    return $http.get('/v0.1/public/templates?categoryCode=basic_question&_lang_=' + language);
                }
                else{
                    return $http.get('/v0.1/public/templates?categoryCode=interaction_question&_lang_=' + language);
                }
            },
            getTemplate:function(code){
                return $http.get('/v0.1/public/template?code='+code)
            }
        }
    }]);
});
