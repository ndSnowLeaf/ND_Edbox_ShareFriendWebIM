function handler(e,n){return i18n.__(e,n)}var i18n=require("i18n"),config=require("../config");i18n.configure({locales:config.getSupportedLanguages(),directory:__dirname+"./../i18n",defaultLocale:"zh-CN"}),exports.i18n=handler;