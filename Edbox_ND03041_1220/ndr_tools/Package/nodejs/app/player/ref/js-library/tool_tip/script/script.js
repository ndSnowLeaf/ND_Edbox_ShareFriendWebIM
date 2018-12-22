(function (window) {
    "use strict";
    // 默认为模态不点击其他。加hide_mask，变为非模态可以进行其他操作
    var toolHtml =
        '<div class="notice_tip_box">' +
        '    <div class="notice_tip_con">' +
        '       <span class="text"></span>' +
        '    </div>' +
        '</div>';
    var Tip = {
        show: function (opt) {
            opt = opt || {};
            opt = $.extend({
                container: $(document).find('body'),
                text: '',
                time: 3000,
                isModal: false
            }, opt);
            var $toolHtml = $(toolHtml);
            $toolHtml.find('.text').text(opt.text);
            opt.isModal ? $toolHtml.removeClass('hide_mask') : $toolHtml.addClass('hide_mask');
            opt.container.append($toolHtml);
            var timer = setTimeout(function () {
                $toolHtml.remove();
                clearTimeout(timer);
            }, opt.time);
        }
    };
    window.ToolTip = Tip;
}(window));
