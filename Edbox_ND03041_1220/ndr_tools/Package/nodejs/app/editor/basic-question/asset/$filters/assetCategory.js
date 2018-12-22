define(['require','question-module'],function(require,module){	
	module.filter('assetCategory',['$i18n',function($i18n){
		return function(value,type){
			if(type=='local') {
				return value ? $i18n('asset.label.local.' + value) : '';
			}else if(type=='mine'){
				return value?$i18n('asset.label.mine.'+value):'';
			}else if(type=='ndChapter'){
				return value?$i18n('asset.label.nd_chapter.'+value):'';
			}else if(type=='nd'){
				return value?$i18n('asset.label.nd.'+value):'';
			}else if(type=='baidu'){
				return value?$i18n('asset.label.bd.'+value):'';
			}
			else{
				return value?$i18n('asset.label.'+value):'';
			}
		};
	}]);
	module.filter('nosuffix',['$i18n',function($i18n){
		return function(value){ 
			if(!value) return value;
			if(value.lastIndexOf(".")!=-1){
				return value.substring(0,value.lastIndexOf("."));
			}
			return value;
		};
	}]);
});