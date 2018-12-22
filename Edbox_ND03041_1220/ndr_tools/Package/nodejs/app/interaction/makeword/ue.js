var $wap = $('.com_layout');
var winHeight, winWidth;
var ratio = 10/7;
var maxWidth = 1300;
var maxHeight = maxWidth/ratio;
var minWidth = 1159;
var minHeight = minWidth/ratio;

function getWinSize(){
    winHeight = $(window).height();
    winWidth = $(window).width();
}
function setWapSize(s){
    // $wap.css({
    //     width:w,
    //     height:h,
    //     marginTop:winHeight - h > 0 ? (winHeight - h)/2 : 0
    // });
    $(".com_layout").removeClass('com_layout_small com_layout_mid com_layout_large');
    $(".com_layout").addClass(s);
}

function wapRePosition(){
    if(winWidth / winHeight > ratio){
        if(winHeight >= maxHeight){
            setWapSize("com_layout_large");
        }else if(winHeight <= minHeight){
            setWapSize("com_layout_small");
        }else{
            setWapSize("com_layout_mid");
        }
    }else{
        if(winWidth >= maxWidth){
            setWapSize("com_layout_large");
        }else if(winWidth <= minWidth){
            setWapSize("com_layout_small");
        }else{
            setWapSize("com_layout_mid");
        }
    }
}

getWinSize();
wapRePosition();

$(window).bind('resize', function(){
    getWinSize();
    wapRePosition();
})