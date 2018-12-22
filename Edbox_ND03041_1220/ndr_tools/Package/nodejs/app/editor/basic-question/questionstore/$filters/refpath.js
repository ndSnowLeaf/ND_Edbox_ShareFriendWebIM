define(['require','question-module','jquery','plupload'],function(require,module) {
    var $ = require('jquery');
    module.filter("refpath", ['$url',function ($url) {
        return function(value){
            return $url.csref(value);
        }
    }]);
});

