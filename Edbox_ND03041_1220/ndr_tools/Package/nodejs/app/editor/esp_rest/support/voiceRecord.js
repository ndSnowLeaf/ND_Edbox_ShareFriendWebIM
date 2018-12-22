var voiceRecordEngine = require('./voiceRecord/voicerecordeginebridge');
var path = require('path');
var dllPath = path.resolve(__dirname, "./voiceRecord/VoiceRecordEngine.dll");

//console.log(dllPath);
var isRecording = false;
var currentVoiceVolumn = null;
var startRecordCallback = null;
var stopRecordCallback = null;
var EventChannel = function(eventName, eventParams) {
	console.log('EventChannel', arguments);
	if(eventName === 'VoiceMessage') {
		if(eventParams) {
			var result = JSON.parse(eventParams);
			switch(result.msg) {
				case 'hasdevice': //开始录音：有录音设备
					isRecording = true;
					startRecordCallback && startRecordCallback(0);
					startRecordCallback = null;
					break;
				case 'nodevice': //开始录音：无录音设备
					isRecording = false;
					startRecordCallback && startRecordCallback(-1);
					startRecordCallback = null;
					break;
				case 'finish': //结束录音
					isRecording = false;
					stopRecordCallback && stopRecordCallback(result.path);
					stopRecordCallback = null;
					break;
				default:;
			}
		}
		
	} else if(eventName === 'VoiceRecordState'){
		if(eventParams) {
			var result = JSON.parse(eventParams);
			console.log(result);
			switch(result.state) {
				case 'voicedb': //音量返回
					currentVoiceVolumn = result.value;
					break;
				default:;
			}
		}
	}
};

var startVoiceRecord = function(callback) {
	voiceRecordEngine.init(dllPath, EventChannel);

	(startVoiceRecord = function(callback) {
		if(!isRecording) {
			startRecordCallback = callback;
			currentVoiceVolumn = null;
			voiceRecordEngine.start(100000000);
		} else {
			callback(-2); //正在录音
		}
	})(callback);
};

var getVoiceVolumn = function(callback){
	if(isRecording) {
		callback(currentVoiceVolumn);
	} else {
		callback();
	}
};

var stopVoiceRecord = function(callback) {
	if(isRecording) {
		stopRecordCallback = callback;
		voiceRecordEngine.stop();
	} else {
		callback(-1); //还没开始录音
	}
};

//系统退出前，释放aiengine
process.on("exit", function (err, req, resp) {
    !!voiceRecordEngine && !!voiceRecordEngine.exit && voiceRecordEngine.exit();
});

exports.startVoiceRecord = startVoiceRecord; //开始录音
exports.stopVoiceRecord = stopVoiceRecord;   //结束录音
exports.getVoiceVolumn = getVoiceVolumn;     //获取当前录音音量
