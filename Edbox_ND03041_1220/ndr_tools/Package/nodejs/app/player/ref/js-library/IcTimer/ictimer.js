/**
 * Created by Administrator on 2016/3/9.
 */


(function (window) {
    'use strict';

    var config = {
        debug: false,
        log: function () {
            if (this.debug) {
                console.log.apply(window.console, Array.prototype.slice.apply(arguments, [0]));
            }
        }
    };

    var visibilityState = (function () {
        var visibilityState = 'visible';
        var hidden = document.hidden;
        var visibilityChange = 'visibilitychange';
        var state = 'visibilityState';
        var vendors = ['moz', 'ms', 'webkit'];
        for (var i = 0; i < vendors.length && !hidden; i++) {
            hidden = document[vendors[i] + 'Hidden'];
            visibilityChange = vendors[i] + 'visibilitychange';
            state = vendors[i] + 'VisibilityState';
        }

        return {
            bindChangeEvent: function (callback) {
                document.addEventListener(visibilityChange, function () {
                    visibilityState = document[state];
                    if (callback) {
                        callback(visibilityState === 'visible');
                    }
                }, false);
            }
        }
    })();

    var timerFactory = {
        getTimer: function (hoggingCpu) {
            var that = this;
            if (hoggingCpu) {
                return that._setTimeout;
            } else {
                if (this._requestAnimationFrame.enable) {
                    return that._requestAnimationFrame;
                } else {
                    this.getTimer = function () {
                        return that._setTimeout;
                    };
                    return that._setTimeout;
                }
            }
        },
        _setTimeout: {
            _lastTime: 0,
            _frameRate: 1000 / 60,
            run: function (callback) {
                var currTime = new Date().getTime();
                //16ms一帧，计算当前时间点和上一次执行时间点偏差，保证每帧时间间隔为16ms
                var timeToCall = Math.max(0, this._frameRate - ( currTime - this._lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                //保存最后一次执行的时间点
                this._lastTime = currTime + timeToCall;
                return id;
            },
            cancel: function (id) {
                window.clearTimeout(id);
            }
        },
        _requestAnimationFrame: (function () {
            var requestAnimationFrame = window.requestAnimationFrame;
            var cancelAnimationFrame = window.cancelAnimationFrame;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
                requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            config.log('requestAnimationFrame:' + !!requestAnimationFrame);
            return {
                enable: !!requestAnimationFrame,
                run: function (callback) {
                    return requestAnimationFrame(callback);
                },
                cancel: function (id) {
                    cancelAnimationFrame(id);
                }
            };
        })()
    };

    var runnableQueue = {
        queue: [],
        getLength: function () {
            return this.queue.length;
        },
        push: function (callback, periodMillis, repeat, hoggingCpu) {
            var currTime = new Date().getTime();
            this.queue.push({
                lastTime: currTime,
                callback: callback,
                periodMillis: periodMillis || 0,
                repeat: !!repeat,
                hoggingCpu: !!hoggingCpu
            });
        },
        remove: function (callbackOrIndex) {
            if (typeof  callbackOrIndex === 'function') {
                var queueLen = this.queue.length;
                var task;
                for (var i = 0; i < queueLen; i++) {
                    task = this.queue[i];
                    if (task && callbackOrIndex === this.queue[i].callback) {
                        this.queue.splice(i, 1);
                        i--;
                        queueLen--;
                    }
                }
            } else if (typeof  callbackOrIndex === 'number') {
                this.queue.splice(callbackOrIndex, 1);
            } else {
                config.log('remove queue fail, callbackOrIndex:', callbackOrIndex);
            }
        },
        needHoggingCpu: function () {
            var queueLen = this.queue.length;
            var task;
            for (var i = 0; i < queueLen; i++) {
                task = this.queue[i];
                if (task && task.hoggingCpu === true) {
                    return true;
                }
            }
        },
        clear: function () {
            this.queue = [];
        },
        get: function (i) {
            return this.queue[i];
        }

    };

    var mainTask = {
        timer: timerFactory.getTimer(false),
        isRunning: false,
        id: 0,
        timerChanged: false,
        isTabVisible: true,
        bindVisibilityState: function () {
            var that = this;
            visibilityState.bindChangeEvent(function (isTabVisible) {
                that.isTabVisible = isTabVisible;
                if (isTabVisible === false) {
                    if (runnableQueue.needHoggingCpu()) {
                        that.stop();
                        that.timer = timerFactory.getTimer(true);
                        that.timerChanged = true;
                        if (runnableQueue.getLength() > 0 && !that.isRunning) {
                            that.start();
                        }
                    }
                } else if (that.timerChanged) {
                    that.timerChanged = false;
                    that.stop();
                    that.timer = timerFactory.getTimer(false);
                    if (runnableQueue.getLength() > 0 && !that.isRunning) {
                        that.start();
                    }
                }
            });
        },
        start: function () {
            var that = this;
            that.isRunning = true;
            this.id = that.timer.run(function (millis) {
                var queueLen = runnableQueue.getLength();
                var currentTime;
                var task;
                for (var i = 0; i < queueLen; i++) {
                    task = runnableQueue.get(i);
                    currentTime = new Date().getTime();

                    var intervalMillis = currentTime - task.lastTime - task.periodMillis;
                    if (task && intervalMillis >= -5) {
                        if (that.isTabVisible || (!that.isTabVisible && task.hoggingCpu)) {
                            try {
                                task.callback(millis);
                            } catch (e) {
                                task.repeat = false;
                                console.error('定时器任务内部异常,任务被移除', e.stack);
                            }
                            config.log('running', task.periodMillis, '---', currentTime - task.lastTime);
                            if (task.repeat) {
                                task.lastTime = currentTime;
                            } else {
                                runnableQueue.remove(i);
                                i--;
                                queueLen--;
                            }
                        }
                    }
                }
                if (runnableQueue.getLength() === 0) {
                    that.stop();
                } else {
                    that.start();
                }
            });
        },
        scheduleTask: function (callback, periodMillis, repeat, hoggingCpu) {
            runnableQueue.push(callback, periodMillis, repeat, hoggingCpu);
            if (!this.isRunning) {
                this.start();
            }
        },
        cancelTask: function (callback) {
            runnableQueue.remove(callback);
        },
        stop: function () {
            this.isRunning = false;
            this.timer.cancel(this.id);
        },
        release: function () {
            this.stop();
            runnableQueue.clear();
        }
    };

    mainTask.bindVisibilityState();

    window.IcTimer = {
        debug: function (debug) {
            config.debug = debug;
        },
        scheduleAnimationTask: function (callback) {
            mainTask.scheduleTask(callback, 0, true, false);
        },
        scheduleTask: function (callback, periodMillis, repeat, hoggingCpu) {
            mainTask.scheduleTask(callback, periodMillis, repeat, hoggingCpu);
        },
        cancelTask: function (callback) {
            mainTask.cancelTask(callback);
        },
        release: function () {
            mainTask.release();
        }
    };

})(window);