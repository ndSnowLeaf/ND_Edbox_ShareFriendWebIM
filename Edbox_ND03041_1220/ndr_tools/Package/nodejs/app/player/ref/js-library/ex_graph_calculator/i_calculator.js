;(function () {
    "use strict";

    /**
     * @license
     * Copyright 2015 Google Inc. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    /**
     * A component handler interface using the revealing module design pattern.
     * More details on this design pattern here:
     * https://github.com/jasonmayes/mdl-component-design-pattern
     *
     * @author Jason Mayes.
     */
    /* exported componentHandler */

// Pre-defining the componentHandler interface, for closure documentation and
// static verification.
    var componentHandler = {
        /**
         * Searches existing DOM for elements of our component type and upgrades them
         * if they have not already been upgraded.
         *
         * @param {string=} optJsClass the programatic name of the element class we
         * need to create a new instance of.
         * @param {string=} optCssClass the name of the CSS class elements of this
         * type will have.
         */
        upgradeDom: function (optJsClass, optCssClass) {
        },
        /**
         * Upgrades a specific element rather than all in the DOM.
         *
         * @param {!Element} element The element we wish to upgrade.
         * @param {string=} optJsClass Optional name of the class we want to upgrade
         * the element to.
         */
        upgradeElement: function (element, optJsClass) {
        },
        /**
         * Upgrades a specific list of elements rather than all in the DOM.
         *
         * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
         * The elements we wish to upgrade.
         */
        upgradeElements: function (elements) {
        },
        /**
         * Upgrades all registered components found in the current DOM. This is
         * automatically called on window load.
         */
        upgradeAllRegistered: function () {
        },
        /**
         * Allows user to be alerted to any upgrades that are performed for a given
         * component type
         *
         * @param {string} jsClass The class name of the MDL component we wish
         * to hook into for any upgrades performed.
         * @param {function(!HTMLElement)} callback The function to call upon an
         * upgrade. This function should expect 1 parameter - the HTMLElement which
         * got upgraded.
         */
        registerUpgradedCallback: function (jsClass, callback) {
        },
        /**
         * Registers a class for future use and attempts to upgrade existing DOM.
         *
         * @param {componentHandler.ComponentConfigPublic} config the registration configuration
         */
        register: function (config) {
        },
        /**
         * Downgrade either a given node, an array of nodes, or a NodeList.
         *
         * @param {!Node|!Array<!Node>|!NodeList} nodes
         */
        downgradeElements: function (nodes) {
        }
    };

    componentHandler = (function () {
        'use strict';

        /** @type {!Array<componentHandler.ComponentConfig>} */
        var registeredComponents_ = [];

        /** @type {!Array<componentHandler.Component>} */
        var createdComponents_ = [];

        var componentConfigProperty_ = 'mdlComponentConfigInternal_';

        /**
         * Searches registered components for a class we are interested in using.
         * Optionally replaces a match with passed object if specified.
         *
         * @param {string} name The name of a class we want to use.
         * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
         * @return {!Object|boolean}
         * @private
         */
        function findRegisteredClass_(name, optReplace) {
            for (var i = 0; i < registeredComponents_.length; i++) {
                if (registeredComponents_[i].className === name) {
                    if (typeof optReplace !== 'undefined') {
                        registeredComponents_[i] = optReplace;
                    }
                    return registeredComponents_[i];
                }
            }
            return false;
        }

        /**
         * Returns an array of the classNames of the upgraded classes on the element.
         *
         * @param {!Element} element The element to fetch data from.
         * @return {!Array<string>}
         * @private
         */
        function getUpgradedListOfElement_(element) {
            var dataUpgraded = element.getAttribute('data-upgraded');
            // Use `['']` as default value to conform the `,name,name...` style.
            return dataUpgraded === null ? [''] : dataUpgraded.split(',');
        }

        /**
         * Returns true if the given element has already been upgraded for the given
         * class.
         *
         * @param {!Element} element The element we want to check.
         * @param {string} jsClass The class to check for.
         * @returns {boolean}
         * @private
         */
        function isElementUpgraded_(element, jsClass) {
            var upgradedList = getUpgradedListOfElement_(element);
            return upgradedList.indexOf(jsClass) !== -1;
        }

        /**
         * Searches existing DOM for elements of our component type and upgrades them
         * if they have not already been upgraded.
         *
         * @param {string=} optJsClass the programatic name of the element class we
         * need to create a new instance of.
         * @param {string=} optCssClass the name of the CSS class elements of this
         * type will have.
         */
        function upgradeDomInternal(optJsClass, optCssClass) {
            if (typeof optJsClass === 'undefined' &&
                typeof optCssClass === 'undefined') {
                for (var i = 0; i < registeredComponents_.length; i++) {
                    upgradeDomInternal(registeredComponents_[i].className,
                        registeredComponents_[i].cssClass);
                }
            } else {
                var jsClass = /** @type {string} */ (optJsClass);
                if (typeof optCssClass === 'undefined') {
                    var registeredClass = findRegisteredClass_(jsClass);
                    if (registeredClass) {
                        optCssClass = registeredClass.cssClass;
                    }
                }

                var elements = document.querySelectorAll('.' + optCssClass);
                for (var n = 0; n < elements.length; n++) {
                    upgradeElementInternal(elements[n], jsClass);
                }
            }
        }

        /**
         * Upgrades a specific element rather than all in the DOM.
         *
         * @param {!Element} element The element we wish to upgrade.
         * @param {string=} optJsClass Optional name of the class we want to upgrade
         * the element to.
         */
        function upgradeElementInternal(element, optJsClass) {
            // Verify argument type.
            if (!(typeof element === 'object' && element instanceof Element)) {
                throw new Error('Invalid argument provided to upgrade MDL element.');
            }
            var upgradedList = getUpgradedListOfElement_(element);
            var classesToUpgrade = [];
            // If jsClass is not provided scan the registered components to find the
            // ones matching the element's CSS classList.
            if (!optJsClass) {
                var classList = element.classList;
                registeredComponents_.forEach(function (component) {
                    // Match CSS & Not to be upgraded & Not upgraded.
                    if (classList.contains(component.cssClass) &&
                        classesToUpgrade.indexOf(component) === -1 && !isElementUpgraded_(element, component.className)) {
                        classesToUpgrade.push(component);
                    }
                });
            } else if (!isElementUpgraded_(element, optJsClass)) {
                classesToUpgrade.push(findRegisteredClass_(optJsClass));
            }

            // Upgrade the element for each classes.
            for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
                registeredClass = classesToUpgrade[i];
                if (registeredClass) {
                    // Mark element as upgraded.
                    upgradedList.push(registeredClass.className);
                    element.setAttribute('data-upgraded', upgradedList.join(','));
                    var instance = new registeredClass.classConstructor(element);
                    instance[componentConfigProperty_] = registeredClass;
                    createdComponents_.push(instance);
                    // Call any callbacks the user has registered with this component type.
                    for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
                        registeredClass.callbacks[j](element);
                    }

                    if (registeredClass.widget) {
                        // Assign per element instance for control over API
                        element[registeredClass.className] = instance;
                    }
                } else {
                    throw new Error(
                        'Unable to find a registered component for the given class.');
                }

                var ev;
                if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
                    ev = new Event('mdl-componentupgraded', {
                        'bubbles': true, 'cancelable': false
                    });
                } else {
                    ev = document.createEvent('Events');
                    ev.initEvent('mdl-componentupgraded', true, true);
                }
                element.dispatchEvent(ev);
            }
        }

        /**
         * Upgrades a specific list of elements rather than all in the DOM.
         *
         * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
         * The elements we wish to upgrade.
         */
        function upgradeElementsInternal(elements) {
            if (!Array.isArray(elements)) {
                if (typeof elements.item === 'function') {
                    elements = Array.prototype.slice.call(/** @type {Array} */ (elements));
                } else {
                    elements = [elements];
                }
            }
            for (var i = 0, n = elements.length, element; i < n; i++) {
                element = elements[i];
                if (element instanceof HTMLElement) {
                    upgradeElementInternal(element);
                    if (element.children.length > 0) {
                        upgradeElementsInternal(element.children);
                    }
                }
            }
        }

        /**
         * Registers a class for future use and attempts to upgrade existing DOM.
         *
         * @param {componentHandler.ComponentConfigPublic} config
         */
        function registerInternal(config) {
            // In order to support both Closure-compiled and uncompiled code accessing
            // this method, we need to allow for both the dot and array syntax for
            // property access. You'll therefore see the `foo.bar || foo['bar']`
            // pattern repeated across this method.
            var widgetMissing = (typeof config.widget === 'undefined' &&
            typeof config['widget'] === 'undefined');
            var widget = true;

            if (!widgetMissing) {
                widget = config.widget || config['widget'];
            }

            var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
                classConstructor: config.constructor || config['constructor'],
                className: config.classAsString || config['classAsString'],
                cssClass: config.cssClass || config['cssClass'],
                widget: widget,
                callbacks: []
            });

            registeredComponents_.forEach(function (item) {
                if (item.cssClass === newConfig.cssClass) {
                    throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
                }
                if (item.className === newConfig.className) {
                    throw new Error('The provided className has already been registered');
                }
            });

            if (config.constructor.prototype
                    .hasOwnProperty(componentConfigProperty_)) {
                throw new Error(
                    'MDL component classes must not have ' + componentConfigProperty_ +
                    ' defined as a property.');
            }

            var found = findRegisteredClass_(config.classAsString, newConfig);

            if (!found) {
                registeredComponents_.push(newConfig);
            }
        }

        /**
         * Allows user to be alerted to any upgrades that are performed for a given
         * component type
         *
         * @param {string} jsClass The class name of the MDL component we wish
         * to hook into for any upgrades performed.
         * @param {function(!HTMLElement)} callback The function to call upon an
         * upgrade. This function should expect 1 parameter - the HTMLElement which
         * got upgraded.
         */
        function registerUpgradedCallbackInternal(jsClass, callback) {
            var regClass = findRegisteredClass_(jsClass);
            if (regClass) {
                regClass.callbacks.push(callback);
            }
        }

        /**
         * Upgrades all registered components found in the current DOM. This is
         * automatically called on window load.
         */
        function upgradeAllRegisteredInternal() {
            for (var n = 0; n < registeredComponents_.length; n++) {
                upgradeDomInternal(registeredComponents_[n].className);
            }
        }

        /**
         * Check the component for the downgrade method.
         * Execute if found.
         * Remove component from createdComponents list.
         *
         * @param {?componentHandler.Component} component
         */
        function deconstructComponentInternal(component) {
            if (component) {
                var componentIndex = createdComponents_.indexOf(component);
                createdComponents_.splice(componentIndex, 1);

                var upgrades = component.element_.getAttribute('data-upgraded').split(',');
                var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
                upgrades.splice(componentPlace, 1);
                component.element_.setAttribute('data-upgraded', upgrades.join(','));

                var ev;
                if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
                    ev = new Event('mdl-componentdowngraded', {
                        'bubbles': true, 'cancelable': false
                    });
                } else {
                    ev = document.createEvent('Events');
                    ev.initEvent('mdl-componentdowngraded', true, true);
                }
            }
        }

        /**
         * Downgrade either a given node, an array of nodes, or a NodeList.
         *
         * @param {!Node|!Array<!Node>|!NodeList} nodes
         */
        function downgradeNodesInternal(nodes) {
            /**
             * Auxiliary function to downgrade a single node.
             * @param  {!Node} node the node to be downgraded
             */
            var downgradeNode = function (node) {
                createdComponents_.filter(function (item) {
                    return item.element_ === node;
                }).forEach(deconstructComponentInternal);
            };
            if (nodes instanceof Array || nodes instanceof NodeList) {
                for (var n = 0; n < nodes.length; n++) {
                    downgradeNode(nodes[n]);
                }
            } else if (nodes instanceof Node) {
                downgradeNode(nodes);
            } else {
                throw new Error('Invalid argument provided to downgrade MDL nodes.');
            }
        }

        // Now return the functions that should be made public with their publicly
        // facing names...
        return {
            upgradeDom: upgradeDomInternal,
            upgradeElement: upgradeElementInternal,
            upgradeElements: upgradeElementsInternal,
            upgradeAllRegistered: upgradeAllRegisteredInternal,
            registerUpgradedCallback: registerUpgradedCallbackInternal,
            register: registerInternal,
            downgradeElements: downgradeNodesInternal
        };
    })();

    /**
     * Describes the type of a registered component type managed by
     * componentHandler. Provided for benefit of the Closure compiler.
     *
     * @typedef {{
 *   constructor: Function,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: (string|boolean|undefined)
 * }}
     */
    componentHandler.ComponentConfigPublic;  // jshint ignore:line

    /**
     * Describes the type of a registered component type managed by
     * componentHandler. Provided for benefit of the Closure compiler.
     *
     * @typedef {{
 *   constructor: !Function,
 *   className: string,
 *   cssClass: string,
 *   widget: (string|boolean),
 *   callbacks: !Array<function(!HTMLElement)>
 * }}
     */
    componentHandler.ComponentConfig;  // jshint ignore:line

    /**
     * Created component (i.e., upgraded element) type as managed by
     * componentHandler. Provided for benefit of the Closure compiler.
     *
     * @typedef {{
 *   element_: !HTMLElement,
 *   className: string,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: string
 * }}
     */
    componentHandler.Component;  // jshint ignore:line

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
    componentHandler['upgradeDom'] = componentHandler.upgradeDom;
    componentHandler['upgradeElement'] = componentHandler.upgradeElement;
    componentHandler['upgradeElements'] = componentHandler.upgradeElements;
    componentHandler['upgradeAllRegistered'] =
        componentHandler.upgradeAllRegistered;
    componentHandler['registerUpgradedCallback'] =
        componentHandler.registerUpgradedCallback;
    componentHandler['register'] = componentHandler.register;
    componentHandler['downgradeElements'] = componentHandler.downgradeElements;
    window.componentHandler = componentHandler;
    window['componentHandler'] = componentHandler;

    window.addEventListener('load', function () {
        'use strict';

        /**
         * Performs a "Cutting the mustard" test. If the browser supports the features
         * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
         * components requiring JavaScript.
         */
        if ('classList' in document.createElement('div') &&
            'querySelector' in document &&
            'addEventListener' in window && Array.prototype.forEach) {
            document.documentElement.classList.add('mdl-js');
            componentHandler.upgradeAllRegistered();
        } else {
            /**
             * Dummy function to avoid JS errors.
             */
            componentHandler.upgradeElement = function () {
            };
            /**
             * Dummy function to avoid JS errors.
             */
            componentHandler.register = function () {
            };
        }
    });

// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
// MIT license
    if (!Date.now) {
        /**
         * Date.now polyfill.
         * @return {number} the current Date
         */
        Date.now = function () {
            return new Date().getTime();
        };
        Date['now'] = Date.now;
    }
    var vendors = [
        'webkit',
        'moz'
    ];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
        window['requestAnimationFrame'] = window.requestAnimationFrame;
        window['cancelAnimationFrame'] = window.cancelAnimationFrame;
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        /**
         * requestAnimationFrame polyfill.
         * @param  {!Function} callback the callback function.
         */
        window.requestAnimationFrame = function (callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                callback(lastTime = nextTime);
            }, nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
        window['requestAnimationFrame'] = window.requestAnimationFrame;
        window['cancelAnimationFrame'] = window.cancelAnimationFrame;
    }
    var MaterialUpperSlider = function MaterialUpperSlider(element) {
        this.element_ = element;
        // Browser feature detection.
        this.isIE_ = window.navigator.msPointerEnabled;
        // Initialize instance.
        this.init();
    };
    window['MaterialUpperSlider'] = MaterialUpperSlider;
    /**
     * Store constants in one place so they can be updated easily.
     *
     * @enum {string | number}
     * @private
     */
    MaterialUpperSlider.prototype.Constant_ = {};
    /**
     * Store strings for class names defined by this component that are used in
     * JavaScript. This allows us to simply change it in one place should we
     * decide to modify at a later date.
     *
     * @enum {string}
     * @private
     */
    MaterialUpperSlider.prototype.CssClasses_ = {
        IE_CONTAINER: 'mdl-slider__ie-container',
        SLIDER_CONTAINER: 'mdl-slider__container',
        BACKGROUND_FLEX: 'mdl-slider__background-flex',
        BACKGROUND_LOWER: 'mdl-slider__background-lower',
        BACKGROUND_UPPER: 'mdl-slider__background-upper',
        IS_LOWEST_VALUE: 'is-lowest-value',
        IS_UPGRADED: 'is-upgraded'
    };
    /**
     * Handle input on element.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialUpperSlider.prototype.onInput_ = function (event) {
        this.updateValueStyles_();
    };
    /**
     * Handle change on element.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialUpperSlider.prototype.onChange_ = function (event) {
        this.updateValueStyles_();
    };
    /**
     * Handle mouseup on element.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialUpperSlider.prototype.onMouseUp_ = function (event) {
        event.target.blur();
    };
    /**
     * Handle mousedown on container element.
     * This handler is purpose is to not require the use to click
     * exactly on the 2px slider element, as FireFox seems to be very
     * strict about this.
     *
     * @param {Event} event The event that fired.
     * @private
     * @suppress {missingProperties}
     */
    MaterialUpperSlider.prototype.onContainerMouseDown_ = function (event) {
        // If this click is not on the parent element (but rather some child)
        // ignore. It may still bubble up.
        if (event.target !== this.element_.parentElement) {
            return;
        }
        // Discard the original event and create a new event that
        // is on the slider element.
        event.preventDefault();
        var newEvent = new MouseEvent('mousedown', {
            target: event.target,
            buttons: event.buttons,
            clientX: event.clientX,
            clientY: this.element_.getBoundingClientRect().y
        });
        this.element_.dispatchEvent(newEvent);
    };
    /**
     * Handle updating of values.
     *
     * @private
     */
    MaterialUpperSlider.prototype.updateValueStyles_ = function () {
        // Calculate and apply percentages to div structure behind slider.
        var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
        if (fraction === 0) {
            this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
        } else {
            this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
        }
    };
