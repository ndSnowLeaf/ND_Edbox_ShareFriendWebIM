var nodeUuid = require("node-uuid");
var path = require('path');
var crypto = require('crypto');
var config = {
    appKey: 'ed0e0aefe155246afc40c4afece9302043988ab3320d0e6a4591f217e7985dad',
    secretKey: 'add3c95e96b331925522c1ac75bfa86035503f481c97c71e4d87017b6cb270e7283f53c2149e52c5932185ade1b460d1',
    provisionFile: path.resolve(__dirname, 'aiengine/aiengine.provision').replace(/\\/g, '/'),
    dllFile: path.resolve(__dirname, 'aiengine/aiengine.dll')
};

var aiEngineBridge = null;
try {
	aiEngineBridge = require('./aiengine/aienginebridge');
} catch(ex) {
	
}

//系统退出前，释放aiengine
process.on("exit", function (err, req, resp) {
    !!aiEngineBridge && !!aiEngineBridge.close && aiEngineBridge.close();
});

function decipher(crypted) {
    var decipher = crypto.createDecipher('aes-256-cbc', 'c1*h2-i0+v6&o7!x8');
    var dec = decipher.update(crypted, 'hex', 'utf8');
    dec += decipher.final('utf8');

    return dec;
}

/**
 * 合成队列管理
 * 由于目前aiEngineBridge不支持并发任务，所以实行队列管理
 * 后续需要优化aiengine/aienginebridge.node，以支持并发任务
 *
 * @type {{queue: {}, push: Function, pop: Function}}
 */
var SynthesisQueueManager = {
    queue: {},
    push: function (params, callback) {
        var uuid = nodeUuid.v4();
        this.queue[uuid] = {
            params: params,
            callback: callback
        };
    },
    pop: function () {
        var queue = this.queue;
        for (var key in queue) {
            if (queue.hasOwnProperty(key)) {
                var item = queue[key];
                delete queue[key];

                doSynthesis(item.params, item.callback);

                break; //每次只取出一个
            }
        }
    }
};

/**
 * 获取音色
 * 
 * @param lang  语言
 * @param tone  音色
 * @return string
 */
var getTone = function(lang, tone) {
	var result;
	if(lang === 'en') { //英文音色
		switch(tone) {
			case "M1":
				result = "syn.ensnt.liuyim";
				break;
			case "M2":
				result = "syn.ensnt.acawbm";
				break;
			case "W1":
				result = "syn.ensnt.shirlf";
				break;
			case "W2":
				result = "syn.ensnt.wysbrf";
				break;
			default:
				result = "syn.ensnt.liuyim";
		}
	} else { //中文音色
		switch(tone) {
			case "M1":
			case "M2":
				result = "voices_anonym_male.0.2.8";
				break;
			case "W1":
				result = "voices_anonyf_female.0.2.7";
				break;
			case "W2":
				result = "voices_bcgirl_female.0.2.7";
				break;
			case "W3":
				result = "voices_xyshenf_female.0.2.7";
				break;
			case "W4":
				result = "voices_zhilingf_female.0.2.8";
				break;
			default:
				result = "voices_anonyf_female.0.2.7";
		}
	}
	
	return result;
};

/**
 * 语音合成
 * @param params {
 * 	 text  待合成文本,
 *   audioPath  合成结果存放目录,
 *   lang  语言 中文-cn,英文-en,
 *   tone  音色 M1-男1,M2-男2,W1-女1,W2-女2
 * }
 * @param callback  回调函数
 */
var doSynthesis = function (params, callback) {
    //Step1. open DLL Library
    var openResult = aiEngineBridge.open(config.dllFile);
    var openCode = JSON.parse(openResult).result;
    if (openCode == 0 || openCode == -100) { //0:加载成功; -100:已加载;
        //Step2. Setting
        aiEngineBridge.setting(decipher(config.appKey), decipher(config.secretKey), config.provisionFile);

        //Override doSynthesis, ensure that just call "aiEngineBridge.task" subsequently.
        (exports.doSynthesis = doSynthesis = function (params, callback) {
		
            //Step3. Task
            var options = {
                "coreProvideType": "cloud",
                "app": {
                    "userId": "chivox_demo"
                },
                "audio": {
                    "audioType": "mp3",
                    "sampleRate": 16000,
                    "channel": 1,
                    "sampleBytes": 2
                },
                "request": {
                    "coreType": "cn.syn.sent",
                    "res": "voices_anonyf_female.0.2.7",
                    "refText": params.text,
                    "speechRate": "1.0"
                }
            };
			
			if(params.lang === "en") {
				options.request.coreType = "en.syn.sent";
				options.request.res = getTone(params.lang, params.tone);
			}

            //NODE需要保证失败情况下也能调用回调函数
            var taskResult = aiEngineBridge.task(JSON.stringify(options), params.audioPath, function (data) {
                callback && callback(data);

                SynthesisQueueManager.pop();
            });
            var taskCode = JSON.parse(taskResult).result;
            switch (taskCode) {
                case 0: //正常，等待回调
                    break;
                case -1001: //已有一个请求正在合成中
                    SynthesisQueueManager.push.apply(SynthesisQueueManager, arguments);
                    break;
                case -1002:
                case -1003:
                    callback && callback();
                    break;
                default:
            }
        })(params, callback);
    } else {
        throw "Synthesis Error::Open";
    }
};

exports.synthesis = function(text, audioPath, callback) {
	doSynthesis({text: text, audioPath: audioPath}, callback);
};
exports.synthesisV2 = function(params, callback) {
	doSynthesis(params, callback);
};
