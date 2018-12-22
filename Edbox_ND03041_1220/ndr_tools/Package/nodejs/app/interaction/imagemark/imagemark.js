define("imagemark/directive/mark-type-guide/mark-type-guide",["angularAMD"],function(angularAMD){angularAMD.directive("markTypeGuide",[function(){return{restrict:"E",templateUrl:"interaction/imagemark/directive/mark-type-guide/mark-type-guide.html",scope:!1,controller:["$scope",function($scope){}]}}])}),define("imagemark/directive/imageitem/imageitem",["angularAMD","components/site-directive/event-load/event-load"],function(angularAMD){angularAMD.directive("imageitem",["$stateParams","ngDialog",function($stateParams,ngDialog){return{restrict:"EA",templateUrl:"interaction/imagemark/directive/imageitem/imageitem.html",scope:{tags:"=tags",tagIndex:"@tagIndex",imageItem:"=imageItem",markType:"=markType",validMarkHandler:"=validMarkHandler"},controller:["$scope","$filter","$timeout","UtilsService",function($scope,$filter,$timeout,UtilsService){function getScalePercent(){return UtilsService.getScalePercent(angular.element(".scalable_layout"))}function calcPosition(tag,quadrantIndex){var rec_x,rec_y;switch(quadrantIndex){case 1:if(rec_x=Math.max(0,tag.x-DEF_GAP-RANGE_WIDTH),rec_y=Math.max(0,tag.y-DEF_GAP-RANGE_HEIGHT),rec_x+RANGE_WIDTH>=tag.x||rec_y+RANGE_HEIGHT>=tag.y)return void calcPosition(tag,4);break;case 2:if(rec_x=Math.min(CONTAINER_WIDTH-RANGE_WIDTH,tag.x+DEF_GAP+CIRCLE_WIDTH),rec_y=Math.max(0,tag.y-DEF_GAP-RANGE_HEIGHT),rec_x<=tag.x||rec_y+RANGE_HEIGHT>=tag.y)return void calcPosition(tag,3);break;case 3:if(rec_x=Math.max(0,tag.x-DEF_GAP-RANGE_WIDTH),rec_y=Math.min(CONTAINER_HEIGHT-RANGE_HEIGHT,tag.y+DEF_GAP+CIRCLE_HEIGHT),rec_x+RANGE_WIDTH>=tag.x||rec_y<=tag.y)return void calcPosition(tag,2);break;default:if(rec_x=Math.min(CONTAINER_WIDTH-RANGE_WIDTH,tag.x+DEF_GAP+CIRCLE_WIDTH),rec_y=Math.min(CONTAINER_HEIGHT-RANGE_HEIGHT,tag.y+DEF_GAP+CIRCLE_HEIGHT),rec_x<=tag.x||rec_y<=tag.y+CIRCLE_HEIGHT)return void calcPosition(tag,1)}tag.rec_x=rec_x,tag.rec_y=rec_y,calcLinkLine(tag)}function confirmChangeTagMode(){$scope.tags=[],$scope.markType===$scope.MARK_TYPE.LINE?$scope.markType=$scope.MARK_TYPE.AREA:$scope.markType=$scope.MARK_TYPE.LINE}function blurAllTags(){angular.forEach($scope.tags,function(tag){tag.isFocus=!1})}function calcLinkLine(tag){var rangeWidth=RANGE_WIDTH,rangeHeight=RANGE_HEIGHT;if(tag.x>tag.rec_x)if(tag.y>tag.rec_y){tag.line_x=tag.x+CIRCLE_RADIUS_GAP,tag.line_y=tag.y+CIRCLE_RADIUS_GAP;var stopPoint={x:tag.rec_x+rangeWidth-RECT_RADIUS_GAP,y:tag.rec_y+rangeHeight-RECT_RADIUS_GAP};tag.line_width=Math.sqrt(Math.pow(tag.line_x-stopPoint.x,2)+Math.pow(tag.line_y-stopPoint.y,2)),tag.line_rorate=UtilsService.getAngle(tag.line_x,tag.line_y,stopPoint.x,stopPoint.y)}else{tag.line_x=tag.x+CIRCLE_RADIUS_GAP,tag.line_y=tag.y+CIRCLE_HEIGHT-CIRCLE_RADIUS_GAP;var stopPoint={x:tag.rec_x+rangeWidth-RECT_RADIUS_GAP,y:tag.rec_y+RECT_RADIUS_GAP};tag.line_width=Math.sqrt(Math.pow(tag.line_x-stopPoint.x,2)+Math.pow(tag.line_y-stopPoint.y,2)),tag.line_rorate=UtilsService.getAngle(tag.line_x,tag.line_y,stopPoint.x,stopPoint.y)}else if(tag.y>tag.rec_y){tag.line_x=tag.x+CIRCLE_WIDTH-CIRCLE_RADIUS_GAP,tag.line_y=tag.y+CIRCLE_RADIUS_GAP;var stopPoint={x:tag.rec_x+RECT_RADIUS_GAP,y:tag.rec_y+rangeHeight-RECT_RADIUS_GAP};tag.line_width=Math.sqrt(Math.pow(tag.line_x-stopPoint.x,2)+Math.pow(tag.line_y-stopPoint.y,2)),tag.line_rorate=UtilsService.getAngle(tag.line_x,tag.line_y,stopPoint.x,stopPoint.y)}else{tag.line_x=tag.x+CIRCLE_WIDTH-CIRCLE_RADIUS_GAP,tag.line_y=tag.y+CIRCLE_HEIGHT-CIRCLE_RADIUS_GAP;var stopPoint={x:tag.rec_x+RECT_RADIUS_GAP,y:tag.rec_y+RECT_RADIUS_GAP};tag.line_width=Math.sqrt(Math.pow(tag.line_x-stopPoint.x,2)+Math.pow(tag.line_y-stopPoint.y,2)),tag.line_rorate=UtilsService.getAngle(tag.line_x,tag.line_y,stopPoint.x,stopPoint.y)}}function execCalcBoxRect(){var img=insertImgDiv.find("img"),width=img.width(),height=img.height();originBoxRect={left:(CONTAINER_WIDTH-width)/2,top:(CONTAINER_HEIGHT-height)/2,width:width,height:height},originBoxRect.right=originBoxRect.left+width,originBoxRect.bottom=originBoxRect.top+height,originBoxRect.origin={x:originBoxRect.left+width/2,y:originBoxRect.top+height/2}}function checkBoxRect(){var width=insertImgDiv.width(),height=insertImgDiv.height();if(width!=originBoxRect.width){var diff=(width-originBoxRect.width)/2;originBoxRect.left-=diff,originBoxRect.right+=diff,originBoxRect.width=width}if(height!=originBoxRect.height){var diff=(height-originBoxRect.height)/2;originBoxRect.top-=diff,originBoxRect.bottom+=diff,originBoxRect.height=height}}function checkTagCircleCross(point,tag){if($scope.tags.length>0)for(var tagCircleRect={left:point.x,right:point.x+CIRCLE_WIDTH,top:point.y,bottom:point.y+CIRCLE_HEIGHT},i=0;i<$scope.tags.length;i++){var indexTag=$scope.tags[i];if(!tag||tag!=indexTag){var isCross=UtilsService.checkRectsCross(tagCircleRect,{left:indexTag.x,right:indexTag.x+CIRCLE_WIDTH,top:indexTag.y,bottom:indexTag.y+CIRCLE_HEIGHT});if(isCross)return!0}}return!1}function getPointsByMatrix(){checkBoxRect();var matrix=UtilsService.getElementMatrix(insertImgDiv),boxLTP=UtilsService.translateMatrixPoint(matrix,{x:originBoxRect.left-originBoxRect.origin.x,y:originBoxRect.top-originBoxRect.origin.y});boxLTP.x+=originBoxRect.origin.x,boxLTP.y+=originBoxRect.origin.y;var boxRTP=UtilsService.translateMatrixPoint(matrix,{x:originBoxRect.right-originBoxRect.origin.x,y:originBoxRect.top-originBoxRect.origin.y});boxRTP.x+=originBoxRect.origin.x,boxRTP.y+=originBoxRect.origin.y;var boxRBP=UtilsService.translateMatrixPoint(matrix,{x:originBoxRect.right-originBoxRect.origin.x,y:originBoxRect.bottom-originBoxRect.origin.y});boxRBP.x+=originBoxRect.origin.x,boxRBP.y+=originBoxRect.origin.y;var boxLBP=UtilsService.translateMatrixPoint(matrix,{x:originBoxRect.left-originBoxRect.origin.x,y:originBoxRect.bottom-originBoxRect.origin.y});return boxLBP.x+=originBoxRect.origin.x,boxLBP.y+=originBoxRect.origin.y,{leftTop:boxLTP,rightTop:boxRTP,rightBottom:boxRBP,leftBottom:boxLBP}}$scope.resourceValidParam={imageType:["image/jpg","image/jpeg","image/webp","image/gif","image/png","image/bmp"],imageSize:1048576},$scope.MARK_TYPE=$scope.$parent.MARK_TYPE,$scope.TAG_MAX_SIZE=15,$scope.AREA_RADIUS=87.5,$scope.virtualTag={},$scope.isImageLoading=!0;var insertImgDiv,imgmarkCtrl,unLoadedImage=!0,CONTAINER_WIDTH=1131,CONTAINER_HEIGHT=416,CIRCLE_WIDTH=17,CIRCLE_HEIGHT=17,RANGE_WIDTH=133.76835,RANGE_HEIGHT=107.66721,CIRCLE_RADIUS_GAP=8,RECT_RADIUS_GAP=3,DEF_GAP=20;$scope.validMarkHandler.run=function(){if($scope.markType===$scope.MARK_TYPE.LINE){for(var size=$scope.tags.length,i=0;i<size;i++)if(!$scope.isPointOnImage($scope.tags[i]))return!1}else if($scope.markType===$scope.MARK_TYPE.AREA)for(var size=$scope.tags.length,i=0;i<size;i++)if(!$scope.isCircleOnImage($scope.tags[i]))return!1;return!0},$scope.addAssets=function(asset_type){$scope.imageItem.asset_type=asset_type,$scope.isImageLoading=!0},$scope.imageLoad=function(){insertImgDiv=angular.element("#insertImgDiv"),unLoadedImage&&(unLoadedImage=!1,$scope.imageItem.other&&$scope.imageItem.other.style&&"auto"!=insertImgDiv[0].style.width&&"auto"!=insertImgDiv[0].style.height&&insertImgDiv.find("img").attr({width:insertImgDiv.width(),height:insertImgDiv.height()}),UtilsService.safeApply($scope,function(){$scope.markType===$scope.MARK_TYPE.AREA?angular.forEach($scope.tags,function(tag){tag.isEditor=!0}):angular.forEach($scope.tags,function(tag){tag.isEditor=!0,calcLinkLine(tag)})})),$scope.isImageLoading&&($scope.isImageLoading=!1,imgmarkCtrl=angular.element(".imgmark .imgbig"),execCalcBoxRect())},$scope.confirmPopupMessage="";var confirmPopupType,tagIndex;$scope.changeTagMode=function(){$scope.tags&&$scope.tags.length>0?(confirmPopupType=1,$scope.markType===$scope.MARK_TYPE.LINE?$scope.confirmPopupMessage=$filter("translate")("imagemark.marktype_line_tip"):$scope.confirmPopupMessage=$filter("translate")("imagemark.marktype_area_tip"),$scope.showConfirmPopup=!0):confirmChangeTagMode()},$scope.removeBackground=function(){confirmPopupType=2,$scope.confirmPopupMessage=$filter("translate")("imagemark.remove_background_confirm"),$scope.showConfirmPopup=!0},$scope.removeTag=function($index){confirmPopupType=3,tagIndex=$index,$scope.confirmPopupMessage=$filter("translate")("imagemark.remove_tag_confirm"),$scope.showConfirmPopup=!0},$scope.confirmPopup=function(){switch(confirmPopupType){case 1:confirmChangeTagMode();break;case 2:$scope.imageItem.asset_type="",$scope.imageItem.asset="",$scope.imageItem.other={},$scope.tags=[],$scope.showEdit=!1,$scope.showConfirmRemoveBg=!1;break;case 3:$scope.tags.splice(tagIndex,1)}$scope.showConfirmPopup=!1};var timer=null;$scope.ondblClick=function(){timer&&$timeout.cancel(timer),$scope.showEdit=!$scope.showEdit},$scope.addAreaTag=function(event){$scope.showEdit||(timer&&$timeout.cancel(timer),timer=$timeout(function(){if($scope.tags.length<$scope.TAG_MAX_SIZE){var scalePercent=getScalePercent(),containerOffset=imgmarkCtrl.offset(),tag={serial_num:"",value:"",x:(event.clientX-containerOffset.left-$scope.AREA_RADIUS)/scalePercent,y:(event.clientY-containerOffset.top-$scope.AREA_RADIUS)/scalePercent,area_circle_x:event.offsetX+insertImgDiv[0].offsetLeft,area_circle_y:event.offsetY+insertImgDiv[0].offsetTop,radius:$scope.AREA_RADIUS,image_src:""};$scope.tags.push(tag)}},300))},$scope.addTag=function(event){$scope.markType!==$scope.MARK_TYPE.AREA&&(timer&&$timeout.cancel(timer),timer=$timeout(function(){if($scope.tags.length<$scope.TAG_MAX_SIZE){var scalePercent=getScalePercent(),containerOffset=imgmarkCtrl.offset(),tag={serial_num:"",value:"",x:(event.clientX-containerOffset.left-CIRCLE_WIDTH/2)/scalePercent,y:(event.clientY-containerOffset.top-CIRCLE_HEIGHT/2)/scalePercent,isFocus:!0};if(!checkTagCircleCross(tag)){var quadrantIndex=UtilsService.getQuadrantIndex(tag,CONTAINER_WIDTH,CONTAINER_HEIGHT);calcPosition(tag,quadrantIndex),blurAllTags(),$scope.tags.push(tag)}}},300))};var startPoint,endPoint;$scope.mousedown=function(e){if($scope.markType!==$scope.MARK_TYPE.LINE){e.preventDefault(),e.stopPropagation();var scalePercent=getScalePercent(),containerOffset=imgmarkCtrl.offset();startPoint={x:(e.clientX-containerOffset.left)/scalePercent,y:(e.clientY-containerOffset.top)/scalePercent}}},$scope.mouseup=function(e){if($scope.markType!==$scope.MARK_TYPE.LINE){var scalePercent=getScalePercent(),containerOffset=imgmarkCtrl.offset();endPoint={x:(e.clientX-containerOffset.left)/scalePercent,y:(e.clientY-containerOffset.top)/scalePercent};var circlePoint={x:(startPoint.x+endPoint.x)/2,y:(startPoint.y+endPoint.y)/2,radius:UtilsService.calTwoPointDistance(startPoint,endPoint)/2};if(circlePoint.radius<$scope.AREA_RADIUS&&Math.abs(circlePoint.radius)>20&&(circlePoint.radius=$scope.AREA_RADIUS),circlePoint.radius>=$scope.AREA_RADIUS&&$scope.tags.length<$scope.TAG_MAX_SIZE){var tag={serial_num:"",value:"",x:circlePoint.x-circlePoint.radius,y:circlePoint.y-circlePoint.radius,area_circle_x:circlePoint.x,area_circle_y:circlePoint.y,radius:circlePoint.radius,image_src:"",isFocus:!0};blurAllTags(),$scope.tags.push(tag)}startPoint={},endPoint={}}},$scope.redrawLine=function(tag,scope){UtilsService.safeApply(scope,function(){calcLinkLine(tag)})},$scope.isPointOnImage=function(point,tag){if(point.x<0||point.x>CONTAINER_WIDTH-CIRCLE_WIDTH||point.y<0||point.y>CONTAINER_HEIGHT-CIRCLE_HEIGHT)return!1;var points=getPointsByMatrix(),isPointInsidePoly=UtilsService.isPointInsidePoly({x:point.x+CIRCLE_WIDTH/2,y:point.y+CIRCLE_HEIGHT/2},[points.leftTop,points.rightTop,points.rightBottom,points.leftBottom,points.leftTop]);return isPointInsidePoly&&tag?!checkTagCircleCross(point,tag):isPointInsidePoly},$scope.isCircleOnImage=function(circle){var points=getPointsByMatrix(),radius=circle.radius||circle.target.width()/2;if(!UtilsService.isPointInsidePoly({x:circle.x+radius,y:circle.y+radius},[points.leftTop,points.rightTop,points.rightBottom,points.leftBottom,points.leftTop]))return!1;for(var arr=[points.leftTop,points.rightTop,points.rightBottom,points.leftBottom],i=0,l=arr.length;i<l;i++)arr[i].y=-arr[i].y;for(var i=-1,l=arr.length,j=l-1;++i<l;j=i){var p={x:circle.x+radius,y:circle.y+radius},distance=UtilsService.calPointToLineDistance(p,UtilsService.getEquation(arr[i],arr[j]));if(radius>=distance)return!1}return!0};var originBoxRect}]}}])}),define("imagemark/directive/tag/tag",["angularAMD"],function(angularAMD){angularAMD.directive("tag",[function(){return{restrict:"E",templateUrl:"interaction/imagemark/directive/tag/tag.html",replace:!0,scope:{tagsData:"=tagsData",tagData:"=tagData",imageItem:"=imageItem",tagIndex:"@tagIndex",onRemoveTag:"&onRemoveTag",redrawLine:"=redrawLine",isPointOnImage:"="},controller:["$scope","$timeout","$element",function($scope,$timeout,$element){function blurAllTags(){angular.forEach($scope.tagsData,function(tag){tag.isFocus=!1})}function focusCurrentTag(blurOtherTag){blurOtherTag&&blurAllTags(),$scope.tagData.isFocus=!0}$scope.resourceValidParam={imageType:["image/jpg","image/jpeg","image/webp","image/gif","image/png","image/bmp"],imageSize:1048576},$scope.removeTag=function(){$scope.onRemoveTag()},$scope.addTagAssets=function(asset_type){blurAllTags(),$scope.tagData.isFocus=!0,$scope.tagData.isEditing=!0,$scope.tagData.type=asset_type},$scope.clickText=function(event){blurAllTags(),$scope.tagData.isFocus=!0,$scope.tagData.isEditing=!0,$scope.tagData.type="text",$timeout(function(){$("#tag"+$scope.tagIndex).focus()},100)},$scope.onInputFocus=function(){blurAllTags(),$scope.tagData.isFocus=!0,$scope.tagData.isEditing=!0},$scope.onInputBlur=function(event){$scope.tagData.isFocus=!1,$scope.tagData.isEditing=!1,$scope.tagData.value||(event.target.innerHTML?$scope.tagData.value=event.target.innerHTML:$scope.tagData.type="")};var TAG_WIDTH=133.76835,TAG_HEIGHT=107.66721,STAGE_CTRL=angular.element(".imgmark");$scope.inputOptions={began:function(){blurAllTags(),$range=angular.element("#imgboxContral"+$scope.tagIndex),this.range={originX:$range[0].offsetLeft,originY:$range[0].offsetTop},this.moveRange={x:{min:0,max:STAGE_CTRL.width()-TAG_WIDTH},y:{min:0,max:STAGE_CTRL.height()-TAG_HEIGHT}}},moved:function(e,curPostion){$scope.$apply(function(){$scope.inputOptions.isMoving=!0}),$scope.tagData.rec_x=curPostion.x,$scope.tagData.rec_y=curPostion.y,$scope.redrawLine($scope.tagData,$scope)},ended:function(){$scope.$apply(function(){$scope.inputOptions.isMoving=!1,focusCurrentTag()})},isMoving:!1,isMoveCircle:!1,moveRange:{x:{min:0,max:STAGE_CTRL.width()-TAG_WIDTH},y:{min:0,max:STAGE_CTRL.height()-TAG_HEIGHT}}},$scope.circleOptions={began:function(){blurAllTags(),$range=angular.element("#imgboxContral"+$scope.tagIndex),this.range={originX:$range[0].offsetLeft,originY:$range[0].offsetTop}},canMove:function(position){return!$scope.isPointOnImage||$scope.isPointOnImage(position,$scope.tagData)},moved:function(e,curPostion){var p={x:this.range.originX+curPostion.addX,y:this.range.originY+curPostion.addY};if($scope.tagData.x=curPostion.x,$scope.tagData.y=curPostion.y,$range=angular.element("#imgboxContral"+$scope.tagIndex),this.rectangleMoveRange){var xMax=this.rectangleMoveRange.x.max-$range.width(),yMax=this.rectangleMoveRange.y.max-$range.height();if(p.x<this.rectangleMoveRange.x.min||p.x>xMax||p.y<this.rectangleMoveRange.y.min||p.y>yMax)return void $scope.redrawLine($scope.tagData,$scope)}$scope.tagData.rec_x=p.x,$scope.tagData.rec_y=p.y,$range.css({left:$scope.tagData.rec_x,top:$scope.tagData.rec_y}),$scope.redrawLine($scope.tagData,$scope),focusCurrentTag()},tag:$scope.tagData,isMoveCircle:!0,range:{originX:$scope.tagData.rec_x,originY:$scope.tagData.rec_y},circle:{originX:$scope.tagData.x,originY:$scope.tagData.y},moveRange:{x:{min:0},y:{min:0}},rectangleMoveRange:$scope.inputOptions.moveRange}}]}}])}),define("imagemark/directive/tag/areaTag",["angularAMD"],function(angularAMD){angularAMD.directive("areatag",[function(){return{restrict:"E",templateUrl:"interaction/imagemark/directive/tag/areaTag.html",replace:!0,scope:{tagsData:"=tagsData",tagData:"=tagData",tagIndex:"@tagIndex",onRemoveTag:"&onRemoveTag",isCircleOnImage:"="},controller:["$scope","$timeout","$element","UtilsService",function($scope,$timeout,$element,UtilsService){function blurAllTags(){angular.forEach($scope.tagsData,function(tag){tag.isFocus=!1})}function focusCurrentTag(blurOtherTag){blurOtherTag&&blurAllTags(),$scope.tagData.isFocus=!0}function isCanMoveEnd(p,cTag,tagArr){var width=STAGE_CTRL.width(),height=STAGE_CTRL.height();if(p.x<0||p.x>width-2*p.radius)return!1;if(p.y<0||p.y>height-2*p.radius)return!1;if($scope.isCircleOnImage(p)===!1)return!1;for(var i=0,l=tagArr.length;i<l;i++)if(cTag!==tagArr[i]){var pa={x:p.x+p.radius,y:p.y+p.radius},pb={x:tagArr[i].x+tagArr[i].radius,y:tagArr[i].y+tagArr[i].radius};if(UtilsService.calTwoPointDistance(pa,pb)<p.radius+tagArr[i].radius)return!1}return!0}$scope.resourceValidParam={imageType:["image/jpg","image/jpeg","image/webp","image/gif","image/png","image/bmp"],imageSize:1048576},$scope.removeTag=function(itemOld,index,objX,objY){$scope.onRemoveTag()},$scope.addTagAssets=function(asset_type){blurAllTags(),$scope.tagData.isFocus=!0,$scope.tagData.isEditing=!0,$scope.tagData.type=asset_type},$scope.clickText=function(event){blurAllTags(),$scope.tagData.isFocus=!0,$scope.tagData.isEditing=!0,$scope.tagData.type="text",$timeout(function(){$("#tag"+$scope.tagIndex).focus()},100)},$scope.onInputFocus=function(){blurAllTags(),$scope.tagData.isFocus=!0,$scope.tagData.isEditing=!0},$scope.onInputBlur=function(event){$scope.tagData.isFocus=!1,$scope.tagData.isEditing=!1,$scope.tagData.value||(event.target.innerHTML?$scope.tagData.value=event.target.innerHTML:$scope.tagData.type="")};var MIN_RADIUS=87.5;$scope.squareOptions={began:function(e,startPosition){blurAllTags();var $circle=angular.element("#circle"+$scope.tagIndex);this.circle={originX:$circle[0].offsetLeft,originY:$circle[0].offsetTop,input:{originW:$scope.tagData.width,originH:$scope.tagData.height},originRadius:$scope.tagData.radius},this.$circle=$circle,this.square={originP:startPosition}},canMove:function(curPostion){var distance="x"===this.onlymove?curPostion.addX:curPostion.addY,originXOrY="x"===this.onlymove?this.square.originP.x:this.square.originP.y,curXOrY="x"===this.onlymove?curPostion.x:curPostion.y;if((originXOrY-this.circle.originRadius)*(curXOrY-this.circle.originRadius)<0)return!1;("x"===this.onlymove&&this.circle.originRadius>curPostion.x||"y"===this.onlymove&&this.circle.originRadius>curPostion.y)&&(distance=-distance);var circle=this.circle,radius=circle.originRadius+distance;return!(radius<MIN_RADIUS)&&void 0},moved:function(e,curPostion){var distance="x"===this.onlymove?curPostion.addX:curPostion.addY;("x"===this.onlymove&&this.circle.originRadius>curPostion.x||"y"===this.onlymove&&this.circle.originRadius>curPostion.y)&&(distance=-distance);var circle=this.circle;$scope.$apply(function(){$scope.tagData.isAreaChanging=!0,$scope.tagData.x=distance>0?circle.originX-distance:circle.originX-distance,$scope.tagData.y=distance>0?circle.originY-distance:circle.originY-distance,$scope.tagData.radius=circle.originRadius+distance})},ended:function(e,curPosition){$scope.$apply(function(){$scope.tagData.isAreaChanging=!1,focusCurrentTag()});var p={x:this.$circle[0].offsetLeft,y:this.$circle[0].offsetTop,target:this.$circle,radius:this.$circle.width()/2};if(isCanMoveEnd(p,$scope.tagData,$scope.tagsData)===!1){this.$circle.css({left:this.circle.originX,top:this.circle.originY});var circle=this.circle;$scope.$apply(function(){$scope.tagData.x=circle.originX,$scope.tagData.y=circle.originY,$scope.tagData.radius=circle.originRadius,$scope.tagData.width=circle.input.originW,$scope.tagData.height=circle.input.originH})}delete this.$circle},isMoveCircle:!0,positionByExternal:!0},$scope.circleOptions={beganStart:function(e){blurAllTags();var $circle=angular.element("#circle"+$scope.tagIndex);this.$circle=$circle},began:function(e,startPosition){this.startPosition=startPosition},moved:function(e,curPostion){$scope.$apply(function(){$scope.circleOptions.isMoving=!0})},ended:function(e,curPosition){$scope.$apply(function(){$scope.circleOptions.isMoving=!1,focusCurrentTag()}),curPosition.target=this.$circle,curPosition.radius=curPosition.target.width()/2,isCanMoveEnd(curPosition,$scope.tagData,$scope.tagsData)===!1?this.$circle.css({left:this.startPosition.x,top:this.startPosition.y}):$scope.$apply(function(){$scope.tagData.x=curPosition.x,$scope.tagData.y=curPosition.y}),delete this.$circle},isMoving:!1,isMoveCircle:!0};var STAGE_CTRL=angular.element(".imgmark")}]}}])}),define("imagemark/directive/imagemark.directive",["components/site-directive/assets-select/assets-select","components/site-directive/edit-box/new-edit-box","components/site-directive/foot-tool/time-box/new-time-box","components/site-directive/foot-tool/foot-tool","components/site-directive/error-tip/error-tip","components/site-directive/image-transform/image-transform","components/site-directive/confirm-popup/confirm-popup","imagemark/directive/mark-type-guide/mark-type-guide","imagemark/directive/imageitem/imageitem","components/site-directive/contenteditable/contenteditable","imagemark/directive/tag/tag","imagemark/directive/tag/areaTag","components/site-directive/draggable/nd-draggable","components/site-services/utils.service"],function(){}),define(["app","imagemark/directive/imagemark.directive"],function(app){"use strict";app.controller("imagemark_ctrl",["$scope","skin_service","$stateParams","CustomEditorService","$rootScope","$filter",function($scope,skin_service,$stateParams,CustomEditorService,$rootScope,$filter){$scope.errorModel={},$scope.showGuide=!0,$scope.MARK_TYPE={LINE:"line",AREA:"area"},$scope.model={title:"",skin:{code:"wood",css_url:"${ref-path}/edu/esp/preparecustomeditor/imagemark/wood/css/wood.css",name:$filter("translate")("imagemark.muwen"),package_url:"${ref-path}/edu/esp/preparecustomeditor/imagemark/wood"},timer:{timer_type:"sequence",time_minute:"0",time_second:"0"},image_item:{asset_type:"",asset:"",other:{}},mark_type:$scope.MARK_TYPE.LINE,tags:[]},$rootScope.moduleScope=$scope,$scope.defaultTitleSetting={isCleared:!1,title:$filter("translate")("imagemark.default.title")},$scope.model.title=$scope.defaultTitleSetting.title;var loadingData=function(id){$scope.isloadingData=!0,CustomEditorService.getQuestionInfoById(id).then(function(rtnData){rtnData?(""!=rtnData.skin.code?($scope.model=$scope.decodeData(rtnData),skin_service.set_skin_by_code($scope.model.skin.code,"v1"),$scope.showGuide=!1):($scope.showGuide=!0,$scope.model.id=rtnData.id,skin_service.set_skin_by_code($scope.model.skin.code,"v1")),$scope.errorModel.errorText="",$scope.isloadingData=!1):$scope.errorModel.errorText=$filter("translate")("imagemark.unvalidno")},function(error){$scope.errorModel.errorText=$filter("translate")("imagemark.get_title_error")})};$stateParams.id?loadingData($stateParams.id):skin_service.set_skin_by_code($scope.model.skin.code,"v1"),$scope.$on("changgedSkin",function(){$rootScope.scaleHtml()}),$scope.validMarkHandler={run:null},$scope.validPostData=function(){var modelData=$scope.model;if(""==$.trim(modelData.title))return $scope.errorModel.errorText=$filter("translate")("imagemark.no_title"),!1;if(0==modelData.tags.length)return $scope.errorModel.errorText=$filter("translate")("imagemark.no_content"),!1;if($scope.validMarkHandler.run&&!$scope.validMarkHandler.run())return $scope.model.mark_type==$scope.MARK_TYPE.LINE?$scope.errorModel.errorText=$filter("translate")("imagemark.tag_origin_invalid"):$scope.errorModel.errorText=$filter("translate")("imagemark.tag_area_invalid"),!1;for(var isValid=!0,i=0;i<modelData.tags.length;i++)if(!modelData.tags[i].value)return $scope.errorModel.errorText=$filter("translate")("imagemark.tag_is_empty",{index:i+1}),isValid=!1,!1;return isValid},$scope.encodeData=function(model){var newModel=angular.copy(model);return angular.forEach(newModel.tags,function(tag,$index){tag.serial_num=$index+1}),newModel.mark_type+="&NEW",newModel.image_item.other["max-width"]="679px",newModel.image_item.other["max-height"]="416px",newModel},$scope.decodeData=function(model){var index=model.mark_type.indexOf("&");if(index>-1)model.mark_type=model.mark_type.substring(0,index);else{var horizontaRate=1.131,verticalRate=.832;angular.forEach(model.tags,function(tag){tag.x=tag.x*horizontaRate,tag.y=tag.y*verticalRate,tag.rec_x=tag.rec_x*horizontaRate,tag.rec_y=tag.rec_y*verticalRate})}return 0==$scope.model.tags.length?model:($scope.model.id=model.id,$scope.model.interaction_hints=model.interaction_hints,$scope.model)},$scope.setMarkType=function(markType,isRemoveTags){$scope.model.mark_type=markType,$scope.showGuide=!1,isRemoveTags&&($scope.model.tags=[])},$scope.onMousedown=function(event){var $target=$(event.target);$target.hasClass("mousedownable")||0!==$target.parents("mousedownable").length||(event.preventDefault(),event.stopPropagation())}}])});