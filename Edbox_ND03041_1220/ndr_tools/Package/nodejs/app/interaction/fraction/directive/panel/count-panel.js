/**
 * Created by zy on 2015/7/6.
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD .directive('countPanel', [ function () {
        return {
            restrict:'E',
            templateUrl:'interaction/fraction/directive/panel/count-panel.html',
            scope: {
                inputData:'=countData',
                nextStep :'=nextStep'
            },
            replace: true,
            link:function(scope,element,attrs){

				// /^\d{1,6}\/[1-9]\d{0,5}[+-]\d{1,6}\/[1-9]\d{0,5}$/
				var isPinyin = false ;

            	var cArr = ['0','1','2','3','4','5','6','7','8','9','','+','','-','','/'] ;
                scope.keybaord = function( e ){

                	var keyCode = e.keyCode ;
					var inputText = $("#f_inputText").val();
                	if(    (keyCode>=96 && keyCode<108)
						   || keyCode === 109
						   || keyCode === 111){
						var c = cArr[keyCode-96] ;
						if(   isValidFraction(inputText.substr(0,$("#f_inputText")[0].selectionStart),c) === false ){
							e.preventDefault();
							return false ;
						}else {

						}
                	}else if( ( keyCode>47 && keyCode<58 && event.shiftKey === false )
							  || ( keyCode === 187 && e.shiftKey === true )
							  || ( keyCode === 189 && e.shiftKey === false )
							  || ( keyCode === 191 && e.shiftKey === false ) ){
								  if( keyCode > 180 ){
									  keyCode =  48 + 10 + (keyCode-186) ;
								  }
						          var c = cArr[keyCode-48] ;
								  if(  isValidFraction(inputText.substr(0,$("#f_inputText")[0].selectionStart),c) === false ){
									  e.preventDefault();
								  }else {

								  }
					}else if( keyCode===229){
						isPinyin = true ;
                	}else if( keyCode===8 || (keyCode>36 &&　keyCode<41) ){

					}else {
						e.preventDefault();
					}

                }

                scope.keyup = function( e ){
					var inputText = $("#f_inputText").val();
					var startIndex = $("#f_inputText")[0].selectionStart, endIndex = $("#f_inputText")[0].selectionEnd ;
					if( startIndex === endIndex  && isValidFraction( inputText.substr(0,startIndex-1) , inputText.substr(startIndex-1,1)) === false ){
						inputText = inputText.substr(0,startIndex-1) +  inputText.substr(startIndex) ;
						focusNewVauleByIndex( inputText ,startIndex-1) ;
					};
					scope.inputData = inputText ;
                	if( /^\d{1,6}\/[1-9]\d{0,5}[+-]\d{1,6}\/[1-9]\d{0,5}$/.test(inputText) === true ){
                		angular.element("#next_step").css({background:"rgb(69, 153, 249)",color: '#FFF'}); 
                    }else {
                    	angular.element("#next_step").css({background:"#FFF",color: '#888'}); 
                    }
                }

                scope.getNum = function(c){
					var inputText = $("#f_inputText").val();
					var startIndex = $("#f_inputText")[0].selectionStart, endIndex = $("#f_inputText")[0].selectionEnd ;
					if(  scope.inputData.length === startIndex ){
						if( isValidFraction(inputText,c) ){
							inputText=inputText+c;
							$("#f_inputText").val(inputText);
						}
					}else {
						if( startIndex < endIndex ){
							inputText= inputText.substr(0,startIndex)+c+ inputText.substr(endIndex) ;
						}else {
							var tempStr = inputText.substr(0,startIndex);
							if( isValidFraction(tempStr,c) ){
								//scope.inputData=tempStr+c+scope.inputData.substr($("#f_inputText")[0].selectionStart);
								inputText = tempStr+c+inputText.substr(startIndex);
							}else{
								if( startIndex>0 ){
									startIndex-- ;
								}
							}
						}
						focusNewVauleByIndex( inputText ,startIndex+1) ;
					}
					scope.inputData = inputText ;
					if( inputText){
						scope.keyup();
					}
                };

                //退格删除
                scope.deleteNum=function(){
					var inputText = scope.inputData ;
					if(  inputText.length === $("#f_inputText")[0].selectionStart ){
						scope.inputData=inputText.replace(/.$/,'');
						$("#f_inputText").val(scope.inputData);

					}else {
						var startIndex = $("#f_inputText")[0].selectionStart, endIndex = $("#f_inputText")[0].selectionEnd ;
						if( startIndex < endIndex ){
							inputText= inputText.substr(0,startIndex)+ inputText.substr(endIndex) ;
						}else {
							inputText =inputText.substr(0,startIndex-1)+ inputText.substr(startIndex) ;
							startIndex--  ;
						}
						focusNewVauleByIndex( inputText ,startIndex) ;
						scope.inputData=inputText;
					}

					scope.keyup();
                }
				function focusNewVauleByIndex(value , Index  ){
					$("#f_inputText").val(value);
					$("#f_inputText")[0].focus();
					$("#f_inputText")[0].setSelectionRange(Index,Index);
				}

				function isValidFraction( inputData,c){
					if(!inputData){
						if(/(^0|[\/+-])/.test(c)) return  false;
					}
					var flag = /[+-]/.test(c) ;
					//如果连续输入运算符要替换
					if(flag){

						if(/[+-]$/.test(inputData)){
							inputData = inputData.replace(/[+-]$/,c)
							return false;
						}else if(/[+-]/.test(inputData ) || inputData && /[0-9]$/.test(inputData) === false ) {
							return false;
						}

					}else{
						var l =  inputData.length
						var strNum  =  l>=7?inputData.substring(l-6,l):inputData;
						if( l>=6 && /^\d{6}$/.test(strNum) && /^\d$/.test(c)){
							return false;
						}

						if(/[\/+-]$/.test(inputData) && c === '0' ){
							return false;
							//当最后一个数为数字的时候才可以输入/
						}else if( inputData && /[0-9]$/.test(inputData) === false  && c === '/' ){
							return false;
						}else if(  /\/\d\d*$/.test(inputData) && c === '/'  ){
							return false;
						}

					}
					return true ;
				}
            }
        };
    }])

});
