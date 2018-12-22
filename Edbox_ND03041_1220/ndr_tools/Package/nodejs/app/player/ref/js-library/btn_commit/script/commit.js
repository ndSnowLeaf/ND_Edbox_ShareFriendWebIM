/**
 * Created by Administrator on 2015/9/6.
 */
function CommitBtn(containterSelector,id,callback){
    this.statContainer = $(containterSelector); //容器

    var btn = null;
    var clickCallback = callback;
    var isMouseDown = false;
    var isAllowSubmit = true;
    var isLock = false;

    if(this.statContainer){
        var html = '<a id="'+id+'" class="com_u_btn1">提交</a>';
        btn = $(html);
        btn.appendTo(this.statContainer);
        btn.on('mousedown touchstart', function(e) {
            if (isAllowSubmit) {
                isMouseDown = true;
            }

        }).on('mouseup touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isMouseDown) {
                clickCallback(e);
            }
            isMouseDown = false;
            isAllowSubmit = false;
            if (!isLock) {
                isLock = true;
                setTimeout(function() {
                    isLock = false;
                    isAllowSubmit = true;
                }, 1000);
            }

        });
    }

    this.disable = function(){
        if(btn){
            btn.off('mouseup mousedown touchstart touchend');
        }
    };

    this.enable = function(){
        btn.on('mousedown touchstart', function(e) {
            isMouseDown = true;
        });
        btn.on('mouseup touchend', function(e) {
            e.preventDefault();
            if (isMouseDown) {
                clickCallback(e);
            }
            isMouseDown = false;
        });
    }

    this.onDestory = function(){
        clickCallback = null;
    }
}
