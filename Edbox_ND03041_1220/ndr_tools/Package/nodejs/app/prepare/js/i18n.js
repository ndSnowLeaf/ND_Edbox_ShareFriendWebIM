var i18n = {
	DEFAULT_LANG: "zh-CN",
	translation: {},
	languageMap: { //Language Map
		"zh-CN": ["zh", "zh_CN"],
		"zh-TW-HK": ["zh_TW", "zh-TW", "zh_HK", "zh-HK"],
		"en-US": ["en", "en_US"],
		"ja-JP": ["ja", "ja_JP"],
		"ru-RU": ["ru", "ru_RU"]
	},
	translationsMap: {
		"zh-CN":{
			"prepare.newquestions":"新建试题",
			"prepare.basicquestion":"基础习题",
			"prepare.interactquestion":"趣味题型",
			"prepare.help": "帮助",
			"prepare.sample": "范例",
			"prepare.prompt.keyword":"请输入关键字"
		},
		"ja-JP":{
			"prepare.newquestions": "",
			"prepare.basicquestion": "基礎問題",
			"prepare.interactquestion": "インタラクティブ問題" ,
			"prepare.help": "help",
			"prepare.sample": "範例",
			"prepare.prompt.keyword":"キーワードを入力してください"
		},
		"en-US":{
			"prepare.newquestions": "",
			"prepare.basicquestion": "Exercises",
			"prepare.interactquestion": "Interactive Exercises",
			"prepare.help": "help",
			"prepare.sample": "sample",
			"prepare.prompt.keyword":"Please enter key words"
		},
		"zh-TW-HK":{
			"prepare.newquestions":"新建試題",
			"prepare.basicquestion":"基礎習題",
			"prepare.interactquestion":"趣味題型",
			"prepare.help": "帮助",
			"prepare.sample": "範例",
			"prepare.prompt.keyword":"請輸入關鍵字"
		},
		"ru-RU":{
			"prepare.newquestions":"新建试题",
			"prepare.basicquestion":"Основные задания",
			"prepare.interactquestion":"Занимательные упражнения",
			"prepare.help": "помочь",
			"prepare.sample": "пример",
			"prepare.prompt.keyword":"Введите ключевое слово"
		}
	}
};
i18n.use = function(language){ 
	var currentLange = language || this.DEFAULT_LANG;
	if(!this.translationsMap.hasOwnProperty(currentLange)) {
		var isSupported = false;
		var code = currentLange.substring(0, currentLange.indexOf('_'));
		for(var key in this.languageMap) {
			var languages = this.languageMap[key] || [];
			if(languages.indexOf(currentLange) > -1 || languages.indexOf(code) > -1) {
				isSupported = true;
				currentLange = key;
				break;
			}
		}
		!isSupported && (currentLange = this.DEFAULT_LANG);
	}
	
	this.currentLange = currentLange;
	this.translation = this.translationsMap[this.currentLange];
};
i18n.translate = function(key){
    return this.translation[key];
};
