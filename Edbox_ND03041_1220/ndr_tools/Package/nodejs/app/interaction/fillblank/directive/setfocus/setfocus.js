/**
 * Created by oy on 2015/8/3.
 */

define(['angularAMD'
], function (angularAMD) {
    angularAMD.directive('setfocus', [ function () {
    	return function(scope, element){
            element[0].focus();
    	}
    	/*
        return function(scope, element){
            var sel, range;

            element = element[0];
            window.setTimeout(function () {
                if (window.getSelection && document.createRange) {
                    range = document.createRange();
                    range.selectNodeContents(element);
                    range.collapse(true);
                    range.setEnd(element, element.childNodes.length);
                    range.setStart(element, element.childNodes.length);
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(element);
                    range.collapse(true);
                    range.select();
                }
            }, 0);           
        };
        */
    }])
});