(function(window) {

  var showTrue = function() {
    domCtr.mask.find('.dialog').text('太棒啦，您答对了');
    domCtr.mask.show();
    setTimeout(function() {
      domCtr.mask.hide();
    }, 3000);
  };
  var isSubmitMouseDown = false;
  var isCancelMouseDown = false;

  var isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  /**
   * 此处三个函数注释是为了获取dom字符串，不能删除
   */
  var confirmWrap = (function() {
    /*
      <div id="messageboxPopInModule" class="pop_content pop_content_confirm">
        <div class="popbox">
          <p class="pophd">
            <span class="dec dec_1"></span>
            <span class="dec dec_2"></span>
          </p>
          <div class="popbd">
            <p id="messageboxPopInModule-text" class="remind">确定要提交答案吗？</p>
            <p class="btnbox">
              <a href="###" class="btn btn_1 confirm-cancel">取消</a>
              <a href="###" class="btn btn_2 confirm-submit">确定</a>
            </p>
          </div>
        </div>
      </div>
      */
  }).toString();
  confirmWrap = confirmWrap.substring(confirmWrap.indexOf('/*') + 2, confirmWrap.lastIndexOf('*/'));
  var rightWrap = (function() {
    /*
    <div id="messageboxPopInModule" class="pop_content pop_content_right">
      <div class="popbox">
        <p class="pophd">
          <span class="dec dec_1"></span>
          <span class="dec dec_2"></span>
        </p>
        <div class="popbd">
          <span class="popicon icon_right"></span>
          <p id="messageboxPopInModule-text" class="text text_1">太棒啦，您答对了！</p>
        </div>
      </div>
    </div>
    */
  }).toString();
  rightWrap = rightWrap.substring(rightWrap.indexOf('/*') + 2, rightWrap.lastIndexOf('*/'));
  var errorWrap = (function() {
    /*
    <div id="messageboxPopInModule" class="pop_content pop_content_error">
      <div class="popbox">
        <p class="pophd">
          <span class="dec dec_1"></span>
          <span class="dec dec_2"></span>
        </p>
        <div class="popbd">
          <span class="popicon icon_wrong"></span>
          <p id="messageboxPopInModule-text" class="text text_2">这道题没有做对，下次加油哦！</p>
        </div>
      </div>
    </div>
    */
  }).toString();
  errorWrap = errorWrap.substring(errorWrap.indexOf('/*') + 2, errorWrap.lastIndexOf('*/'));

  var thisWrap;
  var wrapper = $('<div class="game-mask-wrapper-messsage-box"></div>');
  var dialog = $('<div class="dialog"></div>');

  var timerId;
  var closeCallback = null;
  var hideDialog = function() {
    thisWrap
      .off('mousedown touchstart')
      .off('mousedown mouseup touchstart touchend', '.confirm-cancel')
      .off('mousedown mouseup touchstart touchend', '.confirm-submit');
    thisWrap.remove();
    closeCallback && closeCallback();
    closeCallback = null;
  };

  var bindButtonEvent = function(buttons) {
    var buttonsArr = buttons || [];
    var submit = buttonsArr[0] || {};
    var cancel = buttonsArr[1] || {};
    var submitCb = submit.handle;
    var cancelCb = cancel.handle;
    var submitTx = submit.text;
    var cancelTx = cancel.text;
    submitTx && thisWrap.find('.confirm-submit').text(submitTx);
    cancelTx && thisWrap.find('.confirm-cancel').text(cancelTx);
    thisWrap
      .off('mousedown mouseup touchstart touchend', '.confirm-cancel')
      .off('mousedown mouseup touchstart touchend', '.confirm-submit')
      .on('mousedown touchstart', '.confirm-cancel', function(e) {
        isCancelMouseDown = true;
      }).on('mousedown touchstart', '.confirm-submit', function(e) {
        isSubmitMouseDown = true;
      }).on('mouseup touchend', '.confirm-cancel', function(e) {
        e.preventDefault();
        if (isCancelMouseDown) {
          hideDialog();
          cancelCb && cancelCb();
        }
        isCancelMouseDown = false;
      }).on('mouseup touchend', '.confirm-submit', function(e) {
        e.preventDefault();
        if (isSubmitMouseDown) {
          hideDialog();
          submitCb && submitCb();
        }
        isSubmitMouseDown = false;
      });
  };

  var showWoodDialog = function(parent, options) {
    var $parent = $(parent);
    var isConfirm = false;
    switch (options.type) {
      case 'right':
        thisWrap = $(rightWrap);
        break;
      case 'error':
        thisWrap = $(errorWrap);
        break;
      case 'confirm':
        thisWrap = $(confirmWrap);
        bindButtonEvent(options.buttons);
        isConfirm = true;
        break;
      default:
        thisWrap = $(confirmWrap);
        bindButtonEvent(options.buttons);
        isConfirm = true;
    }
    var text = options.text;
    text && thisWrap.find('#messageboxPopInModule-text').text(text);
    thisWrap.on('mousedown touchstart', function(e) {e.preventDefault();});
    closeCallback = options.closeCallback;
    var messageboxPopInModule = $parent.find('#messageboxPopInModule');
    if (messageboxPopInModule.length) {
      messageboxPopInModule.remove();
    }
    $parent.append(thisWrap);
    if (!isConfirm) {
      setTimeout(hideDialog, options.hideTime || 3000);
    }
  };

  var MessageBox = {
    show: function(parent, text, hidetime) {
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
      setTimeout(function() {
        $wrapper.hide();
      }, hidetime || 3000);
    },
    showPop: function(parent, options) {
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

      switch (options.mode) {
        case 'wood':
          showWoodDialog(parent, options);
          break;
        default:
          self.show(parent, options.text, options.hideTime);
      }
    }
  };
  window.GameMessageBox = MessageBox;
})(window);
