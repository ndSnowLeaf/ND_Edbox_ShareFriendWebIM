define(['../utils.js'],function(utils){
    var defaultRates = {
        'n':{top:-1,height:-1,left: 0,width: 0},
        'nw':{top:-1,height:-1,left: -1,width: -1},
        'ne':{top:-1,height:-1,left: 0,width: 1},
        's':{top:0,height:1,left: 0,width: 0},
        'sw':{top:0,height:1,left: -1,width: -1},
        'se':{top:0,height:1,left: 0,width: 1},
        'w':{top:0,height:0,left: -1,width: -1},
        'e':{top:0,height:0,left: 0,width: 1}
    }
    var sevenrates = {
        'nw':{
            "sevenpiece_sub1":{top:-1,height:-1,left: -2,width: -1},
            "sevenpiece_sub2":{top:-2,height:-1,left: -1,width: -1},
            "sevenpiece_sub3":{top:-1,height:-1,left: -4/3,width: -1},
            "sevenpiece_sub4":{top:-2,height:-1,left: -1.5,width: -1},
            "sevenpiece_sub5":{top:-1.5,height:-1,left: -1,width: -1},
            "sevenpiece_sub6":{top:-2,height:-1,left: -1,width: -1},
            "sevenpiece_sub7":{top:-1,height:-1,left: -1,width: -1}
        },
        'ne':{
            "sevenpiece_sub1":{top:-1,height:-1,left: 0,width: 1},
            "sevenpiece_sub2":{top:-2,height:-1,left: 0,width: 1},
            "sevenpiece_sub3":{top:-1,height:-1,left: 0,width: 1},
            "sevenpiece_sub4":{top:-2,height:-2,left: 0.5,width: 2},
            "sevenpiece_sub5":{top:-1.5,height:-1,left: 1,width: 1},
            "sevenpiece_sub6":{top:-2,height:-1,left: 3,width: 1},
            "sevenpiece_sub7":{top:-1,height:-1,left: 1,width: 1}
        },
        'sw':{
            "sevenpiece_sub1":{top:0,height:1,left: -2,width: -1},
            "sevenpiece_sub2":{top:0,height:1,left: -1,width: -1},
            "sevenpiece_sub3":{top:3,height:1,left: -4/3,width: -1},
            "sevenpiece_sub4":{top:2,height:1,left: -1.5,width: -1},
            "sevenpiece_sub5":{top:0.5,height:1,left: -1,width: -1},
            "sevenpiece_sub6":{top:0,height:1,left: -1,width: -1},
            "sevenpiece_sub7":{top:1,height:1,left: -1,width: -1}
        },
        'se':{
            "sevenpiece_sub1":{top:0,height:1,left: 0,width: 1},
            "sevenpiece_sub2":{top:0,height:1,left: 0,width: 1},
            "sevenpiece_sub3":{top:3,height:1,left: 0,width: 1},
            "sevenpiece_sub4":{top:2,height:2,left: 0.5,width: 2},
            "sevenpiece_sub5":{top:0.5,height:1,left: 1,width: 1},
            "sevenpiece_sub6":{top:0,height:1,left: 3,width: 1},
            "sevenpiece_sub7":{top:1,height:1,left: 1,width: 1}
        }
    }
    var extraRate = {
        width:{
            "sevenpiece_sub1":0.5,
            "sevenpiece_sub2":1,
            "sevenpiece_sub3":0.75,
            "sevenpiece_sub4":0.5,
            "sevenpiece_sub5":0.5,
            "sevenpiece_sub6":0.25,
            "sevenpiece_sub7":0.5
        },
        height:{
            "sevenpiece_sub1":1,
            "sevenpiece_sub2":0.5,
            "sevenpiece_sub3":0.25,
            "sevenpiece_sub4":0.25,
            "sevenpiece_sub5":0.5,
            "sevenpiece_sub6":0.5,
            "sevenpiece_sub7":0.5
        }

    }

   return {
       create:function(sourceModule,modules){
            var firstHandle = true;
            var proxys = [];
            var direction = null;
            var startModule = null;
            var calculateMaxMinRate = function(module){
                var config = module.resizeConfig;
                var rate = {width: 1000,height:1000};
                var maxWidth = utils.stageSize.width-5;
                var maxHeight = utils.stageSize.height-5;
                if(config.top!=0){
                    var calRate =1 - (module.startBox.top-10)/(config.top*module.startBox.height);
                    if(calRate>0){
                        rate.height = Math.min(rate.height,calRate);
                    }
                }
                if(config.left!=0){
                    var calRate = 1 -(module.startBox.left-10)/(config.left*module.startBox.width);
                    if(calRate>0){
                        rate.width = Math.min(rate.width,calRate);
                    }

                }
                if(config.left!=-1){
                    var calRate =(maxWidth -module.startBox.left+config.left*module.startBox.width)/(module.startBox.width   +config.left*module.startBox.width);
                    if(calRate>0){
                        rate.width =Math.min(rate.width,calRate);
                    }
                }
                if(config.top!=-1){
                    var calRate =  (maxHeight-module.startBox.top+config.top*module.startBox.height)/( module.startBox.height +config.top*module.startBox.height);
                    if(calRate>0){
                        rate.height =Math.min(rate.height, calRate);
                    }


               }
               return {
                   max: rate,
                   min:{
                       width : 20.0/module.startBox.width,
                       height :20.0/module.startBox.height
                   }
               };

           }
           var calculateResizeBox = function(box){
               var config = startModule.resizeConfig;

               var extraWidthRate = sourceModule.shapeGroupId ? extraRate['width'][sourceModule.shapetype] : 1.0;
               var extraHeightRate = sourceModule.shapeGroupId ? extraRate['height'][sourceModule.shapetype] : 1.0;

               var widthRate = (sourceModule.startBox.width+box.moveX*extraWidthRate*config.width)/sourceModule.startBox.width;
               var heightRate = (sourceModule.startBox.height+box.moveY*extraHeightRate*config.height)/sourceModule.startBox.height;

               if(box.lockScale){
                   widthRate = heightRate = Math.min(widthRate,heightRate);
               }
               var rates = [];
               for(var i=0;i<proxys.length;i++){
                   rates[i] = calculateMaxMinRate(proxys[i]);
               }
               for(var i=0;i<rates.length;i++){
                   var rate = rates[i];
                   var maxRate = rate.max;
                   widthRate = Math.min(widthRate,maxRate.width);
                   heightRate = Math.min(heightRate,maxRate.height);
               }
               for(var i=0;i<rates.length;i++){
                   var rate = rates[i];
                   var minRate = rate.min;
                   widthRate = Math.max(widthRate,minRate.width);
                   heightRate = Math.max(heightRate,minRate.height);
               }
               return {
                   width: widthRate,
                   height:heightRate
               }
           }
           var setResizeConfig = function(module,direction){
               if(module.shapeGroupId){
                   //七巧板特殊处理
                   module.resizeConfig = angular.extend({},sevenrates[direction][module.shapetype]);
               }
               else{
                   module.resizeConfig = angular.extend({},defaultRates[direction]);
               }
           }
           return {
               start:function(direction){
                   var sevenGroup = [];
                   var pushSevenGroup = function(module){
                       if(module.shapeGroupId&&sevenGroup.indexOf(module.shapeGroupId)==-1){
                           sevenGroup.push(module.shapeGroupId);
                       }
                   }
                   var isSelectGroup = function(module){
                       return module.shapeGroupId&&sevenGroup.indexOf(module.shapeGroupId)!=-1;
                   }
                   var initAndAddtoProxy = function(module){
                       module.startBox=module.getBoxValue();
                       setResizeConfig(module,direction);
                       proxys.push(module);
                   }
                   var module = sourceModule;
                   if(module&&module.group){
                       module.startBox=module.getBoxValue();
                       initAndAddtoProxy(module);
                       pushSevenGroup(module);
                   }
                   else{
                       modules.each(function(m){
                           if(m.selected&& !m.group){
                               if(m.type == 'group'){
                                   for(var j=0;j< m.children.length;j++){
                                       m.children[j].startBox=m.children[j].getBoxValue();
                                       setResizeConfig( m.children[j],direction);
                                       pushSevenGroup( m.children[j]);
                                   }
                               }
                               initAndAddtoProxy(m);
                               pushSevenGroup(m);
                           }
                       });
                   }
                   if(sevenGroup.length>0){
                       modules.each(function(m){
                          if(isSelectGroup(m)&&proxys.indexOf(m)==-1){
                              initAndAddtoProxy(m);
                          }
                       });
                   }
               },
               change:function(box,_direction,_startModule){
                   if(firstHandle){
                        direction = _direction;
                        startModule = _startModule;
                        firstHandle = false;
                        this.start(direction);
                   }
                   var rate = calculateResizeBox(box);
                   for(var i=0;i<proxys.length;i++){
                       var proxy = proxys[i];
                       proxy.changeSize(rate);
                   }
                   for(var i=0;i<proxys.length;i++){
                       var proxy = proxys[i];
                       if(proxy.type == 'group') {
                           for (var j = 0; proxy.children && j < proxy.children.length; j++) {
                               var child = proxy.children[j];
                               modules.shrinkChild(child,rate);
                           }
                       }
                   }

               },
               finish:function(){
                   for(var i=0;i<proxys.length;i++){
                       if(proxys[i].group){
                           modules.resizeGroupSize(proxys[i].group);
                       }
                   }
                   firstHandle = true;
                   proxys = [];
                   direction = null;
               }
           }

       }
   }
});