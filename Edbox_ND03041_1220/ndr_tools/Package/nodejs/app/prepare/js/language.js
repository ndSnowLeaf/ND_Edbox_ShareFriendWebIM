/**
 * Created by Administrator on 2016/8/25.
 */
var language = {
    "zh-CN":{
        "prepare.newquestions":"新建试题",
        "prepare.basicquestion":"基础题型",
        "prepare.interactquestion":"趣味习题",
        "prepare.help": "帮助",
        "prepare.sample": "范例",
        "prepare.prompt.keyword":"请输入关键字"
    },
    "ja-JP":{
        "prepare.newquestions": "",
        "prepare.basicquestion": "基礎問題",
        "prepare.interactquestion": "インタラクティブ問題" ,
        "prepare.help": "help",
        "prepare.sample": "sample",
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
        "prepare.basicquestion":"基礎題型",
        "prepare.interactquestion":"趣味習題",
        "prepare.help": "帮助",
        "prepare.sample": "範例",
        "prepare.prompt.keyword":"請輸入關鍵字"
    }

}
language.setLanguage = function(lan){
    language.lan = lan;
}
language.i18n = function(key){
    var lan =language.lan;
    if(lan){
        lan = lan.toLowerCase();
        if(lan.indexOf("zh-tw")!=-1||lan.indexOf("zh_tw")!=-1||lan.indexOf("zh-hk")!=-1||lan.indexOf("zh_hk")!=-1){
            lan = "zh-TW-HK";
        }
        else if(lan.indexOf("zh")!=-1){
            lan = "zh-CN";
        }
        else if(lan.indexOf("ja")!=-1){
            lan = "ja-JP";
        }
        else if(lan.indexOf("en")!=-1){
            lan = "en-US";
        }
    }
    if(!lan){
        lan = language.lan = "zh-CN";
    }
    return language[lan][key];
}