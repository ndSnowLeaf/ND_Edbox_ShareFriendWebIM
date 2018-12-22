
/**
 * Created by ccy on 2015/11/3.
 * page = { size , index , total , pageCount }
 */
//test
config.lifecycle_host = "http://esp-lifecycle.web.sdp.101.com";
config.ref_path="http://cs.101.com/v0.1/static";
define(['angularAMD' , 'wordcard_search/directive/wordcard_search.directive','wordcard_search/utils','wordcard_search/directive/page/page'
], function (angularAMD,myService,utils) {
    angularAMD .directive('searchWindow', ['wordService', function (wordService) {
        return {
            restrict:'E',
            templateUrl:'interaction/wordcard_search/directive/search/search-window.html',
            scope: {
            	content:'=content',
            },
            replace: true,
            link:function($scope,element,attrs){

            	
            	$scope.opts = {	
            			prompt_flag:false,
            			prompt_cancel_flag:false ,
            			select_all_flag :false ,
            			search_word_flag : false ,
            			preview_flag : false ,
            			preview_item : false,
						show_content : false
            	} ;
                
                /*交互行为start*/
            	//插入
            	$scope.insertWord = function(item){
            		wordService.wordMessenger.send({
        				oper:'batch', 
        				type:'chinese',
        				data:[
	        				   {'data-key':'1',
	        					"data-content":'啊',
	        					'data-type':'chinese_word',
	        					'data-grade':'1',
	        					'sdp-package':'xxx-sdp-package.xml'}
        				   ]
        			});
            		item.isShowPrompt = false ; 
            		item.isInsert = !item.isInsert ; 
            	}
				//显示提示框
            	$scope.showPromptWindow = function(item){
            		//true 取消插入操作 ， false插入操作
            		if( !item.isInsert ){
            			//item.isShowPrompt = true ; 
            			$scope.insertWord(item);
            		}else {
            			item.isInsert = false ; 
            			wordService.wordMessenger.send({
            				oper:"delete", 
            				data:{"data-key":'1'}
            			});
            		}
            	} 
            	
            	
            	$scope.btnbarMoveleave = function(item){
            		if(	item.isShowPrompt === true ){ item.isShowPrompt = false ; }
            	}
            	
            	//插入所有选中的文字
            	$scope.insertSelects = function( ){
            		wordService.wordMessenger.send({
        				oper:'batch', 
        				type:'chinese',
        				data:[{'data-key':'1',"data-content":'啊','data-type':'chinese_word','data-grade':'1','sdp-package':'xxx-sdp-package.xml'},
        				      {'data-key':'2',"data-content":'哦','data-type':'chinese_word','data-grade':'1','sdp-package':'xxx-sdp-package.xml'}]
        			});
            	}
            	//预览
            	$scope.preview = function(item){
            		
            	}
            	//选中
            	$scope.selectItem = function(item){
            		item.isSelect=!item.isSelect;
            		if(item.isSelect){
            			$scope.content.select_words.push(item);
            		}else {
            			utils.removeItemByValue($scope.content.select_words,item) ;
            		}
            	}
            	//全选
            	$scope.selectAll = function(){
            		if( $scope.opts.select_all_flag === false ){
                		var words = $scope.content.words ; 
                		for( var i = 0 , l = words.length ; i<l ; i++ ){
                			if( !words[i].isSelect ){
                				words[i].isSelect = true;
                				$scope.content.select_words.push(words[i]);
                			}
                		}
            		}else {
                		var words = $scope.content.words ; 
                		for( var i = 0 , l = words.length ; i<l ; i++ ){
                			if( words[i].isSelect ){
                				words[i].isSelect = false;
                			}
                		}
                		$scope.content.select_words = [];
            		}
            		$scope.opts.select_all_flag  = !$scope.opts.select_all_flag ;
            	}
            	//弹出“是否替换现有图卡？”提示框
//            	$scope.showPromptCancelDialog = function(){
//            		var opts = $scope.opts ; 
//            		opts.prompt_cancel_flag=true;
//            		
//            		$f('#search_dialog').on('click.prompt_cancel.word',function(e){
//            			var $target = $f(e.target) ; 
//            			if( $target.closest('.prompt_cancel').length>0 && $target.hasClass('prompt_cancel_no') ){
//            				
//            				opts.prompt_cancel_flag=false;
//            				$f('#search_dialog').off('click.prompt_cancel.word');
//            				$scope.$apply();
//            			}
//            		})
//            	}
            	//点击生字词卡搜索按钮
            	$scope.searchWord = function(){
            		$scope.opts.search_word_flag = true ; 
            		$scope.content.search_word = $f('#wordcard_search_word').val() || $scope.content.search_word ; 
            		if( $scope.content.search_word.trim().length>1 ){
						alert("请输入单个中文文字")
            			return ; 
            		}else if( $scope.content.search_word.trim().length === 1 ){
						getWordsByPromise() ;
					}


            	}
            	//
            	$scope.goBack = function(){
            		$scope.opts.search_word_flag = false ; 
            		$scope.content.search_word = '';
					getWordsByPromise();
            	}
            	//关闭互动课堂调用的弹窗窗口
            	$scope.colseWindow = function(){
            		
            	}
            	
            	//预览窗口
            	$scope.showPreviewWindow = function(item){
            		$scope.opts.preview_item = item ; 
            		$scope.opts.preview_flag = true ; 
            	}
            	/*交互行为end*/
                if($scope.content.search_word){
                		$scope.searchWord();
                }else {
                		//从LC 获取生字词卡资源列表
					getWordsByPromise();
                }
                	
                	 
                //绑定事件
                bindEvent();

                
            	//dom 事件绑定
            	function bindEvent(){

            	}

				$scope.search_dialog_wid  = 1200 ;
				function init(){
					function resizeBallback(){
						var tempWid = $("#search_dialog").width() ;
						$scope.search_dialog_wid = tempWid ;
						if( tempWid<1180 ){
							$("#search_dialog .word_hz_img p").css({'font-size':'160px',top:'-40px'});
						}else {
							$("#search_dialog .word_hz_img p").css({'font-size':'180px',top:'-30px'});
						}
					}
					resizeBallback()
					$(window).resize(resizeBallback);
					$scope.load = function() {
						resizeBallback();
					}
				}

				init();

            	function $f(select){
            		return angular.element(select) ; 
            	}

				function getWordsByPromise(){
					var promise =  wordService.getWordsFromLC({chapter_id :$scope.content.chapter_id  , search_word:$scope.content.search_word });
					promise.then(function(data) {  // 调用承诺API获取数据 .resolve
						$scope.opts.show_content = true ;
						$scope.content.words = data;
					}, function(data) {  // 处理错误 .reject
						$scope.opts.show_content = true ;
						console.log(data);
					});
				}

                
            	
            }
        }
    }])

});
