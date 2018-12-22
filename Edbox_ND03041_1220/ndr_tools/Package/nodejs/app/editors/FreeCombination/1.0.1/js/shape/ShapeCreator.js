define([
    'jquery',
    'angular','../utils.js','./ShapeInterface.js','snap','strformat','../lib/ShapeBuilder.js'],function(jquery,angular,utils,ShapeInterface,snap,strformat){

        var transfer = function(points,width,height,template){
            var standardWidth = template.width || 500;
            var standardHeight = template.height || 500;
            var target = [];
            for(var i=0;i<points.length;i++){
                var rate = i%2 ==0 ? width/standardWidth : height/standardHeight;
                target[i] = points[i]*rate;
            }
            return target;
        }
        var getShapeDefinition = function(type){
              return {
                  generateTextStyle:function(width,height){
                      var template = utils.findTemplate(type);

                      if(template.disable_text){
                          return {};
                      }
                      var style = angular.copy(template.text_style);
                      var points =  transfer(template.text_style_points,width,height,template);
                      for(var key in style){
                          if(style[key]){
                              var value =  strformat(style[key],points);
                              style[key] = value;
                          }
                      }
                      return style;
                  }
              }

          };
          return {
              create : function(module,type){
                  var shapeDefinition = getShapeDefinition(type);
                  module.template = utils.findTemplate(type);
                  return ShapeInterface(module,shapeDefinition);
              }
          }
    }
);
