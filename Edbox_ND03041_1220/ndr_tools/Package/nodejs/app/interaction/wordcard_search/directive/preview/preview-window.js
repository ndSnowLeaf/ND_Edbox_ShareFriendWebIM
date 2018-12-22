
/**
 * Created by ccy on 2015/11/3.
 * page = { size , index , total , pageCount }
 */
//test
config.lifecycle_host = "http://esp-lifecycle.web.sdp.101.com";
config.ref_path="http://cs.101.com/v0.1/static";
define(['angularAMD' , 'wordcard_search/ue' ,  'components/site-directive/jq-media/jq.media' ,'wordcard_search/directive/chineseword_trace' ,'wordcard_search/directive/preview/preview-dialog'
], function (angularAMD) {
    angularAMD .directive('previewWindow', ['wordService', function (wordService) {
        return {
            restrict:'E',
            templateUrl:'interaction/wordcard_search/directive/preview/preview-window.html',
            scope: {
            	content:"=content" ,
            	
            },
            replace: true,
            link:function($scope,element,attrs){
            	$scope.test = function(){
            		console.log(this);
            	}
            	var H_SPEED = 5 , L_SPEED = 2;
            	//默认高年级
            	$scope.LEVEL = 'L' ; 
            	//如果是低年级这赋值L
            	if( $scope.content.grade && parseInt($scope.content.grade) >= 3 ){
            		$scope.LEVEL = 'H' ; 
            	} 
            		
            	$scope.opts = {	
            			prompt_cancel_flag:false ,
            			img_switch:[1],
            			duoyinziFlag:false,
                        footwrap1:true ,
                        footwrap2:false ,
                        footwrap3:false ,
                        isSequencer:false
                } ;
                var testWord ;
                //$scope.previewItem =    wordService.getWordVeiwByJson($scope.content.json_url);
                wordService.getWordVeiwByJson($scope.content.json_url).then(function(data) {  // 调用承诺API获取数据 .resolve
                    $scope.previewItem = data;
                    initMedia();
                    $.ajax({
                        url:data.strokesUrl.replace('${ref-path}', config.ref_path),
                        dataType: 'json',
                        async:true
                    }).done(function(jsonResult) {
                       testWord =jsonResult ;
                       $scope.showWordCard(false,true );
                    }).fail(function(e){
                        console.log("笔顺描红返回json文件解析异常",e)
                    });


                }, function(data) {  // 处理错误 .reject
                    console.log(data);
                });

            	function initMedia(){
                    var media = $scope.previewItem.media ;
                    for( var i=1 ,l=media.images.length ; i<l ; i++ ){
                        $scope.opts.img_switch[i] = 0 ;
                    }
                }
            	$scope.changeImage = function(index){
                	for( var i=0 ,l=$scope.opts.img_switch.length ; i<l ; i++ ){
                		$scope.opts.img_switch[i] = 0 ; 
                	}
                	$scope.opts.img_switch[index] = 1 ;
            	}

                $scope.showFootwrap = function(index){
                    $scope.opts.footwrap1 = false ;
                    $scope.opts.footwrap2 = false ;
                    $scope.opts.footwrap3 = false ;

                    if( index !== 0 ){
                        $scope.opts['footwrap'+index] = true ;
                        $scope.opts.isSequencer = false ;
                        if( index === 2) {
                            $scope.showWordRadical();
                        }else if(index===3){
                            $scope.showWordStructure();
                        }
                    }else {
                        $scope.showWordCard(false);
                    }
                }
                $scope.pinyin_audioPlay = function(){
                    $('#pinyin_audio')[0].play();
                }
            	//弹出“是否确定取消插入？”提示框
            	$scope.showPromptCancelDialog = function(){
            		var opts = $scope.opts ; 
            		$scope.opts.prompt_cancel_flag=true;
            		
            		$f('#previewDialog').on('click.prompt_cancel.preview',function(e){
            			var $target = $f(e.target) ; 
            			if( $target.closest('.prompt_cancel').length>0 && $target.hasClass('prompt_cancel_no') ){
            				
            				opts.prompt_cancel_flag=false;
            				$f('#previewDialog').off('click.prompt_cancel.preview');
            				$scope.$apply();
            			}
            		})
            	}
            	
            	$scope.cancelInsertWord = function(){
            		wordService.wordMessenger.send({
        				oper:'batch', 
        				type:'chinese',
        				data:[{'data-key':'1'},]
        			});
            		//$scope.closeWindow();
            		//$scope.insertWord($scope.previewItem) ; 
            	}

            	$scope.insertWord = function(){
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
            	
            	}
            	$scope.closePreview = function(){
            		var dialogClose = window.parent.document.getElementsByClassName("ngdialog-close") ; 
            		if(dialogClose.length>0){
            			$(dialogClose[0]).click();
            		}
            	
            	}
            	
            	function $f(select){
            		return angular.element(select) ; 
            	}
            	
            	function init(){
            		$f("#my_media_video").videoplayer();
                    $f("#my_media_audio").audioplayer();

                    //setTimeout(function(){   $scope.showWordCard();},500);
            	}
            	init(); 
            	
            
            	$scope.setAnimSpeed = function(speed){
            		var temp = H_SPEED;
            		if(speed === 'L'){
            			temp = L_SPEED;
            		}
            		$scope.animSpeed = temp ;

            	}
            	
            	$scope.animSpeed = H_SPEED ;

            	
                /**
                 * 显示
                 */
//                ANIM_NORMAL:'normal',
//                ANIM_SLOW:'slow',
            	
            	$scope.showWordCard = function(animate,isFirst){
              		 if( animate === false && isFirst!==true  ){
            			 stopStroke();
            		 }
              		 
            		 var testWord1 = $.extend(true,{},testWord);
            		 ChineseWord.wordCoordinate = coordinateTransform(testWord1,289,289);
            	     ChineseWord.animSpeed = $scope.animSpeed;
            	     ChineseWord.loop = 0;
            		 var $drawCanvas = $('#wordcard-canvas');
            		 var context = $drawCanvas[0].getContext('2d');
            	     $drawCanvas.attr("width",289);
            	     $drawCanvas.attr("height",289);
            	     ChineseWord.context=context ;
              		
              		 drawWord(testWord1,animate);
              	
                  

                }
            	$scope.stopStroke = stopStroke ; 

                $scope.showWordRadical = function(){
                    stopStroke();
                    var testWord1 = $.extend(true,{},testWord);
                    ChineseWord.wordCoordinate = coordinateTransform(testWord1,289,289);
                    drawWord(testWord1,false, 'radical');

                }
                $scope.showWordStructure = function(){
                    stopStroke();
                    var testWord1 = $.extend(true,{},testWord);
                    ChineseWord.wordCoordinate = coordinateTransform(testWord1,289,289);
                    drawWord(testWord1,false,"structure");
                }


                /**-----------------字体描红相关start----------------**/
                /**
                 * 生字坐标转换
                 * originalWord 需要进行转换的字
                 * w 生成字的宽
                 * h 生成字的高
                 */
                function coordinateTransform(originalWord,w,h){
                    var originalSize = originalWord.size;
                    var scaleX = w / originalSize;
                    var scaleY = h / originalSize;
                    for(var i = 0;i < originalWord.strokes.length;i++){
                        for(var j = 0;j < originalWord.strokes[i].centers.length;j++){
                            originalWord.strokes[i].centers[j].x = originalWord.strokes[i].centers[j].x * scaleX;
                            originalWord.strokes[i].centers[j].y = originalWord.strokes[i].centers[j].y * scaleY;
                        }

                        for (var k = 0; k < originalWord.strokes[i].segments.length; k++) {
                            originalWord.strokes[i].segments[k].start.x = originalWord.strokes[i].segments[k].start.x * scaleX;
                            originalWord.strokes[i].segments[k].start.y = originalWord.strokes[i].segments[k].start.y * scaleY;

                            originalWord.strokes[i].segments[k].end.x = originalWord.strokes[i].segments[k].end.x * scaleX;
                            originalWord.strokes[i].segments[k].end.y = originalWord.strokes[i].segments[k].end.y * scaleY;

                            for(var l = 0;l < originalWord.strokes[i].segments[k].points.length; l++){
                                originalWord.strokes[i].segments[k].points[l].x = originalWord.strokes[i].segments[k].points[l].x * scaleX;
                                originalWord.strokes[i].segments[k].points[l].y = originalWord.strokes[i].segments[k].points[l].y * scaleY;
                            }
                        }
                    }
                    return originalWord;
                }

                //初始化，画出背景canvas
                function init_canvas(type,withAnim){
                    var cb = ChineseWord.context;
                    var steps = ChineseWord.word.steps;
                    var radicalInfo = ChineseWord.radicalInfo;
                    var structureInfos = ChineseWord.structureInfos;

                    cb.restore();
                    cb.clearRect(0,0,cb.canvas.width,cb.canvas.height);
                    var i, j,k;

                    for (i = 0; i < steps.length; i++) {
                        cb.fillStyle = "rgb(0,0,0)";
                        if(  withAnim === true ){
                            cb.fillStyle = "rgb(136,136,136)";
                        }

                        if(type && type == 'radical' && radicalInfo){
                            if(radicalInfo.stepIndex && radicalInfo.stepIndex.indexOf(i) > -1){
                                cb.fillStyle = radicalInfo.color;
                            }
                        }else if(type && type == 'structure' && structureInfos){
                            for(j=0;j<structureInfos.length;j++){
                                if(structureInfos[j].stepIndex.indexOf(i) > -1){
                                    cb.fillStyle = structureInfos[j].color;
                                    break;
                                }
                            }
                        }
                        var points = steps[i].points;
                        cb.beginPath();
                        for (j = 0; j < points.length; j++) {
                            var point = points[j];
                            cb.lineTo(point.x, point.y);
                        }
                        cb.closePath();
                        cb.fill();
                    }
                    ChineseWord.imageData = cb.getImageData(0,0,cb.canvas.width,cb.canvas.height);

                }

                /**
                 * 绘制文字
                 * @param wordStr
                 * @param withAnim
                 */
                function drawWord(wordStr,withAnim,type) {
                    if (ChineseWord.loop)
                        return;

                    ChineseWord.word = convertData2(wordStr);
                    ChineseWord.startDraw = false;

                    if (!ChineseWord.word)
                        return;

                    ChineseWord.currentStep = 0;
                    ChineseWord.lastTime = 0;


                    if (typeof wordStr != 'undefined')
                        init_canvas(type,withAnim);

                    if(withAnim == true){
                        leftContextAnimate();
                    }

                };

                function convertData2(word) {
                    var instance = ChineseWord;
                    instance.radicalInfo = {//部首
                        stepIndex:[],
                        color:"rgb(136,136,136)"
                    };
                    instance.structureInfos = [//字形结构

                    ];
                    var i, j, k,len, m,n;
                    var strokes = word.strokes;
                    var strokeInfo = word.strokeInfo;
                    var strokeIndex = [],structureStrokeIndex = [];
                    if(strokeInfo && strokeInfo.radicalInfo && strokeInfo.radicalInfo.strokeIndex){
                        strokeIndex = strokeInfo.radicalInfo.strokeIndex.split(",");
                        for(i=0; i<strokeIndex.length; i++){
                            strokeIndex[i] = parseInt(strokeIndex[i]);
                        }
                    }
                    if(strokeInfo && strokeInfo.radicalInfo && strokeInfo.radicalInfo.oriColor && strokeInfo.radicalInfo.oriColor.length == 3){
                        var color = strokeInfo.radicalInfo.oriColor;
                        instance.radicalInfo.color = "rgb("+color[0]+","+color[1]+","+color[2]+")";
                    }
                    if(strokeInfo && strokeInfo.structureInfos && strokeInfo.structureInfos.length > 0){
                        var temp = [];
                        for(i=0,len = strokeInfo.structureInfos.length; i<len; i++){
                            var structureInfo = strokeInfo.structureInfos[i];
                            var info = {
                                stepIndex:[],
                                color:"rgb(136,136,136)"
                            };
                            var color = structureInfo.oriColor;
                            info.color = "rgb("+color[0]+","+color[1]+","+color[2]+")";
                            temp = structureInfo.strokeIndex.split(",");
                            structureStrokeIndex[i] = [];
                            for(j=0; j<temp.length; j++){
                                structureStrokeIndex[i][j] = parseInt(temp[j]);
                            }
                            instance.structureInfos.push(info);
                        }
                    }

                    word.steps = [];
                    for (i = 0; i < strokes.length; i++) {
                        var centers = strokes[i].centers, segments = strokes[i].segments;
                        for (j = 0; j < centers.length; j++) {
                            centers[j] = new ChineseWord.Point(centers[j].x, centers[j].y);
                        }
                        for (j = 0; j < segments.length; j++) {
                            segments[j].start = new ChineseWord.Point(segments[j].start.x, segments[j].start.y);
                            segments[j].end = new ChineseWord.Point(segments[j].end.x, segments[j].end.y);
                            var points = segments[j].points;
                            for (k = 0; k < points.length; k++) {
                                points[k] = new ChineseWord.Point(points[k].x, points[k].y);
                            }
                            if(strokeIndex.indexOf(i) > -1){
                                instance.radicalInfo.stepIndex.push(word.steps.length);
                            }
                            for(m=0;m<structureStrokeIndex.length; m++){
                                if(structureStrokeIndex[m].indexOf(i) > -1){
                                    instance.structureInfos[m].stepIndex.push(word.steps.length);
                                    break;
                                }
                            }
                            word.steps.push({"line": new ChineseWord.Line(segments[j].start, segments[j].end), "points": points});
                        }
                    }

                    return word;
                }

                function leftContextAnimate(id) {
                    var c = ChineseWord.context;
                    c.fillStyle = "rgb(201, 71, 71)";
                    draw(id);
                }

                function draw(id) {
                    if (ChineseWord.currentStep >= ChineseWord.word.steps.length) {
                        ChineseWord.loop = 0;
                        return;
                    }
                    ChineseWord.context.save();
                    setClipPath(id);
                    animate(id);
                }

                function animate(id) {
                    var interval = 0,
                        step = ChineseWord.word.steps[ChineseWord.currentStep],
                        maxValue = step.line.getLength();

                    function animateInner() {
                        interval += 	$scope.animSpeed ;
                        if (interval >= maxValue)
                            interval = maxValue;

                        drawAnimationFrame(interval,id);

                        if (interval == maxValue) {
                            cancelAnimationFrame(ChineseWord.loop);
                            ++ChineseWord.currentStep;
                            ChineseWord.context.restore();
                            draw(id);
                            return;
                        }
                        ChineseWord.loop = requestAnimationFrame(animateInner);
                    }

                    ChineseWord.loop = requestAnimationFrame(animateInner);
                }

                /**
                 * 停止描红
                 * @param id
                 */
                function stopStroke(){
                    cancelAnimationFrame(ChineseWord.loop);
                    ChineseWord.loop = 0;
                    drawWord(ChineseWord.wordCoordinate,false);
                }
                function setClipPath(id) {
                    var c = ChineseWord.context, steps = ChineseWord.word.steps;
                    c.beginPath();
                    var points = steps[ChineseWord.currentStep].points;
                    for (var j = 0; j < points.length; j++) {
                        var point = points[j];
                        c.lineTo(point.x, point.y);
                    }
                    c.closePath();
                    c.clip();
                }

                function drawAnimationFrame(interval,id) {
                    var c = ChineseWord.context;
                    c.beginPath();
                    var rectAry = ChineseWord.word.steps[ChineseWord.currentStep].line.getRectangle(500, interval);
                    for (var i = 0; i < rectAry.length; i++) {
                        var point = rectAry[i];
                        c.lineTo(point.x, point.y);
                    }
                    c.closePath();
                    c.fill();
                }
                /**-----------------字体描红相关end----------------**/


                //var testWord = {"char":"嗒","strokeCount":12,"size":500,"radicals":{"Item1":0,"Item2":11},"strokes":[{"centers":[{"x":46,"y":161},{"x":48,"y":163},{"x":50,"y":162},{"x":53,"y":167},{"x":58,"y":168},{"x":65,"y":171},{"x":68,"y":176},{"x":69,"y":199},{"x":71,"y":209},{"x":72,"y":223},{"x":73,"y":238},{"x":73,"y":247},{"x":74,"y":261},{"x":75,"y":270},{"x":76,"y":278},{"x":76,"y":283},{"x":78,"y":286},{"x":76,"y":288},{"x":78,"y":291},{"x":79,"y":294}],"segments":[{"start":{"x":45,"y":160},"end":{"x":79,"y":294},"points":[{"x":46,"y":167},{"x":46,"y":161},{"x":50,"y":160},{"x":54,"y":158},{"x":64,"y":160},{"x":79,"y":166},{"x":81,"y":210},{"x":83,"y":241},{"x":84,"y":257},{"x":85,"y":274},{"x":84,"y":284},{"x":82,"y":289},{"x":79,"y":294},{"x":75,"y":293},{"x":71,"y":288},{"x":67,"y":283},{"x":64,"y":265},{"x":62,"y":236},{"x":60,"y":207},{"x":57,"y":187},{"x":52,"y":177}]}]},{"centers":[{"x":68,"y":166},{"x":78,"y":172},{"x":89,"y":172},{"x":96,"y":171},{"x":104,"y":170},{"x":110,"y":169},{"x":115,"y":167},{"x":120,"y":166},{"x":125,"y":165},{"x":129,"y":164},{"x":132,"y":164},{"x":133,"y":163},{"x":141,"y":160},{"x":145,"y":162},{"x":147,"y":163},{"x":148,"y":165},{"x":152,"y":166},{"x":155,"y":168},{"x":158,"y":183},{"x":154,"y":187},{"x":154,"y":193},{"x":150,"y":201},{"x":148,"y":211},{"x":144,"y":219},{"x":142,"y":229},{"x":140,"y":235},{"x":139,"y":242},{"x":139,"y":247},{"x":130,"y":250}],"segments":[{"start":{"x":67,"y":166},"end":{"x":148,"y":160},"points":[{"x":135,"y":173},{"x":128,"y":172},{"x":118,"y":175},{"x":107,"y":177},{"x":91,"y":179},{"x":68,"y":180},{"x":68,"y":166},{"x":87,"y":165},{"x":102,"y":163},{"x":112,"y":160},{"x":123,"y":158},{"x":129,"y":156},{"x":132,"y":153},{"x":134,"y":150},{"x":137,"y":148},{"x":140,"y":147},{"x":142,"y":147},{"x":147,"y":148}]},{"start":{"x":143,"y":147},"end":{"x":130,"y":250},"points":[{"x":147,"y":148},{"x":154,"y":151},{"x":161,"y":154},{"x":169,"y":158},{"x":176,"y":162},{"x":183,"y":167},{"x":186,"y":171},{"x":186,"y":175},{"x":186,"y":178},{"x":183,"y":181},{"x":178,"y":184},{"x":173,"y":187},{"x":167,"y":196},{"x":159,"y":212},{"x":151,"y":228},{"x":147,"y":241},{"x":147,"y":250},{"x":130,"y":250},{"x":130,"y":243},{"x":132,"y":230},{"x":137,"y":210},{"x":142,"y":190},{"x":142,"y":178},{"x":139,"y":175},{"x":135,"y":173}]}]},{"centers":[{"x":72,"y":250},{"x":79,"y":259},{"x":97,"y":258},{"x":105,"y":257},{"x":112,"y":255},{"x":124,"y":254},{"x":132,"y":253},{"x":136,"y":252},{"x":142,"y":251},{"x":144,"y":251},{"x":149,"y":250},{"x":153,"y":254},{"x":156,"y":255}],"segments":[{"start":{"x":72,"y":250},"end":{"x":156,"y":255},"points":[{"x":99,"y":249},{"x":85,"y":250},{"x":72,"y":250},{"x":74,"y":268},{"x":110,"y":265},{"x":133,"y":263},{"x":142,"y":261},{"x":152,"y":258},{"x":156,"y":255},{"x":155,"y":250},{"x":155,"y":245},{"x":152,"y":243},{"x":147,"y":242},{"x":141,"y":242},{"x":131,"y":243},{"x":115,"y":246}]}]},{"centers":[{"x":177,"y":141},{"x":179,"y":142},{"x":181,"y":142},{"x":184,"y":145},{"x":187,"y":144},{"x":190,"y":147},{"x":195,"y":147},{"x":199,"y":148},{"x":201,"y":148},{"x":206,"y":148},{"x":214,"y":146},{"x":226,"y":145},{"x":241,"y":142},{"x":259,"y":139},{"x":273,"y":137},{"x":286,"y":135},{"x":305,"y":132},{"x":317,"y":131},{"x":331,"y":130},{"x":343,"y":129},{"x":353,"y":128},{"x":363,"y":128},{"x":373,"y":127},{"x":383,"y":127},{"x":389,"y":127},{"x":391,"y":127},{"x":396,"y":128},{"x":400,"y":131},{"x":410,"y":132},{"x":414,"y":135},{"x":415,"y":139},{"x":420,"y":140}],"segments":[{"start":{"x":177,"y":141},"end":{"x":421,"y":140},"points":[{"x":370,"y":138},{"x":348,"y":138},{"x":325,"y":140},{"x":302,"y":142},{"x":276,"y":146},{"x":247,"y":151},{"x":218,"y":156},{"x":202,"y":159},{"x":198,"y":159},{"x":195,"y":159},{"x":190,"y":156},{"x":184,"y":150},{"x":179,"y":144},{"x":177,"y":141},{"x":180,"y":140},{"x":183,"y":140},{"x":190,"y":139},{"x":200,"y":138},{"x":211,"y":137},{"x":234,"y":133},{"x":271,"y":128},{"x":308,"y":123},{"x":337,"y":119},{"x":357,"y":117},{"x":377,"y":116},{"x":388,"y":115},{"x":392,"y":115},{"x":395,"y":115},{"x":401,"y":118},{"x":409,"y":124},{"x":418,"y":129},{"x":421,"y":134},{"x":421,"y":137},{"x":420,"y":140},{"x":410,"y":141},{"x":390,"y":139}]}]},{"centers":[{"x":215,"y":82},{"x":217,"y":82},{"x":219,"y":84},{"x":221,"y":83},{"x":224,"y":83},{"x":226,"y":85},{"x":232,"y":87},{"x":237,"y":88},{"x":241,"y":95},{"x":244,"y":103},{"x":244,"y":109},{"x":244,"y":115},{"x":247,"y":129},{"x":247,"y":137},{"x":246,"y":146},{"x":249,"y":160},{"x":248,"y":168},{"x":251,"y":175},{"x":252,"y":175},{"x":253,"y":180}],"segments":[{"start":{"x":214,"y":79},"end":{"x":253,"y":180},"points":[{"x":220,"y":77},{"x":227,"y":77},{"x":237,"y":80},{"x":248,"y":82},{"x":254,"y":84},{"x":255,"y":87},{"x":256,"y":89},{"x":257,"y":96},{"x":257,"y":109},{"x":258,"y":121},{"x":258,"y":136},{"x":256,"y":153},{"x":255,"y":171},{"x":253,"y":180},{"x":249,"y":180},{"x":246,"y":180},{"x":241,"y":166},{"x":236,"y":138},{"x":231,"y":109},{"x":226,"y":93},{"x":221,"y":89},{"x":217,"y":85},{"x":215,"y":82},{"x":218,"y":79}]}]},{"centers":[{"x":329,"y":46},{"x":332,"y":48},{"x":333,"y":52},{"x":335,"y":54},{"x":340,"y":56},{"x":346,"y":58},{"x":346,"y":64},{"x":348,"y":76},{"x":345,"y":86},{"x":340,"y":98},{"x":338,"y":108},{"x":332,"y":120},{"x":330,"y":130},{"x":325,"y":139},{"x":321,"y":149},{"x":317,"y":155},{"x":313,"y":165},{"x":309,"y":172},{"x":306,"y":175},{"x":305,"y":175},{"x":303,"y":180}],"segments":[{"start":{"x":329,"y":46},"end":{"x":353,"y":86},"points":[{"x":333,"y":72},{"x":334,"y":61},{"x":330,"y":58},{"x":327,"y":55},{"x":326,"y":52},{"x":328,"y":49},{"x":329,"y":46},{"x":336,"y":47},{"x":347,"y":51},{"x":358,"y":56},{"x":364,"y":60},{"x":365,"y":64},{"x":367,"y":67},{"x":362,"y":81}]},{"start":{"x":348,"y":75},"end":{"x":303,"y":180},"points":[{"x":362,"y":81},{"x":351,"y":105},{"x":341,"y":129},{"x":331,"y":148},{"x":321,"y":160},{"x":312,"y":173},{"x":307,"y":180},{"x":305,"y":180},{"x":303,"y":180},{"x":305,"y":170},{"x":312,"y":150},{"x":318,"y":130},{"x":324,"y":110},{"x":328,"y":91},{"x":333,"y":72}]}]},{"centers":[{"x":259,"y":172},{"x":261,"y":172},{"x":262,"y":174},{"x":266,"y":174},{"x":267,"y":176},{"x":271,"y":178},{"x":276,"y":180},{"x":277,"y":190},{"x":274,"y":197},{"x":270,"y":202},{"x":266,"y":208},{"x":259,"y":219},{"x":253,"y":227},{"x":246,"y":236},{"x":239,"y":247},{"x":232,"y":256},{"x":224,"y":267},{"x":215,"y":275},{"x":207,"y":284},{"x":197,"y":291},{"x":188,"y":300},{"x":178,"y":308},{"x":169,"y":315},{"x":159,"y":321},{"x":149,"y":327},{"x":140,"y":331},{"x":130,"y":337},{"x":121,"y":341},{"x":115,"y":341},{"x":110,"y":343}],"segments":[{"start":{"x":261,"y":167},"end":{"x":224,"y":267},"points":[{"x":212,"y":262},{"x":229,"y":242},{"x":243,"y":218},{"x":258,"y":195},{"x":264,"y":182},{"x":262,"y":178},{"x":259,"y":175},{"x":259,"y":172},{"x":262,"y":170},{"x":264,"y":168},{"x":270,"y":170},{"x":278,"y":175},{"x":287,"y":179},{"x":292,"y":184},{"x":292,"y":188},{"x":293,"y":192},{"x":290,"y":199},{"x":282,"y":210},{"x":274,"y":220},{"x":263,"y":235},{"x":249,"y":253},{"x":235,"y":271}]},{"start":{"x":230,"y":263},"end":{"x":109,"y":343},"points":[{"x":235,"y":271},{"x":218,"y":288},{"x":198,"y":303},{"x":179,"y":318},{"x":160,"y":330},{"x":141,"y":338},{"x":123,"y":346},{"x":113,"y":349},{"x":111,"y":346},{"x":110,"y":343},{"x":119,"y":336},{"x":139,"y":324},{"x":159,"y":312},{"x":177,"y":298},{"x":195,"y":280},{"x":212,"y":262}]}]},{"centers":[{"x":283,"y":185},{"x":279,"y":191},{"x":290,"y":202},{"x":298,"y":208},{"x":311,"y":219},{"x":319,"y":228},{"x":334,"y":242},{"x":347,"y":253},{"x":356,"y":262},{"x":372,"y":271},{"x":381,"y":280},{"x":391,"y":285},{"x":410,"y":292},{"x":414,"y":292},{"x":422,"y":292},{"x":433,"y":291},{"x":452,"y":297},{"x":464,"y":296},{"x":473,"y":300},{"x":473,"y":301},{"x":478,"y":301}],"segments":[{"start":{"x":281,"y":184},"end":{"x":407,"y":300},"points":[{"x":385,"y":262},{"x":353,"y":245},{"x":327,"y":223},{"x":301,"y":201},{"x":286,"y":189},{"x":283,"y":185},{"x":272,"y":194},{"x":295,"y":216},{"x":312,"y":233},{"x":341,"y":261},{"x":359,"y":280},{"x":377,"y":299},{"x":390,"y":308},{"x":398,"y":309}]},{"start":{"x":381,"y":283},"end":{"x":478,"y":301},"points":[{"x":398,"y":309},{"x":406,"y":310},{"x":421,"y":309},{"x":444,"y":306},{"x":466,"y":304},{"x":478,"y":301},{"x":479,"y":298},{"x":479,"y":296},{"x":461,"y":288},{"x":423,"y":275},{"x":385,"y":262}]}]},{"centers":[{"x":232,"y":283},{"x":239,"y":283},{"x":240,"y":284},{"x":241,"y":286},{"x":243,"y":287},{"x":244,"y":288},{"x":248,"y":289},{"x":253,"y":289},{"x":266,"y":286},{"x":272,"y":286},{"x":278,"y":285},{"x":290,"y":283},{"x":296,"y":282},{"x":302,"y":280},{"x":310,"y":279},{"x":314,"y":277},{"x":315,"y":276},{"x":317,"y":276},{"x":319,"y":270},{"x":321,"y":270},{"x":322,"y":269}],"segments":[{"start":{"x":232,"y":283},"end":{"x":323,"y":269},"points":[{"x":324,"y":276},{"x":324,"y":280},{"x":321,"y":284},{"x":318,"y":287},{"x":310,"y":290},{"x":298,"y":293},{"x":285,"y":296},{"x":274,"y":298},{"x":263,"y":298},{"x":251,"y":298},{"x":244,"y":296},{"x":241,"y":294},{"x":237,"y":292},{"x":235,"y":289},{"x":234,"y":286},{"x":232,"y":283},{"x":244,"y":279},{"x":270,"y":275},{"x":295,"y":270},{"x":310,"y":268},{"x":314,"y":268},{"x":319,"y":268},{"x":322,"y":269},{"x":323,"y":273}]}]},{"centers":[{"x":203,"y":344},{"x":205,"y":344},{"x":206,"y":346},{"x":212,"y":346},{"x":214,"y":348},{"x":223,"y":351},{"x":224,"y":355},{"x":226,"y":371},{"x":227,"y":377},{"x":228,"y":383},{"x":229,"y":397},{"x":230,"y":403},{"x":232,"y":409},{"x":233,"y":415},{"x":233,"y":430},{"x":231,"y":431},{"x":232,"y":435},{"x":233,"y":436},{"x":231,"y":438},{"x":231,"y":439}],"segments":[{"start":{"x":202,"y":340},"end":{"x":231,"y":439},"points":[{"x":238,"y":376},{"x":240,"y":404},{"x":241,"y":434},{"x":237,"y":436},{"x":234,"y":439},{"x":231,"y":439},{"x":229,"y":436},{"x":227,"y":434},{"x":225,"y":427},{"x":223,"y":414},{"x":221,"y":402},{"x":218,"y":390},{"x":216,"y":378},{"x":214,"y":365},{"x":211,"y":357},{"x":207,"y":352},{"x":204,"y":347},{"x":203,"y":344},{"x":205,"y":341},{"x":208,"y":338},{"x":218,"y":339},{"x":235,"y":345}]}]},{"centers":[{"x":223,"y":345},{"x":231,"y":353},{"x":246,"y":351},{"x":256,"y":349},{"x":272,"y":347},{"x":284,"y":345},{"x":297,"y":342},{"x":313,"y":340},{"x":321,"y":338},{"x":323,"y":338},{"x":324,"y":338},{"x":327,"y":337},{"x":328,"y":338},{"x":331,"y":337},{"x":333,"y":336},{"x":335,"y":337},{"x":337,"y":338},{"x":343,"y":341},{"x":344,"y":342},{"x":349,"y":346},{"x":349,"y":358},{"x":344,"y":366},{"x":343,"y":376},{"x":337,"y":392},{"x":323,"y":410}],"segments":[{"start":{"x":222,"y":345},"end":{"x":355,"y":340},"points":[{"x":331,"y":351},{"x":328,"y":348},{"x":325,"y":347},{"x":321,"y":347},{"x":318,"y":347},{"x":285,"y":352},{"x":254,"y":356},{"x":223,"y":361},{"x":223,"y":345},{"x":238,"y":345},{"x":258,"y":343},{"x":284,"y":338},{"x":309,"y":333},{"x":324,"y":330},{"x":328,"y":327},{"x":333,"y":325},{"x":338,"y":324},{"x":343,"y":325},{"x":347,"y":325},{"x":354,"y":330}]},{"start":{"x":346,"y":328},"end":{"x":323,"y":410},"points":[{"x":354,"y":330},{"x":364,"y":338},{"x":373,"y":346},{"x":378,"y":352},{"x":378,"y":355},{"x":378,"y":358},{"x":375,"y":360},{"x":369,"y":361},{"x":363,"y":362},{"x":354,"y":378},{"x":343,"y":410},{"x":323,"y":410},{"x":331,"y":374},{"x":334,"y":354},{"x":331,"y":351}]}]},{"centers":[{"x":227,"y":424},{"x":238,"y":417},{"x":255,"y":415},{"x":269,"y":414},{"x":284,"y":412},{"x":301,"y":411},{"x":319,"y":409},{"x":335,"y":407},{"x":338,"y":407},{"x":342,"y":407},{"x":344,"y":408},{"x":347,"y":409},{"x":350,"y":413},{"x":358,"y":414}],"segments":[{"start":{"x":227,"y":424},"end":{"x":359,"y":414},"points":[{"x":249,"y":424},{"x":276,"y":423},{"x":309,"y":420},{"x":342,"y":417},{"x":358,"y":414},{"x":358,"y":410},{"x":358,"y":407},{"x":356,"y":404},{"x":351,"y":401},{"x":347,"y":399},{"x":341,"y":398},{"x":335,"y":398},{"x":328,"y":398},{"x":292,"y":402},{"x":261,"y":406},{"x":227,"y":410},{"x":227,"y":424}]}]}]}

            }
        }
    }])

});
