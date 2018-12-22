var Toast = function (config) {
    this.context = config.context == null ? $('body') : config.context;//上下文
    this.message = config.message;//显示内容
    this.time = config.time == null ? 3000 : config.time;//持续时间
    this.left = config.left;//距容器左边的距离
    this.top = config.top;//距容器上方的距离
    this.init();
}
var msgEntity;
Toast.prototype = {
    //初始化显示的位置内容等
    init: function () {    	
        $("#toastMessage").remove();
        //设置消息体
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage">');
        msgDIV.push('<span>' + this.message + '</span>');
        msgDIV.push('</div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //设置消息样式
        var left = this.left == null ? this.context.width() / 2 - msgEntity.find('span').width() / 2 : this.left;
        var top = this.top == null ? '20px' : this.top;
        msgEntity.css({ position: 'absolute', top: top, 'z-index': '99', left: left, 'background-color': 'black', color: 'white', 'font-size': '18px', padding: '10px', margin: '10px' });
        msgEntity.hide();
    },
    //显示动画
    show: function () {
        msgEntity.fadeIn(this.time / 2);
        msgEntity.fadeOut(this.time / 2);
    }
}

var ComicDialogue = {
		config: {
            minWidth: 30, //最小宽度
            minHeight: 45, //最小高度
            tipButtom: 15, //对白图案三角底部高度
            topZindex: 100, //最上层z-index
            bottomZindex: 2,//底层z-index
            editWidth: 755, //编辑器图片区域宽
            editHeight: 555, //编辑器图片区域高 
            containWidth: 700,//实际编辑区宽
            containHeight: 600,//实际编辑区宽
        },
        CurrentTip:null,//当前选中的tip
        CurrentMouseObject:null,//当前鼠标点中的对象
        CurrentMouseType:"none",//none 无 move 移动 close 关闭 stretch 拉伸 rotate 旋转 drawX 画横线 drawY 画竖线 drawZ 画斜线
        CurrentMode:"none",//当前模式 none 无 edit 编辑
        container: null,//对白的容器
        mouseStartPoint: null, //鼠标按下位置
        allowAddTip:true,//是否允许插入气泡
	    scope:null,	    
	    //载入
	    init: function (scope) {	
	    	ComicDialogue.container = $(".div_container");
	    	
	    	ComicDialogue.scope = scope;	    	
	        $(".div_addtip").on("mousedown touchstart", function (e) {
//	            e.stopPropagation();
//	            e.preventDefault();
	            ComicDialogue.addTip();
	        })	        
	        
	        $(".tip").each(function (index, dom) {
	        	ComicDialogue.CurrentTip = $(this);
	            ComicDialogue.setTipWidthHeight();
	            ComicDialogue.setTipTextArea();
	            ComicDialogue.setTipTextStyle();
	            ComicDialogue.drawTip($(this).find(".tip-bg"), $(this).attr("drawtype"), $(this).attr("drawcolor"));
	        });	        
	        
	        
	        ComicDialogue.CurrentTip = null;
	        $(document).on("mousedown touchstart", function (e) {
//	        	e.stopPropagation();
//		        e.preventDefault();
	            ComicDialogue.mouseDown(e);	           
	        }).on("mousemove touchmove", function (e) {
//	            e.stopPropagation();
//	            e.preventDefault();
	            ComicDialogue.mouseMove(e);
	        }).on("mouseup touchend", function (e) {
//	            e.stopPropagation();
//	            e.preventDefault();
	            ComicDialogue.mouseUp(e);
	        }).on("dblclick doubletap", function (e) {
//				e.stopPropagation();
//	            e.preventDefault();
	            ComicDialogue.mouseDbClick(e);
	        });
	     
	      
	    },
	    getTipParam: function (tip) {	        
            return {
                tipType: (tip.attr("drawtype") ? parseInt(tip.attr("drawtype")) : 0),
                tipLeft: (tip.attr("drawleft") ? parseInt(tip.attr("drawleft")) : 0),
                tipTop: (tip.attr("drawtop") ? parseInt(tip.attr("drawtop")) : 0),
                tipWidth: (tip.attr("drawwidth") ? parseInt(tip.attr("drawwidth")) : 0),
                tipHeight: (tip.attr("drawheight") ? parseInt(tip.attr("drawheight")) : 0),
                tipColor: (tip.attr("drawcolor") ? tip.attr("drawcolor") : "#000000"),
                textColor: (tip.attr("fontcolor") ? tip.attr("fontcolor") : "#000000"),
                fontFamily: (tip.attr("fontfamily") ? tip.attr("fontfamily") : "宋体"),
                fontSize: (tip.attr("fontsize") ? parseInt(tip.attr("fontsize")) : 14),
                textAlign: (tip.attr("textalign") ? tip.attr("textalign") : "center"),
                diretion: (tip.attr("textdiretion") ? parseInt(tip.attr("textdiretion")) : 0),
                tipContext: tip.find(".text-input").html()
            };
        },
        getTipDialogues: function () {
            var dialogues = [];
            $(".tip").each(function () {
                dialogues.push(ComicDialogue.getTipParam($(this)));
            });
            return dialogues;
        },
        loadItem: function (item, scaleW, scaleH) {
            item.tipLeft = (item.tipLeft) * scaleW + 3;
            item.tipTop = (item.tipTop + 5) * scaleH;
            item.tipWidth = item.tipWidth * scaleW;
            item.tipHeight = item.tipHeight * scaleH;
            ComicDialogue.CurrentTip = $('<div class="tip" onclick="ComicDialogue.setCurrentTip(this)"><canvas class="tip-bg"></canvas><div class="move-area"><div class="text-area"><div class="text-cell"><div class="text-input">' + item.tipContext + '</div></div></div></div></div>');
            ComicDialogue.CurrentTip.attr("drawtype", item.tipType).attr("drawleft", item.tipLeft).attr("drawtop", item.tipTop)
                .attr("drawcolor", item.tipColor).attr("drawwidth", item.tipWidth).attr("drawheight", item.tipHeight)
                .attr("fontcolor", item.textColor).attr("textalign", item.tipAlign).attr("textdiretion", item.diretion)
                .attr("fontsize", item.fontSize).attr("fontfamily", item.fontFamily);
            ComicDialogue.container.append(ComicDialogue.CurrentTip);
            ComicDialogue.setTipWidthHeight();
            ComicDialogue.setTipTextArea();
            ComicDialogue.setTipTextStyle();
            ComicDialogue.drawTip(ComicDialogue.CurrentTip.find(".tip-bg"), ComicDialogue.CurrentTip.attr("drawtype"), ComicDialogue.CurrentTip.attr("drawcolor"));
        },
        setCurrentTip:function(dom){        	
        	ComicDialogue.CurrentTip = $(dom);
        	ComicDialogue.CurrentMouseObject = $(event.target);
        },
	    //添加对白
	    addTip: function () {	    		    	
	    	ComicDialogue.cancelSelect();
            var w = 100, h = 75;//默认宽高
            var l = (ComicDialogue.container.width() - w) / 2;
            var t = (ComicDialogue.container.height() - h) / 2;
            
            var item = { "tipType": 0, "tipLeft": l, "tipTop": t, "tipColor": "#FFFFFF", "tipWidth": 100, "tipHeight": 75, "textColor": "#000000", "tipAlign": "center", "diretion": 0, "fontSize": 14, "fontFamily": "宋体", "tipContext":"" };
            ComicDialogue.loadItem(item, 1, 1);
            ComicDialogue.showButton();
            ComicDialogue.textTip();
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	    },
	    //画对白背景图案
	    drawTip: function (cvs, type, color) {
	        switch (parseInt(type)) {
	            case 1:
	            	ComicDialogue.drawRectangle(cvs, color);
	                break;
	            case 2:
	            	ComicDialogue.drawRhombus(cvs, color);
	                break;
	            default:
	            	ComicDialogue.drawCircle(cvs, color);
	                break;
	        }
	    },
	    //画圆弧矩形
	    drawRectangle: function (cvs, bgColor) {//画矩形
	        bgColor = bgColor ? bgColor : "#FFFFFF";
	        var borderColor = bgColor != "#FFFFFF" ? bgColor : "#000000";
	        var w = cvs.width();
	        var h = cvs.height();
	        if (cvs[0].getContext) {
	            var ctx = cvs[0].getContext("2d");
	            ctx.save();
	            ctx.clearRect(0, 0, w, h);
	            ctx.strokeStyle = borderColor;
	            var x = 0, r = 5, b = ComicDialogue.config.tipButtom;
	            ctx.lineWidth = 2;
	            ctx.roundRect(1, 1, w - 2, h - b, 10, bgColor, borderColor);
	            //ctx.clearRect(((w - 10) / 2), h - b, 10, 2);
	            ctx.beginPath();
	            ctx.moveTo(((w - 10) / 2), h - b);
	            ctx.lineTo(((w - 10) / 2) + 7, h - 3);
	            ctx.lineTo(((w - 10) / 2) + 14, h - b);
	            ctx.fillStyle = bgColor;
	            ctx.fill();
	            ctx.stroke();
	        }
	    },	   
	    //画圆
	    drawCircle: function (cvs, bgColor) {
	        bgColor = bgColor ? bgColor : "#FFFFFF";
	        var borderColor = bgColor != "#FFFFFF" ? bgColor : "#000000";
	        var w = cvs.width();
	        var h = cvs.height();
	        if (cvs[0].getContext) {
	            var ctx = cvs[0].getContext("2d");
	            ctx.save();
	            ctx.clearRect(0, 0, w, h);
	            ctx.strokeStyle = borderColor;
	            var x = 0, b = ComicDialogue.config.tipButtom;
	            ctx.lineWidth = 2;
	            ctx.ellipse(w / 2, (h - b) / 2, (w / 2 - 2), (h - b) / 2 - 2, bgColor, borderColor);
	            //ctx.clearRect(((w - 10) / 2), h - b - 4, 10, 4);
	            ctx.beginPath();
	            ctx.moveTo(((w - 10) / 2), h - b - 3);
	            ctx.lineTo(((w - 10) / 2) + 6, h - 3);
	            ctx.lineTo(((w - 10) / 2) + 12, h - b - 3);
	            ctx.fillStyle = bgColor;
	            ctx.fill();
	            ctx.stroke();
	        }
	    },
	    //画菱形
	    drawRhombus: function (cvs, bgColor) {
	        bgColor = bgColor ? bgColor : "#FFFFFF";
	        var borderColor = bgColor != "#FFFFFF" ? bgColor : "#000000";
	        var w = cvs.width();
	        var h = cvs.height();
	        if (cvs[0].getContext) {
	            var ctx = cvs[0].getContext("2d");
	            ctx.save();
	            ctx.clearRect(0, 0, w, h);
	            ctx.strokeStyle = borderColor;
	            var x = 0, b = ComicDialogue.config.tipButtom;
	            var qx = Math.tan(15 * Math.PI / 180) * (h - b);//倾斜距离
	            ctx.lineWidth = 2;
	            ctx.beginPath();
	            ctx.moveTo(qx, 1);
	            ctx.lineTo(w - 1, 1);
	            ctx.lineTo(w - qx, h - b);
	            ctx.lineTo(1, h - b);
	            ctx.closePath();
	            ctx.fillStyle = bgColor;
	            ctx.fill();
	            ctx.stroke();

	            //ctx.clearRect(((w - qx - 10) / 2), h - b - 2, 10, 3);
	            ctx.beginPath();
	            ctx.moveTo(((w - qx - 10) / 2), h - b - 1);
	            ctx.lineTo(((w - qx - 10) / 2) + 7, h - 3);
	            ctx.lineTo(((w - qx - 10) / 2) + 14, h - b - 1);
	            ctx.fillStyle = bgColor;
	            ctx.fill();
	            ctx.stroke();
	        }
	    },
	    //清除当前选中的对白
	    cancelSelect: function () {
	    	ComicDialogue.CurrentMode = "none";
            if (ComicDialogue.CurrentTip == null)
                return;
//            ComicDialogue.CurrentTip.css("z-index", ComicDialogue.config.bottomZindex).removeAttr("status");
//            ComicDialogue.setTipIsEdit(false);
//            ComicDialogue.CurrentTip.find("._resize").hide();
//            ComicDialogue.CurrentTip.find(".btn-area").hide();
//            ComicDialogue.CurrentTip = null;
            $(".tip").each(function (index, dom) {
            	ComicDialogue.CurrentTip = $(dom);
	            $(dom).css("z-index", ComicDialogue.config.bottomZindex).removeAttr("status");
                ComicDialogue.setTipIsEdit(false);
                $(dom).find("._resize").hide();
                $(dom).find(".btn-area").hide();
                ComicDialogue.CurrentTip = null;
	        });	   
            
	    },
	    mouseDbClick: function (event) {
	    	ComicDialogue.CurrentMouseObject = $(event.target);
	        if (ComicDialogue.CurrentMode == "edit")
	            return;
	        if (ComicDialogue.CurrentMouseObject.hasClass("move-area") || 
	        		ComicDialogue.CurrentMouseObject.hasClass("text-area") || 
	        		ComicDialogue.CurrentMouseObject.hasClass("text-cell") || 
	        		ComicDialogue.CurrentMouseObject.hasClass("text-input")) {
	        	ComicDialogue.setTipIsEdit(true);
	        }
	    },
	    mouseDown: function (e) {	    	
	    	ComicDialogue.CurrentMouseObject = $(e.target);
	        
	        if (ClientProxy && ClientProxy.isClosest()) {
	            return;
	        }
	        
	        if (ClientProxy && ClientProxy.isOpen()) {
	            ClientProxy.close();
	        }
	        if (ComicDialogue.CurrentMouseObject.hasClass("none"))
	            return;
	        if (ComicDialogue.CurrentMouseObject.hasClass("btn-text")) {//文字
	        	ComicDialogue.CurrentTip = ComicDialogue.CurrentMouseObject.closest(".tip");
	            ComicDialogue.textTip();
	            return;
	        }
	        if (ComicDialogue.CurrentMouseObject.hasClass("btn-style")) {//样式
	        	ComicDialogue.CurrentTip = ComicDialogue.CurrentMouseObject.closest(".tip");
	            
	            ComicDialogue.styleTip(e);
	            return;
	        }
	        if (ComicDialogue.CurrentMouseObject.hasClass("btn-delete")) {//删除
	        	ComicDialogue.CurrentTip = ComicDialogue.CurrentMouseObject.closest(".tip");
	            ComicDialogue.deleteTip();
	            return;
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_resize")) {//拉伸
	        	ComicDialogue.setTipIsEdit(false);
	        	ComicDialogue.CurrentTip = ComicDialogue.CurrentMouseObject.closest(".tip");
	        	ComicDialogue.CurrentMouseType = "resize";
	            ComicDialogue.mouseStartPoint = ComicDialogue.getPoint(e);
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("move-area") || 
	        		ComicDialogue.CurrentMouseObject.hasClass("text-area") || 
	        		ComicDialogue.CurrentMouseObject.hasClass("text-cell") || 
	        		ComicDialogue.CurrentMouseObject.hasClass("text-input") || 
	        		ComicDialogue.CurrentMouseObject.hasClass("tip-bg")) {//移动
	        	 if (ComicDialogue.CurrentMouseObject.closest(".tip").attr("status") != "move") {
	        		 ComicDialogue.cancelSelect();
	                }
	                if (ComicDialogue.CurrentMode == "edit")
	                    return;
	                ComicDialogue.CurrentTip = ComicDialogue.CurrentMouseObject.closest(".tip");
	                ComicDialogue.CurrentTip.css("z-index", ComicDialogue.config.topZindex).attr("status", "move");
	                ComicDialogue.showButton();
	                //if (CurrentMode != "edit") {
	                //    CurrentTip.find(".text-input").attr("onselectstart", "return false;");
	                //}
	                ComicDialogue.CurrentMouseType = "move";
	                ComicDialogue.mouseStartPoint = ComicDialogue.getPoint(e);
	        } else {
	        	ComicDialogue.CurrentMouseType = "none";
	            ComicDialogue.cancelSelect();
	        }
	    },
	    mouseMove: function (event) {
	        if (ComicDialogue.CurrentMouseType != "none" && ComicDialogue.CurrentTip != null) {
	            switch (ComicDialogue.CurrentMouseType) {
	                case "move":
	                    clearSlct();
	                    var start = ComicDialogue.mouseStartPoint;
	                    var end = ComicDialogue.getPoint(event);
	                    var maxLeft = $(".div_container").width() - ComicDialogue.CurrentTip.width();
	                    var maxTop = $(".div_container").height() - ComicDialogue.CurrentTip.height();
	                    var x = parseInt(start.left) + parseInt(end.x) - parseInt(start.x);
	                    x = x < 0 ? 0 : x;
	                    x = x > maxLeft ? maxLeft : x;
	                    var y = parseInt(start.top) + parseInt(end.y) - parseInt(start.y);
	                    y = y < 0 ? 0 : y;
	                    y = y > maxTop ? maxTop : y;
	                    ComicDialogue.CurrentTip.css("left", x + "px").attr("drawleft", x).css("top", y + "px").attr("drawtop", y);
	                    ComicDialogue.setButtonArea();
	                    break;
	                case "resize":
	                    clearSlct();
	                    var start = ComicDialogue.mouseStartPoint;
	                    var end = ComicDialogue.getPoint(event);
	                    ComicDialogue.resizeTip(start, end);
	                    break;
	                default: break;
	            }	            
	        }
	    },
	    mouseUp: function (event) {
	    	ComicDialogue.CurrentMouseType = "none";
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	        
	    },
	    //拉伸对白
	    resizeTip: function (start, end) {
	        var moveX = end.x - start.x;
	        var x = start.left + moveX;
	        var moveY = end.y - start.y;
	        var y = start.top + moveY;

	        var left = start.left + moveX;
	        var top = start.top + moveY;
	        var width = start.w - moveX;
	        var height = start.h - moveY;
	        var max = { w: 0, h: 0 };//最大宽度和高度
	        var min = { w: ComicDialogue.config.minWidth, h: ComicDialogue.config.minHeight };//最小宽度和高度
	        if (ComicDialogue.CurrentMouseObject.hasClass("_nw")) {//左上
	            max.w = $(".div_container").width() + start.left;
	            max.h = $(".div_container").height() + start.top;
	            width = start.w - moveX;
	            height = start.h - moveY;
	            var minTop = ComicDialogue.CurrentTip.find(".btn-area").height();
	            if (left < 0) {
	                left = 0;
	                width = start.w + start.left;
	            }
	            else if (width < min.w) {
	                width = min.w;
	                left = start.left + start.w - min.w;
	            }
	            if (top < 0) {
	                top = 0;
	                height = start.h + start.top;
	            }
	            else if (height < min.h) {
	                height = min.h;
	                top = start.top + start.h - min.h;
	            }
	            ComicDialogue.CurrentTip.css("left", left + "px").css("width", width + "px").css("top", top + "px").css("height", height + "px");
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_w")) {//左
	            max.w = $(".div_container").width() + start.left;
	            max.h = $(".div_container").height() + start.top;
	            width = start.w - moveX;
	            if (left < 0) {
	                left = 0;
	                width = start.w + start.left;
	            }
	            else if (width < min.w) {
	                width = min.w;
	                left = start.left + start.w - min.w;
	            }
	            ComicDialogue.CurrentTip.css("left", left + "px").css("width", width + "px");
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_sw")) {//左下
	            max.w = $(".div_container").width() + start.left;
	            max.h = $(".div_container").height() - start.top;
	            width = start.w - moveX;
	            height = start.h + moveY;
	            if (left < 0) {
	                left = 0;
	                width = start.w + start.left;
	            }
	            else if (width < min.w) {
	                width = min.w;
	                left = start.left + start.w - min.w;
	            }
	            else if (width > max.w) {
	                width = max.w;
	                left = start.left + start.w - max.w;
	            }
	            if (height < min.h) {
	                height = min.h;
	            }
	            else if (height > max.h) {
	                height = max.h;
	            }
	            ComicDialogue.CurrentTip.css("left", left + "px").css("width", width + "px").css("height", height + "px");
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_s")) {//下
	            max.h = $(".div_container").height() - start.top;
	            height = start.h + moveY;
	            if (height < min.h) {
	                height = min.h;
	            }
	            else if (height > max.h) {
	                height = max.h;
	            }
	            ComicDialogue.CurrentTip.css("height", height + "px");
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_se")) {//右下
	            max.w = $(".div_container").width() - start.left;
	            max.h = $(".div_container").height() - start.top;
	            width = start.w + moveX;
	            height = start.h + moveY;
	            if (width < min.w) {
	                width = min.w;
	            }
	            else if (width > max.w) {
	                width = max.w;
	            }
	            if (height < min.h) {
	                height = min.h;
	            }
	            else if (height > max.h) {
	                height = max.h;
	            }
	            ComicDialogue.CurrentTip.css("width", width + "px").css("height", height + "px");
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_e")) {//右
	            max.w = $(".div_container").width() - start.left;
	            width = start.w + moveX;
	            if (width < min.w) {
	                width = min.w;
	            }
	            else if (width > max.w) {
	                width = max.w;
	            }
	            ComicDialogue.CurrentTip.css("width", width + "px");
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_ne")) {//右上
	            max.w = $(".div_container").width() - start.left;
	            max.h = $(".div_container").height() + start.top;
	            width = start.w + moveX;
	            height = start.h - moveY;
	            if (width < min.w) {
	                width = min.w;
	            }
	            else if (width > max.w) {
	                width = max.w;
	            }
	            if (top < 0) {
	                top = 0;
	                height = start.h + start.top;
	            }
	            else if (height < min.h) {
	                height = min.h;
	                top = start.top + start.h - min.h;
	            }
	            else if (height > max.h) {
	                height = max.h;
	                top = start.top + start.h - max.h;
	            }
	            ComicDialogue.CurrentTip.css("top", top + "px").css("width", width + "px").css("height", height + "px");
	        }
	        else if (ComicDialogue.CurrentMouseObject.hasClass("_n")) {//上
	            max.h = $(".div_container").height() + start.top;
	            height = start.h - moveY;
	            if (top < 0) {
	                top = 0;
	                height = start.h + start.top;
	            }
	            else if (height < min.h) {
	                height = min.h;
	                top = start.top + start.h - min.h;
	            }
	            else if (height > max.h) {
	                height = max.h;
	                top = start.top + start.h - max.h;
	            }
	            ComicDialogue.CurrentTip.css("top", top + "px").css("height", height + "px");
	        }
	        ComicDialogue.setTipTextArea();
	        ComicDialogue.setButtonArea();
	        ComicDialogue.CurrentTip.attr("drawwidth", ComicDialogue.CurrentTip.width()).attr("drawheight", ComicDialogue.CurrentTip.height()).attr("drawleft", ComicDialogue.CurrentTip.css("left").replace("px", "")).attr("drawtop", ComicDialogue.CurrentTip.css("top").replace("px", ""));
	        var cvs = ComicDialogue.CurrentTip.find("canvas").attr("width", ComicDialogue.CurrentTip.width()).attr("height", ComicDialogue.CurrentTip.height());
	        ComicDialogue.drawTip(cvs, ComicDialogue.CurrentTip.attr("drawtype"), ComicDialogue.CurrentTip.attr("drawcolor"));
	    },
	    setTipWidthHeight: function () {
	        var width = parseInt(ComicDialogue.CurrentTip.attr("drawwidth"));
	        ComicDialogue.CurrentTip.width(width > 0 ? width : 100);
	        var height = parseInt(ComicDialogue.CurrentTip.attr("drawheight"));
	        ComicDialogue.CurrentTip.height(height > 0 ? height : 75);
	        var left = parseInt(ComicDialogue.CurrentTip.attr("drawleft"));
	        ComicDialogue.CurrentTip.css("left", left > 0 ? left + "px" : "0px");
	        var top = parseInt(ComicDialogue.CurrentTip.attr("drawtop"));
	        ComicDialogue.CurrentTip.css("top", top > 0 ? top + "px" : "0px");
	        ComicDialogue.CurrentTip.find("canvas").attr("width", ComicDialogue.CurrentTip.width()).attr("height", ComicDialogue.CurrentTip.height());
	        	        
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	        
	    },
	    setTipIsEdit: function (edit) {
	        if (edit) {
	        	ComicDialogue.CurrentMode = "edit";
	            ComicDialogue.CurrentMouseType = "none";
	            ComicDialogue.CurrentTip.find(".text-input").css("cursor", "text").attr("contenteditable", "true");//.attr("onselectstart", "return false;")
	            var editor = ComicDialogue.CurrentTip.find(".text-input")[0];
	            //editor.scrollIntoView(true);

	            window.setTimeout(function () {
	                var sel, range;
	                if (window.getSelection && document.createRange) {
	                    range = document.createRange();
	                    range.selectNodeContents(editor);
	                    range.collapse(true);
	                    range.setEnd(editor, editor.childNodes.length);
	                    range.setStart(editor, editor.childNodes.length);
	                    sel = window.getSelection();
	                    sel.removeAllRanges();
	                    sel.addRange(range);
	                } else if (document.body.createTextRange) {
	                    range = document.body.createTextRange();
	                    range.moveToElementText(editor);
	                    range.collapse(true);
	                    range.select();
	                }
	            }, 1);
	        } else {
	        	ComicDialogue.replaceHtml();
	        	ComicDialogue.CurrentTip.find(".text-input").attr("contenteditable", "false").css("cursor", "move");//.attr("onselectstart", "return false;")
	        }
	    },
	    replaceHtml:function(){
	    	if(ComicDialogue.CurrentTip==null)
	    		return;
	        var input = ComicDialogue.CurrentTip.find(".text-input");
	        var html = input.html();
	        html = html.replace(/<div>/g, "").replace(/<\/div>/g, "<br />");
	        input.html(html);
	    },
	    //设置对白文本区域大小
	    setTipTextArea: function () {
	        var w = ComicDialogue.CurrentTip.width();
	        var h = ComicDialogue.CurrentTip.height();
	        switch (parseInt(ComicDialogue.CurrentTip.attr("drawtype"))) {
	            case 1://圆弧矩形
	            	ComicDialogue.CurrentTip.find(".text-area").css("width", w - 20 + "px").css("height", h - 35 + "px").css("top", "10px").css("left", "10px");
	            	ComicDialogue.CurrentTip.find(".text-input").css("max-height", h - 35).css("max-width", w - 20);
	                break;
	            case 2:
	                var b = ComicDialogue.config.tipButtom;
	                var x = parseInt(Math.tan(15 * Math.PI / 180) * (h - b));//倾斜距离
	                ComicDialogue.CurrentTip.find(".text-area").css("width", (w - 2 * x) - 2 + "px").css("height", h - 30 + "px").css("top", "10px").css("left", x + 2 + "px");
	                ComicDialogue.CurrentTip.find(".text-input").css("max-height", h - 30).css("max-width", (w - 2 * x) - 2);
	                break;
	            default://椭圆
	                h -= 15;
	                var i = (w > h) ? 2 / w : 2 / h;
	                var x = parseInt(w * Math.cos(Math.atan(h / w))) - 5;
	                var y = parseInt(h * Math.sin(Math.atan(h / w)));
	                ComicDialogue.CurrentTip.find(".text-area").css("width", x - 3 + "px").css("height", y + "px").css("left", parseInt((w - x) / 2) + 2 + "px").css("top", parseInt((h - y) / 2) + "px");
	                ComicDialogue.CurrentTip.find(".text-input").css("max-height", y).css("max-width", x - 3);
	                break;
	        }
	        //CurrentTip.find(".text-input").css("max-height", CurrentTip.find(".text-area").css("height")).css("max-width", CurrentTip.find(".text-area").css("width"));
	        
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	    },
	    setTipTextStyle: function () {
	        var color = ComicDialogue.CurrentTip.attr("fontcolor");
	        var family = ComicDialogue.CurrentTip.attr("fontfamily");
	        var size = ComicDialogue.CurrentTip.attr("fontsize");
	        var align = (ComicDialogue.CurrentTip.attr("textalign") ? ComicDialogue.CurrentTip.attr("textalign") : "center");
	        var diretion = ComicDialogue.CurrentTip.attr("textdiretion");
	        ComicDialogue.CurrentTip.find(".text-input").css("color", (color ? color : "#000000")).css("font-family", (family ? family : "宋体"))
	            .css("font-size", (size ? size : 16) + "px").css("text-align", align);
	        if (diretion == "1") {
	            //CurrentTip.find(".text-area").addClass((align == "left" ? "diretion-y-l" : "diretion-y-r"));
	        	ComicDialogue.CurrentTip.find(".text-area").addClass("diretion-y-r");
	            //CurrentTip.find(".text-cell").css("vertical-align", (align == "left" ? "top" : (align == "right" ? "top" : "middle")));
	        } else {
	        	ComicDialogue.CurrentTip.find(".text-area").removeClass("diretion-y-r");//.removeClass("diretion-y-r");
	            //CurrentTip.find(".text-cell").css("vertical-align", "middle");
	        }
	        
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	    },
	    //设置按钮位置
	    setButtonArea: function () {
	        var btn = ComicDialogue.CurrentTip.find(".btn-area");
	        var l = 0;
	        var w = btn.width();
	        if (ComicDialogue.CurrentTip.width() > w) {
	            l = (ComicDialogue.CurrentTip.width() - w) / 2;
	        } else {
	            var leave = $(".div_container").width() - parseInt(ComicDialogue.CurrentTip.css("left").replace("px", "")) - ComicDialogue.CurrentTip.width();
	            if (leave < (w - ComicDialogue.CurrentTip.width())) {
	                l = ComicDialogue.CurrentTip.width() - w - 2;
	            }
	        }
	        btn.css("left", l + "px");

	        var topH = 30, bottomH = 35;
	        var top = parseInt(ComicDialogue.CurrentTip.css("top").replace("px", ""));
	        if (top < topH) {
	            btn.removeClass("area-t").removeClass("area-b").addClass("area-b");
	        }
	        else{
	            btn.removeClass("area-t").removeClass("area-b").addClass("area-t");
	        }
	    },
	    //点击文本
	    textTip: function () {
	    	ComicDialogue.CurrentTip.find("._btn").removeClass("active");
	    	ComicDialogue.CurrentTip.find(".btn-text").addClass("active");
	        ComicDialogue.setTipIsEdit(true);
	    },
	    //点击样式
	    styleTip: function (e) {
	    	ComicDialogue.CurrentTip.find("._btn").removeClass("active");
	    	ComicDialogue.CurrentTip.find(".btn-style").addClass("active");
	    	ComicDialogue.CurrentMode = "style";
	        ComicDialogue.CurrentMouseType = "none";
	        ComicDialogue.setTipIsEdit(false);
	        var param = ComicDialogue.getTipParam(ComicDialogue.CurrentTip);
	        param.left = ComicDialogue.CurrentTip.width() + parseInt(ComicDialogue.CurrentTip.css("left").replace("px", "")) + $(".div_container").offset().left + 5;
	        param.top = parseInt(ComicDialogue.CurrentTip.css("top").replace("px", "")) + $(".div_container").offset().top;
	        ClientProxy.open(param, e);
	        
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	    },
	    //点击删除
	    deleteTip: function () {
	    	ComicDialogue.CurrentTip.find(".btn-area").removeClass("active");
	        ComicDialogue.CurrentTip.find(".btn-delete").addClass("active");
	        ComicDialogue.CurrentTip.remove();
	        ComicDialogue.CurrentTip = null;
	        ComicDialogue.CurrentMode = "none";
	        ComicDialogue.CurrentMouseType = "none";
	    },
	    //显示可编辑状态的按钮
	    showButton: function () {
	    	ComicDialogue.CurrentTip.css("z-index", ComicDialogue.config.topZindex).attr("status", "move");
	        if (ComicDialogue.CurrentTip.find("._resize").length == 0) {
	        	ComicDialogue.CurrentTip.find(".move-area").css("border-width", "1px").append($('<span class="_resize _nw"></span><span class="_resize _w"></span><span class="_resize _sw"></span><span class="_resize _s"></span><span class="_resize _se"></span><span class="_resize _e"></span><span class="_resize _ne"></span><span class="_resize _n"></span>'));
	        } else {
	        	ComicDialogue.CurrentTip.find("._resize").show();
	        }
	        if (ComicDialogue.CurrentTip.find(".btn-area").length == 0) {
	        	ComicDialogue.CurrentTip.find(".move-area").append($('<div class="btn-area"><span class="_btn btn-text">文字</span><span class="_btn btn-style">样式</span><span class="_btn btn-delete">删除</span></span>'));
	        } else {
	        	ComicDialogue.CurrentTip.find(".btn-area").show();
	        	ComicDialogue.CurrentTip.find(".btn-area").removeClass("active");
	        }
	        ComicDialogue.setButtonArea();
	    },
	    //获取鼠标坐标
	    getPoint: function (ev) {
	        var x = parseInt(ev.pageX);
	        var y = parseInt(ev.pageY);
	        if (ev.type.indexOf("touch") >= 0 && ev.originalEvent) {
	            if (ev.originalEvent.touches && ev.originalEvent.touches.length > 0) {
	                x = parseInt(ev.originalEvent.touches[0].pageX);
	                y = parseInt(ev.originalEvent.touches[0].pageY);
	            }
	        }
	        var top = parseInt(ComicDialogue.CurrentTip.css("top").replace("px", ""));
	        var left = parseInt(ComicDialogue.CurrentTip.css("left").replace("px", ""));
	        var w = parseInt(ComicDialogue.CurrentTip.width());
	        var h = parseInt(ComicDialogue.CurrentTip.height());
	        return { x: x, y: y, top: top, left: left, w: w, h: h };
	    },

	    //设置对白的风格
	    //type 0 圆弧矩形 1 椭圆 2 四方形
	    //color 颜色值 #FFFFFF
	    setTipStyle: function (param) {
	    	
	        if (ComicDialogue.CurrentTip == null)
	            return;
	        ComicDialogue.CurrentTip.attr("drawtype", param.tipType);
	        ComicDialogue.CurrentTip.attr("drawcolor", param.tipColor);
	        ComicDialogue.drawTip(ComicDialogue.CurrentTip.find(".tip-bg"), param.tipType, param.tipColor);
	        ComicDialogue.setTipTextArea();
	        
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	    },
	    //设置对白的字体等
	    setTipText: function (param) {
	        if (ComicDialogue.CurrentTip == null)
	            return;
	        ComicDialogue.CurrentTip.attr("fontcolor", param.textColor);
	        ComicDialogue.CurrentTip.attr("fontfamily", param.fontFamily);
	        ComicDialogue.CurrentTip.attr("fontsize", param.fontSize);
	        ComicDialogue.CurrentTip.attr("textalign", param.textAlign);
	        ComicDialogue.CurrentTip.attr("textdiretion", param.diretion);
	        ComicDialogue.setTipTextStyle();
	        
	        ComicDialogue.scope.model.content.dialogues = ComicDialogue.getTipDialogues();
	    }	  
	};
	function init() {
	    ComicDialogue.init();

	    ////防止鼠标选中内容（当鼠标松开时清除选中内容）
	    //window.onmouseup = function () {
	    //    clearSlct();
	    //};
	    ////防止通过键盘选中内容（当按键松开时清除选中内容）
	    //window.onkeyup = function () {
	    //    clearSlct();
	    //};
	    ////使用jQuery的方法
	    //$(window).on("mouseup keyup mousemove", function () {
	    //    clearSlct();
	    //});
	}
	//清空选择
	var clearSlct = "getSelection" in window ? function () {
	    window.getSelection().removeAllRanges();
	} : function () {
	    document.selection.empty();
	};
	//画圆弧矩形
	CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r, bgColor, borderColor) {
	    //if (w < 2 * r) r = w / 2;
	    //if (h < 2 * r) r = h / 2;
	    this.beginPath();
	    this.moveTo(x + r, y);
	    this.arcTo(x + w, y, x + w, y + h, r);
	    this.arcTo(x + w, y + h, x, y + h, r);
	    this.arcTo(x, y + h, x, y, r);
	    this.arcTo(x, y, x + w, y, r);
	    // ComicDialogue.arcTo(x+r, y);
	    this.closePath();
	    this.fillStyle = bgColor;
	    this.fill();
	    this.strokeStyle = borderColor;
	    this.stroke();
	    return this;
	}
	//画椭圆
	CanvasRenderingContext2D.prototype.ellipse = function (x, y, a, b, bgColor, borderColor) {
	    //max是等于1除以长轴值a和b中的较大者
	    //i每次循环增加1/max，表示度数的增加
	    //这样可以使得每次循环所绘制的路径（弧线）接近1像素
	    var step = (a > b) ? 1 / a : 1 / b;
	    this.save();
	    this.beginPath();
	    this.moveTo(x + a, y); //从椭圆的左端点开始绘制
	    for (var i = 0; i < 2 * Math.PI; i += step) {
	        //参数方程为x = a * cos(i), y = b * sin(i)，
	        //参数为i，表示度数（弧度）
	    	this.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
	    }
	    this.closePath();
	    this.fillStyle = bgColor;
	    this.fill();
	    this.strokeStyle = borderColor;
	    this.stroke();
	    return this;
	};
	

