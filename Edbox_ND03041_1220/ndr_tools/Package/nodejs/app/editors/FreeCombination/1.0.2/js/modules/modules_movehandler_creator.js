define(['../utils.js'],function(utils){
   return {
       create:function(sourceModule,modules){
           var firstHandle = true;
           var proxys = [];
           var boxBoundary = null;
           var calculateAbsoluteBox = function(proxy){
               var box = angular.extend({},proxy.startBox);
               //if(proxy.group){
               //    box.left =box.left+proxy.group.left;
               //    box.top = box.top + proxy.group.top;
               //}
               return box;
           }

           var calculateBoxBoundary = function(){
               var maxWidth = utils.stageSize.width-5;
               var maxHeight = utils.stageSize.height-5;

               var boundary = {
                   maxWidth: 10000,
                   minWidth: -10000,
                   minHeight: -10000,
                   maxHeight: 10000
               };
               for(var i=0;i<proxys.length;i++){
                   var proxy = proxys[i];
                   var startBox = calculateAbsoluteBox(proxy);

                   var max = maxWidth - startBox.left - startBox.width;
                   boundary.maxWidth = Math.min(boundary.maxWidth,max);

                   var min = -1.0*startBox.left;
                   boundary.minWidth = Math.max(boundary.minWidth,min);

                   max = maxHeight - startBox.top - startBox.height;
                   boundary.maxHeight = Math.min(boundary.maxHeight,max);

                   min = -1.0*startBox.top;
                   boundary.minHeight = Math.max(boundary.minHeight,min);
               }
               return boundary;
           }
           //TODO calculate box boundary once
           var fixMoveBox = function(box){
               var maxWidth = utils.stageSize.width-5;
               var maxHeight = utils.stageSize.height-5;
               var width = box.left;
               var height = box.top;

               if(!boxBoundary){
                   boxBoundary = calculateBoxBoundary();
               }
               if(width<boxBoundary.minWidth){
                   width = boxBoundary.minWidth;
               }
               if(width>boxBoundary.maxWidth){
                   width = boxBoundary.maxWidth;
               }
               if(height<boxBoundary.minHeight){
                   height = boxBoundary.minHeight;
               }
               if(height>boxBoundary.maxHeight){
                   height = boxBoundary.maxHeight;
               }
               box.left = width;
               box.top = height;
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
                               if(m.type == 'group'){
                                   for(var j=0;j< m.children.length;j++){
                                       m.children[j].startBox=m.children[j].getBoxValue();
                                   }
                               }
                               proxys.push(m);
                           }
                       });
                   }
               },
               change:function(box){
                   if(firstHandle){
                        firstHandle = false;
                        this.start();
                   }
                   fixMoveBox(box);
                   for(var i=0;i<proxys.length;i++){
                       var proxy = proxys[i];
                       proxy.changeBoxSize(box,sourceModule.startBox);
                       if(proxy.type == 'group'){
                           for(var j=0;proxy.children&&j<proxy.children.length;j++){
                               var child = proxy.children[j];
                               child.changeBoxSize(box,sourceModule.startBox);
                           }
                       }
                   }
               },
               finish:function(){
                   var handles = {};
                   for(var i=0;i<proxys.length;i++){
                       if(proxys[i].group&&!handles[proxys[i].group.id]){
                           modules.resizeGroupSize(proxys[i].group);
                           handles[proxys[i].group.id] = true;
                       }
                   }
                   firstHandle = true;
                   proxys = [];
                   boxBoundary = null;
               }
           }

       }
   }
});