define(["i18n","require","plupload/../plupload.full.min"],function(i18n,require){var langMapping={zh:"zh_CN","zh-CN":"zh_CN"},lang=i18n.language;return requirejs(["plupload/../i18n/"+(langMapping[lang]||lang)],function(){},function(error){console.error("plupload load lang has error:"+error)}),plupload});