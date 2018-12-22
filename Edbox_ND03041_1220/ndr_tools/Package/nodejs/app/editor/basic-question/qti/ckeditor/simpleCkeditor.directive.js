define(['require','question-module','jquery','ckeditor','messenger','css!./style.css'],function(require,module){
	module.directive("simpleCkeditor", ['$document','$i18n','$timeout','$console',function($document,$i18n,$timeout,$console){
		return {
			restrict : 'A',
			scope : {
			},			
			link : function(scope, iElement, attrs, ngModel) {
				var ckeditor;
				var config = {language: $i18n.getLanguage()};
				ckeditor = CKEDITOR.inline(iElement[0], config);
				console.log("create editor ",ckeditor);
				ckeditor.setData("test data");

			}
		};
	}]);
});