// Public methods.
    /**
     * Disable slider.
     *
     * @public
     */
    MaterialUpperSlider.prototype.disable = function () {
        this.element_.disabled = true;
    };
    MaterialUpperSlider.prototype['disable'] = MaterialUpperSlider.prototype.disable;
    /**
     * Enable slider.
     *
     * @public
     */
    MaterialUpperSlider.prototype.enable = function () {
        this.element_.disabled = false;
    };
    MaterialUpperSlider.prototype['enable'] = MaterialUpperSlider.prototype.enable;
    /**
     * Update slider value.
     *
     * @param {number} value The value to which to set the control (optional).
     * @public
     */
    MaterialUpperSlider.prototype.change = function (value) {
        if (typeof value !== 'undefined') {
            this.element_.value = value;
        }
        this.updateValueStyles_();
    };
    MaterialUpperSlider.prototype['change'] = MaterialUpperSlider.prototype.change;
    /**
     * Initialize element.
     */
    MaterialUpperSlider.prototype.init = function () {
        if (this.element_) {
            if (this.isIE_) {
                // Since we need to specify a very large height in IE due to
                // implementation limitations, we add a parent here that trims it down to
                // a reasonable size.
                var containerIE = document.createElement('div');
                containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
                this.element_.parentElement.insertBefore(containerIE, this.element_);
                this.element_.parentElement.removeChild(this.element_);
                containerIE.appendChild(this.element_);
            } else {
                // For non-IE browsers, we need a div structure that sits behind the
                // slider and allows us to style the left and right sides of it with
                // different colors.
                var container = document.createElement('div');
                container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
                this.element_.parentElement.insertBefore(container, this.element_);
                this.element_.parentElement.removeChild(this.element_);
                container.appendChild(this.element_);
                var backgroundFlex = document.createElement('div');
                backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
                container.appendChild(backgroundFlex);
                this.backgroundUpper_ = document.createElement('div');
                this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
                this.backgroundUpper_.style.flex = 1;
                backgroundFlex.appendChild(this.backgroundUpper_);
            }
            this.boundInputHandler = this.onInput_.bind(this);
            this.boundChangeHandler = this.onChange_.bind(this);
            this.boundMouseUpHandler = this.onMouseUp_.bind(this);
            this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
            this.element_.addEventListener('input', this.boundInputHandler);
            this.element_.addEventListener('change', this.boundChangeHandler);
            this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
            this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);
            this.updateValueStyles_();
            this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        }
    };
    MaterialUpperSlider.prototype.changeRange = function (min, max, step) {
        if (min == void 0) {
            min = this.element_.min;
        }

        if (max == void 0) {
            max = this.element_.max;
        }
        if (max < min) {
            return;
        }
        if (this.element_.value < min || this.element_.value > max) {
            this.element_.value = min;
        }
        if (typeof max !== 'undefined') {
            this.element_.max = max;
        }
        if (typeof min !== 'undefined') {
            this.element_.min = min;
        }
        if (step) {
            this.changeStep(step);
        }
        this.updateValueStyles_();
    };
    MaterialUpperSlider.prototype['changeRange'] = MaterialUpperSlider.prototype.changeRange;
    MaterialUpperSlider.prototype.changeStep = function (step) {
        if (step <= 0 || step > (this.element_.max - this.element_.min)) {
            return false;
        }
        this.element_.value = this.element_.min;
        this.element_.step = step;
        this.updateValueStyles_();
    };
    MaterialUpperSlider.prototype['changeStep'] = MaterialUpperSlider.prototype.changeStep;