//气泡数据
var BubblerData = {
  titles: ["气泡", "文字"],
  tipTypes: [
      { "label": "interaction/styles/comicdialogue/assets/images/wood/u1356.png", "name": "0" },
      { "label": "interaction/styles/comicdialogue/assets/images/wood/u1354.png", "name": "1" },
      { "label": "interaction/styles/comicdialogue/assets/images/wood/u1358.png", "name": "2" }],
  tipColors: ["#E84C3D", "#E77E23", "#FFD700", "#2FCC71", "#3598DC",
                  "#9C59B8", "#FF6699", "#BEC3C7", "#808B8D", "#FFFFFF", "#913EB0", "#FF00CC", "#96A6A6", "#999999", "#333333"],
  //
  fonts: ["宋体", "黑体", "楷体", "仿宋", "隶书", "幼圆"],
  textColors: ["#333333", "#E84C3D", "#FFFFFF"],
  fontOps: [{ "label": "-", "name": "interaction/styles/comicdialogue/assets/images/wood/decrease_font.png" },
            { "label": "+", "name": "interaction/styles/comicdialogue/assets/images/wood/increase_font.png" }],
  diretions: [{ "label": "横向", "name": "0" }, { "label": "竖向", "name": "1" }],
  aligns: [{ "label": "interaction/styles/comicdialogue/assets/images/wood/Untitled-2-17.png", name: "left" },
           { "label": "interaction/styles/comicdialogue/assets/images/wood/Untitled-2-18.png", name: "center" },
           { "label": "interaction/styles/comicdialogue/assets/images/wood/Untitled-2-19.png", name: "right" }]
};




