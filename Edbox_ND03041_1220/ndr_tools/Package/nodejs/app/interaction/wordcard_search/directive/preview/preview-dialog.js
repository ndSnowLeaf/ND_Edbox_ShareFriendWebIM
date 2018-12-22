/**
 * Created by ccy on 2015/10/26.
 */
define(['angularAMD', 'lifecycle.service'
], function (angularAMD) {
    angularAMD .directive('previewDialog', ['LifecycleService', '$rootScope', '$stateParams','ngDialog','$filter', '$q', function (LifecycleService, $rootScope, $stateParams,ngDialog,$filter,$q) {
        return {
            restrict:'EA',
            scope:{
				afterClose:'&' , 
				item:'=item',
				grade:'=grade'
            },
            link: function (scope, element, attrs) {
//                attrs.itemType = !attrs.itemType?'image':attrs.itemType;
//                attrs.selectType = !attrs.selectType?'single':attrs.selectType;
//                //资源库[personal:个人库;public:ND库]
               // attrs.space = !$stateParams.space?'personal':$stateParams.space;
                var URL =  config.editor_host ; 
            	scope.model = {
                    href:['/interaction/#/wordcard_search?oper=preview_in&grade=',scope.grade,'&id=',scope.item.id,'&_lang_=',scope.item.json_url].join('')
                };
                
            	scope.insertWord = function(item){
            		item.isInsert = !item.isInsert ; 
            	};
            	
                element.click(function(){
                	var cancelClick = element.attr("cancelClick");
                	if(cancelClick === 'true' || cancelClick === true) return;
                	
					ngDialog.open({
						templateUrl: 'interaction/wordcard_search/directive/preview/preview-dialog.html',
						scope: scope,
						className: "wp-dialog "
					}).closePromise.then(function (data) {
						scope.afterClose();
					});
                    

                })
                

                

            }
        };
    }])

});