// The component registers itself. It can assume componentHandler is available
// in the global scope.
    componentHandler.register({
        constructor: MaterialUpperSlider,
        classAsString: 'MaterialUpperSlider',
        cssClass: 'mdl-js-upper-slider',
        widget: true
    });
}());
/**
 * Created by Mr.L.J.B on 2016/5/11.
 * 函数图形接口对象
 */
var ExpressionGraph;
(function (ExpressionGraph) {
    var GraphManager = (function () {
        function GraphManager() {
            this.options = {
                keypad: false,
                graphpaper: true,
                expressions: false,
                settingsMenu: false,
                zoomButtons: true,
                expressionsTopbar: false,
                solutions: true,
                border: true,
                lockViewport: false,
                expressionsCollapsed: true //Collapse the expression list
            };
        }

        GraphManager.getInstance = function () {
            if (GraphManager.instance == null) {
                GraphManager.instance = new GraphManager();
            }
            return GraphManager.instance;
        };
        /**
         * 初始化
         * @param elt 存放坐标的div
         * @param options 可选属性
         */
        GraphManager.prototype.initalize = function (elt, options) {
            if (options === void 0) {
                options = this.options;
            }
            this.elt = elt;
            this.calculator = Desmos.Calculator(elt, options);
            this.expressionMap = [];
            this.exNumber = 0;
            this.calculator.setGraphSettings({projectorMode: true});
            this.pointId = "pointTable";
        };
        /**
         * 改变参数值
         * @param id 表达式ID
         * @param paramValues 参数值序列（以表达式从左往右提供）
         */
        GraphManager.prototype.changeParam = function (id, paramValues) {
            var ex = this.expressionMap[id];
            ex.changeParamValue(paramValues);
            this.calculator.setExpressions(ex.getExpression());
        };
        /**
         * 设置图形（线条和点）粗细
         * @param projectorMode 设置为true为粗 默认为细
         */
        GraphManager.prototype.setGraphLegibility = function (projectorMode) {
            var graphSetting = {projectorMode: projectorMode};
            this.calculator.setGraphSettings(graphSetting);
        };
        /**
         * 增加表达式
         * @param id 唯一标示
         * @param type 函数类型
         * @param color 颜色（?可选）
         */
        GraphManager.prototype.addExpression = function (id, type, color) {
            var ex = this.expressionMap[id];
            if (ex) {
                return;
            }
            if (this.exNumber >= 5) {
                return;
            }
            if (this.calculator != null) {
                ex = new Expression();
                ex.addExpression(id, type, color);
                this.calculator.setExpressions(ex.getExpression());
                this.expressionMap[id] = ex;
                this.exNumber++;
            }
        };
        /**
         * 移除表达式
         * @param id 表达式ID
         */
        GraphManager.prototype.removeExpression = function (id) {
            var ex = this.expressionMap[id];
            if (ex) {
                this.calculator.removeExpressions(ex.getExpression());
                ex.releaseParams();
                this.expressionMap[id] = null;
                ex = null;
                this.exNumber--;
            }
        };

        /**
         * 隐藏图像
         * @param id
         */
        GraphManager.prototype.hideExpression = function (id) {
            var ex = this.expressionMap[id];
            if (!ex) {
                return;
            }
            if (!ex.isShow()) {
                return;
            }
            ex.hideExpression();
            this.calculator.setExpressions(ex.getExpression());
        }

        /**
         * 隐藏图像
         * @param id
         */
        GraphManager.prototype.showExpression = function (id) {
            var ex = this.expressionMap[id];
            if (!ex) {
                return;
            }
            if (ex.isShow()) {
                return;
            }
            ex.showExpression();
            this.calculator.setExpressions(ex.getExpression());
        }

        /**
         * 重新设置大小： 当外层div改变时，应调用该函数
         */
        GraphManager.prototype.resize = function () {
            this.calculator.resize();
        };
        return GraphManager;
    })();
    ExpressionGraph.GraphManager = GraphManager;
    var ExpressionType = (function () {
        function ExpressionType() {
        }

        /**
         * 1、一次函数：y=kx+b（k,b是常数，k≠0）
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Linear = {
            model: "y=kx+b",
            paramNum: 2,
            defValues: [1, 0],
            getLatex: function (params) {
                return "y=" + params[0] + "x+" + params[1];
            },
            html: "<span>y = kx+b</span>",
            params: ['k', 'b']
        };
        /**
         * 2、正比例函数：y=kx（k为常数，x的次数为1，且k≠0）
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): string)}}
         */
        ExpressionType.Directly_Proportional = {
            model: "y=kx",
            paramNum: 1,
            defValues: [1],
            getLatex: function (params) {
                return "y=" + params[0] + "x";
            },
            html: "<span>y = kx</span>",
            params: ['k']
        };
        /**
         * 3、二次函数：y=ax²+bx+c（a≠0），y=ax²，y=a(x-h)²+k
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Quadration = {
            model: "y=ax^2+bx+c",
            paramNum: 3,
            defValues: [1, 1, 0],
            getLatex: function (params) {
                return "y=" + params[0] + "x^2+" + params[1] + "x+" + params[2];
            },
            html: "<span> <span class=\"cutspace\">y = ax</span> <span class=\"sup\">2</span> <span>+ bx + c</span> </span>",
            params: ['a', 'b', 'c']
        };
        /**
         * 4、反比例函数：y=k/x（k为常数，k≠0，x≠0）
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Inverse_Proportional = {
            model: "y=k/x",
            paramNum: 1,
            defValues: [1],
            getLatex: function (params) {
                return "y=" + params[0] + "/" + "x";
            },
            html: " <span> <span>y = </span> <span class=\"friction\"> <span class=\"frictionup\">k</span> <span class=\"frictiondown\">x</span> </span> </span>",
            params: ['k']
        };
        /**
         * 5、指数函数：y=a^x(a>0且a≠1) (x∈R)
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Exponential = {
            model: "y=a^x",
            paramNum: 1,
            defValues: [2],
            getLatex: function (params) {
                return "y=" + params[0] + "^" + "x";
            },
            html: "<span> <span class=\"cutspace\">y = a</span> <span class=\"sup\">x</span> </span>",
            params: ['a']
        };
        /**
         * 6、对数函数：y=logax（a>0，且a≠1）
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Logarithmic = {
            model: "y=\\log_{a} {x}",
            paramNum: 1,
            defValues: [2],
            getLatex: function (params) {
                return "y=\\log_{" + params[0] + "}{x}";
            },
            html: " <span> <span class=\"cutspace\">y = log</span> <span class=\"cutspace sub\">a</span><span>(x)</span></span>",
            params: ['a']
        };
        /**
         * 7、幂函数：y=xa(a为实数）
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Power = {
            model: "y=x^a",
            paramNum: 1,
            defValues: [2],
            getLatex: function (params) {
                return "y=x^" + params[0];
            },
            html: "<span> <span class=\"cutspace\">y = x</span> <span class=\"sup\">a</span> </span> </span>",
            params: ['a']
        };
        /**
         * 8、正弦函数：y=sin(x)
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.SIN = {
            model: "y=sin(x)",
            paramNum: 0,
            defValues: [],
            getLatex: function (params) {
                return "y=\\sin \\left(x\\right)";
            },
            html: "<span>y = sin(x)</span>",
            params: []
        };
        /**
         * 9、余弦函数：y=cos(x)（x∈R）
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.COS = {
            model: "y=cos(x)",
            paramNum: 0,
            defValues: [],
            getLatex: function (params) {
                return "y=\\cos \\left(x\\right)";
            },
            html: "<span>y = cos(x)</span>",
            params: []
        };
        /**
         * 10、正切函数：y=tan(x){x|x≠(π/2)+kπ,k∈Z}
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.TAN = {
            model: "y=tan(x)",
            paramNum: 0,
            defValues: [],
            getLatex: function (params) {
                return "y=\\tan \\left(x\\right)";
            },
            html: "<span>y = tan(x)</span>",
            params: []
        };
        /**
         * 11、余切函数：y=cot(x)
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.COT = {
            model: "y=cot(x)",
            paramNum: 0,
            defValues: [],
            getLatex: function (params) {
                return "y=\\cot \\left(x\\right)";
            },
            html: "<span>y = cot(x)</span>",
            params: []
        };
        /**
         * 12、正割函数：y=sec(x)
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.SEC = {
            model: "y=sec(x)",
            paramNum: 0,
            defValues: [],
            getLatex: function (params) {
                return "y=\\sec \\left(x\\right)";
            },
            html: "<span>y = sec(x)</span>",
            params: []
        };
        /**
         * 13、余割函数：csc(x)=r/y（定义域{x|x≠kπ，k∈Z}）或者 cscx=1/sinx【值域{y|y≥1或y≤-1}】
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.CSC = {
            model: "y=csc(x)",
            paramNum: 0,
            defValues: [],
            getLatex: function (params) {
                return "y=\\csc \\left(x\\right)";
            },
            html: "<span>y = csc(x)</span>",
            params: []
        };
        /**
         * 14、圆函数：标准方程：（x-a）^2+（y-b）^2=r^2
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Circle = {
            model: "(x-a)^2+(y-b)^2=r^2",
            paramNum: 3,
            defValues: [0, 0, 1],
            getLatex: function (params) {
                return "(x-" + params[0] + ")^2+(y-" + params[1] + ")^2=" + params[2] + "^2";
            },
            html: "<span> <span class=\"cutspace\">(x-a)</span> <span class=\"sup\">2</span> <span class=\"cutspace\">+ (x-b)</span> <span class=\"sup\">2</span> <span class=\"cutspace\">= r</span> <span class=\"sup\">2</span> </span>",
            params: ['a', 'b', 'r']
        };
        /**
         * 15、圆函数：一般方程：x^2+y^2+Dx+Ey+F=0
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Circle_standard = {
            model: "x^2+y^2+Dx+Ey+F=0",
            paramNum: 3,
            defValues: [0, 0, -1],
            getLatex: function (params) {
                return "x^2+y^2+" + params[0] + "x+" + params[1] + "y+" + params[2] + "=0";
            },
            html: "<span> <span class=\"cutspace\">x</span> <span class=\"sup\">2</span> <span class=\"cutspace\">+ y</span> <span class=\"sup\">2</span> <span> + Dx + Ey + F = 0</span> </span>",
            params: ['D', 'E', 'F']
        };
        /**
         * 16、椭圆函数:焦点在X轴时，标准方程为：x²/a²+y²/b²=1 (a>b>0)
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Ellipse = {
            model: "x^2/a^2+y^2/b^2=1",
            paramNum: 2,
            defValues: [1, 2],
            getLatex: function (params) {
                return "x^2/" + params[0] + "^2+y^2/" + params[1] + "^2=1";
            },
            html: '<span>\
                  <span class="friction">\
                  <span class="frictionup">\
                  <span class="cutspace">y</span>\
                  <span class="sup">2</span>\
                  </span>\
                  <span class="frictiondown">\
                  <span class="cutspace">a</span>\
                  <span class="sup">2</span>\
                  </span>\
                  </span>\
                  <span> + </span>\
                  <span class="friction">\
                  <span class="frictionup">\
                  <span class="cutspace">x</span>\
                  <span class="sup">2</span>\
                  </span>\
                  <span class="frictiondown">\
                  <span class="cutspace">b</span>\
                  <span class="sup">2</span>\
                  </span>\
                  </span>\
                  <span>= 1</span>\
                  </span>',
            params: ['a', 'b']
        };
        /**
         * 17、抛物线方程：右开口抛物线：
         * 右开口 y^2=2px
         * 左开口抛物线：y^2= -2px
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Parabola_X = {
            model: "y^2=2px",
            paramNum: 1,
            defValues: [1],
            getLatex: function (params) {
                return "y^2=2" + params[0] + "x";
            },
            html: "<span> <span class=\"cutspace\">y</span> <span class=\"sup\">2</span> <span>= 2px</span> </span>",
            params: ['p']
        };
        /**
         * 18、抛物线方程：
         * 上开口抛物线：x^2=2py
         * 下开口抛物线：x^2=-2py
         * @type {{model: string, paramNum: number, defValues: number[], getLatex: (function(any): *)}}
         */
        ExpressionType.Parabola_Y = {
            model: "x^2=2py",
            paramNum: 1,
            defValues: [1],
            getLatex: function (params) {
                return "x^2=2" + params[0] + "y";
            },
            html: " <span> <span class=\"cutspace\">x</span> <span class=\"sup\">2</span> <span>= 2py</span> </span>",
            params: ['p']
        };
        return ExpressionType;
    })();
    ExpressionGraph.ExpressionType = ExpressionType;
    /**
     * 表达式类
     */
    var Expression = (function () {
        function Expression() {
            this.expression = [];
            this.params = [];
        }

        Expression.prototype.getExpression = function () {
            return this.expression;
        };
        /**
         * 添加表达式
         * @param id 唯一标识
         * @param type 类型
         * @param color 颜色
         */
        Expression.prototype.addExpression = function (id, type, color) {
            for (var i = 0; i < type.paramNum; i++) {
                this.params.push(ParamPool.getInstance().create());
            }
            var ex;
            if (color) {
                ex = {
                    id: id,
                    latex: type.getLatex(this.params),
                    color: color,
                    hidden:false
                };
            }
            else {
                ex = {
                    id: id,
                    latex: type.getLatex(this.params),
                    hidden:false
                };
            }
            this.expression.push(ex);
            for (var i = 0; i < type.paramNum; i++) {
                this.addParam(this.params[i], this.params[i], type.defValues[i]);
            }
        };
        Expression.prototype.isShow = function () {
            if (this.expression && this.expression.length > 0) {
                return !this.expression[0].hidden;
            }
            return false;
        }
        Expression.prototype.showExpression = function () {
            for (var i = 0, len = this.expression.length; i < len; i++) {
                this.expression[i].hidden = false;
            }
        }
        Expression.prototype.hideExpression = function () {
            for (var i = 0, len = this.expression.length; i < len; i++) {
                this.expression[i].hidden = true;
            }
        }
        /**
         * 添加一个参数
         * @param id 唯一标识id
         * @param name 名字
         * @param defValue 默认值
         */
        Expression.prototype.addParam = function (id, name, defValue) {
            var ex = {
                id: id,
                latex: name + "=" + defValue,
                hidden:false
            };
            this.expression.push(ex);
        };
        /**
         * 改变参数
         * @param paramValues 参数值序列
         */
        Expression.prototype.changeParamValue = function (paramValues) {
            for (var i = 0, len1 = paramValues.length, len2 = this.params.length; i < len1 && i < len2; i++) {
                var ex = this.expression[i + 1];
                ex.latex = this.params[i] + "=" + paramValues[i];
            }
        };
        /**
         * 释放参数
         */
        Expression.prototype.releaseParams = function () {
            for (var i = 0, len = this.params.length; i < len; i++) {
                ParamPool.getInstance().release(this.params[i]);
            }
            this.params = null;
        };
        return Expression;
    })();
    /**
     * 参数池，防止出现共同参数
     */
    var ParamPool = (function () {
        function ParamPool() {
            this.index = 0x61;
            this.busy = [];
            this.free = [];
        }

        ParamPool.getInstance = function () {
            if (ParamPool.instance == null) {
                ParamPool.instance = new ParamPool();
            }
            return ParamPool.instance;
        };
        /**
         * 创建一个参数
         * @returns {any}
         */
        ParamPool.prototype.create = function () {
            var param;
            if (this.free.length == 0) {
                param = String.fromCharCode(this.index++);
                while (param == "e" || param == "f" || param == "x" || param == "y") {
                    param = String.fromCharCode(this.index++);
                }
            }
            else {
                param = this.free.pop();
            }
            this.busy.push(param);
            return param;
        };
        /**
         * 释放一个参数
         * @param param
         */
        ParamPool.prototype.release = function (param) {
            for (var i = 0, len = this.busy.length; i < len; i++) {
                if (param == this.busy[i]) {
                    this.busy.splice(i, i + 1);
                    this.free.push(param);
                }
            }
        };
        return ParamPool;
    })();
})(ExpressionGraph || (ExpressionGraph = {}));