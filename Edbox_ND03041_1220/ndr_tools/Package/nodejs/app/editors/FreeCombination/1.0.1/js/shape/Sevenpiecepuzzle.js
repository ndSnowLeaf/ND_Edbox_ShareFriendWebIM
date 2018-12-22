define([
        'jquery',
        'angular','../utils.js','../lib/ShapeBuilder.js','./ShapeCreator.js'],function(jquery,angular,utils,ShapeBuilder,ShapeCreator){

        var prepareForShape = function(seq,options){
            var top = options.top;
            var left =options.left;
            var width = options.width;
            var height = options.height;
            var shapetype = getShapeType(seq);
            if(seq == 1){
                return angular.extend({},options,{top:top,left:left,width:width/2,height:height,shapetype:shapetype,data:{"edgeColor": "#385d8a", "fillColor": "#008001"}});
            }
            if(seq == 2){
                return angular.extend({},options,{top:top,left:left,width:width,height:height/2,shapetype:shapetype,data:{"edgeColor": "#385d8a", "fillColor": "#0000FE"}});
            }
            if(seq == 3){
                return angular.extend({},options,{top:top+height*3/4,left:left,width:width*3/4,height:height/4,shapetype:shapetype,data:{"edgeColor": "#385d8a", "fillColor": "#FF0080"}});
            }
            if(seq == 4){
                return angular.extend({},options,{top:top+height/2,left:left+width/4,width:width/2,height:height/4,shapetype:shapetype,data:{"edgeColor": "#385d8a", "fillColor": "#00FF01"}});
            }
            if(seq == 5){
                return angular.extend({},options,{top:top+height/4,left:left+width/2,width:width/2,height:height/2,shapetype:shapetype,data:{"edgeColor": "#385d8a", "fillColor": "#FF8041"}});
            }
            if(seq == 6){
                return angular.extend({},options,{top:top,left:left+width*3/4,width:width/4,height:height/2,shapetype:shapetype,data:{"edgeColor": "#385d8a", "fillColor": "#804000"}});
            }
            if(seq == 7){
                return angular.extend({},options,{top:top+height/2,left:left+width/2,width:width/2,height:height/2,shapetype:shapetype,data:{"edgeColor": "#385d8a", "fillColor": "#FFFF81"}});
            }
        }
        var createModule = function(original,seq,Module){
            var base = {};
            var options = prepareForShape(seq,original);
            var shape = ShapeCreator.create(base,options.shapetype);
            base.shape = shape;
            return angular.extend(base,Module,options);
        }
        var getShapeType =function(seq){
            //return seq == 1 ? 'rectangle':'triangle';
            return 'sevenpiece_sub'+seq;
        }
        return {
            create : function(options,Module){
                var size = Math.max(options.width,options.height);
                if(size%4!=0){
                    size = size+(4-size%4);
                }
                options.height = options.width = size;
                var maxCount = 7;
                var shapeGroupId = "Shape_"+new Date().getTime();
                var modules = [];
                for(var i=1;i<=maxCount;i++){
                    var module = createModule(options,i,Module);
                    module.shapeGroupId = shapeGroupId;
                    modules.push(module);
                }
                return modules;
            },
            getSize:function(width,seq){
                if( seq==2){
                    return width;
                }
                if(seq == 3){
                    return width*4/3;
                }
                if(seq == 1 ||seq==4||seq==5||seq==7){
                    return width*2;
                }
                if(seq==6){
                    return width*4;
                }
            },
            getSizeByHeight:function(height,seq){
                if(seq == 1){
                    return height;
                }
                if(seq == 2){
                    return height*2;
                }
                if(seq == 3){
                    return height*4;
                }
                if(seq == 4){
                    return height*4;
                }
                if(seq == 5){
                    return height*2;
                }
                if(seq == 6){
                    return height*2;
                }
                if(seq == 7){
                    return height*2;
                }
            },
            getBasePosition:function(top,left,size,seq){
                if(seq == 1||seq==2){
                    return {top:top,left:left};
                }
                if(seq == 3){
                    return {top: top-size*3/4,left:left};
                }
                if(seq == 4){
                    return {top: top-size/2,left:left-size/4};
                }
                if(seq == 5){
                    return {top: top-size/4,left:left-size/2};
                }
                if(seq == 6){
                    return {top: top,left:left-size*3/4};
                }
                if(seq == 7){
                    return {top: top-size/2,left:left-size/2};
                }
            },
            getPosition:function(base,size,seq){
                var top = base.top;
                var left = base.left;
                if(seq == 1||seq==2){
                    return {top:top,left:left};
                }
                if(seq == 3){
                    return {top: top+size*3/4,left:left};
                }
                if(seq == 4){
                    return {top: top+size/2,left:left+size/4};
                }
                if(seq == 5){
                    return {top: top+size/4,left:left+size/2};
                }
                if(seq == 6){
                    return {top: top,left:left+size*3/4};
                }
                if(seq == 7){
                    return {top: top+size/2,left:left+size/2};
                }
            },
            getBox:function(box,seq){
                return prepareForShape(seq,box);
            },
            getSequence:function(type){
                var seq = parseInt(type.substring('sevenpiece_sub'.length));
                return seq;
            },
            getShapeRate:function(seq,top,left){
                if(seq == 1){
                    if(top==0&&left==0){
                        return {top:0,left:0,right:1,bottom:1};
                    }else if(top==1&&left==0){
                        return {top:1,left:0,right:1,bottom:0};
                    }
                    else if(top==0&&left==1){
                        return {top:0,left:2,right:2,bottom:1};
                    }
                    else if(top==1&&left==1){
                        return {top:1,left:2,right:2,bottom:0};
                    }
                }
                if(seq==2){
                    if(top==0&&left==0){
                        return {top:0,left:0,right:1,bottom:1};
                    }else if(top==1&&left==0){
                        return {top:2,left:0,right:1,bottom:2};
                    }
                    else if(top==0&&left==1){
                        return {top:0,left:1,right:0,bottom:1};
                    }
                    else if(top==1&&left==1){
                        return {top:2,left:1,right:0,bottom:2};
                    }
                }
                if(seq == 3){
                    if(top==0&&left==0){
                        return {top:4/3,left:0,right:1,bottom:4};
                    }else if(top==1&&left==0){
                        return {top:1,left:0,right:1,bottom:0};
                    }
                    else if(top==0&&left==1){
                        return {top:4/3,left:4/3,right:4,bottom:4};
                    }
                    else if(top==1&&left==1){
                        return {top:1,left:4/3,right:4,bottom:0};
                    }
                }
                if(seq == 4){
                    if(top==0&&left==0){
                        return {top:2,left:4,right:4/3,bottom:2};
                    }else if(top==1&&left==0){
                        return {top:4/3,left:4,right:4/3,bottom:4};
                    }
                    else if(top==0&&left==1){
                        return {top:2,left:4/3,right:4,bottom:2};
                    }
                    else if(top==1&&left==1){
                        return {top:4/3,left:4/3,right:4,bottom:4};
                    }
                }
                if(seq == 5){
                    if(top==0&&left==0){
                        return {top:4,left:2,right:2,bottom:4/3};
                    }else if(top==1&&left==0){
                        return {top:4/3,left:2,right:2,bottom:4};
                    }
                    else if(top==0&&left==1){
                        return {top:4,left:1,right:0,bottom:4/3};
                    }
                    else if(top==1&&left==1){
                        return {top:4/3,left:1,right:0,bottom:4};
                    }
                }
                if(seq == 6){
                    if(top==0&&left==0){
                        return {top:0,left:4/3,right:4,bottom:1};
                    }else if(top==1&&left==0){
                        return {top:2,left:4/3,right:4,bottom:2};
                    }
                    else if(top==0&&left==1){
                        return {top:0,left:1,right:0,bottom:1};
                    }
                    else if(top==1&&left==1){
                        return {top:2,left:1,right:0,bottom:2};
                    }
                }
                if(seq == 7){
                    if(top==0&&left==0){
                        return {top:2,left:2,right:2,bottom:2};
                    }else if(top==1&&left==0){
                        return {top:1,left:2,right:2,bottom:0};
                    }
                    else if(top==0&&left==1){
                        return {top:2,left:1,right:0,bottom:2};
                    }
                    else if(top==1&&left==1){
                        return {top:1,left:1,right:0,bottom:0};
                    }
                }
            }


        }
    }
);
