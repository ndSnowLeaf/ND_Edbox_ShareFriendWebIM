(function (window) {
    "use strict";
    var toolHtml =
        '<div class="prom_confirm_box hide_mask">' +
        '	<div class="prom_confirm_con">' +
        '		<p class="confirm_text"><em class="text"></em></p>' +
        '		<div class="btn_group">' +
        '           <a class="confirm"><em class="btn_text">确定</em></a>' +
        '           <a class="cancel"><em class="btn_text">取消</em></a>' +
        '		</div>' +
        '	</div>' +
        '</div>';
    var dialog = {
        show: function (opt) {
            opt = opt || {};
            opt = $.extend({
                container: $(document).find('body'),
                text: '',
                isModal: true,
                i18n: {}
            }, opt);
            var $toolHtml = $(toolHtml);
            this._initI18N($toolHtml, opt.i18n);
            $toolHtml.find('.text').text(opt.text);
            if ((arguments.length === 2 && typeof arguments[1] === 'function') && !opt.confirm) {
                opt.confirm = arguments[1];
            }
            if (arguments.length === 3 && typeof arguments[1] === 'function' && typeof arguments[2] === 'function') {
                if (!opt.confirm) {
                    opt.confirm = arguments[1];
                }
                if (!opt.cancel) {
                    opt.cancel = arguments[2];
                }

            }
            if (opt.confirm && typeof opt.confirm === 'function') {
                $toolHtml.find('.btn_group .confirm').on('click', opt.confirm);
            }
            if (opt.cancel && typeof opt.cancel === 'function') {
                $toolHtml.find('.btn_group .cancel').on('click', opt.cancel);
            }
            //默认要关闭
            $toolHtml.find('.btn_group .confirm,.btn_group .cancel').on('click', function (e) {
                e.preventDefault();
                $toolHtml.addClass('hide_dom');
            });

            if (opt.isModal) {
                $toolHtml.removeClass('hide_mask');
            } else {
                $toolHtml.addClass('hide_mask');
            }
            opt.container.append($toolHtml);
            $toolHtml.removeClass('hide_dom');
        },
        _initI18N: function ($toolHtml, i18n) {
            $toolHtml.find('.btn_group .confirm em').text(i18n['confirm']);
            $toolHtml.find('.btn_group .cancel em').text(i18n['cancel']);
        }
    };
    window.ToolDialog = dialog;

}(window));
