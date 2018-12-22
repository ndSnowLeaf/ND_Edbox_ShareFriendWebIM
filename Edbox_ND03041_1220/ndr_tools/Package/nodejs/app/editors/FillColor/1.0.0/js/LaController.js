define([
    'angular',
    './LaModule.js',
    './utils.js'
], function (angular, LaModule, Utils) {
    LaModule.controller('LaController', Controller);
    Controller.$inject = ['$scope', '$stage', '$filter', '$q', 'editor', 'module', 'stage', 'LaService'];

    /**
     * @param $scope
     * @param $stage
     * @param $filter 过滤器，如：国际化-$filter('translate')('key');
     * @param $q
     * @param editor
     * @param module
     * @param stage
     * @param LaService 颗粒服务对象 见LaServices.js
     * @constructor
     */
    function Controller($scope, $stage, $filter, $q, editor, module, stage, LaService) {
        //Step1. 设置舞台
        $stage.setStage(stage);

        //Step2.颗粒业务逻辑 声明
        var PromisesWhenSaving = [];
        var ModuleLogic = {
            /**
             * 初始化
             */
            init: function () {
                //初始化数据模型
                $scope.defaultTitle = $filter('translate')('color.default.title'); //默认标题
                $scope.model = {
                    time: {
                        type: 'sequence',
                        limit: 0
                    },
                    isDemoHidden: false
                };
                $scope.isShowBoard = false;
                //声明界面操作逻辑
                ModuleLogic.__defineScope();
                //加载初始数据
                ModuleLogic.__loadData();
            },

            /**
             * 保存颗粒
             * @returns {*}
             */
            save: function () {
                var result = ModuleLogic.validateModel();
                if (!result) {
                    ModuleLogic.writeModel();
                    /*
                    if (EditorUtils.IsNotEmptyArray(PromisesWhenSaving)) {
                        var defer = $.Deferred();
                        $q.all(PromisesWhenSaving).then(function () {
                            PromisesWhenSaving = [];
                            var result = ModuleLogic.writeModel();
                            defer.resolve(result);
                        });

                        return defer.promise();
                    } else {
                        return ModuleLogic.writeModel();
                    }
                    */
                }

                return result;
            },

            /**
             * 数据模型有效性验证
             * @returns {*} 返回值： 返回非空字符串，将会自动弹出对应的提示信息(返回值)
             */
            validateModel: function () {
              //题目标题不能为空
              if (!$scope.model.title) {
                return $filter('translate')('color.warning.empty.title') || 'color.warning.empty.title';
              }

              //题目标题不能超过60个字符（其中中文占2个字符）
              if (Utils.GetStrLen($scope.model.title) > 60) {
                return $filter('translate')('color.title.maxlength') || 'color.title.maxlength';
              }

              //填色图原始地址不能为空
              if (!$scope.model.pictureInfo||!$scope.model.pictureInfo.pictureLocation) {
                return $filter('translate')('color.warning.empty.picture') || 'color.warning.empty.picture';
              }

              //填色图名称不能为空
              if (!$scope.model.pictureInfo||!$scope.model.pictureInfo.title) {
                return $filter('translate')('color.warning.empty.resourceName') || 'color.warning.empty.resourceName';
              }

              return null;
            },

            /**
             * 写入数据模型
             */
            writeModel: function () {
                var $model = $scope.model;
                var questionContent = {
                  title: $model.title,
                  resourceName: $model.pictureInfo.title,
                  origineImage: $model.pictureInfo.pictureLocation,
                  expectedImage: $model.pictureInfo.previewLocation,
                  recommendColors: $model.pictureInfo.recommendedColor,
                  description: $model.pictureInfo.description,
                  copyright: $model.pictureInfo.copyright,
                  isDemoHidden: $model.isDemoHidden
                };
                module.setPropertyValue("QuestionId", stage.coursewareobjectId);
                module.setPropertyValue("TimerType", $model.time.type);
                module.setPropertyValue("TimeLimit", $model.time.limit);
                module.setPropertyValue("QuestionContent", questionContent);
            },

            /**
             * 读取数据模型：见writeModel，怎么写就怎么读
             */
            readModel: function () {
                var $model = $scope.model;

                $model.time.type = module.getPropertyValue("TimerType");
                $model.time.limit = module.getPropertyValue("TimeLimit");
                var questionContent = module.getPropertyValue('QuestionContent');
                $model.title = questionContent.title;
                $model.isDemoHidden = questionContent.isDemoHidden;
                $model.pictureInfo = {
                  title: questionContent.resourceName,
                  description: questionContent.description,
                  copyright: questionContent.copyright,
                  recommendedColor: questionContent.recommendColors,
                  pictureLocation: questionContent.origineImage,
                  previewLocation: questionContent.expectedImage
                };
            },
          /**
           * 加载初始数据
           * @private
           */
          __loadData: function () {
            var questionContent = module.getPropertyValue('QuestionContent');
            if (!questionContent) { //新建
              var $model = $scope.model;
              $model.title = $scope.defaultTitle;
            } else { //编辑
              this.readModel();
              $scope.isShowBoard = true;
            }
          },
          /**
           * 声明界面操作逻辑
           *   1. 本页面的交互模式管理定义（见InteractionModeManager）：VIEW:查看模式、ADD:添加模式、DELETE:删除模式
           *   2. 交互模式的对应操作集定义：ViewModeHandle、AddModeHandle、DeleteModeHandle
           *   3. 生字词列表操作集定义（见WordListManipulation）
           *   4. 重复字词覆盖弹窗操作集（见ReplaceConfirmPopup）
           *
           * @private
           */
          __defineScope: function () {
            var $model = $scope.model;
            //添加模式操作集
            $scope.AddModeHandle = {
              search: function () {
                stage.trigger('PictureSelector', {value: true});
              },
              //选择图片回调处理
              selectPictureCallback: function (pictureInfo) {
                $model.pictureInfo = pictureInfo;
                $scope.isShowBoard = true;
              },
              setDemoHidden: function () {
                if($model.isDemoHidden === false){
                  $model.isDemoHidden = true;
                }else {
                  $model.isDemoHidden = false;
                }
              }
            };
          }
        };

        //Step3. 重写颗粒数据保存接口
        editor.save = function () {
            var result = ModuleLogic.save();
            return !result ? true : result;
        };

        //Step4. 颗粒初始化
        ModuleLogic.init();
    }
});	