/*
 * Author: lxq
 * Version: 0.1.0
 * Compile Date: 2015-11-02 16:43
*/ 

	/*
	事件
	 */
	//切换卡片主菜单
	$('body').on('click',".wordcard .menulist .item_menu",function(){
		var index = $(this).index(".item_menu");
		var parent = $(this).closest(".wordcard");
		$(this).addClass("on").siblings(".item_menu").removeClass("on");
	 	//$(".wordcard .mainbox .main:eq("+ index +")").addClass("on").siblings(".main").removeClass("on");
	})
	
	//显示多媒体卡片
	/*$(".item_media").click(function(){
	  $(this).toggleClass("on");
	  $(".cardmain .it_newword").removeClass("on");
	  $(".cardmenu .item_newword").removeClass("on");
	  $(".cardmain .it_media").toggleClass("on");
	});*/
	
	//显示生字解析卡片
	/*$(".item_newword").click(function(){
	  $(this).toggleClass("on");
	  $(".cardmain .it_media").removeClass("on");
	  $(".cardmenu .item_media").removeClass("on");
	  $(".cardmain .it_newword").toggleClass("on");
	});*/
	//多媒体切换
	$('body').on('click','.media .mediatab li',function(){
        var index = $(this).index();
        $(this).closest('.cd-folding-panel').find('.media .mediastage').each(function(){
            $(this).find('.mediabox:eq('+ index +')').addClass('on').siblings().removeClass('on');
        })
        $(this).closest('.cd-folding-panel').find('.media .mediatab').each(function(){
            $(this).find('li:eq('+ index +')').addClass('on').siblings().removeClass('on');
        })
    }) ; 
	//多媒体切换
/*    $(".media .mediatab li").click(function(){
        var index = $(this).index();
        $(this).closest('.cd-folding-panel').find('.media .mediastage').each(function(){
            $(this).find('.mediabox:eq('+ index +')').addClass('on').siblings().removeClass('on');
        })
        $(this).closest('.cd-folding-panel').find('.media .mediatab').each(function(){
            $(this).find('li:eq('+ index +')').addClass('on').siblings().removeClass('on');
        })
    })*/

    //生词解析切换
    $('body').on('click', '.media .switch .btn_switch',function(){
        var index = $(this).index();
        $(this).closest('.cd-folding-panel').find('.media .mediastage').each(function(){
            $(this).find('.explain_list:eq('+ index +')').addClass('on').siblings().removeClass('on');
        })
        $(this).closest('.cd-folding-panel').find('.media .footwrap').each(function(){
            $(this).find('.btn_switch:eq('+ index +')').addClass('on').siblings().removeClass('on');
        })
    })
    //多音字替换
	$('body').on('click','.pop_content a',function(){
        $(this).parent("li").addClass("py_selected").siblings().removeClass("py_selected");
    })
	


    controlDom();
    $('body').on('click',".menulist .item_media",function(){
        $(this).toggleClass("on").siblings(".item_menu").removeClass("on");
        $(".cardmenu .item_newword").removeClass("on");
        var btnControl = $(this);
        var foldingPanel = $(this).closest(".wordcard").find(".cd-folding-panel1");
        var thisContent = $(this).closest(".wordcard").find(".cd-folding-panel1 > .it_media");
        var PanelOther = $(this).closest(".wordcard").find(".cd-folding-panel2");
        Action(btnControl,foldingPanel,thisContent,PanelOther);
    })
    $('body').on('click',".menulist .item_newword",function(){
        $(this).toggleClass("on").siblings(".item_menu").removeClass("on");
        $(".cardmenu .item_media").removeClass("on");
        var btnControl = $(this);
        var foldingPanel = $(this).closest(".wordcard").find(".cd-folding-panel2");
        var thisContent = $(this).closest(".wordcard").find(".cd-folding-panel2 > .it_newword");
        var PanelOther = $(this).closest(".wordcard").find(".cd-folding-panel1");
        Action(btnControl,foldingPanel,thisContent,PanelOther);
    })


function controlDom(){
    var foldContentDiv1 = "<div class='cd-folding-panel cd-folding-panel1'><div class='fold-left'><div class='fold-left-after'></div></div><div class='fold-right'><div class='fold-right-after'></div></div></div>";
    var foldContentDiv2 = "<div class='cd-folding-panel cd-folding-panel2'><div class='fold-left'><div class='fold-left-after'></div></div><div class='fold-right'><div class='fold-right-after'></div></div></div>"
    $(".cardmain > .it_media").each(function(){
        $(this).after(foldContentDiv1);
        $(this).siblings('.cd-folding-panel1').find('.fold-left-after').append($(this).clone().addClass("fold-left-in"));
        $(this).siblings('.cd-folding-panel1').find('.fold-right-after').append($(this).clone().addClass("fold-right-in"));
        $(this).siblings(".cd-folding-panel1").append($(this));
    })
    $(".cardmain > .it_newword").each(function(){
        $(this).after(foldContentDiv2);
        $(this).siblings('.cd-folding-panel2').find('.fold-left-after').append($(this).clone().addClass("fold-left-in"));
        $(this).siblings('.cd-folding-panel2').find('.fold-right-after').append($(this).clone().addClass("fold-right-in"));
        $(this).siblings(".cd-folding-panel2").append($(this));
    })
}
function Action(Btn,Parent,Son,ParentOther){
    $(Parent).show();
    if($(Parent).hasClass("is-open")){
        $(Parent).find(".fold-left").show();
        $(Parent).find(".fold-right").show();
        setTimeout(function(){
            $(Parent).removeClass("is-open");
        },1)
        $(Son).removeClass("on");
        $(Parent).animate({
            left: "30px"
        });
        $(Btn).closest(".wordcard").animate({
            width: "518px",
            left: "380px"
        },300);
    }else{
        if($(ParentOther).hasClass("is-open")){
            $(ParentOther).hide().removeClass("is-open");
            $(ParentOther).find(".fold-left").show();
            $(ParentOther).find(".fold-right").show();
            $(Parent).addClass("is-open")
            $(Parent).css({
                "left" : "329px"
            });
            $(Parent).find(".fold-left").hide();
            $(Parent).find(".fold-right").hide();
            $(Son).addClass("on");
        }else{
            $(Parent).addClass("is-open");
            $(Parent).animate({
                left: "329px"
            });
            $(Btn).closest(".wordcard").animate({
                width: "1047px",
                left: "100px"
            },400);
            setTimeout(function(){
                $(Parent).find(".fold-left").hide();
                $(Parent).find(".fold-right").hide();
                $(Son).addClass("on");
            }, 400);
        }
    }
}