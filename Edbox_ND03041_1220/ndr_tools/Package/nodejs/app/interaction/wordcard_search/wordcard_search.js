function controlDom(){var foldContentDiv1="<div class='cd-folding-panel cd-folding-panel1'><div class='fold-left'><div class='fold-left-after'></div></div><div class='fold-right'><div class='fold-right-after'></div></div></div>",foldContentDiv2="<div class='cd-folding-panel cd-folding-panel2'><div class='fold-left'><div class='fold-left-after'></div></div><div class='fold-right'><div class='fold-right-after'></div></div></div>";$(".cardmain > .it_media").each(function(){$(this).after(foldContentDiv1),$(this).siblings(".cd-folding-panel1").find(".fold-left-after").append($(this).clone().addClass("fold-left-in")),$(this).siblings(".cd-folding-panel1").find(".fold-right-after").append($(this).clone().addClass("fold-right-in")),$(this).siblings(".cd-folding-panel1").append($(this))}),$(".cardmain > .it_newword").each(function(){$(this).after(foldContentDiv2),$(this).siblings(".cd-folding-panel2").find(".fold-left-after").append($(this).clone().addClass("fold-left-in")),$(this).siblings(".cd-folding-panel2").find(".fold-right-after").append($(this).clone().addClass("fold-right-in")),$(this).siblings(".cd-folding-panel2").append($(this))})}function Action(Btn,Parent,Son,ParentOther){$(Parent).show(),$(Parent).hasClass("is-open")?($(Parent).find(".fold-left").show(),$(Parent).find(".fold-right").show(),setTimeout(function(){$(Parent).removeClass("is-open")},1),$(Son).removeClass("on"),$(Parent).animate({left:"30px"}),$(Btn).closest(".wordcard").animate({width:"518px",left:"380px"},300)):$(ParentOther).hasClass("is-open")?($(ParentOther).hide().removeClass("is-open"),$(ParentOther).find(".fold-left").show(),$(ParentOther).find(".fold-right").show(),$(Parent).addClass("is-open"),$(Parent).css({left:"329px"}),$(Parent).find(".fold-left").hide(),$(Parent).find(".fold-right").hide(),$(Son).addClass("on")):($(Parent).addClass("is-open"),$(Parent).animate({left:"329px"}),$(Btn).closest(".wordcard").animate({width:"1047px",left:"100px"},400),setTimeout(function(){$(Parent).find(".fold-left").hide(),$(Parent).find(".fold-right").hide(),$(Son).addClass("on")},400))}function getChineseWordTrace(){return ChineseWord}$("body").on("click",".wordcard .menulist .item_menu",function(){$(this).index(".item_menu"),$(this).closest(".wordcard");$(this).addClass("on").siblings(".item_menu").removeClass("on")}),$("body").on("click",".media .mediatab li",function(){var index=$(this).index();$(this).closest(".cd-folding-panel").find(".media .mediastage").each(function(){$(this).find(".mediabox:eq("+index+")").addClass("on").siblings().removeClass("on")}),$(this).closest(".cd-folding-panel").find(".media .mediatab").each(function(){$(this).find("li:eq("+index+")").addClass("on").siblings().removeClass("on")})}),$("body").on("click",".media .switch .btn_switch",function(){var index=$(this).index();$(this).closest(".cd-folding-panel").find(".media .mediastage").each(function(){$(this).find(".explain_list:eq("+index+")").addClass("on").siblings().removeClass("on")}),$(this).closest(".cd-folding-panel").find(".media .footwrap").each(function(){$(this).find(".btn_switch:eq("+index+")").addClass("on").siblings().removeClass("on")})}),$("body").on("click",".pop_content a",function(){$(this).parent("li").addClass("py_selected").siblings().removeClass("py_selected")}),controlDom(),$("body").on("click",".menulist .item_media",function(){$(this).toggleClass("on").siblings(".item_menu").removeClass("on"),$(".cardmenu .item_newword").removeClass("on");var btnControl=$(this),foldingPanel=$(this).closest(".wordcard").find(".cd-folding-panel1"),thisContent=$(this).closest(".wordcard").find(".cd-folding-panel1 > .it_media"),PanelOther=$(this).closest(".wordcard").find(".cd-folding-panel2");Action(btnControl,foldingPanel,thisContent,PanelOther)}),$("body").on("click",".menulist .item_newword",function(){$(this).toggleClass("on").siblings(".item_menu").removeClass("on"),$(".cardmenu .item_media").removeClass("on");var btnControl=$(this),foldingPanel=$(this).closest(".wordcard").find(".cd-folding-panel2"),thisContent=$(this).closest(".wordcard").find(".cd-folding-panel2 > .it_newword"),PanelOther=$(this).closest(".wordcard").find(".cd-folding-panel1");Action(btnControl,foldingPanel,thisContent,PanelOther)}),define("wordcard_search/ue",function(){});var ChineseWord;!function(Common){function Line(){if(2==arguments.length){var p1=arguments[0],p2=arguments[1];this.a=p1.y-p2.y,this.b=p2.x-p1.x,this.c=p1.x*p2.y-p2.x*p1.y,this.p1=p1,this.p2=p2}else 3==arguments.length&&(this.a=arguments[0],this.b=arguments[1],this.c=arguments[2],this.p1=null,this.p2=null)}function Point(x,y){this.x="string"==typeof x?parseInt(x):x,this.y="string"==typeof y?parseInt(y):y}Line.prototype={getK:function(){return-this.a/this.b},getX:function(y){return(-this.c-this.b*y)/this.a},getY:function(x){return(-this.c-this.a*x)/this.b},getLength:function(){return this.p1.getDistance(this.p2)},getDistance:function(p){return Math.abs(this.a*p.x+this.b*p.y+this.c)/Math.sqrt(this.a*this.a+this.b*this.b)},getRectangle:function(width,distance){var startVLine=this.getVertical(this.p1),endFootPoint=this.getPoint(this.p1,this.p2,distance),endVLine=this.getVertical(endFootPoint),startPoints=startVLine.getPoints(this.p1,width/2),endPoints=endVLine.getPoints(endFootPoint,width/2);return[startPoints[0],startPoints[1],endPoints[1],endPoints[0]]},getVertical:function(p){var c=-this.b*p.x+this.a*p.y;return new Line(this.b,-this.a,c)},getPoint:function(start,director,distance){var ps=this.getPoints(start,distance),d1=director.getDistance(ps[0]),d2=director.getDistance(ps[1]);return d1<d2?ps[0]:ps[1]},getPoints:function(p,distance){if(0==Math.round(this.b))return[new Point(p.x,p.y-distance),new Point(p.x,p.y+distance)];var x=Math.sqrt(distance*distance/(1+this.getK()*this.getK()));return[new Point(p.x+x,this.getY(p.x+x)),new Point(p.x-x,this.getY(p.x-x))]}},Common.Line=Line,Point.prototype={getDistance:function(p){return Math.sqrt((this.x-p.x)*(this.x-p.x)+(this.y-p.y)*(this.y-p.y))}},Point.isSimilar=function(standardPoints,verifyPoints,errorRange){function pointCheck(first,second){return first.getDistance(second)<errorRange}function check(firstPath,secondPath){var dotCheck,fp=firstPath,flen=fp.length,sp=secondPath,slen=sp.length,flag=!0;return dotCheck=pointCheck(fp[0],sp[0]),!!(dotCheck=dotCheck&&pointCheck(fp[flen-1],sp[slen-1]))&&(loop(fp,sp),loop(sp,fp,{firstPass:{isPass:!1,point:fp[Math.ceil(flen/3)]},nextPass:{isPass:!1,point:fp[Math.ceil(flen/2)]}}),flag)}"undefined"==typeof errorRange&&(errorRange=10);var flag=!0,loop=function(formPath,toPath,passPoint){var i,j,formPoint,toPoint,ilen=formPath.length,jlen=toPath.length,shouldCheckPass=!!passPoint,mapFlag=!1;for(i=0;i<ilen;i++){if(formPoint=formPath[i],mapFlag=!1,shouldCheckPass)if(pointCheck(formPoint,passPoint.firstPass.point))passPoint.firstPass.isPass=!0;else if(pointCheck(formPoint,passPoint.nextPass.point)&&!passPoint.firstPass.isPass){flag=!1;break}for(j=0;j<jlen;j++)if(toPoint=toPath[j],pointCheck(formPoint,toPoint)){mapFlag=!0;break}if(!mapFlag){flag=!1;break}}};return check(standardPoints,verifyPoints)},Common.Point=Point}(ChineseWord||(ChineseWord={})),define("wordcard_search/directive/chineseword_trace",function(){}),define("wordcard_search/directive/preview/preview-dialog",["angularAMD","lifecycle.service"],function(angularAMD){angularAMD.directive("previewDialog",["LifecycleService","$rootScope","$stateParams","ngDialog","$filter","$q",function(LifecycleService,$rootScope,$stateParams,ngDialog,$filter,$q){return{restrict:"EA",scope:{afterClose:"&",item:"=item",grade:"=grade"},link:function(scope,element,attrs){config.editor_host;scope.model={href:["/interaction/#/wordcard_search?oper=preview_in&grade=",scope.grade,"&id=",scope.item.id,"&_lang_=",scope.item.json_url].join("")},scope.insertWord=function(item){item.isInsert=!item.isInsert},element.click(function(){var cancelClick=element.attr("cancelClick");"true"!==cancelClick&&cancelClick!==!0&&ngDialog.open({templateUrl:"interaction/wordcard_search/directive/preview/preview-dialog.html",scope:scope,className:"wp-dialog "}).closePromise.then(function(data){scope.afterClose()})})}}}])}),config.lifecycle_host="http://esp-lifecycle.web.sdp.101.com",config.ref_path="http://cs.101.com/v0.1/static",define("wordcard_search/directive/preview/preview-window",["angularAMD","wordcard_search/ue","components/site-directive/jq-media/jq.media","wordcard_search/directive/chineseword_trace","wordcard_search/directive/preview/preview-dialog"],function(angularAMD){angularAMD.directive("previewWindow",["wordService",function(wordService){return{restrict:"E",templateUrl:"interaction/wordcard_search/directive/preview/preview-window.html",scope:{content:"=content"},replace:!0,link:function($scope,element,attrs){function initMedia(){for(var media=$scope.previewItem.media,i=1,l=media.images.length;i<l;i++)$scope.opts.img_switch[i]=0}function $f(select){return angular.element(select)}function init(){$f("#my_media_video").videoplayer(),$f("#my_media_audio").audioplayer()}function coordinateTransform(originalWord,w,h){for(var originalSize=originalWord.size,scaleX=w/originalSize,scaleY=h/originalSize,i=0;i<originalWord.strokes.length;i++){for(var j=0;j<originalWord.strokes[i].centers.length;j++)originalWord.strokes[i].centers[j].x=originalWord.strokes[i].centers[j].x*scaleX,originalWord.strokes[i].centers[j].y=originalWord.strokes[i].centers[j].y*scaleY;for(var k=0;k<originalWord.strokes[i].segments.length;k++){originalWord.strokes[i].segments[k].start.x=originalWord.strokes[i].segments[k].start.x*scaleX,originalWord.strokes[i].segments[k].start.y=originalWord.strokes[i].segments[k].start.y*scaleY,originalWord.strokes[i].segments[k].end.x=originalWord.strokes[i].segments[k].end.x*scaleX,originalWord.strokes[i].segments[k].end.y=originalWord.strokes[i].segments[k].end.y*scaleY;for(var l=0;l<originalWord.strokes[i].segments[k].points.length;l++)originalWord.strokes[i].segments[k].points[l].x=originalWord.strokes[i].segments[k].points[l].x*scaleX,originalWord.strokes[i].segments[k].points[l].y=originalWord.strokes[i].segments[k].points[l].y*scaleY}}return originalWord}function init_canvas(type,withAnim){var cb=ChineseWord.context,steps=ChineseWord.word.steps,radicalInfo=ChineseWord.radicalInfo,structureInfos=ChineseWord.structureInfos;cb.restore(),cb.clearRect(0,0,cb.canvas.width,cb.canvas.height);var i,j;for(i=0;i<steps.length;i++){if(cb.fillStyle="rgb(0,0,0)",withAnim===!0&&(cb.fillStyle="rgb(136,136,136)"),type&&"radical"==type&&radicalInfo)radicalInfo.stepIndex&&radicalInfo.stepIndex.indexOf(i)>-1&&(cb.fillStyle=radicalInfo.color);else if(type&&"structure"==type&&structureInfos)for(j=0;j<structureInfos.length;j++)if(structureInfos[j].stepIndex.indexOf(i)>-1){cb.fillStyle=structureInfos[j].color;break}var points=steps[i].points;for(cb.beginPath(),j=0;j<points.length;j++){var point=points[j];cb.lineTo(point.x,point.y)}cb.closePath(),cb.fill()}ChineseWord.imageData=cb.getImageData(0,0,cb.canvas.width,cb.canvas.height)}function drawWord(wordStr,withAnim,type){ChineseWord.loop||(ChineseWord.word=convertData2(wordStr),ChineseWord.startDraw=!1,ChineseWord.word&&(ChineseWord.currentStep=0,ChineseWord.lastTime=0,"undefined"!=typeof wordStr&&init_canvas(type,withAnim),1==withAnim&&leftContextAnimate()))}function convertData2(word){var instance=ChineseWord;instance.radicalInfo={stepIndex:[],color:"rgb(136,136,136)"},instance.structureInfos=[];var i,j,k,len,m,strokes=word.strokes,strokeInfo=word.strokeInfo,strokeIndex=[],structureStrokeIndex=[];if(strokeInfo&&strokeInfo.radicalInfo&&strokeInfo.radicalInfo.strokeIndex)for(strokeIndex=strokeInfo.radicalInfo.strokeIndex.split(","),i=0;i<strokeIndex.length;i++)strokeIndex[i]=parseInt(strokeIndex[i]);if(strokeInfo&&strokeInfo.radicalInfo&&strokeInfo.radicalInfo.oriColor&&3==strokeInfo.radicalInfo.oriColor.length){var color=strokeInfo.radicalInfo.oriColor;instance.radicalInfo.color="rgb("+color[0]+","+color[1]+","+color[2]+")"}if(strokeInfo&&strokeInfo.structureInfos&&strokeInfo.structureInfos.length>0){var temp=[];for(i=0,len=strokeInfo.structureInfos.length;i<len;i++){var structureInfo=strokeInfo.structureInfos[i],info={stepIndex:[],color:"rgb(136,136,136)"},color=structureInfo.oriColor;for(info.color="rgb("+color[0]+","+color[1]+","+color[2]+")",temp=structureInfo.strokeIndex.split(","),structureStrokeIndex[i]=[],j=0;j<temp.length;j++)structureStrokeIndex[i][j]=parseInt(temp[j]);instance.structureInfos.push(info)}}for(word.steps=[],i=0;i<strokes.length;i++){var centers=strokes[i].centers,segments=strokes[i].segments;for(j=0;j<centers.length;j++)centers[j]=new ChineseWord.Point(centers[j].x,centers[j].y);for(j=0;j<segments.length;j++){segments[j].start=new ChineseWord.Point(segments[j].start.x,segments[j].start.y),segments[j].end=new ChineseWord.Point(segments[j].end.x,segments[j].end.y);var points=segments[j].points;for(k=0;k<points.length;k++)points[k]=new ChineseWord.Point(points[k].x,points[k].y);for(strokeIndex.indexOf(i)>-1&&instance.radicalInfo.stepIndex.push(word.steps.length),m=0;m<structureStrokeIndex.length;m++)if(structureStrokeIndex[m].indexOf(i)>-1){instance.structureInfos[m].stepIndex.push(word.steps.length);break}word.steps.push({line:new ChineseWord.Line(segments[j].start,segments[j].end),points:points})}}return word}function leftContextAnimate(id){var c=ChineseWord.context;c.fillStyle="rgb(201, 71, 71)",draw(id)}function draw(id){return ChineseWord.currentStep>=ChineseWord.word.steps.length?void(ChineseWord.loop=0):(ChineseWord.context.save(),setClipPath(id),void animate(id))}function animate(id){function animateInner(){return interval+=$scope.animSpeed,interval>=maxValue&&(interval=maxValue),drawAnimationFrame(interval,id),interval==maxValue?(cancelAnimationFrame(ChineseWord.loop),++ChineseWord.currentStep,ChineseWord.context.restore(),void draw(id)):void(ChineseWord.loop=requestAnimationFrame(animateInner))}var interval=0,step=ChineseWord.word.steps[ChineseWord.currentStep],maxValue=step.line.getLength();ChineseWord.loop=requestAnimationFrame(animateInner)}function stopStroke(){cancelAnimationFrame(ChineseWord.loop),ChineseWord.loop=0,drawWord(ChineseWord.wordCoordinate,!1)}function setClipPath(id){var c=ChineseWord.context,steps=ChineseWord.word.steps;c.beginPath();for(var points=steps[ChineseWord.currentStep].points,j=0;j<points.length;j++){var point=points[j];c.lineTo(point.x,point.y)}c.closePath(),c.clip()}function drawAnimationFrame(interval,id){var c=ChineseWord.context;c.beginPath();for(var rectAry=ChineseWord.word.steps[ChineseWord.currentStep].line.getRectangle(500,interval),i=0;i<rectAry.length;i++){var point=rectAry[i];c.lineTo(point.x,point.y)}c.closePath(),c.fill()}$scope.test=function(){console.log(this)};var H_SPEED=5,L_SPEED=2;$scope.LEVEL="L",$scope.content.grade&&parseInt($scope.content.grade)>=3&&($scope.LEVEL="H"),$scope.opts={prompt_cancel_flag:!1,img_switch:[1],duoyinziFlag:!1,footwrap1:!0,footwrap2:!1,footwrap3:!1,isSequencer:!1};var testWord;wordService.getWordVeiwByJson($scope.content.json_url).then(function(data){$scope.previewItem=data,initMedia(),$.ajax({url:data.strokesUrl.replace("${ref-path}",config.ref_path),dataType:"json",async:!0}).done(function(jsonResult){testWord=jsonResult,$scope.showWordCard(!1,!0)}).fail(function(e){console.log("笔顺描红返回json文件解析异常",e)})},function(data){console.log(data)}),$scope.changeImage=function(index){for(var i=0,l=$scope.opts.img_switch.length;i<l;i++)$scope.opts.img_switch[i]=0;$scope.opts.img_switch[index]=1},$scope.showFootwrap=function(index){$scope.opts.footwrap1=!1,$scope.opts.footwrap2=!1,$scope.opts.footwrap3=!1,0!==index?($scope.opts["footwrap"+index]=!0,$scope.opts.isSequencer=!1,2===index?$scope.showWordRadical():3===index&&$scope.showWordStructure()):$scope.showWordCard(!1)},$scope.pinyin_audioPlay=function(){$("#pinyin_audio")[0].play()},$scope.showPromptCancelDialog=function(){var opts=$scope.opts;$scope.opts.prompt_cancel_flag=!0,$f("#previewDialog").on("click.prompt_cancel.preview",function(e){var $target=$f(e.target);$target.closest(".prompt_cancel").length>0&&$target.hasClass("prompt_cancel_no")&&(opts.prompt_cancel_flag=!1,$f("#previewDialog").off("click.prompt_cancel.preview"),$scope.$apply())})},$scope.cancelInsertWord=function(){wordService.wordMessenger.send({oper:"batch",type:"chinese",data:[{"data-key":"1"}]})},$scope.insertWord=function(){wordService.wordMessenger.send({oper:"batch",type:"chinese",data:[{"data-key":"1","data-content":"啊","data-type":"chinese_word","data-grade":"1","sdp-package":"xxx-sdp-package.xml"}]})},$scope.closePreview=function(){var dialogClose=window.parent.document.getElementsByClassName("ngdialog-close");dialogClose.length>0&&$(dialogClose[0]).click()},init(),$scope.setAnimSpeed=function(speed){var temp=H_SPEED;"L"===speed&&(temp=L_SPEED),$scope.animSpeed=temp},$scope.animSpeed=H_SPEED,$scope.showWordCard=function(animate,isFirst){animate===!1&&isFirst!==!0&&stopStroke();var testWord1=$.extend(!0,{},testWord);ChineseWord.wordCoordinate=coordinateTransform(testWord1,289,289),ChineseWord.animSpeed=$scope.animSpeed,ChineseWord.loop=0;var $drawCanvas=$("#wordcard-canvas"),context=$drawCanvas[0].getContext("2d");$drawCanvas.attr("width",289),$drawCanvas.attr("height",289),ChineseWord.context=context,drawWord(testWord1,animate)},$scope.stopStroke=stopStroke,$scope.showWordRadical=function(){stopStroke();var testWord1=$.extend(!0,{},testWord);ChineseWord.wordCoordinate=coordinateTransform(testWord1,289,289),drawWord(testWord1,!1,"radical")},$scope.showWordStructure=function(){stopStroke();var testWord1=$.extend(!0,{},testWord);ChineseWord.wordCoordinate=coordinateTransform(testWord1,289,289),drawWord(testWord1,!1,"structure")}}}}])}),config.lifecycle_host="http://esp-lifecycle.web.sdp.101.com",config.ref_path="http://cs.101.com/v0.1/static",define("wordcard_search/directive/wordcard_search.directive",["angularAMD","lifecycle.service"],function(angularAMD){var wordMessenger=new Messenger("china_words_card","words_card");wordMessenger.addTarget(window.parent,"parent"),angularAMD.service("wordService",["$q","LifecycleService",function($q,LifecycleService){return{getWordsFromLC:function(options){var deferred=$q.defer(),randomStart=parseInt(1e3*Math.random());return 1===options.search_word.length&&(randomStart=0),LifecycleService.getChineseVocabularyCards(options.chapter_id,options.search_word,randomStart,8).then(function(result){var arr=[];if(0===result.total);else{if(void 0===result.total){result.items=[];var i=0,start=parseInt(10*Math.random()+1);for(var temp in result)start<i&&i<start+9&&result[temp]&&result.items.push(result[temp]),i++}for(var i=0,l=result.items.length;i<l;i++){var item=result.items[i],opts={id:item.identifier,json_url:item.tech_info.href.location,image_url:"",title:item.title,pinyin:""},index=opts.json_url.indexOf(".pkg/main.xml");if(opts.json_url&&index>-1){var url=opts.json_url.substr(0,index).replace("${ref-path}",config.ref_path)+".pkg/resources/relations.json";$.ajax({url:url,dataType:"json",async:!1}).done(function(data){var tempUrl="",tempPinyin="";data.spellAssets&&data.spellAssets.length>0&&(data.spellAssets[0].spellImgAssets&&data.spellAssets[0].spellImgAssets.length>0&&data.spellAssets[0].spellImgAssets[0].target&&data.spellAssets[0].spellImgAssets[0].target.location&&(tempUrl=data.spellAssets[0].spellImgAssets[0].target.location),data.spellAssets[0].target&&data.spellAssets[0].target.title&&(tempPinyin=data.spellAssets[0].target.title)),arr.push({id:opts.id,key:opts.id,image_url:tempUrl,json_url:opts.json_url,pinyin:tempPinyin,sound:"",strokes:"",radical:"",structure:"",sequencer:"",media:{},title:opts.title})}).fail(function(){console.log("请求生字'"+opts.title+"'json文件失败！")})}else console.log("error","词卡"+item.identifier+"资源获取的json文件路径格式不正确")}}arr.total=result.total,deferred.resolve(arr)},function(error){deferred.reject(error)}),deferred.promise},getWordVeiwByJson:function(json_url){var strokesUrl,result="",deferred=$q.defer(),index=json_url.indexOf(".pkg/main.xml"),url="";if(json_url&&index>-1)var url=json_url.substr(0,index).replace("${ref-path}",config.ref_path)+".pkg/resources/relations.json";return $.ajax({url:url,dataType:"json",async:!0}).done(function(data){console.log(data),strokesUrl=data.wordStrokeAsset.target.location;var tempImage="",tempSound="";try{tempImage=data.spellAssets[0].spellImgAssets[0].target.location+"?size=240"}catch(e){console.log("获取多音字图片资源失败",e)}try{tempSound=data.spellAssets[0].dubbingAsset.target.location}catch(e){console.log("获取发音资源失败",e)}result={word:data.word,strokeNum:data.strokeNum,radical:data.radical,structure:data.wordStructure,pinyin:data.spellAssets[0].target.title,sound:tempSound,image:tempImage,sequencer:{spellSeq:data.spellAssets[0].spellSeq,spellSyl:data.spellAssets[0].spellSyl,spellSzl:data.spellAssets[0].spellSzl},media:{images:[],audio:[],video:[]},strokesUrl:strokesUrl};try{for(var spellEntrywordAssets=data.spellAssets[0].spellEntrywordAssets,i=0,l=spellEntrywordAssets.length;i<l;i++);for(var spellMultimediaPictureAssets=data.spellAssets[0].spellMultimediaPictureAssets,j=0;j<spellMultimediaPictureAssets.length;j++){var obj=spellMultimediaPictureAssets[j],tempImg={title:obj.title,url:obj.target.location+"?size=240"};result.media.images.push(tempImg)}for(var spellMultimediaAudioAssets=data.spellAssets[0].spellMultimediaAudioAssets,k=0;k<spellMultimediaAudioAssets.length;k++){var obj=spellMultimediaAudioAssets[k],tempAudio={title:obj.title,url:obj.target.location};result.media.audio.push(tempAudio)}for(var spellMultimediaVideoAssets=data.spellAssets[0].spellMultimediaVideoAssets,j=0;j<spellMultimediaVideoAssets.length;j++){var obj=spellMultimediaVideoAssets[j],tempVedio={title:obj.title,url:obj.target.location};result.media.video.push(tempVedio)}}catch(err){console.log("获取多媒体资源解析异常",err)}deferred.resolve(result)}).fail(function(error){deferred.reject(error),console.log("请求生字json文件失败！")}),deferred.promise},createWord:function(opts){return{id:opts.id,key:opts.id,image:opts.image_url||"wordcard_search/assets/images/word_wa.png",json_url:opts.json_url,pinyin:"",sound:"",strokes:"",radical:"",structure:"",media:{}}},wordMessenger:wordMessenger}}])}),define("wordcard_search/utils",[],function(){return String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),{removeItemByValue:function(arr,value){if(arr.length>0){var tempIndex=arr.indexOf(value);tempIndex>-1&&arr.splice(tempIndex,1)}}}}),define("wordcard_search/directive/page/page",["angularAMD"],function(angularAMD){angularAMD.directive("page",[function(){return{restrict:"E",templateUrl:"wordcard_search/directive/page/page.html",scope:{opts:"=opts"},replace:!0,link:function(scope,element,attrs){scope.numArr=[];for(var l=10<scope.opts.pageCount?10:scope.opts.pageCount,i=0;i<l;i++)scope.numArr.push(i+1)}}}])}),config.lifecycle_host="http://esp-lifecycle.web.sdp.101.com",config.ref_path="http://cs.101.com/v0.1/static",define("wordcard_search/directive/search/search-window",["angularAMD","wordcard_search/directive/wordcard_search.directive","wordcard_search/utils","wordcard_search/directive/page/page"],function(angularAMD,myService,utils){angularAMD.directive("searchWindow",["wordService",function(wordService){return{restrict:"E",templateUrl:"interaction/wordcard_search/directive/search/search-window.html",scope:{content:"=content"},replace:!0,link:function($scope,element,attrs){function bindEvent(){}function init(){function resizeBallback(){var tempWid=$("#search_dialog").width();$scope.search_dialog_wid=tempWid,tempWid<1180?$("#search_dialog .word_hz_img p").css({"font-size":"160px",top:"-40px"}):$("#search_dialog .word_hz_img p").css({"font-size":"180px",top:"-30px"})}resizeBallback(),$(window).resize(resizeBallback),$scope.load=function(){resizeBallback()}}function $f(select){return angular.element(select)}function getWordsByPromise(){var promise=wordService.getWordsFromLC({chapter_id:$scope.content.chapter_id,search_word:$scope.content.search_word});promise.then(function(data){$scope.opts.show_content=!0,$scope.content.words=data},function(data){$scope.opts.show_content=!0,console.log(data)})}$scope.opts={prompt_flag:!1,prompt_cancel_flag:!1,select_all_flag:!1,search_word_flag:!1,preview_flag:!1,preview_item:!1,show_content:!1},$scope.insertWord=function(item){wordService.wordMessenger.send({oper:"batch",type:"chinese",data:[{"data-key":"1","data-content":"啊","data-type":"chinese_word","data-grade":"1","sdp-package":"xxx-sdp-package.xml"}]}),item.isShowPrompt=!1,item.isInsert=!item.isInsert},$scope.showPromptWindow=function(item){item.isInsert?(item.isInsert=!1,wordService.wordMessenger.send({oper:"delete",data:{"data-key":"1"}})):$scope.insertWord(item)},$scope.btnbarMoveleave=function(item){item.isShowPrompt===!0&&(item.isShowPrompt=!1)},$scope.insertSelects=function(){wordService.wordMessenger.send({oper:"batch",type:"chinese",data:[{"data-key":"1","data-content":"啊","data-type":"chinese_word","data-grade":"1","sdp-package":"xxx-sdp-package.xml"},{"data-key":"2","data-content":"哦","data-type":"chinese_word","data-grade":"1","sdp-package":"xxx-sdp-package.xml"}]})},$scope.preview=function(item){},$scope.selectItem=function(item){item.isSelect=!item.isSelect,item.isSelect?$scope.content.select_words.push(item):utils.removeItemByValue($scope.content.select_words,item)},$scope.selectAll=function(){if($scope.opts.select_all_flag===!1)for(var words=$scope.content.words,i=0,l=words.length;i<l;i++)words[i].isSelect||(words[i].isSelect=!0,$scope.content.select_words.push(words[i]));else{for(var words=$scope.content.words,i=0,l=words.length;i<l;i++)words[i].isSelect&&(words[i].isSelect=!1);$scope.content.select_words=[]}$scope.opts.select_all_flag=!$scope.opts.select_all_flag},$scope.searchWord=function(){return $scope.opts.search_word_flag=!0,$scope.content.search_word=$f("#wordcard_search_word").val()||$scope.content.search_word,$scope.content.search_word.trim().length>1?void alert("请输入单个中文文字"):void(1===$scope.content.search_word.trim().length&&getWordsByPromise())},$scope.goBack=function(){$scope.opts.search_word_flag=!1,$scope.content.search_word="",getWordsByPromise()},$scope.colseWindow=function(){},$scope.showPreviewWindow=function(item){$scope.opts.preview_item=item,$scope.opts.preview_flag=!0},$scope.content.search_word?$scope.searchWord():getWordsByPromise(),bindEvent(),$scope.search_dialog_wid=1200,init()}}}])}),define(["app","wordcard_search/directive/preview/preview-window","wordcard_search/directive/search/search-window","css!wordcard_search/assets/css/wood.css"],function(app){"use strict";app.controller("wordcard_search_ctrl",["$scope","$stateParams","$rootScope","$filter",function($scope,$stateParams,$rootScope,$filter){function initSearch(){$stateParams.chapter_id&&($scope.content.chapter_id=$stateParams.chapter_id),$stateParams.grade&&($scope.content.grade=$stateParams.grade),$stateParams.search_word&&($scope.content.search_word=$stateParams.search_word)}function initPreview(){$stateParams.id&&($scope.content.id=$stateParams.id),$stateParams.grade&&($scope.content.grade=$stateParams.grade),$stateParams._lang_&&($scope.content.json_url=$stateParams._lang_)}$scope.content={chapter_id:"",search_word:"",grade:"",words:[],select_words:[],oper:$stateParams.oper},$stateParams.oper&&($scope.oper=$stateParams.oper),"search"==$scope.oper?initSearch():$scope.oper.indexOf("preview")>-1&&initPreview()}])});