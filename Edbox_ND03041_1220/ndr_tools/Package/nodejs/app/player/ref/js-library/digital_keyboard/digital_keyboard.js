var DigitalInput;
(function (DigitalInput) {
    var Cursor = (function () {
        function Cursor() {
            this.element = document.createElement("span");
            this.element.innerHTML = "&#8203";
            this.isShow = true;
            this.isStart = false;
            this.showCursorStyle();
        }
        Cursor.getInstance = function () {
            if (Cursor.instance == null) {
                Cursor.instance = new Cursor();
            }
            return Cursor.instance;
        };
        Cursor.prototype.setCursor = function (parent, brother) {
            if (brother) {
                brother.parentElement.insertBefore(this.element, brother);
            }
            else {
                parent.appendChild(this.element);
            }
            if (!this.isStart) {
                this.starCursor();
            }
        };
        Cursor.prototype.starCursor = function () {
            var _this = this;
            this.isStart = true;
            this.interval = setInterval(function () {
                if (_this.isShow) {
                    _this.dismissCursorStyle();
                }
                else {
                    _this.showCursorStyle();
                }
                _this.isShow = !_this.isShow;
            }, 500);
        };
        Cursor.prototype.clearCursor = function () {
            clearInterval(this.interval);
            this.isStart = false;
            if (this.element && this.element.parentElement) {
                this.element.parentElement.removeChild(this.element);
            }
        };
        Cursor.prototype.showCursorStyle = function () {
            this.element.setAttribute("class", "has_cursor not_select");
        };
        Cursor.prototype.dismissCursorStyle = function () {
            this.element.setAttribute("class", "no_cursor not_select");
        };
        return Cursor;
    })();
    DigitalInput.Cursor = Cursor;
    var EditableSpan = (function () {
        function EditableSpan(editor, charView, className, classNameDone) {
            if (className === void 0) { className = "editable_span editable_has_after"; }
            if (classNameDone === void 0) { classNameDone = "editable_span_done editable_no_after"; }
            /**
             * 是否点击内部传过来的事件
             */
            this.isClickInner = false;
            this.isEditable = false;
            this.element = document.createElement("span");
            this.className = className;
            this.classNameDone = classNameDone;
            this.changeStyle(true);
            this.textList = [];
            this.cursorIndex = -1;
            this.editor = editor;
            this.charView = charView;
            this.setOnClick();
        }
        EditableSpan.prototype.setOnClick = function () {
            var this_ = this;
            DigitalKey.EventUtil.bindClickEvent(this.element, function (e) {
                if (!this_.editor.disabled) {
                    DigitalKey.LogUtils.log("editableSpan");
                    DigitalInput.InputManager.getInstance().openKeyBoard(this_.editor.element.getAttribute("digital_id"));
                    if (!this_.isClickInner) {
                        var left = DigitalInput.ViewUtils.getOffsetLeft(this_.element);
                        var width = this_.element.offsetWidth;
                        var clickX = e.clientX + document.body.scrollLeft;
                        if (clickX < left + width / 2) {
                            this_.setCursor(0);
                        }
                        else {
                            this_.setCursor(this_.textList.length);
                        }
                    }
                    this_.isClickInner = false;
                    this_.charView.setCurrentEditableArea(this_);
                    this_.charView.changeStyle(true);
                    this_.editor.isEditInChild = true;
                    this_.editor.cursorIndex = this_.editor.textList.indexOf(this_.charView);
                    DigitalInput.ViewUtils.stopEvent(e);
                }
            });
        };
        EditableSpan.prototype.setCursor = function (index) {
            if (index === void 0) { index = this.cursorIndex; }
            if (this.disabled) {
                return true;
            }
            if (this.cursorIndex == index && this.element == DigitalInput.Cursor.getInstance().element.parentElement) {
                return;
            }
            if (this.textList.length == 0 || index >= this.textList.length || index < 0) {
                DigitalInput.Cursor.getInstance().setCursor(this.element);
                this.cursorIndex = this.textList.length;
                if (this.editor.onCursorCallBack) {
                    this.editor.onCursorCallBack(false);
                }
            }
            else {
                DigitalInput.Cursor.getInstance().setCursor(this.element, this.textList[index].element);
                this.cursorIndex = index;
                if (this.editor.onCursorCallBack) {
                    this.editor.onCursorCallBack(false);
                }
            }
            this.editor.adjustView(43);
            return false;
        };
        /**
         * 光标前进一格
         */
        EditableSpan.prototype.foward = function (step) {
            if (step === void 0) { step = 1; }
            var index = this.cursorIndex + step;
            if (index > this.textList.length) {
                index = this.textList.length;
            }
            this.setCursor(index);
        };
        /**
         * 光标后退一格
         */
        EditableSpan.prototype.back = function (step) {
            if (step === void 0) { step = 1; }
            var index = this.cursorIndex - step;
            if (index < 0) {
                index = 0;
            }
            this.setCursor(index);
        };
        /**
         * 增加一个基础文本(CharView)
         * @param charView 要添加的文本
         * @param indexOffset 所要添加的位置与当前光标的位移差
         */
        EditableSpan.prototype.addText = function (charView, indexOffset) {
            var index = this.cursorIndex + indexOffset;
            if (index < 0 || index > this.textList.length) {
                index = this.cursorIndex;
            }
            if (index == this.cursorIndex) {
                // 在光标位置加入
                var cursorParent = DigitalInput.Cursor.getInstance().element.parentElement;
                if (cursorParent.lastChild == DigitalInput.Cursor.getInstance().element) {
                    cursorParent.appendChild(charView.element);
                }
                else {
                    cursorParent.insertBefore(charView.element, DigitalInput.Cursor.getInstance().element.nextSibling);
                }
                cursorParent = null;
            }
            else {
                var cursorParent = this.textList[index].element.parentElement;
                if (index == this.textList.length) {
                    cursorParent.appendChild(charView.element);
                }
                else {
                    cursorParent.insertBefore(charView.element, this.textList[index].element);
                }
                cursorParent = null;
            }
            this.textList.splice(index, 0, charView);
        };
        /**
         * 删除一个文本
         * @param indexOffset 文本所处位置，无则删除最后一个
         */
        EditableSpan.prototype.deleteText = function (indexOffset) {
            if (this.textList.length == 0) {
                return;
            }
            var index = this.cursorIndex + indexOffset;
            if (index < 0 || index > this.textList.length) {
                index = this.cursorIndex;
            }
            if (index == 0) {
                return;
            }
            var charView = this.textList.splice(index - 1, 1).pop();
            charView.element.parentElement.removeChild(charView.element);
            charView.element.style.display = "none";
            charView = null;
        };
        /**
         * 移除光标
         */
        EditableSpan.prototype.removeCursor = function () {
        };
        /**
         * 解析输入区域的内容为字符串
         * @returns {string} 输入区域的文本
         */
        EditableSpan.prototype.parseToString = function () {
            var res = [];
            if (this.textList) {
                for (var i = 0; i < this.textList.length; i++) {
                    res.push(this.textList[i].parseToString());
                }
            }
            for (var index = res.length - 1; index > -1; index--) {
                if (res[index] == "^{2}") {
                    index = DigitalInput.squareUtil.handleSquare(res, index);
                }
            }
            var result = "";
            for (var j = 0, len = res.length; j < len; j++) {
                result += res[j];
            }
            return result;
        };
        EditableSpan.prototype.setText = function (charViews) {
            for (var i = 0, len = charViews.length; i < len; i++) {
                this.textList.push(charViews[i]);
                this.element.appendChild(charViews[i].element);
            }
        };
        /**
         * 根据是否在编辑来改变style
         * @param isEditable 是否处理在编辑状态
         */
        EditableSpan.prototype.changeStyle = function (isEditable) {
            if (this.isEditable == isEditable) {
                return;
            }
            this.isEditable = isEditable;
            if (isEditable) {
                this.element.setAttribute("class", this.className);
            }
            else {
                if (this.textList.length > 0) {
                    this.element.setAttribute("class", this.classNameDone);
                }
            }
        };
        /**
         * 删除所有文本
         */
        EditableSpan.prototype.deleteAll = function () {
        };
        EditableSpan.prototype.adjustView = function (offset) {
        };

        /**
        * 2017-3-29 v1.2.1 获取光标的前一个字符
        */
        EditableSpan.prototype.getPreChar = function () {
            if (this.cursorIndex == 0) {
                return '';
            } else {
                var index = this.cursorIndex - 1;
                return this.textList[index].parseToString();
            }
        }
        /**
         * 2017-3-29 v1.2.1 替换光标前一个字符
         */
        EditableSpan.prototype.replaceCursorPreChar = function (char) {
            if (this.cursorIndex == 0) {
                return false;
            } else {
                var index = this.cursorIndex;
                var charView = this.textList.splice(index - 1, 1, char).pop();
                var parent = charView.element.parentElement;
                parent.removeChild(charView.element);
                charView.element.style.display = "none";
                charView = null;
                parent.insertBefore(char.element, DigitalInput.Cursor.getInstance().element);
                return true;
            }
        }
        return EditableSpan;
    })();
    DigitalInput.EditableSpan = EditableSpan;
    var FractionsCharView = (function () {
        function FractionsCharView(element, keyBoardId, key, editor) {
            /**
             * 是否为复杂标签
             */
            this.isComplexView = true;
            this.element = element;
            this.keyBoardId = keyBoardId;
            this.key = key;
            this.editableSpans = [];
            this.editIndex = 0;
            this.setStyle();
            this.setOnClick(editor);
            this.init(editor);
            this.isRepetend = false;
        }
        /**
         *设置最层样式
         */
        FractionsCharView.prototype.setStyle = function () {
            this.element.setAttribute("class", "fractions_container");
        };
        /**
         * 点击事件处理函数
         */
        FractionsCharView.prototype.setOnClick = function (editableArea) {
            var obj = this;
            DigitalKey.EventUtil.bindClickEvent(this.element, function (e) {
                DigitalKey.LogUtils.log("分数内");
                var left = DigitalInput.ViewUtils.getOffsetLeft(obj.element);
                var width = obj.element.offsetWidth;
                var clickX = e.clientX + document.body.scrollLeft;
                // 判断点击位置 如果处于元素的左右边，则在对应左右边加光标
                var cursorIndex = -1;
                if (clickX < left + width / 2) {
                    cursorIndex = editableArea.textList.indexOf(obj);
                }
                else {
                    cursorIndex = editableArea.textList.indexOf(obj) + 1;
                }
                editableArea.isClickInner = true;
                editableArea.setCursor(cursorIndex);
            });
        };
        /**
         * 清除子元素
         * @return 通知父元素是否清除该标签
         */
        FractionsCharView.prototype.deleteText = function (indexOffset) {
            this.getCurrentEditableArea().deleteText(indexOffset);
            return false;
        };
        ;
        /**
         * 增加子元素
         * @return 通知父元素是否要添加该标签
         */
        FractionsCharView.prototype.addText = function (charView, indexOffset) {
            if (charView.key.getTag() != "—")
                this.getCurrentEditableArea().addText(charView, indexOffset);
            return false;
        };
        ;
        /**
         * 解析该视图的实际文本值
         * @returns {string}
         */
        FractionsCharView.prototype.parseToString = function () {
            return this.editableSpans[0].parseToString()
                + "\\frac {"
                + this.editableSpans[1].parseToString()
                + "} {"
                + this.editableSpans[2].parseToString()
                + "}";
        };
        /**
         * 光标前进一格
         */
        FractionsCharView.prototype.foward = function (step) {
            this.changeStyle(true);
            this.getCurrentEditableArea().foward(step);
        };
        /**
         * 光标后退一格
         */
        FractionsCharView.prototype.back = function (step) {
            if (step === void 0) { step = 1; }
            this.changeStyle(true);
            this.getCurrentEditableArea().back(step);
        };
        /**
         * 返回当前标签内可编辑区域
         */
        FractionsCharView.prototype.getCurrentEditableArea = function () {
            return this.editableSpans[this.editIndex];
        };
        /**
         * 设置当前标签内可编辑区域
         */
        FractionsCharView.prototype.setCurrentEditableArea = function (editableSpan) {
            var index = this.editableSpans.indexOf(editableSpan);
            if (index != -1) {
                this.editIndex = index;
            }
        };
        /**
         * 设置内部光标
         */
        FractionsCharView.prototype.setCursor = function (indexOffset) {
            this.changeStyle(true);
            this.getCurrentEditableArea().setCursor(this.getCurrentEditableArea().cursorIndex + indexOffset);
            return false;
        };
        ;
        /**
         * 如果是分母或者分子 需要初始化样式和父标签
         * @param editor
         */
        FractionsCharView.prototype.init = function (editor) {
            // 创建三个可编辑区域
            this.editableSpans[0] = new DigitalInput.EditableSpan(editor, this, "editable_span_inter editable_has_after", "editable_span_inter_done editable_no_after");
            this.element.appendChild(this.editableSpans[0].element);
            this.editableSpans[1] = new DigitalInput.EditableSpan(editor, this);
            this.editableSpans[2] = new DigitalInput.EditableSpan(editor, this);
            // 包裹分母分子的容器（用于改变分数线的宽度）
            var container = document.createElement("span");
            container.setAttribute("class", "fractions_inner_container");
            // 用于包裹分子
            var molContainer = document.createElement("span");
            molContainer.setAttribute("class", "fraction_molecule_container");
            molContainer.appendChild(this.editableSpans[1].element);
            container.appendChild(molContainer);
            // 用于包裹分母
            var denContainer = document.createElement("span");
            denContainer.setAttribute("class", "fraction_denominator_container");
            denContainer.appendChild(this.editableSpans[2].element);
            container.appendChild(denContainer);
            this.element.appendChild(container);
        };
        FractionsCharView.prototype.changeStyle = function (isEditable) {
            this.editableSpans[0].changeStyle(isEditable);
            this.editableSpans[1].changeStyle(isEditable);
            this.editableSpans[2].changeStyle(isEditable);
            if (!isEditable) {
                if (this.editableSpans[0].textList.length == 0) {
                    this.editableSpans[0].element.setAttribute("class", "editable_hidden");
                }
            }
        };
        /**
         * 2017-3-29 v1.2.1 获取光标前一个字符
         */
        FractionsCharView.prototype.getPreChar = function (char) {
            return this.getCurrentEditableArea().getPreChar(char);
        };

        /**
         * 2017-3-29 v1.2.1 替换光标前一个字符
         */
        FractionsCharView.prototype.replaceCursorPreChar = function (char) {
            return this.getCurrentEditableArea().replaceCursorPreChar(char);
        };
        return FractionsCharView;
    })();
    DigitalInput.FractionsCharView = FractionsCharView;
    var GeneralCharView = (function () {
        function GeneralCharView(element, keyBoardId, key, editableArea, isRepetend) {
            if (isRepetend === void 0) { isRepetend = false; }
            /**
             * 是否为复杂标签
             */
            this.isComplexView = false;
            this.element = element;
            this.keyBoardId = keyBoardId;
            this.key = key;
            this.isRepetend = isRepetend;
            this.setStyle();
            this.setOnClick(editableArea);
        }
        /**
         *设置样式
         */
        GeneralCharView.prototype.setStyle = function () {
            this.element.setAttribute("keyboard-cur_digital_id", this.keyBoardId.toString());
            this.element.setAttribute("class", "general_char_view");
            this.element.innerHTML = this.key.getValue();
        };
        /**
         * 点击事件处理函数
         */
        GeneralCharView.prototype.setOnClick = function (editableArea) {
            var obj = this;
            DigitalKey.EventUtil.bindClickEvent(this.element, function (e) {
                DigitalKey.LogUtils.log("普通数字");
                var left = DigitalInput.ViewUtils.getOffsetLeft(obj.element);
                var width = obj.element.offsetWidth;
                var clickX = e.clientX + document.body.scrollLeft;
                // 判断点击位置 如果处于元素的左右边，则在对应左右边加光标
                var cursorIndex = -1;
                if (clickX < left + width / 2) {
                    cursorIndex = editableArea.textList.indexOf(obj);
                }
                else {
                    cursorIndex = editableArea.textList.indexOf(obj) + 1;
                }
                editableArea.isClickInner = true;
                editableArea.setCursor(cursorIndex);
            });
        };
        /**
         * 清除子元素
         * @return 通知父元素是否清除该标签
         */
        GeneralCharView.prototype.deleteText = function (indexOffset) {
            return true;
        };
        ;
        /**
         * 增加子元素
         * @return 通知父元素是否要添加该标签
         */
        GeneralCharView.prototype.addText = function (charView, indexOffset) {
            return true;
        };
        ;
        /**
         * 解析该视图的实际文本值
         * @returns {string}
         */
        GeneralCharView.prototype.parseToString = function () {
            return this.key.getLatex();
        };
        /**
         * 光标前进一格
         */
        GeneralCharView.prototype.foward = function (step) {
        };
        ;
        /**
         * 光标后退一格
         */
        GeneralCharView.prototype.back = function (step) {
            if (step === void 0) { step = 1; }
        };
        ;
        /**
         * 设置内部光标
         */
        GeneralCharView.prototype.setCursor = function (indexOffset) {
            return true;
        };
        ;
        /**
         * 返回当前标签内可编辑区域
         */
        GeneralCharView.prototype.getCurrentEditableArea = function () {
            return null;
        };
        GeneralCharView.prototype.changeStyle = function (param) {
        };
        ;
        /**
         * 设置当前标签内可编辑区域
         */
        GeneralCharView.prototype.setCurrentEditableArea = function (editableSpan) {
        };
        return GeneralCharView;
    })();
    DigitalInput.GeneralCharView = GeneralCharView;
    var InputManager = (function () {
        function InputManager() {
            this.digital_id = 1000;
            this.isClickInner = false;
            this.inputMap = [];
            this.ids = [];
            this.isOpenKeyBoard = false;
            // 初始化按键
            DigitalKey.KeyFactory.init();
            DigitalKey.EventUtil.initEventName();
            DigitalKey.DigitalKeyBoard.getInstance();
            window.addEventListener(DigitalKey.EventUtil.vEventHandler.mouseDown, this.autoCloseKeyBoard);
        }
        InputManager.getInstance = function () {
            if (InputManager.instance == null) {
                InputManager.instance = new InputManager();
            }
            return InputManager.instance;
        };
        /**
         * 注册div为数字键盘的文本输入区域
         * @param div
         * @param callback
         * @param disabled
         */
        InputManager.prototype.register = function (div, callback, disabled) {
            if (disabled === void 0) { disabled = false; }
            var digital_id_str = this.digital_id + "";
            div.setAttribute("digital_id", digital_id_str);
            this.inputMap[digital_id_str] = new DigitalInput.InputText(div, digital_id_str, callback, disabled);
            this.ids.push(digital_id_str);
            this.digital_id++;
        };
        /**
         * 通过id注册
         * @param id
         * @param callback
         * @param disabled
         */
        InputManager.prototype.registerForId = function (id, callback, disabled) {
            if (disabled === void 0) { disabled = false; }
            var div = document.getElementById(id);
            var digital_id_str = this.digital_id.toString();
            div.setAttribute("digital_id", digital_id_str);
            this.inputMap[digital_id_str] = new DigitalInput.InputText(div, digital_id_str, callback, disabled);
            this.ids.push(digital_id_str);
            this.digital_id++;
        };


        /**
        * ?? 解除注册
        * @param div
        * @param callback
        * @param disabled
        */
        InputManager.prototype.unRegister = function (div) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].destory();
            delete this.inputMap[digitalId];
            for (var i = 0; i < this.ids.length; i++) {
                if (this.ids[i] == digitalId) {
                    this.ids.splice(i, 1);
                    break;
                }
            }
            if (digitalId === this.cur_digital_id) {
                this.closeKeyBoard(true);
            }
        };

        /**
         * ?? 解除所有注册
         */
        InputManager.prototype.unRegisterAll = function () {
            var len = this.ids.length;
            for (var i = 0; i < len; i++) {
                this.inputMap[this.ids[i]].destory();
            }
            this.inputMap.length = 0;
            this.ids.length = 0;
            this.digital_id = 1000;
            this.closeKeyBoard(true);
        };

        /**
         *  ?? 通过id解除注册
         * @param id
         * @param callback
         * @param disabled
         */
        InputManager.prototype.unRegister4Id = function (id) {
            var div = document.getElementById(id);
            this.unRegister(div);
        };

        InputManager.prototype.changeInputText = function (digitalId) {
            $('input').blur();
            $('textarea').blur();
            var input = this.inputMap[digitalId];
            DigitalKey.DigitalKeyBoard.getInstance().setOnClick(input);
            if (this.cur_digital_id != digitalId) {
                // 焦点事件
                var current = this.inputMap[this.cur_digital_id];
                if (current) {
                    current.onBlur();
                    current.cursorIndex = -1;
                }
            }
            this.cur_digital_id = digitalId;
            var next = this.inputMap[this.cur_digital_id];
            if (next) {
                next.onFocus();
            }
        };

        /**
         * 打开数字键盘
         * @param digitalId
         */
        InputManager.prototype.openKeyBoard = function (digitalId) {
            var input = this.inputMap[digitalId];
            if (!input.disabled) {
                if (!this.isOpen(digitalId)) {
                    DigitalKey.KeyManager.removeKeyDownListener();
                    DigitalKey.KeyManager.addKeyDownListener();
                    var body = document.getElementsByTagName('body')[0];
                    // 添加视图
                    body.appendChild(DigitalKey.DigitalKeyBoard.getInstance().keyContainer);
                    this.isOpenKeyBoard = true;
                    // 重新设置监听
                    this.changeInputText(digitalId);
                    this.adjustView(digitalId);
                }
            }
            else {
                if (this.isOpenKeyBoard) {
                    this.closeKeyBoard(true);
                }
            }
        };
        InputManager.prototype.isStopEvent = function () {
            return this.isClickInner;
        };
        InputManager.prototype.stopEvent = function (flag) {
            this.isClickInner = flag;
        };
        InputManager.prototype.autoCloseKeyBoard = function () {
            DigitalKey.LogUtils.log("window");
            if (!DigitalInput.InputManager.getInstance().isStopEvent()) {
                if (DigitalInput.InputManager.getInstance().isOpenKeyBoard) {
                    DigitalInput.InputManager.getInstance().closeKeyBoard(true);
                } else {
                    DigitalInput.InputManager.getInstance().clearAllFocus();
                }
            }
            DigitalInput.InputManager.getInstance().stopEvent(false);
        };
        InputManager.prototype.removeAdjustView = function () {
            if (this.blandDiv && this.blandDiv.parentElement) {
                this.blandDiv.parentElement.removeChild(this.blandDiv);
                this.blandDiv.style.display = "none";
                this.blandDiv = null;
            }
        };
        InputManager.prototype.findParent = function (div) {
            var body = document.getElementsByTagName('body')[0];
            if (!div.parentElement) {
                return null;
            }
            if (div.parentElement == body) {
                return body;
            }
            if (ViewUtils.getDefaultStyle(div.parentElement, "overflow") == "scroll"
                || ViewUtils.getDefaultStyle(div.parentElement, "overflow") == "auto"
                || ViewUtils.getDefaultStyle(div.parentElement, "overflow-y") == "scroll"
                || ViewUtils.getDefaultStyle(div.parentElement, "overflow-y") == "auto"
                || div.parentElement.scrollHeight > div.parentElement.offsetHeight) {
                return div.parentElement;
            }
            else {
                return this.findParent(div.parentElement);
            }
        };
        InputManager.prototype.adjustView = function (digitalId) {
            var keyboardOffset = DigitalInput.ViewUtils.offsetFuns(DigitalKey.DigitalKeyBoard.getInstance().keyContainer);
            var keyOffsetTop = keyboardOffset.top;
            var keyHeight = DigitalKey.DigitalKeyBoard.getInstance().keyContainer.offsetHeight;
            var inputOffset = DigitalInput.ViewUtils.offsetFuns(this.inputMap[digitalId].element);
            var inputOffsetTop = inputOffset.top;
            var inputOffsetHeight = this.inputMap[digitalId].element.offsetHeight;
            var bodyHeight = document.body.clientHeight;
            var offset = inputOffsetTop + inputOffsetHeight - keyOffsetTop;
            if (offset > 0) {
                if (this.blandDiv && this.blandDiv.parentElement) {
                    this.blandDiv.parentElement.removeChild(this.blandDiv);
                }
                var blankParent = this.findParent(this.inputMap[digitalId].element);
                if (blankParent) {
                    offset = inputOffsetTop - (bodyHeight - inputOffsetHeight - keyHeight) + inputOffsetHeight;
                    this.blandDiv = document.createElement("div");
                    this.blandDiv.setAttribute("class", "offset_blank_panel");
                    if (blankParent.offsetHeight + offset > bodyHeight) {
                        this.blandDiv.style.height = offset + "px";
                        blankParent.appendChild(this.blandDiv);
                    }
                    else {
                        this.blandDiv.style.height = keyHeight + "px";
                        blankParent.appendChild(this.blandDiv);
                    }
                    this.inputMap[digitalId].element.scrollIntoView();
                }
            }
        };
        /**
         * 是否打开了数字键盘
         */
        InputManager.prototype.isOpen = function (id) {
            if (DigitalKey.DigitalKeyBoard.getInstance().inputText == this.inputMap[id]) {
                return this.isOpenKeyBoard;
            }
            else {
                return false;
            }
        };

        InputManager.prototype.clearAllFocus = function () {
            DigitalKey.KeyManager.removeKeyDownListener();
            var current = this.inputMap[this.cur_digital_id];
            if (current) {
                current.onBlur();
                current.cursorIndex = -1;
            }
            DigitalInput.Cursor.getInstance().clearCursor();
        };

        /**
         * 关闭数字键盘
         * @param isBlur 是否失去焦点
         */
        InputManager.prototype.closeKeyBoard = function (isBlur) {
            if (this.isOpenKeyBoard) {
                // 焦点事件
                if (isBlur) {
                    this.clearAllFocus();
                }
                DigitalKey.KeyManager.removeKeyDownListener();
                var body = document.getElementsByTagName('body')[0];
                body.removeChild(DigitalKey.DigitalKeyBoard.getInstance().keyContainer);
                this.isOpenKeyBoard = false;
                this.removeAdjustView();
            }
        };
        /**
         * 通过数字键盘id获得当前输入框的文本
         * @param digital_id 自动分配的数字键盘id
         * @returns {string}
         */
        InputManager.prototype.getText = function (digital_id) {
            if (digital_id === void 0) { digital_id = this.cur_digital_id; }
            if (digital_id != null && digital_id != "" && this.ids.indexOf(digital_id) != -1) {
                return this.inputMap[digital_id].parseToString();
            }
            return "";
        };
        InputManager.prototype.getText4Dom = function (div) {
            var digital_id = div.getAttribute("digital_id");
            if (digital_id != null && digital_id != "" && this.ids.indexOf(digital_id) != -1) {
                return this.inputMap[digital_id].parseToString();
            }
            return "";
        };
        /**
         * 通过标签id获得当前输入框的文本
         * @param id  控件的id
         * @returns {string}
         */
        InputManager.prototype.getText4Id = function (id) {
            var div = document.getElementById(id);
            var digital_id = div.getAttribute("digital_id");
            if (digital_id != null && digital_id != "" && this.ids.indexOf(digital_id) != -1) {
                return this.inputMap[digital_id].parseToString();
            }
            return "";
        };
        /**
         * 设置输入框的文本。
         * @param latex   latex文本
         * @param digitalId 数字id
         */
        InputManager.prototype.setText = function (latex, digitalId) {
            if (digitalId === void 0) { digitalId = this.cur_digital_id; }
            this.inputMap[digitalId].setText(DigitalInput.Parser.getInstance().parseLatex(latex, this.inputMap[digitalId]));
        };
        /**
         * 设置输入框的文本。
         * @param latex   latex文本
         * @param id 数字id
         */
        InputManager.prototype.setText4Id = function (latex, id) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setText(DigitalInput.Parser.getInstance().parseLatex(latex, this.inputMap[digitalId]));
        };
        /**
         * 设置输入框的文本。
         * @param latex   latex文本
         * @param div 数字id
         */
        InputManager.prototype.setText4DOM = function (latex, div) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setText(DigitalInput.Parser.getInstance().parseLatex(latex, this.inputMap[digitalId]));
        };
        // 2016/12/12 ?? 支持手写输入框提供的API修改
        InputManager.prototype.appendText = function (latex, digitalId, isFocus) {
            if (digitalId === void 0) { digitalId = this.cur_digital_id; }
            this.inputMap[digitalId].appendText(DigitalInput.Parser.getInstance().parseLatex(latex, this.inputMap[digitalId]), isFocus);
        };
        // 2016/12/12 ?? 支持手写输入框提供的API修改
        InputManager.prototype.appendText4Id = function (latex, id, isFocus) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].appendText(DigitalInput.Parser.getInstance().parseLatex(latex, this.inputMap[digitalId]), isFocus);
        };
        // 2016/12/12 ?? 支持手写输入框提供的API修改
        InputManager.prototype.appendText4DOM = function (latex, div, isFocus) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].appendText(DigitalInput.Parser.getInstance().parseLatex(latex, this.inputMap[digitalId]), isFocus);
        };
        /**
         * 通过DOM设置是否可用
         * @param div
         * @param disabled
         */
        InputManager.prototype.setDisabled4DOM = function (div, disabled) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setDisabled(disabled);
        };
        /**
         * 通过DOM获取是否可用
         * @param div
         */
        InputManager.prototype.getDisabled4DOM = function (div) {
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].getDisabled();
        };
        /**
         * 通过ID设置是否可用
         * @param id
         * @param disabled
         */
        InputManager.prototype.setDisabled4Id = function (id, disabled) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setDisabled(disabled);
        };
        /**
         * 通过ID获取是否可用
         * @param id
         */
        InputManager.prototype.getDisabled4Id = function (id) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].getDisabled();
        };
        // 2016/12/12 ?? 设置焦点失去和获得事件
        InputManager.prototype.setFocusCallback4DOM = function (div, onfocus, onblur) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setFocusCallback(onfocus, onblur);
        };
        // 2016/12/12 ?? 设置焦点失去和获得事件
        InputManager.prototype.setFocusCallback4Id = function (id, onfocus, onblur) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setFocusCallback(onfocus, onblur);
        };
        // 2016/12/12 ?? 设置光标变化回调函数 返回isLast来标记是否在最后面
        InputManager.prototype.setCursorCallback = function (div, onCursorCallBack) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setCursorCallback(onCursorCallBack);
        };
        // 2016/12/12 ?? 设置光标变化回调函数 返回isLast来标记是否在最后面
        InputManager.prototype.setCursorCallback4Id = function (id, onCursorCallBack) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].setCursorCallback(onCursorCallBack);
        };
        // 2016/12/12 ?? 返回光标是否在输入框的最后
        InputManager.prototype.isCursorLast = function (div) {
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].isCursorLast();
        };
        // 2016/12/12 ?? 返回光标是否在输入框的最后
        InputManager.prototype.isCursorLast4Id = function (id) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].isCursorLast();
        };
        // 2016/12/12 ?? 指定光标位置清空文本
        InputManager.prototype.clearText = function (div, isFocus) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].deleteAll(isFocus);
        };
        // 2016/12/12 ?? 指定光标位置清空文本
        InputManager.prototype.clearText4Id = function (id, isFocus) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].deleteAll(isFocus);
        };
        // 2016/12/12 ?? 指定光标位置删除文本
        InputManager.prototype.deleteText = function (div) {
            var digitalId = div.getAttribute("digital_id");
            if (this.cur_digital_id === digitalId) {
                this.inputMap[digitalId].deleteAndBack(false);
            } else {
                this.inputMap[digitalId].deleteAndBack(true);
            }
        };
        // 2016/12/12 ?? 指定光标位置删除文本
        InputManager.prototype.deleteText4Id = function (id) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            if (this.cur_digital_id === digitalId) {
                this.inputMap[digitalId].deleteAndBack(false);
            } else {
                this.inputMap[digitalId].deleteAndBack(true);
            }
        };
        /**
         * 设置输入框的文本。
         * @param latexs   latex文本数组
         * @param ids 数字id数组
         */
        InputManager.prototype.setText4All = function (latexs, ids) {
            if (ids === void 0) { ids = this.ids; }
            for (var i = 0, isd_len = ids.length, latexs_len = latexs.length; i < isd_len && i < latexs_len; i++) {
                this.setText(latexs[i], ids[i]);
            }
        };

        /**
         * 2017-3-29 v1.2.1 获取光标的相关信息
         * {preChar:'',left:'',top:'',height:''}
         */
        InputManager.prototype.getCursorPosAndPreChar = function (div) {
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].getCursorPosAndPreChar();
        };

        /**
         * 2017-3-29 v1.2.1 替换光标前的字符
         * {preChar:'',left:'',top:'',height:''}
         */
        InputManager.prototype.replaceCursorPreChar = function (div, char) {
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].replaceCursorPreChar(DigitalInput.Parser.getInstance().parseLatex(char, this.inputMap[digitalId]));
        };


        /**
         * 2017-3-29 v1.2.1 获取光标的相关信息
         * {preChar:'',left:'',top:'',height:''}
         */
        InputManager.prototype.getCursorPosAndPreChar4Id = function (id) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].getCursorPosAndPreChar();
        };

        /**
         * 2017-3-29 v1.2.1 替换光标前的字符
         * {preChar:'',left:'',top:'',height:''}
         */
        InputManager.prototype.replaceCursorPreChar4Id = function (id, char) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            this.inputMap[digitalId].replaceCursorPreChar(DigitalInput.Parser.getInstance().parseLatex(char, this.inputMap[digitalId]));
        };

        /**
        * 2017-3-29 v1.2.1 获取光标位置
        * {preChar:'',left:'',top:'',height:''}
        */
        InputManager.prototype.getCursorIndex = function (div) {
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].getCursorIndex();
        };

        /**
     * 2017-3-29 v1.2.1 获取光标位置
     * {preChar:'',left:'',top:'',height:''}
     */
        InputManager.prototype.getCursorIndex4Id = function (id) {
            var div = document.getElementById(id);
            var digitalId = div.getAttribute("digital_id");
            return this.inputMap[digitalId].getCursorIndex();
        };

        return InputManager;
    })();
    DigitalInput.InputManager = InputManager;
    var Parser = (function () {
        function Parser() {
            this.initKeyMap();
        }
        Parser.getInstance = function () {
            if (Parser.instance == null) {
                Parser.instance = new Parser();
            }
            return Parser.instance;
        };
        Parser.prototype.parseLatex = function (latex, input) {
            latex = HandleTextType.removePackage(latex);
            var charViews = [];
            // 处理掉空格
            latex = latex.toString();
            latex = latex.replace(/\s/ig, '');
            for (var i = 0, len = DigitalKey.KeyFactory.keys.length; i < len; i++) {
                if (DigitalKey.KeyFactory.keys[i].getLatex() != "") {
                    // 根据键盘的latex参数来替代里面的对应文本,转化为单字符
                    if (DigitalKey.KeyFactory.keys[i].getLatex() == "\\dot") {
                        continue;
                    }
                    var str = DigitalKey.KeyFactory.keys[i].getLatex().replace(/\s/ig, '');
                    if (str.length > 1) {
                        str = str.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace("{", "\\{").replace("}", "\\}").replace("^", "\\^");
                        latex = latex.replace(new RegExp(str, "g"), DigitalKey.KeyFactory.keys[i].getTag());
                    }
                }
            }
            // 最后处理循环节的
            var str = "\\dot";
            str = str.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace("{", "\\{").replace("}", "\\}").replace("^", "\\^");
            latex = latex.replace(new RegExp(str, "g"), "•");
            // 先处理分数
            var fracIndexs_start = [];
            var fracIndexs_end = [];
            var fracCharViews = [];
            var re = /^[0-9]+.?[0-9]*$/;
            for (var i = 0, len = latex.length; i < len; i++) {
                if (latex[i] == "—") {
                    // 整数部分
                    var intCharView = [];
                    for (var j = i - 1; j > -1; j--) {
                        if (re.test(latex[j])) {
                            intCharView.push(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, this.keyMap[latex[j]], input));
                        }
                        else {
                            break;
                        }
                    }
                    // 往后移，判断分母子
                    var demCharView = [];
                    if (latex[i + 1] == "{") {
                        i = i + 2;
                        var temp = [];
                        temp.push("{");
                        for (; i < len; i++) {
                            if (temp.length == 0) {
                                break;
                            }
                            if (latex[i] == "{") {
                                temp.push("{");
                            }
                            else if (latex[i] == "}") {
                                temp.pop();
                            }
                            else {
                                demCharView.push(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, this.keyMap[latex[i]], input));
                            }
                        }
                    }
                    // 往后移，判断分母
                    var molCharView = [];
                    if (latex[i] == "{") {
                        temp.length = 0;
                        temp.push("{");
                        i++;
                        for (; i < len; i++) {
                            if (temp.length == 0) {
                                break;
                            }
                            if (latex[i] == "{") {
                                temp.push("{");
                            }
                            else if (latex[i] == "}") {
                                temp.pop();
                            }
                            else {
                                molCharView.push(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, this.keyMap[latex[i]], input));
                            }
                        }
                    }
                    // 新建分数，放入组件
                    var fractionsCharView = new DigitalInput.FractionsCharView(document.createElement("span"), DigitalInput.InputText.textId++, this.keyMap["—"], input);
                    fractionsCharView.editableSpans[0].setText(intCharView.reverse());
                    fractionsCharView.editableSpans[1].setText(demCharView);
                    fractionsCharView.editableSpans[2].setText(molCharView);
                    fractionsCharView.changeStyle(false);
                    fracCharViews.push(fractionsCharView);
                    // 记住序号
                    fracIndexs_start.push(j + 1);
                    fracIndexs_end.push(--i);
                }
            }
            var x = 0;
            for (var i = 0, len = latex.length; i < len; i++) {
                if (x < fracIndexs_start.length && fracIndexs_start[x] == i) {
                    charViews.push(fracCharViews[x]);
                    i = fracIndexs_end[x];
                    x++;
                    continue;
                }
                if (latex[i] == "•") {
                    if (latex[i + 1] == "{") {
                        i = i + 2;
                        while (i < latex.length && latex[i] != "}") {
                            var charView = new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, this.keyMap[latex[i]], input, true);
                            charViews.push(charView);
                            DigitalInput.RepetedentUtils.addRepetedView(charView);
                            i++;
                        }
                    }
                }
                else if (this.keyMap[latex[i]]) {
                    charViews.push(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, this.keyMap[latex[i]], input));
                }
            }
            return charViews;
        };
        Parser.prototype.initKeyMap = function () {
            this.keyMap = [];
            for (var i = 0, len = DigitalKey.KeyFactory.keys.length; i < len; i++) {
                this.keyMap[DigitalKey.KeyFactory.keys[i].getTag()] = DigitalKey.KeyFactory.keys[i];
            }
        };
        return Parser;
    })();
    DigitalInput.Parser = Parser;
    var InputText = (function () {
        function InputText(element, digital_id, onTextChange, disabled) {
            if (disabled === void 0) { disabled = false; }
            /**
             * 光标位置序号
             */
            this.cursorIndex = -1;
            /**
             * 是否点击内部传过来的事件
             */
            this.isClickInner = false;
            this.element = element;
            this.digital_id = digital_id;
            this.onTextChange = onTextChange;
            this.disabled = disabled;
            this.init();
            this.setOnClick();
            this.isEditInChild = false;
        }
        InputText.prototype.onFocus = function () {
            if (this.onfocus) {
                this.onfocus();
            }
        };
        InputText.prototype.onBlur = function () {
            this.changeChildStyle(false);
            if (this.onblur) {
                this.onblur();
            }
        };
        InputText.prototype.destory = function () {
            if (this.onTextChange) { this.onTextChange = null; }
            if (this.onfocus) { this.onfocus = null; }
            if (this.onfocus) { this.onfocus = null; }
            if (this.onCursorCallBack) { this.onCursorCallBack = null; }
            if (this.contentElement) {
                if (this.contentElement.parentElement) {
                    this.contentElement.parentElement.removeChild(this.contentElement);
                }
                this.contentElement = null;
            }
            if (this.textList) {
                this.textList.length = 0;
                this.textList = null;
            }
            if (this.element) {
                if (this.mouseDownEventListener) {
                    this.element.removeEventListener(DigitalKey.EventUtil.vEventHandler.mouseDown, this.mouseDownEventListener);
                }
                this.element = null;
            }
            this.disabled = true;
        };
        InputText.prototype.setFocusCallback = function (onfocus, onblur) {
            this.onfocus = onfocus;
            this.onblur = onblur;
        };
        // 2016/12/12 支持手写输入框提供的API
        InputText.prototype.setCursorCallback = function (onCursorCallBack) {
            this.onCursorCallBack = onCursorCallBack;
        }
        // 2016/12/12 支持手写输入框提供的API
        InputText.prototype.isCursorLast = function () {
            if (this.cursorIndex == this.textList.length || this.cursorIndex == -1) {
                return true;
            }
            return false;
        }
        InputText.prototype.setDisabled = function (disabled) {
            this.disabled = disabled;
        };
        InputText.prototype.getDisabled = function () {
            return this.disabled;
        };
        InputText.prototype.setOnClick = function () {
            var _this = this;
            var this_ = this;
            DigitalKey.EventUtil.bindClickEvent(this.element, function (e) {
                if (!this_.disabled) {
                    DigitalKey.LogUtils.log("InputText");
                    DigitalInput.InputManager.getInstance().openKeyBoard(_this.digital_id);
                    if (!this_.isClickInner) {
                        this_.setCursor(_this.textList.length);
                    }
                    this_.isClickInner = false;
                }
            });
            this.mouseDownEventListener = function (e) {
                // console.log("input onmousedown");
                // DigitalInput.ViewUtils.stopEvent(e);
                DigitalInput.InputManager.getInstance().stopEvent(true);
            };
            this.element.removeEventListener(DigitalKey.EventUtil.vEventHandler.mouseDown, this.mouseDownEventListener);
            this.element.addEventListener(DigitalKey.EventUtil.vEventHandler.mouseDown, this.mouseDownEventListener);
        };
        InputText.prototype.init = function () {
            var classString = this.element.getAttribute("class");
            this.element.setAttribute("class", classString + " input_cursor");
            this.contentElement = document.createElement("span");
            this.contentElement.setAttribute("class", "main_container");
            this.element.appendChild(this.contentElement);
            this.textList = [];
        };
        InputText.prototype.adjustView = function (offset) {
            if (offset === void 0) { offset = 0; }
            var cursorLeft = DigitalInput.ViewUtils.offsetFuns(DigitalInput.Cursor.getInstance().element).left;
            var inputLeft = DigitalInput.ViewUtils.offsetFuns(this.element).left;
            var inputWidth = this.element.offsetWidth;
            if ((cursorLeft - inputLeft - inputWidth) > 0 || offset != 0) {
                this.element.scrollLeft = DigitalInput.Cursor.getInstance().element.offsetLeft - inputWidth + DigitalInput.Cursor.getInstance().element.offsetWidth * 10 + offset;
            }
            else if (cursorLeft <= inputLeft) {
                this.element.scrollLeft = DigitalInput.Cursor.getInstance().element.offsetLeft - DigitalInput.Cursor.getInstance().element.offsetWidth * 8 - offset;
            }
        };
        /**
         * 设置光标位置
         * @param index
         */
        InputText.prototype.setCursor = function (index) {
            if (this.disabled) {
                return true;
            }
            if (this.cursorIndex == index && this.contentElement == DigitalInput.Cursor.getInstance().element.parentElement) {
                return;
            }
            this.isEditInChild = false;
            if (this.textList.length == 0 || index >= this.textList.length || index < 0) {
                DigitalInput.Cursor.getInstance().setCursor(this.contentElement);
                this.cursorIndex = this.textList.length;
                if (this.onCursorCallBack) {
                    this.onCursorCallBack(true);
                }
            }
            else {
                DigitalInput.Cursor.getInstance().setCursor(this.contentElement, this.textList[index].element);
                this.cursorIndex = index;
                if (this.onCursorCallBack) {
                    this.onCursorCallBack(false);
                }
            }
            this.adjustView();
            this.changeChildStyle(false);
            return false;
        };
        InputText.prototype.changeChildStyle = function (isEditable) {
            for (var i = 0; i < this.textList.length; i++) {
                this.textList[i].changeStyle(isEditable);
            }
        };
        /**
         * 光标前进一格
         */
        InputText.prototype.foward = function (step) {
            if (step === void 0) { step = 1; }
            if (this.isEditInChild) {
                this.textList[this.cursorIndex].foward(step);
            }
            else {
                var index = this.cursorIndex + step;
                if (index > this.textList.length) {
                    index = this.textList.length;
                }
                this.setCursor(index);
            }
        };
        /**
         * 光标后退一格
         */
        InputText.prototype.back = function (step) {
            if (step === void 0) { step = 1; }
            if (this.isEditInChild) {
                this.textList[this.cursorIndex].back(step);
            }
            else {
                var index = this.cursorIndex - step;
                if (index < 0) {
                    index = 0;
                }
                this.setCursor(index);
            }
        };
        /**
         * 增加一个基础文本(CharView)
         * @param charView 要添加的文本
         * @param indexOffset 所要添加的位置与当前光标的位移差
         */
        InputText.prototype.addText = function (charView, indexOffset) {
            if (this.isEditInChild) {
                charView.setOnClick(this.textList[this.cursorIndex].getCurrentEditableArea());
                this.textList[this.cursorIndex].addText(charView, indexOffset);
            }
            else {
                var index = this.cursorIndex + indexOffset;
                if (index < 0 || index > this.textList.length) {
                    index = this.cursorIndex;
                }
                if (index == this.cursorIndex) {
                    // 在光标位置加入
                    var cursorParent = DigitalInput.Cursor.getInstance().element.parentElement;
                    if (!cursorParent) {
                        return;
                    }
                    if (cursorParent.lastChild == DigitalInput.Cursor.getInstance().element) {
                        cursorParent.appendChild(charView.element);
                    }
                    else {
                        cursorParent.insertBefore(charView.element, DigitalInput.Cursor.getInstance().element.nextSibling);
                    }
                    cursorParent = null;
                }
                else {
                    var cursorParent = this.textList[index].element.parentElement;
                    if (!cursorParent) {
                        return;
                    }
                    if (index == this.textList.length) {
                        cursorParent.appendChild(charView.element);
                    }
                    else {
                        cursorParent.insertBefore(charView.element, this.textList[index].element);
                    }
                    cursorParent = null;
                }
                this.textList.splice(index, 0, charView);
            }
            this.onTextChange(this.parseToString());
        };
        /**
         * 删除所有文本
         */
        InputText.prototype.deleteAll = function (isFocus) {
            if (this.textList.length == 0) {
                return;
            }
            this.delNextElement(this.contentElement.firstChild, this.contentElement);
            this.textList.length = 0;
            if (isFocus) {
                this.setCursor(0);
                DigitalInput.InputManager.getInstance().changeInputText(this.element.getAttribute("digital_id"));
            }
            this.onTextChange(this.parseToString());
        };
        /**
         * 递归删除文本
         */
        InputText.prototype.delNextElement = function (e, parent) {
            if (e) {
                var next = e.nextSibling;
                if (parent) {
                    parent.removeChild(e);
                }
                this.delNextElement(next, parent);
            }
        };

        InputText.prototype.deleteAndBack = function (isFocus) {
            this.deleteText(0);
            this.back();
            if (isFocus) {
                DigitalInput.InputManager.getInstance().changeInputText(this.element.getAttribute("digital_id"));
                this.setCursor(this.textList.length);
                this.isClickInner = false;
            }
        };

        /**
         * 删除一个文本
         * @param indexOffset 文本所处位置，无则删除最后一个
         */
        InputText.prototype.deleteText = function (indexOffset) {
            if (this.isEditInChild) {
                this.textList[this.cursorIndex].deleteText(indexOffset);
            }
            else {
                if (this.textList.length == 0) {
                    return;
                }
                var index = this.cursorIndex + indexOffset;
                if (index < 0 || index > this.textList.length) {
                    index = this.cursorIndex;
                }
                if (index == 0) {
                    return;
                }
                var charView = this.textList.splice(index - 1, 1).pop();
                charView.element.parentElement.removeChild(charView.element);
                charView.element.style.display = "none";
                charView = null;
            }
            this.onTextChange(this.parseToString());
        };
        /**
         * 移除光标
         */
        InputText.prototype.removeCursor = function () {
            this.contentElement.removeChild(DigitalInput.Cursor.getInstance().element);
            DigitalInput.Cursor.getInstance().clearCursor();
        };
        /**
         * 解析输入区域的内容为字符串
         * @returns {string} 输入区域的文本
         */
        InputText.prototype.parseToString = function () {
            var res = [];
            var repetends = "";
            for (var i = 0, len = this.textList.length; i < len; i++) {
                var item = this.textList[i];
                var itemString = item.parseToString();
                if (item.isRepetend) {
                    repetends += itemString;
                }
                else {
                    if (repetends != "") {
                        res.push("\\dot {" + repetends + "}");
                    }
                    res.push(itemString);
                    repetends = "";
                }
            }
            // 最后一个数是循环节
            if (repetends != "") {
                res.push("\\dot {" + repetends + "}");
            }
            repetends = null;
            for (var index = res.length - 1; index > -1; index--) {
                if (res[index] == "^{2}") {
                    index = DigitalInput.squareUtil.handleSquare(res, index);
                }
            }
            var result = "";
            for (var j = 0, len = res.length; j < len; j++) {
                result += res[j];
            }
            result = HandleTextType.handlePackage(result);
            return result;
        };
        InputText.prototype.setText = function (charViews) {
            this.delNextElement(this.contentElement.firstChild, this.contentElement);
            this.textList.length = 0;
            for (var i = 0, len = charViews.length; i < len; i++) {
                this.textList.push(charViews[i]);
                this.contentElement.appendChild(charViews[i].element);
            }
            this.onTextChange(this.parseToString());
        };
        InputText.prototype.appendText = function (charViews, isFocus) {
            if (this.cursorIndex < 0 || this.cursorIndex > this.textList.length) {
                // 无光标情况下
                for (var i = 0, len = charViews.length; i < len; i++) {
                    this.textList.push(charViews[i]);
                    this.contentElement.appendChild(charViews[i].element);
                }
                if (isFocus) {
                    DigitalInput.InputManager.getInstance().changeInputText(this.element.getAttribute("digital_id"));
                    this.setCursor(this.textList.length);
                    this.isClickInner = false;
                }
                this.onTextChange(this.parseToString());
            } else {
                for (var i = 0, len = charViews.length; i < len; i++) {
                    this.addText(charViews[i], 0);
                    this.foward();
                    // this.textList.push(charViews[i]);
                    // this.contentElement.appendChild(charViews[i].element);
                }
                this.onTextChange(this.parseToString());
            }
        };


        /**
         * 2017-3-29 v1.2.1 获取光标的相关信息
         */
        InputText.prototype.getCursorPosAndPreChar = function () {
            if (this.cursorIndex == -1) {
                return { top: 0, left: 0, preChar: '' }
            }
            var info = $(DigitalInput.Cursor.getInstance().element).position();
            if (!info) {
                info = { top: 0, left: 0 };
            }
            info['preChar'] = this.getPreChar();
            info['height'] = DigitalInput.Cursor.getInstance().element.offsetHeight || 0;
            return info;
        }

        /**
         * 2017-3-29 v1.2.1 获取光标的前一个字符
         */
        InputText.prototype.getPreChar = function () {
            if (this.cursorIndex == 0) {
                return '';
            } else {
                if (this.isEditInChild) {
                    return this.textList[this.cursorIndex].getPreChar();
                }
                else {
                    var index = this.cursorIndex - 1;
                    var charView = this.textList[index];
                    if (charView.isComplexView) {
                        return '';
                    }
                    return this.textList[index].parseToString();
                }
            }
        }

        /**
         * 2017-3-29 v1.2.1 替换光标前的字符
         * {preChar:'',left:'',top:'',height:''}
         */
        InputText.prototype.replaceCursorPreChar = function (chars) {
            if (!chars || chars.lenght < 1) {
                LogUtils.error('解析字符有误' + chars);
                return;
            }
            var char = chars[0];
            if (this.cursorIndex == 0 || this.cursorIndex == -1) {
                return;
            } else {
                if (this.isEditInChild) {
                    if (this.textList[this.cursorIndex].replaceCursorPreChar(char)) {
                        this.onTextChange(this.parseToString());
                    }
                } else {
                    var index = this.cursorIndex;
                    var charView = this.textList.splice(index - 1, 1, char).pop();
                    var parent = charView.element.parentElement;
                    parent.removeChild(charView.element);
                    charView.element.style.display = "none";
                    charView = null;
                    parent.insertBefore(char.element, DigitalInput.Cursor.getInstance().element);
                    this.onTextChange(this.parseToString());
                }
            }
        };

        InputText.prototype.getCursorIndex = function () {
            return this.cursorIndex;
        }

        /**
         * 自增加id
         * @type {number}
         */
        InputText.textId = 1000;
        return InputText;
    })();
    DigitalInput.InputText = InputText;
    var HandleTextType = (function () {
        function HandleTextType() {
        }
        HandleTextType.isNumber = function (text) {
            var number = /^-?[0-9]+\.?[0-9]*$/;
            return number.test(text);
        };
        HandleTextType.handlePackage = function (text) {
            if (text && text.length > 0) {
                if (HandleTextType.isNumber(text)) {
                    // 是数字，不做改变
                    return text;
                }
                else {
                    // 是公式，添加包裹
                    return "\\(" + text + "\\)";
                }
            }
            else {
                return text;
            }
        };
        HandleTextType.removePackage = function (text) {
            var len = text.length;
            if (text.substring(0, 2) == "\\(" && text.substring(len - 2, len) == "\\)") {
                return text.substring(2, len - 2);
            }
            else {
                return text;
            }
        };
        return HandleTextType;
    })();
    DigitalInput.HandleTextType = HandleTextType;
    var RepetedentUtils = (function () {
        function RepetedentUtils() {
        }
        RepetedentUtils.addRepetedView = function (charView) {
            charView.element.innerHTML = "";
            var repetedSpan = document.createElement("span");
            repetedSpan.innerHTML = ".";
            repetedSpan.setAttribute("class", "repetend_visible");
            repetedSpan.setAttribute("repeted", "circle");
            var valueSpan = document.createElement("span");
            valueSpan.innerHTML = charView.key.getValue();
            valueSpan.setAttribute("repeted", "value");
            charView.element.appendChild(repetedSpan);
            charView.element.appendChild(valueSpan);
        };
        RepetedentUtils.removeRepetedView = function (charView) {
            var eles = charView.element.children;
            while (eles.length > 0) {
                charView.element.removeChild(eles[0]);
            }
            eles = null;
            charView.element.innerHTML = charView.key.getValue();
        };
        return RepetedentUtils;
    })();
    DigitalInput.RepetedentUtils = RepetedentUtils;
    var ViewUtils = (function () {
        function ViewUtils() {
        }
        ViewUtils.getDefaultStyle = function (obj, attribute) {
            return obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, "")[attribute];
        };
        ViewUtils.stopEvent = function (e) {
            if (e) {
                e.stopPropagation();
            }
            else {
                window.event.cancelable = true;
            }
        };
        ;
        /**
         * 获取元素的横坐标位置
         * @param obj
         * @returns {number}
         */
        ViewUtils.getOffsetLeft = function (obj) {
            var tmp = obj.offsetLeft;
            var val = obj.offsetParent;
            while (val != null) {
                tmp += val.offsetLeft;
                val = val.offsetParent;
            }
            return tmp;
        };
        ViewUtils.offsetFuns = function (elem) {
            var docElem, win, box = { top: 0, left: 0 }, doc = elem && elem.ownerDocument;
            if (!doc) {
                return;
            }
            docElem = doc.documentElement;
            // If we don't have gBCR, just use 0,0 rather than error
            // BlackBerry 5, iOS 3 (original iPhone)
            if (typeof elem.getBoundingClientRect !== typeof undefined) {
                box = elem.getBoundingClientRect();
            }
            win = doc == doc.window ? doc : (doc.nodeType === 9 ? doc.defaultView || doc.parentWindow : false);
            return {
                top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        };
        ;
        return ViewUtils;
    })();
    DigitalInput.ViewUtils = ViewUtils;
    var squareUtil = (function () {
        function squareUtil() {
        }
        /**
         * 递归来处理平方
         * @param strs
         * @param index
         * @returns {number}
         */
        squareUtil.handleSquare = function (strs, index) {
            var temp = [];
            strs.splice(index--, 0, "}");
            if (strs[index] == "} \\right )") {
                temp.push(strs[index--]);
                while (temp.length != 0 && index > -1) {
                    if (strs[index] == "} \\right )") {
                        temp.push(strs[index--]);
                    }
                    else if (strs[index] == "\\left ( {") {
                        temp.pop();
                    }
                    else if (strs[index] == "^{2}") {
                        index = this.handleSquare(strs, index);
                    }
                    index--;
                }
                strs.splice(index + 1, 0, "{");
                return index;
            }
            else if (strs[index] == "} \\right ]") {
                temp.push(strs[index--]);
                while (temp.length != 0 && index > -1) {
                    if (strs[index] == "} \\right ]") {
                        temp.push(strs[index--]);
                    }
                    else if (strs[index] == "\\left [ {") {
                        temp.pop();
                    }
                    else if (strs[index] == "^{2}") {
                        index = this.handleSquare(strs, index);
                    }
                    index--;
                }
                strs.splice(index + 1, 0, "{");
                return index;
            }
            else if (strs[index] == "\\pi ") {
                strs.splice(index--, 0, "{");
                return index;
            }
            else {
                var re = /^[0-9]+.?[0-9]*$/;
                while (index > -1) {
                    if (strs[index].indexOf("\\dot") != -1) {
                        index--;
                    }
                    else if (strs[index].indexOf("\\frac") != -1) {
                        index--;
                    }
                    else if (re.test(strs[index])) {
                        index--;
                    }
                    else if (strs[index] == "^{2}") {
                        index = this.handleSquare(strs, index);
                    }
                    else {
                        break;
                    }
                }
                strs.splice(index + 1, 0, "{");
                return index;
            }
        };
        return squareUtil;
    })();
    DigitalInput.squareUtil = squareUtil;
})(DigitalInput || (DigitalInput = {}));
var DigitalKey;
(function (DigitalKey) {
    var DigitalKeyBoard = (function () {
        function DigitalKeyBoard() {
            this.init();
        }
        DigitalKeyBoard.getInstance = function () {
            if (DigitalKeyBoard.instance == null) {
                DigitalKeyBoard.instance = new DigitalKeyBoard();
            }
            return DigitalKeyBoard.instance;
        };
        DigitalKeyBoard.prototype.init = function () {
            this.keyList = [];
            this.hasBindClick = false;
            // 初始化按键
            var keys = DigitalKey.KeyFactory.keys;
            for (var i = 0, len = keys.length; i < len; i++) {
                this.keyList.push(new KeyView(keys[i]));
            }
            // 初始化外层容器
            this.keyContainer = document.createElement("div");
            this.keyContainer.setAttribute("class", "exam_wood com_keyboard com_keyboard_number not_select");
            var container = document.createElement("div");
            container.setAttribute("class", "keyboard");
            // 初始化关闭按钮
            var closeRow = document.createElement("div");
            closeRow.setAttribute("class", "boardtop");
            var imgPre = document.createElement("div");
            imgPre.setAttribute("class", "pre_key_press_img");
            closeRow.appendChild(imgPre);
            var closeBtn = document.createElement("a");
            closeBtn.setAttribute("class", "btn_open");
            closeBtn.href = "###";
            closeRow.appendChild(closeBtn);
            DigitalKey.EventUtil.bindClickEvent(closeBtn, function (e) {
                DigitalInput.InputManager.getInstance().closeKeyBoard(true);
            });
            container.appendChild(closeRow);
            // 初始化按键
            for (var i = 0; i < 4; i++) {
                var ul = document.createElement("ul");
                ul.setAttribute("class", "keyrow");
                for (var j = 0; j < 11; j++) {
                    ul.appendChild(this.keyList[i * 11 + j].getElement());
                }
                container.appendChild(ul);
            }
            this.keyContainer.appendChild(container);
        };
        /**
         * 设置监听，在打开键盘的时候
         */
        DigitalKeyBoard.prototype.setOnClick = function (inputText) {
            var _this = this;
            this.inputText = inputText;
            if (this.hasBindClick) {
                return;
            }
            var time_;
            this.keyContainer.addEventListener(DigitalKey.EventUtil.vEventHandler.mouseDown, function (e) {
                var target = DigitalKey.EventUtil.getEventTarget(e);
                var keyId = target.getAttribute("key_id");
                var re = /^[0-9]+.?[0-9]*$/;
                if (re.test(keyId) && -1 < keyId && keyId < _this.keyList.length) {
                    var keyView = _this.keyList[keyId];
                    if (keyView) {
                        var onLongClick = keyView.getOnLongClickCallBack();
                        if (onLongClick) {
                            DigitalKey.LogUtils.log("keyContainaer  mousedown on " + target.tagName + " " + keyId);
                            time_ = setTimeout(function () {
                                onLongClick(_this.inputText, keyView.getKey(), e);
                            }, 1500);
                        }
                    }
                }
                DigitalInput.InputManager.getInstance().stopEvent(true);
                //DigitalInput.ViewUtils.stopEvent(e);
            });
            this.keyContainer.addEventListener(DigitalKey.EventUtil.vEventHandler.mouseUp, function (e) {
                var target = DigitalKey.EventUtil.getEventTarget(e);
                var keyId = target.getAttribute("key_id");
                var re = /^[0-9]+.?[0-9]*$/;
                if (re.test(keyId) && -1 < keyId && keyId < _this.keyList.length) {
                    var keyView = _this.keyList[keyId];
                    if (keyView) {
                        var onLongClick = keyView.getOnLongClickCallBack();
                        if (onLongClick) {
                            DigitalKey.LogUtils.log("keyContainaer  mouseup on " + target.tagName + " " + keyId);
                            clearTimeout(time_);
                        }
                    }
                }
                //DigitalInput.ViewUtils.stopEvent(e);
            });
            DigitalKey.EventUtil.bindClickEvent(this.keyContainer, function (e) {
                var target = DigitalKey.EventUtil.getEventTarget(e);
                var keyId = target.getAttribute("key_id");
                DigitalKey.LogUtils.log("keyContainaer  mouseclick on " + target.tagName + " " + keyId);
                var re = /^[0-9]+.?[0-9]*$/;
                if (re.test(keyId) && -1 < keyId && keyId < _this.keyList.length) {
                    var keyView = _this.keyList[keyId];
                    var callback = keyView.getOnClickCallBack();
                    callback(_this.inputText, keyView.getKey(), e);
                }
                //DigitalInput.ViewUtils.stopEvent(e);
            });
            //for (var i:number = 0, len = this.keyList.length; i < len; i++) {
            //    this.keyList[i].setOnClick(inputText);
            //    this.keyList[i].setOnLongClick(inputText);
            //}
            this.hasBindClick = true;
        };
        return DigitalKeyBoard;
    })();
    DigitalKey.DigitalKeyBoard = DigitalKeyBoard;
    var Key = (function () {
        function Key(tag, name, value, latex) {
            if (tag === void 0) { tag = ""; }
            if (name === void 0) { name = ""; }
            if (value === void 0) { value = ""; }
            if (latex === void 0) { latex = ""; }
            this.tag = tag;
            this.name = name;
            this.value = value;
            this.latex = latex;
        }
        Key.prototype.getId = function () {
            return this.id;
        };
        Key.prototype.setId = function (id) {
            this.id = id;
        };
        Key.prototype.getOnClickFunction = function () {
            return this.onClick;
        };
        /**
         * 设置点击函数的变量
         * @param onClick 点击函数的变量
         */
        Key.prototype.setOnClickFunction = function (onClick) {
            this.onClick = onClick;
        };
        /**
         * 设置长按点击事件
         * @param onLongClick
         */
        Key.prototype.setOnLongClickFunction = function (onLongClick) {
            this.onLongClick = onLongClick;
        };
        Key.prototype.getOnLongClickFunction = function () {
            return this.onLongClick;
        };
        /**
         * 该key的标识符号或说明
         * 在解析文本时会被作为替换值替换到latex文本
         * 尽量保证为单字符
         * @returns {string}
         */
        Key.prototype.getTag = function () {
            return this.tag;
        };
        Key.prototype.setTag = function (tag) {
            this.tag = tag;
        };
        /**
         * 返回key显示在键盘上的html
         * @returns {string}
         */
        Key.prototype.getName = function () {
            return this.name;
        };
        Key.prototype.setName = function (name) {
            this.name = name;
        };
        /**
         * 返回key显示在输入框中的html
         * @returns {string}
         */
        Key.prototype.getValue = function () {
            return this.value;
        };
        Key.prototype.setValue = function (value) {
            this.value = value;
        };
        /**
         * key对应解析的latex文本
         * @returns {string}
         */
        Key.prototype.getLatex = function () {
            return this.latex;
        };
        Key.prototype.setLatex = function (latex) {
            this.latex = latex;
        };
        /**
         * 按键显示是否有特殊样式,例如：smallFont样式
         * 会新建一个em标签并设置该样式，再将value放进去
         * @returns {string}
         */
        Key.prototype.getKeyStyle = function () {
            return this.keyStyle;
        };
        Key.prototype.setKeyStyle = function (keyStyle) {
            this.keyStyle = keyStyle;
        };
        /**
         * 返回是否需要点击的提示
         * @returns {string}
         */
        Key.prototype.isHasTip = function () {
            return this.hasTip;
        };
        Key.prototype.setHasTip = function (hasTip) {
            this.hasTip = hasTip;
        };
        return Key;
    })();
    DigitalKey.Key = Key;
    var KeyFactory = (function () {
        function KeyFactory() {
        }
        KeyFactory.init = function () {
            this.keys = [];
            for (var i = 0; i < Keys.keyJson.length; i++) {
                var key = new DigitalKey.Key();
                key.setId(i + "");
                key.setTag(Keys.keyJson[i].tag);
                key.setName(Keys.keyJson[i].name);
                key.setValue(Keys.keyJson[i].value);
                key.setLatex(Keys.keyJson[i].latex);
                if (Keys.keyJson[i]["keyStyle"] === void 0) {
                    key.setKeyStyle(null);
                }
                else {
                    key.setKeyStyle(Keys.keyJson[i]["keyStyle"]);
                }
                if (Keys.keyJson[i]["hasTip"] === void 0) {
                    key.setHasTip(true);
                }
                else {
                    key.setHasTip(Keys.keyJson[i]["hasTip"]);
                }
                if (Keys.keyJson[i]["callback"] !== void 0) {
                    key.setOnClickFunction(DigitalKey.EventCallBacks.getCallBack(Keys.keyJson[i]["callback"]));
                }
                if (Keys.keyJson[i]["longClickBack"] !== void 0) {
                    key.setOnLongClickFunction(DigitalKey.EventCallBacks.getCallBack(Keys.keyJson[i]["longClickBack"]));
                }
                this.keys.push(key);
                key = null;
            }
        };
        return KeyFactory;
    })();
    DigitalKey.KeyFactory = KeyFactory;
    var Keys = (function () {
        function Keys() {
        }
        /**
         *  按键的json数据，参数意义参考 Key 类
         */
        Keys.keyJson = [
            { tag: "0", name: "0", value: "0", latex: "0" },
            { tag: "1", name: "1", value: "1", latex: "1" },
            { tag: "2", name: "2", value: "2", latex: "2" },
            { tag: "3", name: "3", value: "3", latex: "3" },
            { tag: "4", name: "4", value: "4", latex: "4" },
            { tag: "5", name: "5", value: "5", latex: "5" },
            { tag: "6", name: "6", value: "6", latex: "6" },
            { tag: "7", name: "7", value: "7", latex: "7" },
            { tag: "8", name: "8", value: "8", latex: "8" },
            { tag: "9", name: "9", value: "9", latex: "9" },
            {
                tag: "backspace",
                name: "",
                value: "",
                latex: "",
                keyStyle: "icon_del",
                hasTip: false,
                callback: "backCallBack",
                longClickBack: "backLongClickCallBack"
            },
            { tag: "≈", name: "&asymp;", value: "&asymp;", latex: "\\approx " },
            { tag: "(", name: "(", value: "(", latex: "(" },
            { tag: ")", name: ")", value: ")", latex: ")" },
            { tag: "<", name: "&lt;", value: "&lt;", latex: "<" },
            { tag: ">", name: "&gt;", value: "&gt;", latex: ">" },
            { tag: "+", name: "+", value: "+", latex: "+" },
            { tag: "-", name: "-", value: "-", latex: "-" },
            { tag: "×", name: "&times;", value: "&times;", latex: "\\times " },
            { tag: "÷", name: "&divide;", value: "&divide;", latex: "\\div " },
            { tag: "=", name: "=", value: "=", latex: "=" },
            {
                tag: "up arrow",
                name: "&uarr;",
                value: "",
                latex: "",
                callback: "upCallBack"
            },
            { tag: "π", name: "&pi;", value: "&pi;", latex: "\\pi " },
            { tag: "[", name: "【", value: "[", latex: "[" },
            { tag: "]", name: "】", value: "]", latex: "]" },
            { tag: "≤", name: "&le;", value: "&le;", latex: "\\leq " },
            { tag: "≥", name: "&ge;", value: "&ge;", latex: "\\geq " },
            { tag: "²", name: "&sup2;", value: "&sup2;", latex: "^{2}" },
            {
                tag: "•",
                name: "&bull;",
                value: "&bull;",
                latex: "\\dot",
                keyStyle: "font_super",
                callback: "repetendCallBack"
            },
            {
                tag: "sign",
                name: "+/-",
                value: "",
                latex: "",
                keyStyle: "font_small",
                callback: "signCallBack"
            },
            {
                tag: "—",
                name: "&mdash;",
                value: "&mdash;",
                latex: "\\frac",
                callback: "fractionsCallBack"
            },
            { tag: "…", name: "&hellip;", value: "...", latex: "\\dots " },
            {
                tag: "down arrow",
                name: "&darr;",
                value: "",
                latex: "",
                callback: "downCallBack"
            },
            { tag: "∠", name: "&ang;", value: "&ang;", latex: "\\angle " },
            { tag: "°", name: "&deg;", value: "&deg;", latex: "°" },
            { tag: "℃", name: "&deg;C", value: "℃", latex: "℃" },
            { tag: "%", name: "%", value: "%", latex: "\\%" },
            { tag: " ", name: "Space", value: "&nbsp;", latex: "\\, ", keyStyle: "font_small" },
            { tag: ".", name: ".", value: ".", latex: "." },
            { tag: ",", name: ",", value: ",", latex: "," },
            { tag: ":", name: ":", value: ":", latex: ":" },
            {
                tag: "left arrow",
                name: "&larr;",
                value: "",
                latex: "",
                callback: "leftCallBack"
            },
            {
                tag: "right arrow",
                name: "&rarr;",
                value: "",
                latex: "",
                callback: "rightCallBack"
            },
            {
                tag: "Enter",
                name: "Enter",
                value: "",
                latex: "",
                keyStyle: "font_small",
                callback: "enterCallBack"
            }
        ];
        return Keys;
    })();
    var KeyView = (function () {
        /**
         *
         * @param key  按键的详细说明key
         */
        function KeyView(key) {
            this.key = key;
            this.init();
        }
        /**
         * 返回该按键的element
         * @returns {HTMLLIElement}
         */
        KeyView.prototype.getElement = function () {
            return this.keyElement;
        };
        /**
         * 返回该按键的key属性
         * @returns {DigitalKey.Key}
         */
        KeyView.prototype.getKey = function () {
            return this.key;
        };
        //public setStyleChange(element,className,classNamePress) {
        //    element.addEventListener(EventUtil.vEventHandler.mouseDown,()=>{
        //        LogUtils.log("key down");
        //        element.setAttribute("class", classNamePress);
        //    });
        //    element.addEventListener(EventUtil.vEventHandler.mouseUp,()=>{
        //        LogUtils.log("key up");
        //        element.setAttribute("class", className);
        //    });
        //    element.addEventListener("mouseout",()=>{
        //        LogUtils.log("key out");
        //        element.setAttribute("class", className);
        //    });
        //if (this.tipDiv) {
        //    if (isShow) {
        //        this.tipDiv.setAttribute("class", "tipbox tipbox_show");
        //    } else {
        //        this.tipDiv.setAttribute("class", "tipbox tipbox_hidden");
        //    }
        //}
        //if (this.aDiv) {
        //    if (isShow) {
        //        this.aDiv.setAttribute("class", "key key_press");
        //    } else {
        //        this.aDiv.setAttribute("class", "key key_normal");
        //    }
        //}
        //}
        KeyView.prototype.init = function () {
            this.keyElement = document.createElement("li");
            // 设置按键
            var span = document.createElement("span");
            span.setAttribute("class", "txt");
            span.setAttribute("key_id", this.key.getId());
            if (this.key.getKeyStyle()) {
                // 如果有特殊样式，则设置一个em标签来设置样式包含
                var em = document.createElement("em");
                em.setAttribute("class", this.key.getKeyStyle());
                em.setAttribute("key_id", this.key.getId());
                em.innerHTML = this.key.getName();
                span.appendChild(em);
                em = null;
            }
            else {
                span.innerHTML = this.key.getName();
            }
            var aEle = document.createElement("a");
            aEle.href = "###";
            aEle.setAttribute("class", "key key_normal");
            aEle.appendChild(span);
            aEle.setAttribute("key_id", this.key.getId());
            this.keyElement.appendChild(aEle);
            //this.setStyleChange(div,"key key_normal","key key_press");
            // 设置提示
            //if (this.key.isHasTip()) {
            //    var p:HTMLParagraphElement = document.createElement("p");
            //    p.setAttribute("class", "tip");
            //    p.setAttribute("key_id", this.key.getId());
            //    if (this.key.getKeyStyle()) {
            //        // 如果有特殊样式，则设置一个em标签来设置样式包含
            //        var em = document.createElement("em");
            //        em.setAttribute("class", this.key.getKeyStyle());
            //        em.setAttribute("key_id", this.key.getId());
            //        em.innerHTML = this.key.getName();
            //        p.appendChild(em);
            //        em = null;
            //    } else {
            //        p.innerHTML = this.key.getName();
            //    }
            //    this.tipDiv = document.createElement("div");
            //    this.tipDiv.setAttribute("class", "tipbox tipbox_hidden");
            //    this.tipDiv.setAttribute("key_id", this.key.getId());
            //    this.tipDiv.appendChild(p);
            //    this.keyElement.appendChild(this.tipDiv);
            //}
        };
        KeyView.prototype.getOnClickCallBack = function () {
            var _this = this;
            var onClick = this.key.getOnClickFunction();
            if (onClick) {
                return onClick;
            }
            else {
                return function (editor, key, e) {
                    editor.addText(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, _this.key, editor), 0);
                    editor.foward();
                };
            }
        };
        //public setOnClick(editor:DigitalInput.EditableArea) {
        //    var onClick = this.key.getOnClickFunction();
        //    if (onClick) {
        //        DigitalKey.EventUtil.bindClickEvent(this.keyElement, (e)=> {
        //            onClick(editor, this.key, e);
        //            DigitalInput.ViewUtils.stopEvent(e);
        //        });
        //    } else {
        //        DigitalKey.EventUtil.bindClickEvent(this.keyElement, (e)=> {
        //            editor.addText(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, this.key, editor), 0);
        //            editor.foward();
        //            DigitalInput.ViewUtils.stopEvent(e);
        //        });
        //    }
        //};
        KeyView.prototype.getOnLongClickCallBack = function () {
            return this.key.getOnLongClickFunction();
        };
        return KeyView;
    })();
    DigitalKey.KeyView = KeyView;
    var EventCallBacks = (function () {
        function EventCallBacks() {
        }
        /**
         * 通过反射获得回调的执行函数
         * @param callBackName  回调的函数名
         * @returns (e:any, key:any, editor:DigitalInput.EditableArea)=>{} 回调函数
         */
        EventCallBacks.getCallBack = function (callBackName) {
            if (this[callBackName] && typeof (this[callBackName]) == "function") {
                return this[callBackName];
            }
            else {
                return this.getError;
            }
        };
        EventCallBacks.getError = function () {
            throw "error to get callback, check the callback name!";
        };
        /**
         * 点击事件:退格键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.backCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("backCallBack");
            editor.deleteText(0);
            editor.back();
            return true;
        };
        /**
         * 点击事件:退格键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.backLongClickCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("backLongClickCallBack");
            editor.deleteAll();
        };
        /**
         * 点击事件:向上键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.upCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("upCallBack");
            if (editor.cursorIndex < 0) {
                return;
            }
            var charView;
            if (editor.isEditInChild) {
                charView = editor.textList[editor.cursorIndex];
                charView.editIndex--;
                if (charView.editIndex < 0) {
                    charView.editIndex = 0;
                    editor.isEditInChild = false;
                    editor.back(0);
                }
                else {
                    editor.back(-charView.editableSpans[charView.editIndex].textList.length);
                }
            }
            else {
                if (editor.cursorIndex < 1) {
                    return;
                }
                charView = editor.textList[editor.cursorIndex - 1];
                if (charView.isComplexView) {
                    charView.editIndex = charView.editableSpans.length - 1;
                    editor.isEditInChild = true;
                    editor.cursorIndex = editor.textList.indexOf(charView);
                    editor.back(-charView.editableSpans[charView.editIndex].textList.length);
                }
                else {
                    editor.back();
                }
            }
            charView = null;
            return true;
        };
        /**
         * 点击事件:向下键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.downCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("downCallBack");
            if (editor.cursorIndex >= editor.textList.length) {
                return;
            }
            var charView = editor.textList[editor.cursorIndex];
            if (editor.isEditInChild) {
                charView.editIndex++;
                if (charView.editIndex >= charView.editableSpans.length) {
                    charView.editIndex = 0;
                    editor.isEditInChild = false;
                    editor.foward();
                }
                else {
                    editor.foward(charView.editableSpans[charView.editIndex].textList.length);
                }
            }
            else {
                if (charView.isComplexView) {
                    editor.isEditInChild = true;
                    editor.cursorIndex = editor.textList.indexOf(charView);
                    charView.editIndex = 0;
                    editor.foward(charView.editableSpans[charView.editIndex].textList.length);
                }
                editor.foward();
            }
            charView = null;
            return true;
        };
        /**
         * 点击事件:向左键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.leftCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("leftCallBack");
            if (editor.cursorIndex < 1) {
                return;
            }
            editor.back();
            return true;
        };
        /**
         * 点击事件:向右键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.rightCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("rightCallBack");
            if (editor.cursorIndex >= editor.textList.length) {
                return;
            }
            editor.foward();
            return true;
        };
        /**
         * 点击事件:回车键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.enterCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("enterCallBack");
            if (editor.isEditInChild) {
                editor.isEditInChild = false;
                editor.foward();
            }
            else {
                var id = DigitalInput.InputManager.getInstance().cur_digital_id;
                var index = DigitalInput.InputManager.getInstance().ids.indexOf(id);
                if (index + 1 < DigitalInput.InputManager.getInstance().ids.length) {
                    var nextId = DigitalInput.InputManager.getInstance().ids[index + 1];
                    DigitalInput.InputManager.getInstance().openKeyBoard(nextId);
                    var nextInput = DigitalInput.InputManager.getInstance().inputMap[nextId];
                    if (!nextInput.isClickInner && !nextInput.disabled) {
                        nextInput.setCursor(nextInput.textList.length);
                    }
                    nextInput.isClickInner = false;
                }
                else {
                    DigitalInput.InputManager.getInstance().closeKeyBoard(true);
                }
            }
            return true;
        };
        /**
         * 点击事件：分数键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.fractionsCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("fractionsCallBack");
            if (editor.isEditInChild) {
                return;
            }
            var fractionsCharView = new DigitalInput.FractionsCharView(document.createElement("span"), DigitalInput.InputText.textId++, key, editor);
            editor.addText(fractionsCharView, 0);
            editor.isEditInChild = true;
            editor.foward();
            return true;
        };
        /**
         * 点击事件:正负号按键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.signCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("signCallBack");
            var hasAdd = false;
            var re = /^[0-9]+.?[0-9]*$/;
            var isFirstCircle = false;
            var edit;
            if (editor.isEditInChild) {
                edit = editor.textList[editor.cursorIndex].getCurrentEditableArea();
            }
            else {
                edit = editor;
            }
            if (edit) {
                for (var i = edit.cursorIndex - 1, len = edit.textList.length; i > -1 && i < len; i--) {
                    var text = edit.textList[i].key.getTag();
                    if (edit.textList[i].isComplexView) {
                        continue;
                    }
                    if (!re.test(text)) {
                        if (text == "." && !isFirstCircle) {
                            isFirstCircle = true;
                            continue;
                        }
                        if (text == "²") {
                            continue;
                        }
                        if (text == "-") {
                            edit.deleteText(i + 1 - edit.cursorIndex);
                            edit.back();
                            hasAdd = true;
                            break;
                        }
                        else {
                            edit.addText(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, new DigitalKey.Key("-", "-", "-", "-"), edit), i + 1 - edit.cursorIndex);
                            edit.foward();
                            hasAdd = true;
                            break;
                        }
                    }
                }
                if (hasAdd == false) {
                    edit.addText(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, new DigitalKey.Key("-", "-", "-", "-"), edit), -edit.cursorIndex);
                    edit.foward();
                }
            }
            return true;
        };
        /**
         * 点击事件:循环节键
         * @param e 事件
         * @param key 键
         * @param editor 输入区
         * @return boolean 是否阻止事件传送
         */
        EventCallBacks.repetendCallBack = function (editor, key, e) {
            DigitalKey.LogUtils.log("repetendCallBack");
            var re = /^[0-9]+.?[0-9]*$/;
            if (editor.isEditInChild) {
                return;
            }
            if (editor.cursorIndex - 1 > -1) {
                var charView = editor.textList[editor.cursorIndex - 1];
                var tag = charView.key.getTag();
                if (re.test(tag)) {
                    // 改变内容
                    if (charView.isRepetend) {
                        DigitalInput.RepetedentUtils.removeRepetedView(charView);
                        charView.isRepetend = false;
                    }
                    else {
                        DigitalInput.RepetedentUtils.addRepetedView(charView);
                        charView.isRepetend = true;
                    }
                    editor.onTextChange(editor.parseToString());
                }
            }
            return true;
        };
        return EventCallBacks;
    })();
    DigitalKey.EventCallBacks = EventCallBacks;
    var EventUtil = (function () {
        function EventUtil() {
        }
        EventUtil.getEventTarget = function (e) {
            e = e || window.event;
            return e.target || e.srcElement;
        };
        EventUtil.initEventName = function () {
            if (EventUtil.vEventHandler == null) {
                EventUtil.vEventHandler = {};
                if ("ontouchend" in document && navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
                    //拥有触屏事件
                    EventUtil.vEventHandler.mouseDown = 'touchstart';
                    EventUtil.vEventHandler.mouseUp = 'touchend';
                    EventUtil.vEventHandler.mouseCancel = 'touchcancel';
                    EventUtil.vEventHandler.getEventX = function (event) {
                        return event.changedTouches[0].clientX;
                    };
                    EventUtil.vEventHandler.getEventY = function (event) {
                        return event.changedTouches[0].clientY;
                        //return event.originalEvent.changedTouches[0].clientY;
                    };
                }
                else {
                    //没有触屏幕事件
                    EventUtil.vEventHandler.mouseDown = 'mousedown';
                    EventUtil.vEventHandler.mouseUp = 'mouseup';
                    EventUtil.vEventHandler.mouseCancel = 'mouseleave';
                    EventUtil.vEventHandler.getEventX = function (event) {
                        return event.clientX;
                    };
                    EventUtil.vEventHandler.getEventY = function (event) {
                        return event.clientY;
                    };
                }
            }
        };
        EventUtil.bindClickEvent = function (_target, callback) {
            var target = _target;
            if ("ontouchend" in document && navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {

                var vMouseDown = EventUtil.vEventHandler.mouseDown;
                var vMouseUp = EventUtil.vEventHandler.mouseUp;
                var vMouseCancel = EventUtil.vEventHandler.mouseCancel;
                var _start = 0;
                var _startX = 0;
                var _startY = 0;
                var handler = function (event) {
                    if (event.which !== 0 || event.which !== 1) {
                        var end = new Date().getTime();
                        var endX = EventUtil.vEventHandler.getEventX(event);
                        var endY = EventUtil.vEventHandler.getEventY(event);
                        var holdTime = end - _start;
                        var dx = Math.abs(endX - _startX);
                        var dy = Math.abs(endY - _startY);
                        if (holdTime <= 350 && dx < 20 && dy < 20) {
                            //触发tap事件
                            callback(event);
                        }
                    }
                    target.removeEventListener(vMouseUp, handler);
                    target.removeEventListener(vMouseCancel, cancelHandler);
                    //event.stopPropagation();
                };
                var cancelHandler = function (event) {
                    target.removeEventListener(vMouseUp, handler);
                    target.removeEventListener(vMouseCancel, cancelHandler);
                    //event.stopPropagation();
                };
                var func = function (downEvent) {
                    if (downEvent.which !== 0 || downEvent.which !== 1) {
                        _start = new Date().getTime();
                        _startX = EventUtil.vEventHandler.getEventX(downEvent);
                        _startY = EventUtil.vEventHandler.getEventY(downEvent);
                    }
                    //downEvent.stopPropagation();
                    target.addEventListener(vMouseUp, handler);
                    target.addEventListener(vMouseCancel, cancelHandler);
                };
                target.removeEventListener(vMouseUp, handler);
                target.removeEventListener(vMouseCancel, cancelHandler);
                target.removeEventListener(vMouseDown, func);
                target.addEventListener(vMouseDown, func);
            } else {
                target.addEventListener('click', function (event) {
                    callback(event);
                });
            }
        };
        ;
        EventUtil.vEventHandler = null;
        return EventUtil;
    })();
    DigitalKey.EventUtil = EventUtil;
    var LogUtils = (function () {
        function LogUtils() {
        }
        LogUtils.log = function (message) {
            if (LogUtils.DEBUG) {
                console.log(message);
            }
        };
        LogUtils.error = function (message) {
            console.error(message);
        };
        LogUtils.DEBUG = false;
        return LogUtils;
    })();
    DigitalKey.LogUtils = LogUtils;
    /**
     *  按键输入管理
     */
    var KeyManager = (function () {
        function KeyManager() {
        }
        KeyManager.addKeyDownListener = function () {
            document.addEventListener("keydown", KeyManager.keyDownListener);
        };
        KeyManager.removeKeyDownListener = function () {
            document.removeEventListener("keydown", KeyManager.keyDownListener);
        };
        KeyManager.createInput = function (editor, position) {
            editor.addText(new DigitalInput.GeneralCharView(document.createElement("span"), DigitalInput.InputText.textId++, DigitalKeyBoard.getInstance().keyList[position].getKey(), editor), 0);
            editor.foward();
        };
        KeyManager.keyDownListener = function (e) {
            e = e || event;
            var currKey = e.keyCode || e.which || e.charCode;
            var editor = DigitalKeyBoard.getInstance().inputText;
            DigitalInput.ViewUtils.stopEvent(e);
            // shift按下后
            if (e.shiftKey) {
                // shift + 5 : %
                if (currKey == 53) {
                    KeyManager.createInput(editor, 36);
                    return;
                }
                // shift + 8: *
                if (currKey == 56) {
                    KeyManager.createInput(editor, 18);
                    return;
                }
                // shift + 9: (
                if (currKey == 57) {
                    KeyManager.createInput(editor, 12);
                    return;
                }
                // shift + 0: )
                if (currKey == 48) {
                    KeyManager.createInput(editor, 13);
                    return;
                }
                // shift + 187: +
                if (currKey == 187) {
                    KeyManager.createInput(editor, 16);
                    return;
                }
                // shift 小于号
                if (currKey == 188) {
                    KeyManager.createInput(editor, 14);
                    return;
                }
                // shift  大于号
                if (currKey == 190) {
                    KeyManager.createInput(editor, 15);
                    return;
                }
                // shift  分号
                if (currKey == 186) {
                    KeyManager.createInput(editor, 40);
                    return;
                }
            }
            // 回车
            if (currKey == 13) {
                EventCallBacks.getCallBack("enterCallBack")(editor, null, null);
                return;
            }
            // 左
            if (currKey == 37) {
                EventCallBacks.getCallBack("leftCallBack")(editor, null, null);
                return;
            }
            // 上
            if (currKey == 38) {
                EventCallBacks.getCallBack("upCallBack")(editor, null, null);
                return;
            }
            // 右
            if (currKey == 39) {
                EventCallBacks.getCallBack("rightCallBack")(editor, null, null);
                return;
            }
            // 下
            if (currKey == 40) {
                EventCallBacks.getCallBack("downCallBack")(editor, null, null);
                return;
            }
            // 空格
            if (currKey == 32) {
                KeyManager.createInput(editor, 37);
                return;
            }
            // [
            if (currKey == 219) {
                KeyManager.createInput(editor, 23);
                return;
            }
            // ]
            if (currKey == 221) {
                KeyManager.createInput(editor, 24);
                return;
            }
            //逗号
            if (currKey == 188) {
                KeyManager.createInput(editor, 39);
                return;
            }
            // 小数点
            if (currKey == 190 || currKey == 110) {
                KeyManager.createInput(editor, 38);
                return;
            }
            // 除号
            if (currKey == 111) {
                KeyManager.createInput(editor, 19);
                return;
            }
            // 乘号
            if (currKey == 106) {
                KeyManager.createInput(editor, 18);
                return;
            }
            // 等号
            if (currKey == 187) {
                KeyManager.createInput(editor, 20);
                return;
            }
            // 加号
            if (currKey == 107) {
                KeyManager.createInput(editor, 16);
                return;
            }
            // 减号
            if (currKey == 189 || currKey == 109) {
                KeyManager.createInput(editor, 17);
                return;
            }
            // 退格键
            if (currKey == 8) {
                editor.deleteText(0);
                editor.back();
                return;
            }
            // 数字0-9
            if (48 <= currKey && currKey <= 57) {
                KeyManager.createInput(editor, currKey - 48);
                return;
            }
            // 数字0-9 小键盘
            if (96 <= currKey && currKey <= 105) {
                KeyManager.createInput(editor, currKey - 96);
                return;
            }
        };
        return KeyManager;
    })();
    DigitalKey.KeyManager = KeyManager;
})(DigitalKey || (DigitalKey = {}));