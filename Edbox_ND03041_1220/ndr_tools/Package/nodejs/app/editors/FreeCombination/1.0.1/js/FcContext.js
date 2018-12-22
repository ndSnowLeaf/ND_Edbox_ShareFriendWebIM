define([],function() {
    return {
        clean:function(){
            var context = this;
            context.drawing = false;
            context.drawtext = false;
            context.drawshape = false;
        },
        isDrawing:function(type){
            if(type == 'text' && this.drawtext){
                return true;
            }
            if(type == 'shape'&&this.drawshape){
                return true;
            }
            return false;
        }
    }
});
