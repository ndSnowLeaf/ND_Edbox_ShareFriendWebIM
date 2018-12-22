
/**
 * Created by ccy on 2015/11/3.
 * page = { size , index , total , pageCount }
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD .directive('page', [ function () {
        return {
            restrict:'E',
            templateUrl:'wordcard_search/directive/page/page.html',
            scope: {
            	opts:"=opts"
            },
            replace: true,
            link:function(scope,element,attrs){
            	scope.numArr = [];
            	var l = 10<scope.opts.pageCount?10:scope.opts.pageCount ;
            	for( var i = 0 ; i<l ; i++ ){
            		scope.numArr.push(i+1);
            	}
            	
            	
            }
        }
    }])

});
