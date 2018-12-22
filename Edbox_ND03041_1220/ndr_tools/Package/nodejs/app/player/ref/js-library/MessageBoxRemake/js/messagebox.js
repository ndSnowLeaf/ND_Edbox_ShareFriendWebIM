(function (window) {
    var isSubmitMouseDown = false;
    var isCancelMouseDown = false;

    /**
     * 此处三个函数注释是为了获取dom字符串，不能删除
     */
    var confirmWrap = (function () {
        /*
         <div class="exam-skin-wood" id="messageboxPopInModule">
         <div class="comui_big_pop2 messagePopContainer">
         <div class="comui_pop_notebook_bg">
         <div class="comui_pop_notebook_bg_papper">
         <!-- 弹窗内容区 -->
         <div class="comui_pop_papper_main">
         <div id="messageboxPopInModule-text" class="pop_confirm_text">确定要提交答案吗？ </div>
         </div>
         <!-- /弹窗内容区 -->
         <!--选中态在按钮上加类.on-->
         <div class="pop_footer_btns">
         <a class="com_btn_round2 right confirm-cancel" href="javascript:;">
         <span class="text_box cancel-text">取消</span>
         </a>
         <a class="com_btn_round2 confirm-submit" href="javascript:;">
         <span class="text_box submit-text">确认</span>
         </a>
         </div>
         <!--选中态在tip-box上加类.on-->
         <label class="tip-box" for="" style="display:none">
         <span class="checkbox"></span>
         <span class="txt">下次不再提醒</span>
         </label>
         </div>
         </div>
         </div>
         </div>
         */
    }).toString();
    confirmWrap = confirmWrap.substring(confirmWrap.indexOf('/*') + 2, confirmWrap.lastIndexOf('*/'));

    /**
     * 此处三个函数注释是为了获取dom字符串，不能删除
     */
    var afuWrap = (function () {
        /*
         <div class="exam-skin-wood" id="messageboxPopInModule">
         <div class="com_pop_feedback  messagePopContainer ">
         <div class="popwraper">
         <div class="popbody">
         <p id="messageboxPopInModule-text" class="tip-txt">答得不好，别灰心，下次要加油！</p>
         <span class="paper-scrap"></span>
         <span class="icon-afu">
         </span>
         </div>
         </div>
         </div>
         </div>
         */
    }).toString();
    afuWrap = afuWrap.substring(afuWrap.indexOf('/*') + 2, afuWrap.lastIndexOf('*/'));

    var toastWrap = (function () {
        /*
         <div class="exam-skin-wood" id="messageboxPopInModule">
         <div class="notice_tip_box">
         <div class="notice_tip_con">
         <p class="notice_tip_text"></p>
         </div>
         </div>
         </div>
         */
    }).toString();
    toastWrap = toastWrap.substring(toastWrap.indexOf('/*') + 2, toastWrap.lastIndexOf('*/'));

    var thisWrap;
    var wrapper = $('<div class="game-mask-wrapper-messsage-box"></div>');
    var dialog = $('<div class="dialog"></div>');

    var timerId;
    var closeCallback = null;
    var hideDialog = function () {
        thisWrap
            .off('mousedown touchstart')
            .off('mousedown mouseup touchstart touchend', '.confirm-cancel')
            .off('mousedown mouseup touchstart touchend', '.confirm-submit');
        thisWrap.parent().hide();
        closeCallback && closeCallback();
        closeCallback = null;
    };

    var bindButtonEvent = function (buttons) {
        var buttonsArr = buttons || [];
        var submit = buttonsArr[0] || {};
        var cancel = buttonsArr[1] || {};
        var submitCb = submit.handle;
        var cancelCb = cancel.handle;
        var submitTx = submit.text;
        var cancelTx = cancel.text;
        submitTx && thisWrap.find('.submit-text').text(submitTx);
        cancelTx && thisWrap.find('.cancel-text').text(cancelTx);
        thisWrap
            .off('mousedown mouseup touchstart touchend', '.confirm-cancel')
            .off('mousedown mouseup touchstart touchend', '.confirm-submit')
            .on('mousedown touchstart', '.confirm-cancel', function (e) {
                isCancelMouseDown = true;
            })
            .on('mousedown touchstart', '.confirm-submit', function (e) {
                isSubmitMouseDown = true;
            })
            .on('mouseup touchend', '.confirm-cancel', function (e) {
                e.preventDefault();
                if (isCancelMouseDown) {
                    hideDialog();
                    cancelCb && cancelCb();
                }
                isCancelMouseDown = false;
            })
            .on('mouseup touchend', '.confirm-submit', function (e) {
                e.preventDefault();
                if (isSubmitMouseDown) {
                    hideDialog();
                    submitCb && submitCb();
                }
                isSubmitMouseDown = false;
            });
    };

    var showWoodDialog = function (parent, options) {
        var $parent = $(parent);
        var isConfirm = false;
        switch (options.type) {
            case 'afuright':
                thisWrap = $(afuWrap);
                thisWrap.find('.messagePopContainer').addClass('view-4');
                break;
            case 'afuerror':
                thisWrap = $(afuWrap);
                thisWrap.find('.messagePopContainer').addClass('view-1');
                break;
            case 'right':
                thisWrap = $(confirmWrap);
                thisWrap.find('.messagePopContainer').addClass('change_feedback_right');
                break;
            case 'error':
                thisWrap = $(confirmWrap);
                thisWrap.find('.messagePopContainer').addClass('change_feedback_wrong');
                break;
            case 'confirm':
                thisWrap = $(confirmWrap);
                bindButtonEvent(options.buttons);
                isConfirm = true;
                break;
            case 'message':
                thisWrap = $(confirmWrap);
                thisWrap.find('.confirm-submit').hide();
                bindButtonEvent(options.buttons);
                isConfirm = true;
                break;
            default:
                thisWrap = $(confirmWrap);
                bindButtonEvent(options.buttons);
                isConfirm = true;
        }
        var text = options.text;
        text && thisWrap.find('#messageboxPopInModule-text').html(text);
        thisWrap.on('mousedown touchstart', function (e) {
            e.preventDefault();
        });
        closeCallback = options.closeCallback;
        var messageboxPopInModule = $parent.find('#messageboxPopInModule');
        if (messageboxPopInModule.length) {
            messageboxPopInModule.remove();
        }
        $parent.append(thisWrap);
        thisWrap.parent().show();
        if (!isConfirm) {
            setTimeout(hideDialog, options.hideTime || 3000);
        }
    };

    var MessageBox = {
        show: function (parent, text, hidetime) {
            var $wrapper;
            var $parent = $(parent);
            var messageBox = $parent.find('.game-mask-wrapper-messsage-box');
            if (messageBox.length) {
                messageBox.find('.dialog').text(text);
            } else {
                dialog.text(text);
                wrapper.append(dialog);
                $parent.append(wrapper);
            }
            $wrapper = $parent.find('.game-mask-wrapper-messsage-box');
            $wrapper.show();
            setTimeout(function () {
                $wrapper.hide();
            }, hidetime || 3000);
        },
        showPop: function (parent, options) {
            /*
             * mode: 'def', //'def', 'wood'
             * type: 'confirm', // 'confirm', 'right', 'error'
             * text: '',//
             * hideTime: 3000,
             * buttons: [{
             *   text: '确认',
             *   handle: function(){}
             * }, {
             *   text: '取消',
             *   handle: function(){}
             * }],
             * closeCallback: function(){}
             */
            var self = this;

            if (options.type === 'toast') {
                this.toast(parent, options);
                return;
            }

            switch (options.mode) {
                case 'wood':
                    showWoodDialog(parent, options);
                    break;
                default:
                    self.show(parent, options.text, options.hideTime);
            }
        },
        toast: function (parent, option) {
            var $parent = $(parent);

            var thisWrap = $(toastWrap);
            var messageboxPopInModule = $parent.find('#messageboxPopInModule');
            if (messageboxPopInModule.length) {
                messageboxPopInModule.remove();
            }
            $parent.append(thisWrap);
            $parent.show()
            $parent.find('.notice_tip_text').html(option.text);
            setTimeout(function () {
                $parent.hide();
            }, option.hidetime || 3000);
        }
    };
    window.MessageBoxRemake = MessageBox;
})(window);