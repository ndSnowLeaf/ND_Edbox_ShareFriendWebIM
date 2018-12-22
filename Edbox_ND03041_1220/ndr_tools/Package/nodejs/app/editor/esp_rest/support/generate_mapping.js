/**
 * Created by Administrator on 2016/8/26.
 */
var Fs = require("fs");
var FileUtils = require("./FileUtils");
var Path = require("path");
var basefolder = Path.join(__dirname,"../../../prepare")
var Q = require("q");

FileUtils.readFile(Path.join(basefolder,"mapping_zh.json")).then(function(content){
    var original = JSON.parse(content);
    var languages = ["zh","ja","en","zh-tw-hk","ru-ru"];
    var aliasConfig = {
       "ja":["ja","ja_JP"],
        "zh":["zh","zh_CN"],
        "en":["en","en_US","en-US"],
        "zh-tw-hk":["zh-tw-hk","zh-TW","zh_TW","zh-HK","zh_HK"],
		"ru-ru":["ru-RU","ru_RU","ru-ru"]
    };
    var properties = ["basic_question","interact_question"];

    function loadLanguagesData(languages){
        var caches = {};
        var promises = [];
        for(var k=0;k<languages.length;k++){
            var language = languages[k];
            promises.push(loadLanguage(caches,language));
        }
        return Q.all(promises).then(function(){
            return caches;
        });
    }

    function loadLanguage(caches,language){
        return FileUtils.readFile(Path.join(basefolder,"mapping_"+language+".json")).then(function(content){
            try{
                var languageData = JSON.parse(content);
                caches[language] = languageData;
                return languageData;
            }
            catch(ex){
                console.log(ex);
                throw ex;
            }
        },function(err){
            console.log(err);

        });
    }
    loadLanguagesData(languages).then(function(languageCache){
        function setValue(item,language,label){
            var alias = aliasConfig[language];
            if(alias.length>0){
                for(var i=0;i<alias.length;i++){
                    if(label){
                        item.i18n[alias[i]] = label;
                    }
                    else{
                        delete item.i18n[alias[i]];
                    }
                }
            }
        }
        function merge(){
            console.log("start merge");
            for(var i=0;i<properties.length;i++){
                var pr =  properties[i];
                var items = original[pr];
                for(var j=0;j<items.length;j++){
                    var item = items[j];

                    if(!item.i18n){
                        item.i18n = {};
                    }
                    for(var k=0;k<languages.length;k++){
                        var language = languages[k];
                        var label = findLabel(item.code,language);
                        setValue(item,language,label);
                    }
                }
            }
            var str = JSON.stringify(original);
            console.log("after handle ",str);
            FileUtils.saveToFile(Path.join(basefolder,"mapping"),str);
        }


        function findLabel(code,lang){
            var data = languageCache[lang];
            for(var i=0;i<properties.length;i++){
                var pr =  properties[i];
                var items = data[pr];
                for(var j=0;j<items.length;j++){
                    var item = items[j];
                    if(item.code == code){
                        return item.label;
                    }
                }
            }
            return null;
        }
        merge();
    });

},function(err){
    console.log(err);
}).catch(function(ex){
    console.log(ex);
});