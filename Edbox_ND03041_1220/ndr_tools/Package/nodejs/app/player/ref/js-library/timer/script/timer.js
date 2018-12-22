/**
 * 公共组件：定时器
 * @param statContainer 定时器容器的选择器
 * @param options 初始化参数 ｛sequence：boolean,seconds:int｝
 * @constructor
 * 调用例子：1、var timer = new Timer('div.com_u_timebox',{sequence:true});
 *            timer.start();  //在div.com_u_timebox这个div下创建一个顺时计时器，并启动. 停止调用stop(callback)
 *
 *          2、var timer = new Timer('div.com_u_timebox',{sequence:false,seconds:30});
 *             timer.start(function(){
 *                console.log('time over');
 *             });   //在div.com_u_timebox这个div下创建一个倒计时器，初始时间30秒，并启动
 */
function Timer(statContainer, options) {

	var intervaler;

	this.statContainer = $(statContainer); //容器

	this.options = options; //参数选项

	var sequence = this.options.sequence;

	if (sequence === true) { //若为顺时，则初始时间设为0
		this.options.seconds = 0;
	}

	var timingCallback = null;
	var onStopCallback = null;

	var min = 0;
	var sec = 0;
	var spendTime = 0;

	this.getTime = function() {
		return min * 60 + sec;
	};
	this.setTime = function(time) {
		if (isNaN(time)) {
			time = 0;
		}
		try {
			min = parseInt(time / 60);
			sec = time % 60;
		} catch (e) {
			min = 0;
			sec = 0;
		}
		this.init();
	};
	this.reset = function() {
		min = Math.floor(this.options.seconds / 60);
		sec = this.options.seconds % 60;
		spendTime = 0;
	}

	function format(num) {
		if (num < 10) {
			return '0' + num;
		}
		return num;
	}

	this.onStop = function(cb) {
		if (cb && $.isFunction(cb)) {
			onStopCallback = cb;
		}
	}

	this.sync = function(timestamp) {
		console.log('time sync timestamp', timestamp);
		//var locTime = new Date().valueOf();
		var locTime = 0;
		if (window.ClassroomUtils && (typeof ClassroomUtils != 'undefined') && ClassroomUtils.getMasterSystemTime) {
			locTime = ClassroomUtils.getMasterSystemTime();
			locTime = locTime == 0 ? new Date().getTime() : (locTime * 1000);
		} else {
			locTime = new Date().valueOf();
		}
		console.log('time sync locTime', locTime);
		if (locTime > timestamp) {
			var dif = Math.floor((locTime - timestamp) / 1000);
			console.log('time sync', dif + 's');
			if (sequence === true) { //顺时
				sec = sec + dif;
				if (Math.floor(sec / 60) >= 1) {
					min = min + Math.floor(sec / 60);
					sec = sec % 60;
				}
			} else if (sequence === false) {
				var seconds = min * 60 + sec - dif;
				min = Math.floor(seconds / 60);
				sec = seconds % 60;
			}
		}
		this.init();
	}

	this.init = function() {
		var timerContainer = this.statContainer.find('>div.timerContainer');
		if (timerContainer.length === 0) {
			var html = "<div class='timerContainer'><span class='timeNum' id='min'>" + format(min) + "</span><span class='timeNum' id='sec'>" + format(sec) + "</span></div>";
			$(html).appendTo(this.statContainer);
		} else if (timerContainer.length === 1) {
			timerContainer.find('span.timeNum#min').text(format(min));
			timerContainer.find('span.timeNum#sec').text(format(sec));
		}
	}

	this.clear = function() {

		if (sequence === true) { //若为顺时，则初始时间设为0
			this.options.seconds = 0;
		}
		min = Math.floor(this.options.seconds / 60);
		sec = this.options.seconds % 60;
		this.spendTime = 0;
	}

	/**
	 * 设置计时回调函数
	 * @param callback
	 */
	this.onTimimg = function(callback) {
		if (callback && $.isFunction(callback)) {
			timingCallback = callback;
		}
	}

	this.start = function() {
		//this.clear();
		var container = this.statContainer;

        function setTimeTxt() {
            var $min = container.find('>div.timerContainer>span#min');
            var $sec = container.find('>div.timerContainer>span#sec');
            if (timingCallback) {
                timingCallback(min, sec, $min.selector, $sec.selector);
            }
            $min.text(format(min));
            $sec.text(format(sec));
        }

		intervaler = setInterval(function() {
			spendTime++;
			if (sequence === true) { //顺时
				if (sec >= 59) {
					sec = 0;
					min++;
				} else {
					sec++;
				}
			} else if (sequence === false) { //倒计时
				if (sec <= 1 && min <= 0) {
					sec = 0;
					min = 0;
					if (onStopCallback && $.isFunction(onStopCallback)) {
						onStopCallback(spendTime);
					}
					clearInterval(intervaler);
				} else {
					if (sec === 0 && min > 0) {
						sec = 59;
						min--;
					} else {
						sec--;
					}
				}
			}

            setTimeTxt();
		}, 1000);
        setTimeTxt();
	}

	this.stop = function() {
		/*if(callback)
		    callback(spendTime);*/
		clearInterval(intervaler);
		return spendTime;
	}

	/**
	 * 销毁，释放内存
	 */
	this.onDestory = function() {
		timingCallback = null;
		intervaler = null;
		onStopCallback = null;
	}

	this.init();
	this.reset();

}
