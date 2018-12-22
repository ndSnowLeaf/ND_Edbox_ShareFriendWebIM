define([
    'jquery',
    'angular','../utils.js', '../svg_helper.js'],function(jquery,angular,utils,svgHelper){

    var ShapeInterface = function(module,shapeDefinition){
        var shape = {
            init:function(module){
                this.module = module;
            },
            getTextStyle:function(){
                var width = this.module.getSize().width;
                var height = this.module.getSize().height;
                return this.generateTextStyle(width,height);
            },
            generateTextStyle:function(borderWidth,width,height){
                return "";
            }
        };
        shape.init(module);
        return angular.extend(shape,shapeDefinition);
    }
    return ShapeInterface;
});

