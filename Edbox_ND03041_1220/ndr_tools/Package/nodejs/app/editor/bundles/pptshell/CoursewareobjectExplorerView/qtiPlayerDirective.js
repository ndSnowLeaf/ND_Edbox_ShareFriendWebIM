define(["jquery","espEnvironment","js-library!QtiPlayer"],function($,espEnvironment){function qtiPlayerDirective($timeout){function link($scope,element,attr){element.addClass("qti-player-wraper");var option={refPath:espEnvironment.referencePath},qtiplayer=QtiPlayer.createPlayer(option);qtiplayer.load($scope.href,function(){var renderOption={showTitleArea:!1,showHint:!1,showCorrectAnswer:!0,showTitleArea:!0,showAnswerArea:!0};qtiplayer.render(element,renderOption,function(){}),$timeout(function(){if(console.log(element.height(),element.parent().height()),element.height()>element.parent().height()){$('<a href="javascript:void(0)" class="show_all">显示全部</a>').appendTo(element.parent()).click(function(){$(this).remove(),element.parent().css("maxHeight","none")})}},500)})}return{restrict:"A",link:link,scope:{href:"@"}}}return qtiPlayerDirective.$inject=["$timeout"],qtiPlayerDirective});