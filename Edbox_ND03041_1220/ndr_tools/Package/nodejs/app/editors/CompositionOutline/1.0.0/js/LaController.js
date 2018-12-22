define([
    'jquery',
    'angular',
    './utils.js',
    './LaModule.js'
], function (jquery, angular, Utils, LaModule) {
    LaModule.controller('LaController', Controller);

    Controller.$inject = ['$scope', '$stage', '$filter', '$q', '$timeout', 'editor', 'module', 'stage', 'DataService'];

    function Controller($scope, $stage, $filter, $q, $timeout, editor, module, stage, DataService) {

        $stage.setStage(stage);

        // tab指令默认标签名的国际化
        var tabDefaultName = $filter('translate')('material');

        // 持久化checklist条目
        function persistCheckList() {
            var data = {
                'in_use_check_list': [],
                'reserve_check_list': []
            };
            for (var item in $scope.checkList) {
                // 过滤用户操作过程中可能出现的空条目
                if ($scope.checkList[item].text.trim() === "") {
                    break;
                }
                data['in_use_check_list'].push($scope.checkList[item].text);
            }
            for (item in $scope.reserveCheckList) {
                // 过滤用户操作过程中可能出现的空条目
                if ($scope.reserveCheckList[item].text.trim() === "") {
                    break;
                }
                data['reserve_check_list'].push($scope.reserveCheckList[item].text);
            }
            DataService.persistCheckListData(data);
        }

        $scope.textentryCount = function () {
            if (!$scope.promptHtmlEditor) return 5;
            var count = jquery($scope.promptHtmlEditor.ckeditor.element.$).find(".cke_textEntryInteraction").length;
            return count;
        };

        $scope.toggleCheckList = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            var $taget = jquery(event.target);
            var mark = $taget.attr('_mark');
            switch (mark) {
                case 'toggleReferenceExampleBtn':
                    $scope.isShowReferenceExample = !$scope.isShowReferenceExample;
                    if ($scope.isShowReferenceExample) {
                        $scope.isShowCheckList = $scope.isShowReserveCheckList = false;
                        $scope.$broadcast('showReferenceExample');
                    }
                    break;
                case 'toggleCheckListBtn':
                    $scope.isShowCheckList = !$scope.isShowCheckList;
                    if ($scope.isShowCheckList) {
                        $scope.isShowReferenceExample = false;
                    } else {
                        $scope.isShowReserveCheckList = false;
                    }
                    break;
            }
        };

        // 【作文文体编码】隐射【作文文体名字】
        var compositionStyle2FormName = {
            "0": "noLimits",
            "1": "narration",
            "2": "argumentation",
            "3": "expositoryWriting"
        };

        var lastStyle = -1, lastLevel = -1;
        // 切换文体
        $scope.toggleCompositionStyle = function (event) {
            var $taget = jquery(event.target);
            var mark = $taget.attr('_mark');
            switch (mark) {
                case 'radio_region_narration':// 记叙文
                    $scope.questionContent.compositionStyle = 1;
                    break;
                case 'radio_region_argumentation':// 议论文
                    $scope.questionContent.compositionStyle = 2;
                    break;
                case 'radio_region_expositoryWriting':// 说明文
                    $scope.questionContent.compositionStyle = 3;
                    break;
                case 'radio_region_no_limits':// 文体不限
                    $scope.questionContent.compositionStyle = 0;
                    break;
            }

            if ($scope.questionContent.compositionStyle !== 0) {
                $scope.isShowSpinner = false;
            }

            if (lastStyle !== $scope.questionContent.compositionStyle || lastLevel !== $scope.questionContent.outlineLevel) {
                $scope.$broadcast('resetMinderMapData', {
                    'compositionStyle': compositionStyle2FormName[$scope.questionContent.compositionStyle],
                    'level': 'level_' + $scope.questionContent.outlineLevel
                });
            }
            lastStyle = $scope.questionContent.compositionStyle;
            lastLevel = $scope.questionContent.outlineLevel;
        };

        // 切换提纲级别
        $scope.toggleOutlineLevel = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            var $taget = jquery(event.target);
            var mark = $taget.attr('_mark');
            switch (mark) {
                case 'radio_region_level1_outline':// 一级提纲
                    $scope.questionContent.outlineLevel = 1;
                    break;
                case 'radio_region_level2_outline':// 二级提纲
                    $scope.questionContent.outlineLevel = 2;
                    break;
            }
            if (lastStyle !== $scope.questionContent.compositionStyle || lastLevel !== $scope.questionContent.outlineLevel) {
                $scope.$broadcast('resetMinderMapData', {
                    'compositionStyle': compositionStyle2FormName[$scope.questionContent.compositionStyle],
                    'level': 'level_' + $scope.questionContent.outlineLevel
                });
            }
            lastStyle = $scope.questionContent.compositionStyle;
            lastLevel = $scope.questionContent.outlineLevel;

            // 关闭checklist弹窗
            $scope.isShowCheckList = false;
        };

        // 陈友东提供的【插入填空横线】指令需要的控制方法
        $scope.exec = function () {
            $scope.promptHtmlEditor.execCommand('textEntryInteraction');
        };

        // 作文素材指令对数据源操作
        $scope.assetsHandler = {
            tabIdxMgr: {
                getIndex: function () {
                    if ($scope.assets.idxInUseArray.length === 0) {
                        $scope.assets.idxInUseArray.push(1);
                        return 1;
                    }
                    if ($scope.assets.idxInUseArray.length === 1) {
                        if ($scope.assets.idxInUseArray[0] === 1) {
                            $scope.assets.idxInUseArray.push(2);
                            return 2;
                        } else {
                            $scope.assets.idxInUseArray.unshift(1);
                            return 1;
                        }
                    }
                    if ($scope.assets.idxInUseArray[0] !== 1) {
                        $scope.assets.idxInUseArray.unshift(1);
                        return $scope.assets.idxInUseArray[0];
                    }
                    // 查找数组是否连续
                    var i;
                    for (i = 1; i < $scope.assets.idxInUseArray.length; ++i) {
                        if ($scope.assets.idxInUseArray[i] - $scope.assets.idxInUseArray[i - 1] > 1) {
                            break;
                        }
                    }
                    if (i < $scope.assets.idxInUseArray.length) {
                        $scope.assets.idxInUseArray.splice(i, 0, $scope.assets.idxInUseArray[i - 1] + 1);
                    } else if (i === $scope.assets.idxInUseArray.length) {
                        $scope.assets.idxInUseArray.push($scope.assets.idxInUseArray[i - 1] + 1);
                    }
                    return $scope.assets.idxInUseArray[i];
                },
                removeIndex: function (idx) {
                    var result = jquery.inArray(idx, $scope.assets.idxInUseArray);
                    if (result !== -1) {
                        $scope.assets.idxInUseArray.splice(result, 1);
                    }
                }
            },
            addTab: function () {
                $timeout(function () {
                    if ($scope.assets.items.length > 0) {
                        $scope.assets.items[$scope.assets.lastEnabledItemIdx].isEnabled = false;
                    }
                    $scope.assets.items.push({
                        title: tabDefaultName,
                        content: '',
                        titleIdx: $scope.assetsHandler.tabIdxMgr.getIndex(),
                        isUnderEdit: false,
                        isEnabled: true
                    });
                    $scope.assets.lastEnabledItemIdx = $scope.assets.items.length - 1;

                    if ($scope.assets.items.length > $scope.assets.MAX_IN_ONE_PAGE) {
                        ++$scope.assets.startTabIndex;
                    }
                }, 0);
            },
            nextTab: function () {
                $timeout(function () {
                    if ($scope.assets.startTabIndex + $scope.assets.MAX_IN_ONE_PAGE < $scope.assets.items.length) {
                        ++$scope.assets.startTabIndex;
                    }
                }, 0);
            },
            preTab: function () {
                $timeout(function () {
                    if ($scope.assets.startTabIndex > 0) {
                        --$scope.assets.startTabIndex
                    }
                }, 0);
            },
            switchTab: function (idx) {
                if (isNaN(idx)) {
                    return;
                }
                idx = parseInt(idx);
                if (idx === $scope.assets.lastEnabledItemIdx) {
                    return;
                }
                $timeout(function () {
                    $scope.assets.items[$scope.assets.lastEnabledItemIdx].isEnabled = false;
                    $scope.assets.lastEnabledItemIdx = idx;
                    $scope.assets.items[idx].isEnabled = true;
                }, 0);
            },
            editTab: function (idx) {
                $timeout(function () {
                    $scope.assets.items[idx].isUnderEdit = true;
                    $scope.$broadcast('editTabCallBack', {
                        itemIdx: idx
                    });
                }, 0);
            },
            saveEditTab: function (data) {
                $timeout(function () {
                    $scope.assets.items[data.itemIdx].isUnderEdit = false;
                    if (data.saveText.trim() === '') {
                        return;
                    }
                    if ($scope.assets.items[data.itemIdx].title + $scope.assets.items[data.itemIdx].titleIdx !== data.saveText) {
                        // 进行标签名字修改数据的保存
                        $scope.assets.items[data.itemIdx].title = data.saveText;
                        $scope.assetsHandler.tabIdxMgr.removeIndex($scope.assets.items[data.itemIdx].titleIdx);
                        if ($scope.assets.items[data.itemIdx].titleIdx !== "") {
                            $scope.assets.items[data.itemIdx].titleIdx = "";
                        }
                    }
                }, 0);
            },
            deleteTab: function (idx) {
                if (isNaN(idx)) {
                    return;
                }
                idx = parseInt(idx);
                if (idx < 0 || idx >= $scope.assets.items.length) {
                    return;
                }
                $timeout(function () {
                    $scope.assetsHandler.tabIdxMgr.removeIndex($scope.assets.items[idx].titleIdx);
                    $scope.assets.items.splice(idx, 1);

                    if ($scope.assets.startTabIndex > 0) {
                        --$scope.assets.startTabIndex;
                    }
                    if ($scope.assets.items.length === 0) {
                        return;
                    }
                    if ($scope.assets.lastEnabledItemIdx === idx) {
                        $scope.assets.lastEnabledItemIdx = $scope.assets.items.length - 1;
                        $scope.assets.items[$scope.assets.lastEnabledItemIdx].isEnabled = true;
                    } else if ($scope.assets.lastEnabledItemIdx > idx) {
                        --$scope.assets.lastEnabledItemIdx;
                    }
                }, 0);
            },
            confirmDeleteTab: function () {
                if ($scope.waitDeleteTabIdx !== -1) {
                    this.deleteTab($scope.waitDeleteTabIdx);
                }
                $scope.isShowDeleteTabPrompt = false;
                $scope.waitDeleteTabIdx = -1;
                $scope.waitDeleteTabName = "";
            },
            setWaitDeleteTabName: function (idx) {
                $timeout(function () {
                    $scope.waitDeleteTabName = $scope.assets.items[idx].title + $scope.assets.items[idx].titleIdx;
                    $scope.isShowDeleteTabPrompt = true;
                }, 0);
            }
        };

        // 检查清单操作
        $scope.checkListHandler = {
            addItem: function () {
                $timeout(function () {
                    $scope.checkList.push({
                        text: '',
                        isUnderEditable: true
                    });
                    $scope.$broadcast('editItemCallBack', {
                        itemIdx: $scope.checkList.length - 1
                    });
                    persistCheckList();
                }, 0);
            },
            editItem: function (idx) {
                $timeout(function () {
                    $scope.checkList[idx].isUnderEditable = true;
                    $scope.$broadcast('editItemCallBack', {
                        itemIdx: idx
                    });
                    persistCheckList();
                }, 0);
            },
            deleteItem: function (idx) {
                $timeout(function () {
                    var itemDeleted = $scope.checkList.splice(parseInt(idx), 1);
                    if (itemDeleted && itemDeleted.length > 0) {
                        $scope.reserveCheckList.push(itemDeleted[0]);
                    }
                    // 备用清单去重
                    $scope.reserveCheckList = Utils.removeDuplicatedItem($scope.reserveCheckList);
                    persistCheckList();
                }, 0);
            },
            recoverItem: function (idx) {
                $timeout(function () {
                    var itemDeleted = $scope.reserveCheckList.splice(parseInt(idx), 1);
                    if (itemDeleted && itemDeleted.length > 0) {
                        $scope.checkList.push(itemDeleted[0]);
                    }
                    persistCheckList();
                    if ($scope.reserveCheckList.length === 0) {
                        $scope.isShowReserveCheckList = false;
                    }
                }, 0);
            },
            sortItem: function (beforeSortIdx, afterSortIdx) {
                $timeout(function () {
                    $scope.checkList.splice(afterSortIdx, 0, $scope.checkList.splice(beforeSortIdx, 1)[0]);
                    persistCheckList();
                }, 0);
            },
            saveEditItem: function (data) {
                $timeout(function () {
                    $scope.checkList[data.itemIdx].isUnderEditable = false;
                    if (data.saveText === '' && $scope.checkList[data.itemIdx].text === '') {
                        $scope.checkList.splice(parseInt(data.itemIdx), 1);
                        return;
                    }
                    if (data.saveText !== '') {
                        $scope.checkList[data.itemIdx].text = data.saveText;
                    }
                    persistCheckList();
                }, 0);
            }
        };

        // 隐藏检查清单弹窗
        $scope.$on('hideCheckList', function (event, data) {
            $timeout(function () {
                if (data.isHideRefExample) {
                    $scope.isShowReferenceExample = false;// 控制是否显示参考范例
                    $scope.isShowSpinner = false;// 隐藏下拉列表
                }
                $scope.isShowCheckList = false;// 控制是否显示检查清单
                $scope.isShowReserveCheckList = false;// 控制是否显示备用清单
            }, 0);
        });

        // 参考案例弹窗【提纲范例】、【作文范例】的切换
        $scope.$on('outline_case', function () {
            if ($scope.isShowOutlineCase) {
                return;
            }
            $timeout(function () {
                $scope.isShowOutlineCase = !$scope.isShowOutlineCase;
                if ($scope.isShowOutlineCase) {
                    $scope.isShowCompositionCase = false;
                    $scope.$broadcast('showOutlineCase');
                }
            }, 0);
        });
        $scope.$on('composition_case', function () {
            if ($scope.isShowCompositionCase) {
                return;
            }
            $timeout(function () {
                $scope.isShowCompositionCase = !$scope.isShowCompositionCase;
                if ($scope.isShowCompositionCase) {
                    $scope.isShowOutlineCase = false;
                    $scope.$broadcast('showCompositionCase');
                }
            }, 0);
        });

        // 检查清单指令消息监听
        $scope.$on('sortItem', function (event, data) {
            if (isNaN(data.beforeSortIdx) || isNaN(data.afterSortIdx)) {
                return;
            }
            $scope.checkListHandler.sortItem(data.beforeSortIdx, data.afterSortIdx);
        });
        $scope.$on('addItem', function () {
            $scope.checkListHandler.addItem();
        });
        $scope.$on('editItem', function (event, data) {
            $scope.checkListHandler.editItem(data.itemIdx);
        });
        $scope.$on('deleteItem', function (event, data) {
            $scope.checkListHandler.deleteItem(data.itemIdx);
        });
        $scope.$on('recoverItem', function (event, data) {
            $scope.checkListHandler.recoverItem(data.itemIdx);
        });
        $scope.$on('saveEditItem', function (event, data) {
            $scope.checkListHandler.saveEditItem(data);
        });
        $scope.$on('toggleReserveCheckList', function () {
            $timeout(function () {
                $scope.isShowReserveCheckList = !$scope.isShowReserveCheckList;
            }, 0);
        });
        $scope.$on('closeReserveCheckList', function () {
            $timeout(function () {
                $scope.isShowReserveCheckList = false;
            }, 0);
        });

        // 每次【思维导图指令】重新创建思维导图实例时发消息告知父作用域缓存【新创建的思维导图实例】
        $scope.$on('CreatedMinderMapInstance', function (event, data) {
            $scope.minderMapInstance = data.minderMapInstance;
        });

        // 参考素材指令消息监听
        $scope.$on('addNewAssetsTab', function () {
            $scope.assetsHandler.addTab();
        });
        $scope.$on('preTab', function () {
            $scope.assetsHandler.preTab();
        });
        $scope.$on('nextTab', function () {
            $scope.assetsHandler.nextTab();
        });
        $scope.$on('switchTab', function (event, data) {
            $scope.assetsHandler.switchTab(data.itemIdx);
        });
        $scope.$on('deleteTab', function (event, data) {
            $scope.waitDeleteTabIdx = data.itemIdx;
            $scope.assetsHandler.setWaitDeleteTabName(data.itemIdx);
        });
        $scope.$on('editTab', function (event, data) {
            $scope.assetsHandler.editTab(data.itemIdx);
        });
        $scope.$on('saveEditTab', function (event, data) {
            $scope.assetsHandler.saveEditTab(data);
        });
        $scope.$on('tabNameDuplication', function (event, data) {
            $scope.isShowTabNameDuplicationPrompt = true;
            tabNameDuplicationIdx = data.itemIdx;
        });
        var tabNameDuplicationIdx;
        $scope.tabNameDuplicationCb = function () {
            $scope.isShowTabNameDuplicationPrompt = false;
            $scope.$broadcast('tabNameDuplicationCb', {
                'itemIdx': tabNameDuplicationIdx
            });
        };

        /**
         * 前序遍历编辑器端思维导图数据并修正
         * @param src 思维导图原始节点数据
         * @param isAmendToStu true：修正成presenter端的思维导图格式
         *                     false：修正成编辑端的思维导图格式
         * @returns {*}
         */
        function traverse(src, isAmendToStu) {
            if (src.root) {
                if (isAmendToStu) {
                    if (src.root.children && src.root.children.length > 0) {
                        src.root.data.requireChildren = false;
                    } else {
                        src.root.data.requireChildren = true;
                    }
                    src.root.data.contentEditAble = false;
                    src.root.data.deleteAble = false;
                    src.root.data.moveAble = false;
                } else {
                    src.root.data.contentEditAble = true;
                    src.root.data.deleteAble = false;
                    src.root.data.moveAble = true;
                }
                traverse(src.root, isAmendToStu);
            }
            if (src.children && src.children.length > 0) {
                for (var i = 0; i < src.children.length; ++i) {
                    if (isAmendToStu) {
                        if (src.children[i].children && src.children[i].children.length > 0) {
                            src.children[i].data.requireChildren = false;
                        } else {
                            src.children[i].data.requireChildren = true;
                        }
                        src.children[i].data.contentEditAble = false;
                        src.children[i].data.deleteAble = false;
                        src.children[i].data.moveAble = false;
                    } else {
                        src.children[i].data.requireChildren = true;
                        src.children[i].data.contentEditAble = true;
                        src.children[i].data.deleteAble = true;
                        src.children[i].data.moveAble = true;
                    }
                    traverse(src.children[i], isAmendToStu);
                }
            }
            return src;
        }

        var Logic = {
            // 题型编辑器进入时的初始化流程
            init: function () {
                this.__initModel();
                this.__loadData();
            },
            // 初始化模型
            __initModel: function () {
                // 缓存待删除的tab下标
                $scope.waitDeleteTabIdx = -1;
                $scope.waitDeleteTabName = "";
                $scope.isShowTabUpLimitPrompt = false;
                $scope.isShowDeleteTabPrompt = false;
                $scope.isShowTabNameDuplicationPrompt = false;

                // 控制是否显示提纲范例
                $scope.isShowOutlineCase = true;
                // 控制是否显示作文范例
                $scope.isShowCompositionCase = false;
                // 控制是否显示参考范例
                $scope.isShowReferenceExample = false;
                // 控制是否显示检查清单
                $scope.isShowCheckList = false;
                // 控制是否显示备用清单
                $scope.isShowReserveCheckList = false;
                // 控制是否显示下拉列表
                $scope.isShowSpinner = false;

                // 缓存当前的检查清单条目
                $scope.checkList = [];

                // 缓存当前的备用清单条目
                $scope.reserveCheckList = [];

                $scope.questionContent = {
                    titleType: 1,// 作文标题类型：1-命题作文，2-自拟命题
                    title: '',// 作文标题：ckEditor返回值
                    requirements: '',//作文要求：ckEditor返回值
                    compositionStyle: -1,//作文文体：0-文体不限，1-记叙文，2-议论文，3-说明文；注：后续新增文体数字以此类推
                    outlineLevel: -1//提纲详略：1-一级提纲，2-二级提纲
                };

                // 作文素材指令所需的数据源
                $scope.assets = {
                    'lastEnabledItemIdx': 0,// 当前被激活的tab下标
                    'startTabIndex': 0,// 起始显示的tab下标
                    'idxInUseArray': [1, 2],// 缓存被占用的默认下标
                    'MAX_IN_ONE_PAGE': 4,// 指定显示多少个tab
                    'items': [// tab的数据源信息
                        {
                            title: tabDefaultName,
                            content: '',
                            titleIdx: 1,
                            isUnderEdit: false,
                            isEnabled: true
                        },
                        {
                            title: tabDefaultName,
                            content: '',
                            titleIdx: 2,
                            isUnderEdit: false,
                            isEnabled: false
                        }
                    ]
                };
            },
            // 模型数据初始化后加载模型数据
            __loadData: function () {
                var questions = module.getPropertyValue('QuestionContent');
                if (questions) {
                    // 再次编辑题目信息，从颗粒数据获取数据
                    this.readFromModule();
                } else {
                    // 新建题目（其他数据模型的默认值已经在__initModel里指定了）
                    DataService.deserializeCheckListData().then(function (checkList) {
                        if (checkList !== "") {
                            // 从本地读取【检查清单】条目
                            if (typeof checkList['in_use_check_list'] !== 'undefined') {
                                for (var i = 0; i < checkList['in_use_check_list'].length; ++i) {
                                    $scope.checkList.push({
                                        text: checkList['in_use_check_list'][i],
                                        isUnderEditable: false
                                    });
                                }
                            }
                            // 从本地读取【备用清单】条目
                            if (typeof checkList['reserve_check_list'] !== 'undefined') {
                                for (var i = 0; i < checkList['reserve_check_list'].length; ++i) {
                                    $scope.reserveCheckList.push({
                                        text: checkList['reserve_check_list'][i],
                                        isUnderEditable: false
                                    });
                                }
                            }
                        } else {
                            // 获取系统内置的checklist条目
                            var cL = DataService.getDefaultCheckListItems();
                            if (cL.length > 0) {
                                for (var i = 0; i < cL.length; ++i) {
                                    $scope.checkList.push({
                                        text: cL[i],
                                        isUnderEditable: false
                                    });
                                }
                            }
                        }
                    });
                }

                if ($scope.questionContent.compositionStyle === -1) {
                    $scope.questionContent.compositionStyle = 1;
                }

                if ($scope.questionContent.outlineLevel === -1) {
                    $scope.questionContent.outlineLevel = 1;
                }

                lastStyle = $scope.questionContent.compositionStyle;
                lastLevel = $scope.questionContent.outlineLevel;
            },
            /**
             * 数据模型写入颗粒数据
             */
            write2Module: function () {
                // 修正编辑端思维导图数据为学生端
                var studentMinderMapData = traverse($scope.minderMapInstance.getData(), true);

                // 待写入模型的颗粒数据
                var questionContent = {
                    titleType: $scope.questionContent.titleType,
                    title: $scope.questionContent.title,
                    requirements: $scope.questionContent.requirements,
                    compositionStyle: $scope.questionContent.compositionStyle,
                    outlineLevel: $scope.questionContent.outlineLevel,
                    outlineTemplate: studentMinderMapData,
                    assets: [],
                    checkList: [],
                    reserveCheckList: []
                };

                // 获取检查清单条目
                if ($scope.checkList && $scope.checkList.length) {
                    for (var i = 0; i < $scope.checkList.length; ++i) {
                        questionContent.checkList.push($scope.checkList[i].text);
                    }
                }

                // 获取备用清单条目
                if ($scope.reserveCheckList && $scope.reserveCheckList.length) {
                    for (var i = 0; i < $scope.reserveCheckList.length; ++i) {
                        questionContent.reserveCheckList.push($scope.reserveCheckList[i].text);
                    }
                }

                // 获取素材
                if ($scope.assets.items && $scope.assets.items.length) {
                    for (var i = 0; i < $scope.assets.items.length; ++i) {
                        questionContent.assets.push({
                            content: $scope.assets.items[i].content,
                            title: $scope.assets.items[i].title + $scope.assets.items[i].titleIdx,// 确保给颗粒的一定是包含下标，下标可能为""
                            titleNoIdx: $scope.assets.items[i].title,
                            titleIdx: $scope.assets.items[i].titleIdx
                        });
                    }
                }

                // 写入颗粒数据
                module.setPropertyValue("QuestionId", stage.coursewareobjectId);
                module.setPropertyValue("QuestionContent", questionContent);

                return true;
            },
            /**
             * 从颗粒数据读取数据模型
             */
            readFromModule: function () {
                // 获取颗粒题型数据
                var questionContent = module.getPropertyValue('QuestionContent');

                // 根据颗粒数据设置模型数据的值
                $scope.questionContent.titleType = questionContent.titleType;
                $scope.questionContent.title = questionContent.title;
                $scope.questionContent.requirements = questionContent.requirements;
                $scope.questionContent.compositionStyle = questionContent.compositionStyle;
                $scope.questionContent.outlineLevel = questionContent.outlineLevel;

                // 修正presenter思维导图数据为编辑端
                var editorMinderMapData = traverse(questionContent.outlineTemplate, false);

                // Cache用户提纲节点数据
                DataService.setUserMinderMapData({
                    compositionStyle: compositionStyle2FormName[questionContent.compositionStyle],
                    outlineLevel: 'level_' + questionContent.outlineLevel,
                    minderMapNodes: editorMinderMapData
                });

                // 广播通知【思维导图指令】初始化提纲详略下的思维导图节点数据
                $scope.$broadcast('resetMinderMapData', {
                    'compositionStyle': compositionStyle2FormName[$scope.questionContent.compositionStyle],
                    'level': 'level_' + $scope.questionContent.outlineLevel,
                    'data': questionContent.outlineTemplate
                });

                // 初始化检查清单条目
                if (questionContent.checkList) {
                    $scope.checkList.length = 0;
                    for (var i = 0; i < questionContent.checkList.length; ++i) {
                        $scope.checkList.push({
                            text: questionContent.checkList[i],
                            isUnderEditable: false
                        });
                    }
                }

                // 初始化备用检查清单条目
                if (questionContent.reserveCheckList) {
                    $scope.reserveCheckList.length = 0;
                    for (var i = 0; i < questionContent.reserveCheckList.length; ++i) {
                        $scope.reserveCheckList.push({
                            text: questionContent.reserveCheckList[i],
                            isUnderEditable: false
                        });
                    }
                }

                // 初始化作文素材
                if (questionContent.assets) {
                    $scope.assets.items.length = 0;
                    $scope.assets.idxInUseArray.length = 0;
                    for (var i = 0; i < questionContent.assets.length; ++i) {
                        // 初始化每个tab的默认下标
                        if (questionContent.assets[i].titleIdx !== "") {
                            $scope.assets.idxInUseArray.push(parseInt(questionContent.assets[i].titleIdx));
                        }
                        $scope.assets.items.push({
                            title: questionContent.assets[i].titleNoIdx,
                            content: questionContent.assets[i].content,
                            titleIdx: questionContent.assets[i].titleIdx,
                            isUnderEdit: false,
                            isEnabled: false
                        });
                    }
                    $scope.assets.idxInUseArray.sort();
                    if ($scope.assets.items.length > 0) {
                        $scope.assets.items[0].isEnabled = true;
                    }
                }
            },
            /**
             * 保存颗粒
             */
            save: function () {
                var dfd = jquery.Deferred();
                try {
                    var result = Logic.write2Module();
                    dfd.resolve(result);
                } catch (e) {
                    dfd.reject(e);
                }
                return dfd.promise();
            },
            /**
             * 对必要字段进行校验
             */
            verify: function () {
                // 校验命题作文下的作文标题
                if ($scope.questionContent.titleType === 1) {
                    if ($scope.userTitleForm.$invalid) {
                        if ($scope.userTitleForm.$error.required) {
                            return $filter('translate')('title.valid.tips.empty');
                        }
                        return $filter('translate')('title.valid.tips.maxLength');
                    }
                }
                // 校验作文要求不能为空
                if ($scope.userRequirementForm.$error.required) {
                    return $filter('translate')('requirements.valid.tips.empty');
                }
                return true;
            }
        };

        //初始化
        Logic.init();

        /**
         * 保存颗粒
         * @returns {*}
         */
        editor.save = function () {
            var verifyResult = Logic.verify();
            if (verifyResult === true) {
                // Cache用户最近保存的提纲节点数据
                DataService.setUserMinderMapData({
                    compositionStyle: compositionStyle2FormName[$scope.questionContent.compositionStyle],
                    outlineLevel: 'level_' + $scope.questionContent.outlineLevel,
                    minderMapNodes: $scope.minderMapInstance.getData()
                });
            }
            return verifyResult === true ? Logic.save() : verifyResult;
        };
    }
});