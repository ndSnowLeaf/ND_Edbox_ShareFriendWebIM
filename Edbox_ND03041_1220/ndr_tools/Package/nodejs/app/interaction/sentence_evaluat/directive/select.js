/**
 * Created by ccy on 2015/10/27
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD .directive('unitSelect', [ 'sentenceService',function (sentenceService) {
        return {
            restrict:'E',
            templateUrl:'interaction/sentence_evaluat/directive/select.html',
            scope: {
            	content:'=content'
            },
            replace: true,
            link:function(scope,element,attrs){
            	scope.opts = {
            			menuShow:false 
            	}
                /**
                 * 当接入Lc资源时，这个接口需调整，目前show_sentences引用是静态数据且引用变量始终不变，二删除句子操作是根据引用地址来删除的。
                 * 所以接入Lc时需对addSentences的引用地址同时做处理（若无需时时刷新句子资源则可做成只获取一次静态数据）
                 * @param id
                 */
            	//根据id显示句子列表
            	scope.showSentencesById = function(id){
                    //var temps = sentenceService.getSentencesByUnit(  id ) ;
                    scope.content.show_sentences = sentenceService.getSentencesByUnit(  id ) ;
            		scope.content.current_unit = id;
            	}

            	
            }
        };
    }])

});
