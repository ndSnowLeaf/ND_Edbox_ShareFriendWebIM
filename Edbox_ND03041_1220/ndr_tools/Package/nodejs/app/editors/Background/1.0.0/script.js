/**
 * Created by chenyoudong on 2015/12/30.
 */
define([
    'jquery',
    'angular',
    'css!./style.css'
],function(
    $,
    angular
){
    function TextModuleEditor(){
        var module, stage, config;
        this.init = function(m,s,c){
            module = m;
            stage = s;
            config = c;
        };
        this.initDefault = function(moduleWrap){
            moduleWrap.setPosition({top:0,left:0});
            moduleWrap.setSize({width:'100%',height:'100%'});
        };
        this.render = function(moduleWrap){
            var el = $('<div class="slides-module-background"></div>').appendTo(moduleWrap.getElement());
        };
    }
    return TextModuleEditor;
});