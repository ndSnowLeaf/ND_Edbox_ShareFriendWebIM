define(['../utils.js'],function(utils){
   return {
       create:function(sourceModule,modules,$element,$stage){
           var firstHandle = true;
           var proxys = [];
           var direction = null;
           var calculateRotateBox = function(box){
               if(!isNaN(box.rotateX) && !isNaN(box.rotateY)){
                   var offset = $element.offset();
                   var rotateCenterX=Math.round($stage.transform(offset.left,true)+sourceModule.startBox.left+(sourceModule.startBox.width/2));
                   var rotateCenterY=Math.round($stage.transform(offset.top,false)+sourceModule.startBox.top+(sourceModule.startBox.height/2));
                   var x=box.rotateX-rotateCenterX;
                   var y=-(box.rotateY-rotateCenterY);
                   var degree = -(Math.atan2(y,x)/Math.PI*180-90);
                   box.rotate=degree;
               }
               return box;
           }
           return {
               start:function(){
                   var module = sourceModule;
                   if(module&&module.group){
                       module.startBox=module.getBoxValue();
                       proxys.push(module);
                   }
                   else{
                       modules.each(function(m){
                           if(m.selected&& !m.group){
                               m.startBox=m.getBoxValue();
                               proxys.push(m);
                               if(m.type == 'group'){
                                   for(var j=0;j< m.children.length;j++){
                                       m.children[j].startBox=m.children[j].getBoxValue();
                                   }
                               }
                           }
                       });
                   }
               },
               change:function(box,direction){
                   if(firstHandle){
                        firstHandle = false;
                        direction = direction;
                        this.start();
                   }
                   box = calculateRotateBox(box);
                   for(var i=0;i<proxys.length;i++){
                       var proxy = proxys[i];
                       proxy.changeBoxSize(box,sourceModule.startBox);
                       if(proxy.type == 'group'){
                           for(var j=0;proxy.children&&j<proxy.children.length;j++){
                               var child = proxy.children[j];
                               modules.rotateChild(proxy,child,box.rotate);
                           }
                       }
                   }
               },
               finish:function(){
                   firstHandle = true;
                   proxys = [];
                   direction = null;
               }
           }

       }
   }
});