//气泡盒子
//气泡盒子
var BubblerBox = {
  current: {
      tipType: 0,
      tipColor: "#E84C3D",
      fontFamily: "SimHei",
      textColor: "#000000",
      fontSize: 14,
      diretion: 0,/*0：横向，1：竖向*/
      textAlign: "left",
      left: 0,
      top: 0,
      move: false,
      isOpen: false
  },
  conflictColor: "yellow",
  box: undefined,
  // 气泡
  bulid: function () {
      bulidBox();
      bulidTab();
      bulidBubblerType();
      bulidBubblerText();
      bulidBubblerFont();
      bulidBubblerColor();

      // 盒子外壳
      function bulidBox() {
          var box = document.createElement("div");
          $(box).addClass("bubble_box");
          $(document.body).append(box)
          BubblerBox.box = box;
      }
      // 气泡的tab
      function bulidTab() {
          var title = document.createElement("div");
          $(title).addClass("box_title");
          $(BubblerBox.box).append(title)

          var span0 = document.createElement("span");
          $(span0).text("气泡").addClass("tab-com first current").on("click touchstart", function () { BubblerBox._tab(0); });
          $(title).append(span0);

          var span1 = document.createElement("span");
          $(span1).text("文字").addClass("tab-com second").on("click touchstart", function () { BubblerBox._tab(1); });
          $(title).append(span1);
      }
      // 气泡的类型
      function bulidBubblerType() {
          var tab0 = document.createElement("div");
          $(tab0).addClass("tab0");
          $(BubblerBox.box).append(tab0);

          var boxBG = document.createElement("div");
          $(boxBG).addClass("box_background");
          $(tab0).append(boxBG);


          $.each(BubblerData.tipTypes, function (index, dom) {
              var type = document.createElement("div");
              if (dom.name == BubblerBox.current.tipType)
                  $(type).addClass("item current").html('<img src="' + dom.label + '" />').on("click touchstart", function () { BubblerBox._setTipType(dom.name) });
              else
                  $(type).addClass("item").html('<img src="' + dom.label + '" />').on("click touchstart", function () { BubblerBox._setTipType(dom.name) });

              $(boxBG).append(type);
          });

          var boxBGColor = document.createElement("div");
          $(boxBGColor).addClass("box_background_color");
          $(tab0).append(boxBGColor);


          var boxBGColorTitle = document.createElement("div");
          $(boxBGColorTitle).addClass("box_background_color title").html("<span>气泡填充颜色</span>");
          $(boxBGColor).append(boxBGColorTitle);

          var boxBGColorContainer = document.createElement("div");
          $(boxBGColorContainer).addClass("box_background_color container");
          $(boxBGColor).append(boxBGColorContainer);

          $.each(BubblerData.tipColors, function (index, dom) {
              var color = document.createElement("div");
              if (dom == BubblerBox.current.tipColor) {
                  $(color).css({ "background-color": dom, "border": "solid 2px white" }).on("click touchstart", function () { BubblerBox._setTipColor(dom); })
              }
              else {
                  $(color).css({ "background-color": dom, "border": "solid 2px " + dom }).on("click touchstart", function () { BubblerBox._setTipColor(dom); })
              }
              $(boxBGColorContainer).append(color);
          });
      }
      // 气泡的文本
      function bulidBubblerText() {
          var tab1 = document.createElement("div");
          $(tab1).addClass("tab1");
          $(BubblerBox.box).append(tab1);

          var boxText = document.createElement("div");
          $(boxText).addClass("bubble_box_text");
          $(tab1).append(boxText);

          // 字体
          var boxTextItem0 = document.createElement("div");
          $(boxTextItem0).addClass("bubble_box_text_item");
          $(boxText).append(boxTextItem0);

          var boxTextItem0Title = document.createElement("div");
          $(boxTextItem0Title).text("字体").addClass("text_item_title");
          $(boxTextItem0).append(boxTextItem0Title)

          var boxTextItem0Options = document.createElement("div");
          $(boxTextItem0Options).addClass("text_item_options").text(BubblerBox.current.fontFamily).on("click touchstart", function () { BubblerBox._showFonts(); });
          $(boxTextItem0).append(boxTextItem0Options)

          var boxTextItem0Label = document.createElement("label");
          $(boxTextItem0Label).text(">");
          $(boxTextItem0).append(boxTextItem0Label)

          // 颜色
          var boxTextItem1 = document.createElement("div");
          $(boxTextItem1).addClass("bubble_box_text_item");
          $(boxText).append(boxTextItem1);


          var boxTextItem1Title = document.createElement("div");
          $(boxTextItem1Title).addClass("text_item_title").text("颜色");
          $(boxTextItem1).append(boxTextItem1Title)


          var boxTextItem1Options = document.createElement("div");
          $(boxTextItem1Options).addClass("text_item_options").on("click touchstart", function () { BubblerBox._showColors(); });
          $(boxTextItem1).append(boxTextItem1Options)


          var boxTextItem1Options0 = document.createElement("div");
          $(boxTextItem1Options0).addClass("text_item_color option_color").css({ "background-color": BubblerBox.current.textColor });
          $(boxTextItem1Options).append(boxTextItem1Options0);

          var boxTextItem1Label = document.createElement("label");
          $(boxTextItem1Label).text(">");
          $(boxTextItem1).append(boxTextItem1Label);


          // 字号
          var boxTextItem2 = document.createElement("div");
          $(boxTextItem2).addClass("bubble_box_text_item");
          $(boxText).append(boxTextItem2);


          var boxTextItem2Container = document.createElement("div");
          $(boxTextItem2).append(boxTextItem2Container)

          var boxTextItem2Title = document.createElement("div");
          $(boxTextItem2Title).addClass("text_item_title").text("字号");
          $(boxTextItem2Container).append(boxTextItem2Title)


          var boxTextItem2Options = document.createElement("div");
          $(boxTextItem2Options).addClass("text_item_options");
          $(boxTextItem2Container).append(boxTextItem2Options)


          $.each(BubblerData.fontOps, function (index, dom) {
              var boxTextItem2Options1 = document.createElement("div");
              if (index==0){
            	  $(boxTextItem2Options1).addClass("text_item_font").on("click touchstart", function () { BubblerBox._decreaseFontSize(); });  
              }else{
            	  $(boxTextItem2Options1).addClass("text_item_font").on("click touchstart", function () { BubblerBox._increaseFontSize(); });
              }
              
              $(boxTextItem2Options).append(boxTextItem2Options1);

              var boxTextItem2Options1Img = document.createElement("img");
              $(boxTextItem2Options1Img).width(25).height(25).attr("src", dom.name);
              $(boxTextItem2Options1).append(boxTextItem2Options1Img);
          });

          // 方向
          var boxTextItem3 = document.createElement("div");
          $(boxTextItem3).addClass("bubble_box_text_item");
          $(boxText).append(boxTextItem3);


          var boxTextItem3Container = document.createElement("div");
          $(boxTextItem3).append(boxTextItem3Container)

          var boxTextItem3Title = document.createElement("div");
          $(boxTextItem3Title).text("方向");
          $(boxTextItem3Title).addClass("text_item_title");
          $(boxTextItem3Container).append(boxTextItem3Title);


          var boxTextItem3Options = document.createElement("div");
          $(boxTextItem3Options).addClass("text_item_options");
          $(boxTextItem3Container).append(boxTextItem3Options)


          $.each(BubblerData.diretions, function (index, dom) {
              var item = document.createElement("div");
              if (dom.name == BubblerBox.current.diretion)
                  $(item).addClass("text_item_diretion current").html("<span>" + dom.label + "</span>").on("click touchstart", function () { BubblerBox._setDiretion(dom.name); })
              else
                  $(item).addClass("text_item_diretion").html("<span>" + dom.label + "</span>").on("click touchstart", function () { BubblerBox._setDiretion(dom.name); })
              $(boxTextItem3Options).append(item);
          });


          // 对齐
          var boxTextItem4 = document.createElement("div");
          $(boxTextItem4).addClass("bubble_box_text_item");
          $(boxText).append(boxTextItem4);

          var boxTextItem4Container = document.createElement("div");
          $(boxTextItem4).append(boxTextItem4Container)

          var boxTextItem4Title = document.createElement("div");
          $(boxTextItem4Title).text("对齐");
          $(boxTextItem4Title).addClass("text_item_title");
          $(boxTextItem4Container).append(boxTextItem4Title);


          var boxTextItem4Options = document.createElement("div");
          $(boxTextItem4Options).addClass("text_item_options");
          $(boxTextItem4Container).append(boxTextItem4Options)


          $.each(BubblerData.aligns, function (index, dom) {
              var item = document.createElement("div");
              if (dom.name == BubblerBox.current.textAlign)
                  $(item).addClass("text_item_align current").on("click touchstart", function () { BubblerBox._setAlign(dom.name); }).append('<img src="' + dom.label + '" width="25" height="25"></img>');
              else
                  $(item).addClass("text_item_align").on("click touchstart", function () { BubblerBox._setAlign(dom.name); }).append('<img src="' + dom.label + '" width="25" height="25"></img>');
              $(boxTextItem4Options).append(item);
          });

      }
      // 气泡文本的字体 
      function bulidBubblerFont() {
          var tab2 = document.createElement("div");
          $(tab2).addClass("tab2");
          $(BubblerBox.box).append(tab2);

          var boxBG = document.createElement("div");
          $(boxBG).addClass("bubble_box_text_item_font");
          $(tab2).append(boxBG);


          var fontSetting = document.createElement("div");
          $(fontSetting).html("字体设置<span style='float:right;' >返回</span>").css({ "font-weight": "bold" }).find("> span").on("click touchstart", function () { BubblerBox._tab(1); })
          $(boxBG).append(fontSetting);

          $.each(BubblerData.fonts, function (index, dom) {
              var item = document.createElement("div");
              if (BubblerBox.current.fontFamily == dom) {
                  $(item).css({ "font-weight": "bold" }).text(dom).on("click touchstart", function () { BubblerBox._setFont(dom); });
              } else {
                  $(item).text(dom).on("click touchstart", function () { BubblerBox._setFont(dom); });
              }
              $(boxBG).append(item);
          });
      }
      // 气泡文本的颜色 
      function bulidBubblerColor() {
          var tab3 = document.createElement("div");
          $(tab3).addClass("tab3");
          $(BubblerBox.box).append(tab3);

          var boxBG = document.createElement("div");
          $(boxBG).addClass("bubble_box_text_item_color");
          $(tab3).append(boxBG);


          var fontSetting = document.createElement("div");
          $(fontSetting).html("颜色设置<span style='float:right;' >返回</span>").css({ "font-weight": "bold" }).find("> span").on("click touchstart", function () { BubblerBox._tab(1); })
          $(boxBG).append(fontSetting);


          var boxBGColorContainer = document.createElement("div");
          $(boxBGColorContainer).addClass("bubble_box_text_item_color_container");
          $(boxBG).append(boxBGColorContainer);

          $.each(BubblerData.tipColors, function (index, dom) {
              var color = document.createElement("div");
              if (dom.toUpperCase() == BubblerBox.current.textColor.toUpperCase()) {
                  if (dom.toUpperCase() == "#FFFFFF") {
                      $(color).css({ "background-color": dom, "border": "solid 2px " + BubblerBox.conflictColor }).on("click touchstart", function () { BubblerBox._setTextColor(dom); })
                  } else {
                      $(color).css({ "background-color": dom, "border": "solid 2px white" }).on("click touchstart", function () { BubblerBox._setTextColor(dom); })
                  }
              }
              else {
                  $(color).css({ "background-color": dom, "border": "solid 2px " + dom }).on("click touchstart", function () { BubblerBox._setTextColor(dom); })
              }
              $(boxBGColorContainer).append(color);
          });
      }
  },
  // 显示
  show: function (params, ev1) {
      var ev = ev1 || window.event;
      var p = BubblerBox.getPoint(ev);
      BubblerBox.wrap(params);
      BubblerBox.bulid();
      BubblerBox.current.isOpen = true;
      if (!BubblerBox.current.left)
          BubblerBox.current.left = p.x;

      if (!BubblerBox.current.top)
          BubblerBox.current.top = p.y;

      $(".bubble_box").css({ left: BubblerBox.current.left, top: BubblerBox.current.top });
      $(".bubble_box").show();
      $(".bubble_box").on("mousedown touchstart", function (e) {
          e.stopPropagation();
          e.preventDefault();
          BubblerBox.current.move = true;
          var p = BubblerBox.getPoint(e);
          BubblerBox.current.left = p.x - parseInt($(".bubble_box").css("left"));
          BubblerBox.current.top = p.y - parseInt($(".bubble_box").css("top"));

          $(document).on("mousemove touchmove", function (e) {
              e.stopPropagation();
              e.preventDefault();
              var p = BubblerBox.getPoint(e);
              if (BubblerBox.current.move) {
                  var x = p.x - BubblerBox.current.left;
                  var y = p.y - BubblerBox.current.top;
                  $(".bubble_box").css({ "top": y, "left": x });
              }
          }).on("mouseup touchend", function () {
              e.stopPropagation();
              e.preventDefault();
              BubblerBox.current.move = false;
          });
      });



  },
  getPoint: function (ev) {
      var x = parseInt(ev.pageX);
      var y = parseInt(ev.pageY);
      if (ev.type.indexOf("touch") >= 0 && ev.originalEvent) {
          if (ev.originalEvent.touches && ev.originalEvent.touches.length > 0) {
              x = parseInt(ev.originalEvent.touches[0].pageX);
              y = parseInt(ev.originalEvent.touches[0].pageY);
          }
      }
      return { x: x, y: y };
  },
  // 关闭
  close: function () {
      BubblerBox.current.isOpen = false;
      $(".bubble_box").hide();
      $(".bubble_box").remove();
  },
  // 是否打开
  isOpen: function () {
      return BubblerBox.current.isOpen;
  },
  // 包装
  wrap: function (params) {
      BubblerBox.current = params;
  },
  // 气泡的样式
  _setTipType: function (tipType) {
      BubblerBox.current.tipType = tipType;
      $(".box_background .item").each(function (index, dom) {
          $(dom).removeClass("current");
          if (index == tipType)
              $(dom).addClass("current");
      });
      ClientProxy.setTipStyle(BubblerBox.current);
  },
  // 气泡的颜色
  _setTipColor: function (tipColor) {
      if (BubblerBox.current.textColor == tipColor) {
          new Toast({ context: $('body'), message: '背景颜色和文本颜色不能一样' }).show();
          return;
      }

      BubblerBox.current.tipColor = tipColor;

      $(".box_background_color .container div").each(function (index, dom) {
          var color = $(dom).css("background-color").colorHex().toUpperCase();
          $(dom).css({ "border": "2px solid " + color });
          if (color == tipColor) {
              if (tipColor.toUpperCase() == "#FFFFFF") {
                  $(dom).css({ "border": "2px solid " + BubblerBox.conflictColor });
              }
              else {
                  $(dom).css({ "border": "2px solid white" });
              }
          }
      });

      ClientProxy.setTipStyle(BubblerBox.current)
  },
  // 字体
  _setFont: function (fontFamily) {
      BubblerBox.current.fontFamily = fontFamily;
      $(".bubble_box_text").find(".bubble_box_text_item:eq(0) >.text_item_options").text(BubblerBox.current.fontFamily);

      $(".bubble_box_text_item_font :gt(1)").css({ "font-weight": "normal" })
      $(".bubble_box_text_item_font >div").each(function (index, dom) {
          var text = $(dom).text();
          if (text == BubblerBox.current.fontFamily) {
              $(dom).css({ "font-weight": "bold" });
          }
      });


      ClientProxy.setTipText(BubblerBox.current)
  },
  // -字号
  _decreaseFontSize: function () {
      BubblerBox.current.fontSize -= 1;
      
      if (BubblerBox.current.fontSize < 14)
          BubblerBox.current.fontSize = 14;
      ClientProxy.setTipText(BubblerBox.current)
  },
  // +字号
  _increaseFontSize: function () {
      BubblerBox.current.fontSize += 1;
      
      if (BubblerBox.current.fontSize > 30)
          BubblerBox.current.fontSize = 30;
      ClientProxy.setTipText(BubblerBox.current)

  },
  // 文本颜色
  _setTextColor: function (textColor) {

      if (BubblerBox.current.tipColor == textColor) {
          new Toast({ context: $('body'), message: '背景颜色和文本颜色不能一样' }).show();
          return;
      }

      BubblerBox.current.textColor = textColor;
      $(".bubble_box_text").find(".bubble_box_text_item:eq(1) >div + >div").css({ "background-color": BubblerBox.current.textColor });

      $(".bubble_box_text_item_color_container >div").each(function (index, dom) {
          $(dom).css({ "border": "solid 2px " + BubblerData.tipColors[index] })
          if (textColor == BubblerData.tipColors[index]) {
              if (textColor.toUpperCase() == "#FFFFFF") {
                  $(dom).css({ "border": "solid 2px " + BubblerBox.conflictColor });
              } else {
                  $(dom).css({ "border": "solid 2px white" });
              }
          }
      });

      ClientProxy.setTipText(BubblerBox.current);
  },
  // 方向
  _setDiretion: function (diretion) {
      BubblerBox.current.diretion = diretion;

      $(".text_item_diretion").each(function (index, dom) {
          $(dom).removeClass("current");
          if (index == diretion)
              $(dom).addClass("current");
      });

      ClientProxy.setTipText(BubblerBox.current);
  },
  // 对齐
  _setAlign: function (textAlign) {
      BubblerBox.current.textAlign = textAlign;
      $(".text_item_align").each(function (index, dom) {
          var align = BubblerBox._getTextAlign(index);
          $(dom).removeClass("current");
          if (align == textAlign)
              $(dom).addClass("current");
      });
      ClientProxy.setTipText(BubblerBox.current);
  },
  // 获取文本对齐
  _getTextAlign: function (index) {

      return BubblerData.aligns[index].name;
  },
  // 获取文本颜色
  _getTextColor: function (index) {
      return BubblerData.textColors[index];
  },
  // tab
  _tab: function (tabIndex) {
      switch (tabIndex) {
          case 0: {
              $(".tab0").show();
              $(".tab1").hide();
              $(".tab2").hide();
              $(".tab3").hide();
              break;
          }
          case 1: {
              $(".tab0").hide();
              $(".tab1").show();
              $(".tab2").hide();
              $(".tab3").hide();
              break;
          }
      }

      $(".box_title span").each(function (index, dom) {
          $(dom).removeClass("current")
          if (tabIndex == index) {
              $(dom).addClass("current")
          }
      })
  },
  // 显示字体界面
  _showFonts: function () {
      $(".tab0").hide();
      $(".tab1").hide();
      $(".tab2").show();
      $(".tab3").hide();
  },
  // 显示颜色界面
  _showColors: function () {
      $(".tab0").hide();
      $(".tab1").hide();
      $(".tab2").hide();
      $(".tab3").show();
  }
};



//代理
var ClientProxy = {
  // 设置气泡样式
  setTipStyle: function (params) {
      ComicDialogue.setTipStyle(params)
  },
  // 设置气泡文本
  setTipText: function (params) {
      ComicDialogue.setTipText(params)
  },
  // 打开气泡设置
  open: function (params,ev) {
      BubblerBox.show(params,ev);
  },
  // 关闭气泡设置
  close: function () {
      BubblerBox.close();
  },
  // 是否气泡已经打开
  isOpen: function () {
      return BubblerBox.isOpen();
  },
  // 是否closest
  isClosest: function () {
      if (ComicDialogue.CurrentMouseObject.closest(".bubble_box").length > 0)
          return true;
      return false;
  }
};
