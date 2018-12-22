define([], function () {
var templates = {};

templates["chapter-selector.html"] = "<div class=\"ChineseCharacterDictation_big_pop\" ng-show=\"model.isVisible\">\n" +
   "    <div class=\"ChineseCharacterDictation_pop_bg\">\n" +
   "\n" +
   "        <!-- 弹窗内容区 -->\n" +
   "        <div class=\"ChineseCharacterDictation_pop_main\" >\n" +
   "\n" +
   "            <div class=\"ChineseCharacterDictation_pop_main_hd\">\n" +
   "                <span class=\"ChineseCd_txt\" ng-bind=\"model.currentItem.title\"></span>\n" +
   "            </div>\n" +
   "\n" +
   "            <div class=\"ChineseCharacterDictation_pop_main_bd\">\n" +
   "                <div class=\"ChineseCd_tabs\" ng-class=\"{'tabs_3': model.currentLevel > 2}\" ng-click=\"onClickTab($event);\">\n" +
   "                    <!-- 3个标题的时候 ChineseCd_tabs 加类名 tabs_3 , ChineseCd_tabs_progress当前添加on 完成添加 ok 默认为 2个tab的情况 宽度 是各50% 有几个tabs就设置宽度为 百分比的分数 -->\n" +
   "                    <div class=\"ChineseCd_tabs_progress ok\" data-tab-level=\"1\">\n" +
   "                        <div class=\"tabs_progress_bg\">\n" +
   "                            <span class=\"ChineseCd_txt\" translate=\"dictation.chapter.select\"></span>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                    <div class=\"ChineseCd_tabs_progress\" data-tab-level=\"2\" ng-class=\"{'on': model.currentLevel > 1}\">\n" +
   "                        <div class=\"tabs_progress_bg\">\n" +
   "                            <span class=\"ChineseCd_txt\" translate=\"dictation.section.select\"></span>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                    <div class=\"ChineseCd_tabs_progress on\" data-tab-level=\"3\" ng-show=\"model.currentLevel > 2\">\n" +
   "                        <div class=\"tabs_progress_bg\">\n" +
   "                            <span class=\"ChineseCd_txt\" translate=\"dictation.n.section.select\"></span>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "                <div class=\"ChineseCd_tabs_area\">\n" +
   "                    <div class=\"ChineseCd_tabs_area_ul_box\" ng-style=\"model.chapterTreeStyle\">\n" +
   "                        <div class=\"ChineseCd_tabs_area_ul_list _list_1\">\n" +
   "                            <ul class=\"tabs_area_box\" ng-click=\"selectChapter($event, 1);\">\n" +
   "                                <!-- 勾选中 tabs_area_list 添加类名 on -->\n" +
   "                                <li class=\"tabs_area_list\" ng-class=\"{'list_go_on': item.children.length > 0}\" ng-repeat=\"item in model.chapterTree[0] track by $index\" ng-index=\"{{$index}}\">\n" +
   "                                    <span class=\"ChineseCd_txt\" ng-bind=\"item.title\"></span>\n" +
   "                                </li>\n" +
   "                            </ul>\n" +
   "                        </div><div class=\"ChineseCd_tabs_area_ul_list _list_2\">\n" +
   "                            <ul class=\"tabs_area_box\" ng-click=\"selectChapter($event, 2);\">\n" +
   "                                <!-- 勾选中 tabs_area_list 添加类名 on -->\n" +
   "                                <li class=\"tabs_area_list\" ng-class=\"{'list_go_on': item.children.length > 0}\" ng-repeat=\"item in model.chapterTree[1] track by $index\" ng-index=\"{{$index}}\">\n" +
   "                                    <span class=\"ChineseCd_txt\" ng-bind=\"item.title\"></span>\n" +
   "                                </li>\n" +
   "                            </ul>\n" +
   "                        </div><div class=\"ChineseCd_tabs_area_ul_list _list_3\">\n" +
   "                            <ul class=\"tabs_area_box\" ng-click=\"selectChapter($event, 3);\">\n" +
   "                                <!-- 勾选中 tabs_area_list 添加类名 on -->\n" +
   "                                <li class=\"tabs_area_list\" ng-class=\"{'list_go_on': item.children.length > 0}\" ng-repeat=\"item in model.chapterTree[2] track by $index\" ng-index=\"{{$index}}\">\n" +
   "                                    <span class=\"ChineseCd_txt\" ng-bind=\"item.title\"></span>\n" +
   "                                </li>\n" +
   "                            </ul>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "\n" +
   "            <div class=\"ChineseCharacterDictation_pop_main_ft\" ng-show=\"!model.isLoading\">\n" +
   "                <a class=\"ChineseCd_light_btn\" href=\"javascript:;\" ng-show=\"model.currentLevel > 1\" ng-click=\"prevStep();\">\n" +
   "                    <span class=\"ChineseCd_light_btn_txt \" translate=\"dictation.btn.step.prev\"></span>\n" +
   "                </a>\n" +
   "                <a class=\"ChineseCd_light_btn btn_high_light\" href=\"javascript:;\" ng-class=\"{'click_disabled': model.isDisabled}\" ng-click=\"beginAdd();\">\n" +
   "                    <span class=\"ChineseCd_light_btn_txt\" translate=\"dictation.btn.add.begin\"></span>\n" +
   "                </a>\n" +
   "            </div>\n" +
   "\n" +
   "            <nd-loader message=\"model.loadingMessage\" ng-show=\"model.isLoading\"></nd-loader>\n" +
   "        </div>\n" +
   "        <!-- /弹窗内容区 -->\n" +
   "\n" +
   "        <!-- 右边关闭按钮 -->\n" +
   "        <a href=\"###\" class=\"comui_btn_close comui_btn_rb\" ng-click=\"exit();\"><span></span></a>\n" +
   "        <!-- /右边关闭按钮 -->\n" +
   "\n" +
   "        <!-- 左边关闭按钮 -->\n" +
   "        <a href=\"###\" class=\"stati_com_btn_close stati_com_btn_lb stati_com_btn_hide\" ng-click=\"exit();\"><span></span><!-- 下面的span做点击背景的预加载 --><span class=\"preload_btn_close_pic1\"></span><span class=\"preload_btn_close_pic2\"></span></a>\n" +
   "        <!-- /左边关闭按钮 -->\n" +
   "    </div>\n" +
   "</div>";

templates["confirm-popup-main.html"] = "<div class=\"ChineseCharacterDictation_pop_add for_text\">\n" +
   "    <div class=\"ChineseCharacterDictation_pop_add_bg \">\n" +
   "        <div class=\"ChineseCharacterDictation_pop_add_bg_papper \">\n" +
   "            <!-- 弹窗内容区 -->\n" +
   "            <div class=\"ChineseCharacterDictation_pop_add_main\">\n" +
   "                <div class=\"ChineseCharacterDictation_pop_txt_main_bd\">\n" +
   "                    <span class=\"ChineseCd_txt_main\" ng-bind=\"messageDynamic\"></span>\n" +
   "                    <span class=\"ChineseCd_txt_tip\" ng-bind=\"messageStatic\"></span>\n" +
   "                </div>                                        \n" +
   "                <div class=\"ChineseCharacterDictation_pop_main_ft\">\n" +
   "                    <!-- 按钮不可点击添加类名 .click_disabled -->\n" +
   "                    <a class=\"ChineseCd_light_btn\" href=\"javascript:;\" ng-click=\"ok();\">    \n" +
   "                        <span class=\"ChineseCd_light_btn_txt\" ng-bind=\"btnOkName\"></span>\n" +
   "                    </a>\n" +
   "                    <a class=\"ChineseCd_light_btn\" href=\"javascript:;\" ng-click=\"cancel();\">    \n" +
   "                        <span class=\"ChineseCd_light_btn_txt\" ng-bind=\"btnCancelName\"></span>\n" +
   "                    </a>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <!-- /弹窗内容区 -->\n" +
   "        </div>\n" +
   "    </div>    \n" +
   "</div>";

templates["confirm-popup.html"] = "<div class=\"ChineseCharacterDictation_tips_pop_wrapper \">\n" +
   "    <div class=\"ChineseCd_tips_pop_bg\">\n" +
   "\n" +
   "        <div class=\"ChineseCd_tips_pop_bd \">\n" +
   "            <span class=\"ft_tips_txt\" ng-bind=\"message\"></span>\n" +
   "        </div>\n" +
   "        <div class=\"ChineseCd_tips_pop_ft\">\n" +
   "            <a class=\"ChineseCd_block_btn btn_high_light \" href=\"javascript:;\" ng-click=\"ok();\">\n" +
   "                <span class=\"ChineseCd_block_btn_txt\" ng-bind=\"btnOkName\"></span>\n" +
   "            </a>\n" +
   "            <a class=\"ChineseCd_block_btn \" href=\"javascript:;\" ng-click=\"cancel();\">\n" +
   "                <span class=\"ChineseCd_block_btn_txt\" ng-bind=\"btnCancelName\"></span>\n" +
   "            </a>\n" +
   "        </div>\n" +
   "\n" +
   "    </div>\n" +
   "</div>\n" +
   "";

templates["container.html"] = "<div class=\"exam_wood freecombination ui_dev_layout\">\n" +
   "    <div class=\"com_layout com_layout_large\">\n" +
   "        <div class=\"com_lay_main ChineseCharacterDictation_wrapper\">\n" +
   "            <div class=\"com_lay_header\">\n" +
   "                <time-box model=\"model.time\"></time-box>\n" +
   "                <div class=\"ui_layout_operationTips\" style=\"display: none;\">\n" +
   "                    <a class=\"nes_btn_pt nes_help\" href=\"javascript:\" translate=\"dictation.label.help\"></a>\n" +
   "                    <a class=\"nes_btn_pt nes_example ui_has_bf_line\" href=\"javascript:\" translate=\"dictation.label.sample\"></a>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <div class=\"com_lay_contain\">\n" +
   "                <div class=\"com_lay_mboard\">\n" +
   "                    <div class=\"com_lay_boardtit\">\n" +
   "                        <h2 class=\"com_u_boardtit\">\n" +
   "                            <!--<p class=\"tit\" contenteditable=\"true\">{{model.title}}</p><!--此处建议使用p标签配合contenteditable属性的形式，也可换成input-->\n" +
   "                            <textarea title-box class=\"tit\" maxlength=\"70\" ng-model=\"model.title\"></textarea>\n" +
   "                        </h2>\n" +
   "                    </div>\n" +
   "                    <div class=\"com_lay_board\" onselectstart=\"return false;\">\n" +
   "                        <nd-loader message=\"pageLoadingMessage\" ng-show=\"isPageLoading\"></nd-loader>\n" +
   "                        <div class=\"ChineseCharacterDictation_content\">\n" +
   "                            <div class=\"ChineseCd_content_bd\">\n" +
   "                                <div class=\"ChineseCd_content_bd_title\">\n" +
   "                                    <span class=\"ChineseCd_txt\" ng-if=\"interactiveMode != INTERACTIVE_MODE.ADD\">\n" +
   "                                        <label translate=\"dictation.panel.chapter.name\" translate-values=\"{chapter_name: model.chapter_name}\"></label>\n" +
   "                                        <label translate=\"dictation.label.word.dictate\"></label>\n" +
   "                                        <label translate=\"dictation.label.word.added\" translate-values=\"{amount: wordsAmountDisplay}\"></label>\n" +
   "                                    </span>\n" +
   "                                    <span class=\"ChineseCd_txt\" ng-if=\"interactiveMode === INTERACTIVE_MODE.ADD\">\n" +
   "                                        <label translate=\"dictation.panel.chapter.name\" translate-values=\"{chapter_name: AddModeHandle.chapter_name}\"></label>\n" +
   "                                        <label translate=\"dictation.label.word.dictate\"></label>\n" +
   "                                        <label translate=\"dictation.label.word.selected\" translate-values=\"{amount: wordAmountSelectedDisplay}\"></label>\n" +
   "                                    </span>\n" +
   "                                </div>\n" +
   "                                <ul class=\"ChineseCd_content_bd_main\" ng-click=\"ViewModeHandle.view($event);\" ng-show=\"interactiveMode != INTERACTIVE_MODE.ADD\"\n" +
   "                                    ng-class=\"{'ChineseCharacterDictation_scrollbar':interactiveMode === INTERACTIVE_MODE.DELETE}\">\n" +
   "                                    <li class=\"ChineseCd_items_list\" ng-repeat=\"word in model.words track by $index\" ng-index=\"{{$index}}\">\n" +
   "                                        <div class=\"ChineseCd_items_list_bd\">\n" +
   "                                            <div class=\"list_bd_txt_box\">\n" +
   "                                                <!-- list_bd_txt单字的时候的时候添加类名 fz_30 来放大字号 -->\n" +
   "                                                <span class=\"list_bd_txt\" ng-bind=\"word.text\" ng-class=\"{'fz_30': word.text.length === 1}\"></span>\n" +
   "                                            </div>\n" +
   "                                            <a href=\"javascript:;\" class=\"list_bd_delete\" ng-class=\"{'hide_dom': interactiveMode != INTERACTIVE_MODE.DELETE}\"></a>\n" +
   "                                        </div>\n" +
   "                                    </li>\n" +
   "                                </ul>\n" +
   "                                <ul class=\"ChineseCd_content_bd_main ChineseCharacterDictation_scrollbar\" ng-click=\"AddModeHandle.select($event);\" ng-if=\"interactiveMode === INTERACTIVE_MODE.ADD\">\n" +
   "                                    <li class=\"ChineseCd_items_list\" ng-repeat=\"word in AddModeHandle.wordsSearched track by $index\" ng-index=\"{{$index}}\">\n" +
   "                                        <div class=\"ChineseCd_items_list_bd\">\n" +
   "                                            <div class=\"list_bd_txt_box\">\n" +
   "                                                <!-- list_bd_txt单字的时候的时候添加类名 fz_30 来放大字号 -->\n" +
   "                                                <span class=\"list_bd_txt\" ng-bind=\"word.text\" ng-class=\"{'fz_30': word.text.length === 1}\"></span>\n" +
   "                                            </div>\n" +
   "                                            <!-- 选中状态 .list_bd_select 添加类名 .on -->\n" +
   "                                            <a href=\"javascript:;\" class=\"list_bd_select\" ng-class=\"{'on': word.selected}\"></a>\n" +
   "                                        </div>\n" +
   "                                    </li>\n" +
   "                                </ul>\n" +
   "                            </div>\n" +
   "                            <div class=\"ChineseCd_content_ft\">\n" +
   "                                <div class=\"ChineseCd_ft_txt_tips\" ng-show=\"model.words.length > 30\">\n" +
   "                                    <span class=\"ft_tips_txt\" translate=\"dictation.label.tip\"></span><span class=\"ft_tips_txt\" translate=\"dictation.warning.maximum\"></span>\n" +
   "                                </div>\n" +
   "                                <div class=\"ChineseCd_ft_btns_nor\" ng-show=\"interactiveMode === INTERACTIVE_MODE.VIEW\">\n" +
   "                                    <div class=\"com_u_btn_has_pop\">\n" +
   "                                        <!--按钮不可点击添加类名 .com_s_disabled ,自定义配置图标类名 例如 iconleft是固定的 icon_add 表示是加号私有图标-->\n" +
   "                                        <a href=\"###\" class=\"com_u_btn4\" ng-click=\"AddModeHandle.enter();\" ng-class=\"{'com_s_disabled':isPageLoading || ViewModeHandle.isAddDisable}\">\n" +
   "                                            <i class=\"iconleft icons_add\"></i><span class=\"com_s_txt\" translate=\"dictation.btn.word.add\"></span>\n" +
   "                                        </a>\n" +
   "                                        <div class=\"btns_toolpop\" ng-show=\"addWordToolPopFlag\">\n" +
   "                                            <div class=\"btns_foot_box\">\n" +
   "                                                <a href=\"###\" class=\"com_u_btn4 \" ng-click=\"AddModeHandle.create();\"><span class=\"com_s_txt\" translate=\"dictation.btn.word.create\"></span></a>\n" +
   "                                                <a href=\"###\" class=\"com_u_btn4 \" ng-click=\"AddModeHandle.search();\"><span class=\"com_s_txt\" translate=\"dictation.btn.word.search\"></span></a>\n" +
   "                                            </div>\n" +
   "                                            <a href=\"javascript:;\" class=\"btns_toolpop_close\" ng-click=\"AddModeHandle.exit();\"></a>\n" +
   "                                        </div>\n" +
   "                                    </div>\n" +
   "                                    <!--按钮不可点击添加类名 .com_s_disabled ,自定义配置图标类名 例如 iconleft是固定的 icon_add 表示是加号私有图标-->\n" +
   "                                    <a href=\"###\" class=\"com_u_btn4 \" ng-click=\"DeleteModeHandle.enter();\" ng-class=\"{'com_s_disabled':!(model.words.length > 0)}\">\n" +
   "                                        <i class=\"iconleft icons_del\"></i><span class=\"com_s_txt\" translate=\"dictation.btn.word.delete\"></span>\n" +
   "                                    </a>\n" +
   "                                </div>\n" +
   "                                <div class=\"ChineseCd_ft_btns_add\" ng-show=\"interactiveMode === INTERACTIVE_MODE.ADD\" ng-switch=\"AddModeHandle.wordAmountSearched\">\n" +
   "                                    <a href=\"###\" class=\"com_u_btn4 \" ng-click=\"AddModeHandle.search(true);\" ng-switch-when=\"0\"><span class=\"com_s_txt\" translate=\"dictation.btn.word.search\"></span></a>\n" +
   "                                    <a href=\"###\" class=\"com_u_btn4 \" ng-click=\"AddModeHandle.confirmAdd();\" ng-switch-when=\"0\"><span class=\"com_s_txt\" translate=\"dictation.btn.return\"></span></a>\n" +
   "                                    <a href=\"###\" class=\"com_u_btn4 \" ng-click=\"AddModeHandle.confirmAdd();\" ng-switch-default><span class=\"com_s_txt\" translate=\"dictation.btn.add.confirm\"></span></a>\n" +
   "                                </div>\n" +
   "                                <div class=\"ChineseCd_ft_btns_del\" ng-show=\"interactiveMode === INTERACTIVE_MODE.DELETE\">\n" +
   "                                    <a href=\"###\" class=\"com_u_btn4 \" ng-click=\"DeleteModeHandle.exit();\" ng-class=\"{'com_s_disabled':!DeleteModeHandle.isExitable}\">\n" +
   "                                        <span class=\"com_s_txt\" translate=\"dictation.btn.done\"></span>\n" +
   "                                    </a>\n" +
   "                                </div>\n" +
   "                            </div>\n" +
   "                        </div>\n" +
   "\n" +
   "                        <!-- 查看字卡的弹窗 -->\n" +
   "                        <word-card-view word=\"wordSelected\" close=\"ViewModeHandle.exit\" ng-show=\"!!wordSelected\"></word-card-view>\n" +
   "                        <!-- /查看字卡的弹窗 -->\n" +
   "\n" +
   "                        <!-- 创建字卡的弹窗 -->\n" +
   "                        <word-card-new save=\"AddModeHandle.addWordCallback\" quit=\"AddModeHandle.quitCreate\" ng-if=\"addWordPanelFlag\"></word-card-new>\n" +
   "                        <!-- /创建字卡的弹窗 -->\n" +
   "\n" +
   "                        <!-- 选择单元的弹窗 -->\n" +
   "                        <chapter-selector after-select-chapter=\"AddModeHandle.selectChapterCallback\"></chapter-selector>\n" +
   "                        <!-- /选择单元的弹窗 -->\n" +
   "\n" +
   "                        <!-- 字词覆盖的弹窗 -->\n" +
   "                        <confirm-popup ng-show=\"ReplaceConfirmPopup.isVisible\" message=\"ReplaceConfirmPopup.message\"\n" +
   "                                       btn-ok-name=\"ReplaceConfirmPopup.okName\" btn-cancel-name=\"ReplaceConfirmPopup.cancelName\"\n" +
   "                                       btn-ok-handle=\"ReplaceConfirmPopup.ok\" btn-cancel-handle=\"ReplaceConfirmPopup.cancel\"></confirm-popup>\n" +
   "                        <!-- /字词覆盖的弹窗 -->\n" +
   "\n" +
   "                        <!-- 请先选择一本教材的弹窗 -->\n" +
   "                        <div class=\"ChineseCharacterDictation_tips_pop_wrapper\" ng-if=\"noBookTipShow\">\n" +
   "                            <div class=\"ChineseCd_tips_pop_bg\">\n" +
   "                                <div class=\"ChineseCd_tips_pop_bd _padding_none\">\n" +
   "                                    <span class=\"ft_tips_txt ng-binding\" ng-bind=\"noBookTipMessage\"></span>\n" +
   "                                </div>\n" +
   "                            </div>\n" +
   "                        </div>\n" +
   "                        <!-- /请先选择一本教材的弹窗 -->\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "</div>";

templates["nd-loader.html"] = "<div class=\"nd-loader\" template=\"1\">\n" +
   "    <div class=\"nd-loader-content\">\n" +
   "        <svg version=\"1.1\" id=\"loader_1\"  x=\"0px\" y=\"0px\" width=\"30px\" height=\"30px\" viewBox=\"0 0 40 40\" enable-background=\"new 0 0 40 40\" xml:space=\"preserve\">\n" +
   "          <path opacity=\"0.2\" fill=\"#FFFFFF\" d=\"M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946\n" +
   "            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634\n" +
   "            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z\"></path>\n" +
   "          <path fill=\"#FFFFFF\" d=\"M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0\n" +
   "            C22.32,8.481,24.301,9.057,26.013,10.047z\" transform=\"rotate(322.462 20 20)\">\n" +
   "            <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"rotate\" from=\"0 20 20\" to=\"360 20 20\" dur=\"0.5s\" repeatCount=\"indefinite\"></animateTransform>\n" +
   "          </path>\n" +
   "        </svg>\n" +
   "        <p style=\"margin: 2px 0px;\" ng-bind=\"message\"></p>\n" +
   "    </div>\n" +
   "</div>";

templates["time-box.html"] = "<div class=\"com_u_timebox\">\n" +
   "    <span class=\"time_1\" ng-bind=\"minutes\">00</span>\n" +
   "    <span class=\"time_2\">:</span>\n" +
   "    <span class=\"time_1\" ng-bind=\"seconds\">00</span>\n" +
   "</div>";

templates["word_card_new.html"] = "<div class=\"ChineseCharacterDictation_pop_add\">\n" +
   "    <div class=\"ChineseCharacterDictation_pop_add_bg \">\n" +
   "        <div class=\"ChineseCharacterDictation_pop_add_bg_papper \">\n" +
   "            <!-- 弹窗内容区 -->\n" +
   "            <div class=\"ChineseCharacterDictation_pop_add_main\">\n" +
   "\n" +
   "                <div class=\"ChineseCharacterDictation_pop_add_main_bd\">\n" +
   "\n" +
   "                    <!-- 添加字词 -->\n" +
   "                    <div class=\"ChineseCharacterDictation_add_txt_area\" ng-show=\"interactiveMode === INTERACTIVE_MODE.UNMATCHED\">\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_tips\">\n" +
   "                            <span ng-bind=\"UnmatchedModeHandle.message\"></span>\n" +
   "                        </div>\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_input\">\n" +
   "                            <input type=\"text\" maxlength=\"4\" ng-model=\"wordAdding.text\" ng-trim=\"false\" ng-change=\"UnmatchedModeHandle.onTextChange();\" ng-keyup=\"UnmatchedModeHandle.onKeyup($event);\"/>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                    <!-- /添加字词 -->\n" +
   "\n" +
   "                    <!-- 多音字选择 -->\n" +
   "                    <div class=\"ChineseCharacterDictation_has_word_dyz\" ng-show=\"interactiveMode === INTERACTIVE_MODE.SELECT\">\n" +
   "                        <div class=\"ChineseCharacterDictation_word_dyz_tips\">\n" +
   "                            <span ng-bind=\"SelectModeHandle.message\"></span>\n" +
   "                        </div>\n" +
   "                        <div class=\"ChineseCd_tabs_area\">\n" +
   "                            <ul class=\"tabs_area_box\" ng-click=\"SelectModeHandle.select($event)\">\n" +
   "                                <li class=\"tabs_area_list\" ng-repeat=\"item in SelectModeHandle.words track by $index\" ng-index=\"{{$index}}\" ng-class=\"{'on': item.selected}\">\n" +
   "                                    <span class=\"ChineseCd_txt\" ng-bind=\"item.pinyin[0]\"></span></li>\n" +
   "                            </ul>\n" +
   "                        </div>\n" +
   "                    </div>\n" +
   "                    <!-- 多音字选择 -->\n" +
   "\n" +
   "\n" +
   "                    <!-- 匹配到字词没有释义 .ChineseCharacterDictation_has_word_txt_area 添加类名 no_explanation -->\n" +
   "                    <div class=\"ChineseCharacterDictation_has_word_txt_area no_explanation\" ng-show=\"interactiveMode === INTERACTIVE_MODE.MATCHED\">\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_tips\">\n" +
   "                            <span ng-bind=\"MatchedModeHandle.message\"></span>\n" +
   "                        </div>\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_list\">\n" +
   "                            <ul class=\"ChineseCd_add_single_listBox\">\n" +
   "                                <li class=\"ChineseCd_add_single_w\" ng-repeat=\"item in wordAdding.word track by $index\">\n" +
   "                                    <div class=\"ChineseCd_word_py\">{{wordAdding.pinyin[$index]}}</div>\n" +
   "                                    <div class=\"ChineseCd_word_pyw\">{{item}}</div>\n" +
   "                                </li>\n" +
   "                                <!-- 发音按钮 不可点击添加类名 .click_disabled 发音中添加类名 .animation_go -->\n" +
   "                                <a href=\"###\" class=\"ChineseCharacterDictation_sound\" ng-class=\"{'animation_go': MatchedModeHandle.isPlaying, 'click_disabled':!MatchedModeHandle.isCanPlay}\" ng-click=\"MatchedModeHandle.play();\">\n" +
   "                                <span class=\"icons_horn\">\n" +
   "                                    <span class=\"icons_horn_w1\"></span>\n" +
   "                                    <span class=\"icons_horn_w2\"></span>\n" +
   "                                    <span class=\"icons_horn_w3\"></span>\n" +
   "                                </span>\n" +
   "                                </a>\n" +
   "                                <!-- 发音按钮 -->\n" +
   "                            </ul>\n" +
   "                        </div>\n" +
   "                        <!-- 文字编辑的容器 显示编辑的时候 .ChineseCharacterDictation_add_txt_show 是 hide_dom -->\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_textarea\" ng-show=\"MatchedModeHandle.isEditing\">\n" +
   "                            <textarea name=\"\" id=\"\" cols=\"30\" rows=\"5\" ng-model=\"wordAdding.definition\"></textarea>\n" +
   "                        </div>\n" +
   "                        <!-- /文字编辑的容器 -->\n" +
   "                        <!-- 文字显示的容器 显示文字的时候 .ChineseCharacterDictation_add_txt_textarea 是 hide_dom -->\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_show \" ng-show=\"!MatchedModeHandle.isEditing\">\n" +
   "                            <span class=\"ChineseCd_txt js_definition_label\" translate=\"dictation.label.word.definition\"></span>\n" +
   "                            <span class=\"ChineseCd_txt\" ng-bind=\"wordAdding.definition\"></span>\n" +
   "                            <a href=\"###\" class=\"ChineseCd_txt_edit\" ng-click=\"MatchedModeHandle.doEdit();\"></a>\n" +
   "                        </div>\n" +
   "                        <!-- /文字显示的容器 -->\n" +
   "\n" +
   "                    </div>\n" +
   "                    <!-- /匹配到字词没有释义 -->\n" +
   "\n" +
   "                </div>\n" +
   "                <div class=\"ChineseCharacterDictation_pop_main_ft\">\n" +
   "                    <!-- 按钮不可点击添加类名 .click_disabled -->\n" +
   "                    <a class=\"ChineseCd_light_btn\" href=\"javascript:;\" ng-show=\"interactiveMode === INTERACTIVE_MODE.UNMATCHED && !UnmatchedModeHandle.isMatching\"\n" +
   "                       ng-class=\"{'click_disabled': !(wordAdding.text.length > 0)}\" ng-click=\"UnmatchedModeHandle.match();\">\n" +
   "                        <span class=\"ChineseCd_light_btn_txt\" translate=\"dictation.btn.match\"></span>\n" +
   "                    </a>\n" +
   "                    <a class=\"ChineseCd_light_btn click_disabled\" href=\"javascript:;\" ng-show=\"interactiveMode === INTERACTIVE_MODE.UNMATCHED && UnmatchedModeHandle.isMatching\">\n" +
   "                        <span class=\"ChineseCd_light_btn_txt\" translate=\"dictation.btn.matching\"></span>\n" +
   "                    </a>\n" +
   "                    <a class=\"ChineseCd_light_btn\" href=\"javascript:;\" ng-show=\"interactiveMode === INTERACTIVE_MODE.MATCHED\"\n" +
   "                       ng-click=\"MatchedModeHandle.save();\">\n" +
   "                        <span class=\"ChineseCd_light_btn_txt\" translate=\"dictation.btn.save\"></span>\n" +
   "                    </a>\n" +
   "                    <a class=\"ChineseCd_light_btn\" href=\"javascript:;\"  ng-show=\"interactiveMode === INTERACTIVE_MODE.SELECT\"\n" +
   "                       ng-class=\"{'click_disabled': !SelectModeHandle.wordSelected}\" ng-click=\"SelectModeHandle.confirm();\">\n" +
   "                        <span class=\"ChineseCd_light_btn_txt\" translate=\"dictation.btn.confirm\"></span>\n" +
   "                    </a>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <!-- /弹窗内容区 -->\n" +
   "        </div>\n" +
   "        <!-- 右上关闭按钮 -->\n" +
   "        <a href=\"###\" class=\"stati_com_btn_close\" ng-click=\"exit();\"></a>\n" +
   "        <!-- /右上关闭按钮 -->\n" +
   "    </div>\n" +
   "\n" +
   "    <!-- 关闭提示弹窗 -->\n" +
   "    <!-- /关闭提示弹窗 -->\n" +
   "    <audio class=\"hide_dom\" style=\"display: none;width:0;height:0\" preload=\"auto\"></audio>\n" +
   "</div>\n" +
   "<confirm-popup ng-show=\"QuitConfirmPopup.isVisible\" message=\"QuitConfirmPopup.message\"\n" +
   "               btn-ok-name=\"QuitConfirmPopup.okName\" btn-cancel-name=\"QuitConfirmPopup.cancelName\"\n" +
   "               btn-ok-handle=\"QuitConfirmPopup.ok\" btn-cancel-handle=\"QuitConfirmPopup.cancel\"></confirm-popup>";

templates["word_card_view.html"] = "<div class=\"ChineseCharacterDictation_pop_add\" ng-click=\"onPanelClick($event);\">\n" +
   "    <div class=\"ChineseCharacterDictation_pop_add_bg \">\n" +
   "        <div class=\"ChineseCharacterDictation_pop_add_bg_papper \">\n" +
   "            <!-- 弹窗内容区 -->\n" +
   "            <div class=\"ChineseCharacterDictation_pop_add_main\" >\n" +
   "                <div class=\"ChineseCharacterDictation_pop_add_main_bd\">\n" +
   "                    <!-- 匹配到字词没有释义 .ChineseCharacterDictation_has_word_txt_area 添加类名 no_explanation -->\n" +
   "                    <div class=\"ChineseCharacterDictation_has_word_txt_area\">\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_tips\">\n" +
   "                            <span ng-bind=\"tipMessage\"></span>\n" +
   "                        </div>\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_list\">\n" +
   "                            <ul class=\"ChineseCd_add_single_listBox\">\n" +
   "                                <li class=\"ChineseCd_add_single_w\" ng-repeat=\"item in word.word track by $index\">\n" +
   "                                    <div class=\"ChineseCd_word_py\">{{word.pinyin[$index]}}</div>\n" +
   "                                    <div class=\"ChineseCd_word_pyw\">{{item}}</div>\n" +
   "                                </li>\n" +
   "                                <!-- 发音按钮 不可点击添加类名 .click_disabled 发音中添加类名 .animation_go -->\n" +
   "                                <a href=\"###\" class=\"ChineseCharacterDictation_sound\" ng-class=\"{'animation_go': isPlaying, 'click_disabled':!isCanPlay}\" ng-click=\"play();\">\n" +
   "                                <span class=\"icons_horn\">\n" +
   "                                    <span class=\"icons_horn_w1\"></span>\n" +
   "                                    <span class=\"icons_horn_w2\"></span>\n" +
   "                                    <span class=\"icons_horn_w3\"></span>\n" +
   "                                </span>\n" +
   "                                </a>\n" +
   "                                <!-- 发音按钮 -->\n" +
   "                            </ul>\n" +
   "                        </div>\n" +
   "                        <!-- 文字编辑的容器 显示编辑的时候 .ChineseCharacterDictation_add_txt_show 是 hide_dom -->\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_textarea\" ng-show=\"isEditing\">\n" +
   "                            <textarea name=\"\" id=\"\" cols=\"30\" rows=\"5\" ng-model=\"definition\"></textarea>\n" +
   "                        </div>\n" +
   "                        <!-- /文字编辑的容器 -->\n" +
   "                        <!-- 文字显示的容器 显示文字的时候 .ChineseCharacterDictation_add_txt_textarea 是 hide_dom -->\n" +
   "                        <div class=\"ChineseCharacterDictation_add_txt_show \" ng-show=\"!isEditing\">\n" +
   "                            <span class=\"ChineseCd_txt js_definition_label\" translate=\"dictation.label.word.definition\"></span>\n" +
   "                            <span class=\"ChineseCd_txt\" ng-bind=\"word.definition\"></span>\n" +
   "                            <a href=\"###\" class=\"ChineseCd_txt_edit\" ng-click=\"doEdit();\"></a>\n" +
   "                        </div>\n" +
   "                        <!-- /文字显示的容器 -->\n" +
   "                    </div>\n" +
   "                    <!-- /匹配到字词没有释义 -->\n" +
   "                </div>\n" +
   "                <div class=\"ChineseCharacterDictation_pop_main_ft\" ng-show=\"isEditing\">\n" +
   "                    <!-- 按钮不可点击添加类名 .click_disabled -->\n" +
   "                    <a class=\"ChineseCd_light_btn\" href=\"javascript:;\" ng-if=\"false\" ng-click=\"exit(true);\">\n" +
   "                        <span class=\"ChineseCd_light_btn_txt\" translate=\"dictation.btn.save\"></span>\n" +
   "                    </a>\n" +
   "                </div>\n" +
   "            </div>\n" +
   "            <!-- /弹窗内容区 -->\n" +
   "        </div>\n" +
   "        <!-- 右上关闭按钮 -->\n" +
   "        <a href=\"###\" class=\"stati_com_btn_close\" ng-click=\"exit(false);\"></a>\n" +
   "        <!-- /右上关闭按钮 -->\n" +
   "    </div>\n" +
   "    <!-- 关闭提示弹窗 -->\n" +
   "    <!-- /关闭提示弹窗 -->\n" +
   "    <audio class=\"hide_dom\" style=\"display: none;width:0;height:0\" preload=\"auto\"></audio>\n" +
   "</div>";
return templates;});