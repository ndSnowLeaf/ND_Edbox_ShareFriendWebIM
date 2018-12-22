define([
    'jquery',
    'angular',
    './../fc_stage.js'],function(jquery,angular){
    return function($scope){
        $scope.setEditor = function(editor){
            $scope.editor = editor;
            if($scope.module.newCreate){
                $scope.module.selected = true;
                $scope.editor.ckeditor.focus();
                $scope.module.newCreate = false;
            }
        }
        $scope.module.insertText = function(text){
            try{
                $scope.editor.ckeditor.insertText(text);
            } catch(ex){}

        }
        $scope.module.insertHtml = function(text){
            try{
                $scope.editor.ckeditor.insertHtml(text);
            }
            catch(ex){}
        }
        $scope.module.getEditor=function(){
            return $scope.editor ? $scope.editor.ckeditor : null;
        }
        $scope.cancelToolbar =function(){
            $scope.$emit("cancel_tool_bar");
        }

    }
});


