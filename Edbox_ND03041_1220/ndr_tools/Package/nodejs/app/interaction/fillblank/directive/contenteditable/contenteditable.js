/**
 * Created by oy on 2015/8/3.
 */
/**
 * Two-way data binding for contenteditable elements with ng-model.
 * @example
 *   <p contenteditable="true" ng-model="text"></p>
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD.directive('contenteditable', [ function () {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ctrl) {

                // Do nothing if this is not bound to a model
                if (!ctrl) { return; }

                // Checks for updates (input or pressing ENTER)
                // view -> model
                element.bind('input enterKey', function() {
                    var rerender = false;
                    var html = element.html();

                    if (attrs.noLineBreaks) {
                        html = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '');
                        rerender = true;
                    }

                    scope.$apply(function() {
                        ctrl.$setViewValue(html);
                        if(rerender) {
                            ctrl.$render();
                        }
                    });
                });

                element.keyup(function(e){
                    if(e.keyCode === 13){
                        element.trigger('enterKey');
                    }
                });

                // model -> view
                ctrl.$render = function() {
                    element.html(ctrl.$viewValue);
                };

                // load init value from DOM
                ctrl.$render();
            }
        };
    }])
});