/**
 * Created by ccy on 2015/10/27
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD .directive('unitSelect', [ function () {
        return {
            restrict:'E',
            templateUrl:'interaction/speechevaluating/directive/select.html',
            scope: {
            	currentId:'=currentId',
            	content:'=content',
            	isShow:'=isShow',
            	showWordsById:'=showWordsById'
            },
            replace: true,
            link:function(scope,element,attrs){
            	scope.list = scope.content.units;
            	//scope.isShow = false; 

            	if(scope.currentId){
            		
//            		for( var i = 0 , l = scope.list.length; i<l ; i++ ){
// 
//            			if( scope.currentId.length === 3 ){
//            				if(scope.currentId === scope.list[i].id){
//            					scope.currentItem = scope.list[i];
//            					break; 
//            				}
//            			}else {
//            				for( var j=0 ,jl = scope.list[i].parts.length; j<jl; j++ ){
//                				if(scope.currentId === scope.list[i].parts[j].id ){
//                					scope.currentItem = scope.list[i].parts[j];
//                					break; 
//                				}
//            					
//            				}
//            			}
//            			
//            		}
            		scope.showWordsById(scope.currentId);
            	}

            	
            }
        };
    }])

});
