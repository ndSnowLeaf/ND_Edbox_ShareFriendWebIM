define([
    'jquery',
    'angular',
    '../utils.js',
    'text!./../../templates/picture-selector-tpl.html',
    '../directives/tm.pagination.js'
  ],
    function (jquery, angular, Utils, pictureSelectorTpl, pagination) {
        var LaModule = angular.module('LaModule');

        //章节选择面板
        LaModule.directive('pictureSelector', ['$stage', '$filter', 'LaService', function ($stage, $filter, LaService) {
            return {
                restrict: 'AE',
                template: pictureSelectorTpl,
                replace: true,
                scope: {
                    afterSelectPicture: '='
                },
                link: function ($scope, $element, attrs) {
                    var isLoaded = false,                 //章节数据加载标识
                        $model = {
                            isVisible: false,    //章节选择器可见标识
                            loadingMessage: $filter('translate')('color.message.pictures.loading'), //章节数据加载中提示信息
                            isLoading: false,    //章节数据加载中标识
                            currentItem: null,   //当前选中的章节
                            pictureList: [],
                            isShowPictureList: true,
                            isShowDetail: false,
                            popHeight:530
                        };
                    $scope.model = $model;

                    //配置分页基本参数
                    $scope.paginationConf = {
                      currentPage: 1,
                      itemsPerPage: 12,
                      totalItems: 13,
                      pagesLength: 2,
                      perPageOptions: [12, 16, 20, 24],
                      onChange:function () {
                        getPictureList('');
                      }
                    };

                    $scope.goBack = function () {
                      $model.isShowPictureList = true;
                      $model.isShowDetail = false;
                      $model.popHeight = 530;
                    };

                    $stage.getStage().on('PictureSelector', function (data) {
                      $model.isShowPictureList = true;
                      $model.isShowDetail = false;
                      $model.popHeight = 530;
                        if (!!data.value) {
                            $model.isVisible = true;
                            if (!isLoaded) {
                                isLoaded = true;

                                $model.loadingMessage = $filter('translate')('color.message.pictures.loading');
                                $model.isLoading = true;

                                //获取当前教材下的章节数据
                                getPictureList('');
                            }
                        } else {
                            $model.isVisible = false;
                        }
                    });
                    //获取当前教材下的章节数据
                    function getPictureList(key) {
                      LaService.getPictureList(key,$scope.paginationConf.currentPage).then(function (data) {
                        $model.pictureList = data;
                        $model.isLoading = false;
                      }, function () {
                        $model.isLoading = false;
                      });
                    }


                    //选择图片
                    $scope.selectPicture = function (event) {
                        var li = $(event.target).closest('li'),
                            index = li.attr('ng-index');
                        if (index != null && index != undefined) {
                            var item = $model.pictureList[index];
                            $model.currentItem = item;
                            $model.isShowPictureList = false;
                            $model.isShowDetail = true;
                            $model.popHeight = 900;
                            return item;
                        }
                    };

                    //确认选择填色图
                    $scope.confirmSelectPicture = function () {
                        $scope.afterSelectPicture && $scope.afterSelectPicture($model.currentItem);
                        $model.isVisible = false;
                    };

                    //退出弹窗
                    $scope.exit = function () {
                        $model.isVisible = false;
                    };

                }
            };
        }]);
    });

