define([
    'jquery',
    'angular',
    'text!./table_config.html',
    './../fc_stage.js'],function(jquery,angular,template){
    var module = angular.module("fcstage");
    module.directive('tableConfig',[function(){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            scope:{
                createTable:"&"
            },
            controller:['$scope','$rootScope','$document',function($scope,$rootScope,$document){
                $scope.config = {
                    columns: 3,
                    rows: 3,
                    width: 500,
                    height: 300,
                    titleconfig: '无',
                    alignconfig: '没有设置',
                    cellpadding: 1,
                    cellspacing:1,
                    border:1,
                    title:'',
                    abbr: '',
                    id:'',
                    dir:'没有设置',
                    style:'',
                    class:''
                }
                $scope.show = false;
                $rootScope.$on("showTableConfig",function(){
                    $scope.show = true;
                });
                $($document).on("click",function(event){
                   $scope.show = false;
                });
                $scope.preventClick = function($event){
                    $scope.showtitleconfig=false;
                    $scope.showdir=false;
                    $scope.showalignconfig=false;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                var isTh = function(row,column){
                    if(($scope.config.titleconfig =='第一行'||$scope.config.titleconfig =='第一行和第一列')&& row==0){
                        return true;
                    }
                    if(($scope.config.titleconfig =='第一列'||$scope.config.titleconfig =='第一行和第一列')&& column==0){
                        return true;
                    }
                    return false;
                }
                $scope.create = function(){
                    var table = $("<table></table>");
                    if($scope.config.id){
                        table.attr("id",$scope.config.id);
                    }
                    if($scope.config.dir!='没有设置'){
                        var dir = $scope.config.dir== '从左到右(LTR)' ? 'ltr':'rtl';
                        table.attr("dir",dir);
                    }
                    if($scope.config.style){
                        table.attr("style",$scope.config.style);
                    }
                    if($scope.config.class){
                        table.attr("class",$scope.config.class);
                    }
                    if($scope.config.width){
                        table.width($scope.config.width);
                    }
                    if($scope.config.height){
                        table.height($scope.config.height);
                    }
                    if($scope.config.alignconfig!='没有设置'){
                        var align = $scope.config.alignconfig == '左对齐' ? 'left':($scope.config.alignconfig == '右对齐' ?'right':'center');
                        table.attr("align",align);
                    }
                    if($scope.config.cellpadding){
                        table.attr("cellpadding",$scope.config.cellpadding);
                    }
                    if($scope.config.cellspacing){
                        table.attr("cellspacing",$scope.config.cellspacing);
                    }
                    if($scope.config.border){
                        table.attr("border",$scope.config.border);
                    }
                    if($scope.config.abbr){
                        table.attr("summary",$scope.config.abbr);
                    }
                    if($scope.config.title){
                        $("<caption></caption>").html($scope.config.title).appendTo(table);
                    }
                    var thead = $("<thead></thead>");
                    var tbody = $("<tbody></tbody>").appendTo(table);
                    for(var i=0;i<$scope.config.rows;i++){
                        var tr = $("<tr></tr>")
                        if(i==0&&isTh(i,2)){
                            thead.appendTo(table);
                            tr.appendTo(thead);
                        }
                        else{
                            tr.appendTo(tbody);
                        }
                        for(var j=0;j<$scope.config.columns;j++){
                            var cell = isTh(i,j) ? $("<th></th>") : $("<td></td>");
                            cell.appendTo(tr);
                        }
                    }

                    var html = $("<div></div>").append(table).html();
                    $scope.show = false;
                    $scope.createTable({html:html,width:$scope.config.width,height:$scope.config.height});
                }
                $scope.cancel = function(){
                    $scope.show = false;
                };
                $scope.setOther=function(value){
                    $scope.other = value;
                }
                $scope.setTitleConfigShow = function($event,value){
                    $scope.showtitleconfig=value;
                    $event.preventDefault();
                    $event.stopPropagation();
                };
                $scope.setAlignConfigShow = function($event,value){
                    $scope.showalignconfig=value;
                    $event.preventDefault();
                    $event.stopPropagation();
                };

                $scope.setAlignConfig=function($event,value){
                    $scope.showalignconfig=false;
                    $scope.config.alignconfig = value;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                $scope.setDirShow = function($event,value){
                    $scope.showdir=value;
                    $event.preventDefault();
                    $event.stopPropagation();
                };

                $scope.setDir=function($event,value){
                    $scope.showdir=false;
                    $scope.config.dir = value;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                $scope.setTitleConfig=function($event,value){
                    $scope.showtitleconfig=false;
                    $scope.config.titleconfig = value;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
            }],
            link:function($scope, $element, $attr, slidesEditable){

            }
        };
    }]);
});

