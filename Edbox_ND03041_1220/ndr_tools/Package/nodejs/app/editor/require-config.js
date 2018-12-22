requirejs.config({
	"paths": {
		"text": "lib/require/2.1.11/require-text",
		"json": "lib/require/2.1.11/require-json",
		"css": "lib/require/2.1.11/require-css",
		"jlang": "lib/jlang/1.0.0/jlang",
		"jquery": "lib/jquery/1.11.2/jquery",
		"angular_": "lib/angular/1.4.4/angular",
		"angular": "lib/angular/1.4.4/angular-extend",
		"angular-translate": "lib/angular/1.4.4/angular-translate",
		"i18n": "lib/i18n/1.0.0/i18n",
		"exception": "lib/exception/1.0.0/exception",
		"prompter": "lib/prompter/1.0.0/prompter",
		"angular-prompter": "lib/prompter/1.0.0/angular-prompter",
		"slides": "lib/slides/1.0.0/slides",
		"angular-slides": "lib/slides/1.0.0/angular-slides",
		"plupload": "lib/plu/2.1.2/plupload",
		"ckeditor": "lib/ckeditor/4.5.4/ckeditor",
		"cryptojs": "lib/cryptojs/3.1.2/cryptojs",
		"snap": "lib/snap/dist/snap.svg-min",
		"espService": "esp-lib/esp-service/1.3.0/esp-service",
		"espModel": "esp-lib/esp-model/1.3.0/esp-model",
		"espSecurity": "esp-lib/esp-security/1.3.0/esp-security",
		"espEnvironment": "esp-lib/esp-environment/1.3.0/esp-environment",
		"strformat": "lib/angular/strformat",
		"cropper": "lib/cropper/3.0.0/cropper.min"
	},
	"map": {
		"*": {}
	},
	"shim": {
		"jlang": {
			"exports": "jlang"
		},
		"angular_": {
			"deps": [
				"jquery"
			],
			"exports": "angular"
		},
		"angular": {
			"deps": [
				"angular_",
				"angular-translate"
			],
			"exports": "angular"
		},
		"angular-translate": {
			"deps": [
				"angular_"
			],
			"exports": "angular"
		},
		"ckeditor": {
			"deps": [
				"lib/ckeditor/4.5.4/ckeditor_common"
			],
			"exports": "CKEDITOR"
		},
		"cryptojs": {
			"exports": "CryptoJS"
		},
		"cropper": {
			"deps": [
				"css!lib/cropper/3.0.0/cropper.min.css",
				"jquery"
			]
		},
		"*": {
			"deps": [
				"json!config.json"
			]
		}
	}
});


define('environmentConfig', ['json!config.json'], function (config) {
	var version = config.version;
	if(!version && config.debug === true){
		version = new Date().getTime();
	}
	version && requirejs.config({
		urlArgs:'_version_=' + version
	});
	return config;
});

define('i18nConfig', ['environmentConfig'], function (environmentConfig) {
	return {
		supportLanguages: environmentConfig.supportLanguages,
		defaultLanguage: environmentConfig.defaultLanguage,
		languageParamName: environmentConfig.languageParamName,
		globalLanguagePack: environmentConfig.globalLanguagePack || 'lang'
	};
});

define('js-library',['jquery', 'espEnvironment'], function ($, espEnvironment) {
	var libraries = {};
	function reqNext(req, paths, i, result, done, fail){
		var path = paths[i];
		if(!path){
			done && done(result);
			return;
		}
		req([path], function (r) {
			result[i] = r;
			reqNext(req, paths, i + 1, result, done, fail);
		}, function (e) {
			fail && fail(e);
		});
	}
	return {
		/**
		 * 参数name支持数组方式，如：'js-library!editor_common_css&css!./style.css&css!./program.css'
		 * 应用场景：主要用于需要执行顺序加载的样式表
		 */
		load : function(name, req, onLoad, config) {
			var names = name.replace(/ /g, "").split("&"),
			    followings = names.slice(1),
				version, idx;
				
			name = names[0];
			idx = name.indexOf(':');
			if(idx != -1){
				version = name.substring(idx + 1);
				name = name.substring(0, idx);
			}
			
			var library = libraries[name];
			if(library){
				if(library.state === 1){
					onLoad(library.exports);
					followings.lengnth > 0 && reqNext(req, followings, 0, []);
				}else if(library.state === -1){
					onLoad.error(library.exports);
					followings.lengnth > 0 && reqNext(req, followings, 0, []);
				}else{
					library.promise.then(function() {
						$.each(followings, function(i, item) {
							library.paths.push(item);
						});
					});
					
					library.waiting.push(onLoad);
				}

				return;
			}
			library = libraries[name] = {version: version, load: 0, waiting: [onLoad], promise: $.Deferred(), paths:[]};
			var url = espEnvironment.url.jsLibraryRoot(name, version);
			req(['json!' + url('package.json')], function (packageConfig) {
				var dependencies = packageConfig.dependencies || [],
					scripts = packageConfig.script || [],
					styles = packageConfig.css || [];

				$.each(dependencies, function(i, dep){
					var depName, depVersion;
					if(typeof dep === 'string'){
						depName = dep;
					}else{
						depName = dep.name;
						depVersion = dep.version;
					}
					depName && library.paths.push('js-library!' + depName + (depVersion ? ':' + depVersion : ''));
				});
				$.each(styles, function(i, style){
					library.paths.push('css!' + url(style));
				});
				$.each(scripts, function(i, script){
					library.paths.push(url(script));
				});
				$.each(followings, function(i, item) {
					library.paths.push(item);
				});
				library.promise.resolve();
				reqNext(req, library.paths, 0, [], function (result) {
					library.exports = result;
					$.each(library.waiting, function (i, fn) {
						fn(library.exports);
					});
					library.waiting.length = 0;
					library.state = 1;
				}, function (e) {
					library.exports = e;
					$.each(library.waiting, function (i, fn) {
						fn.error(library.exports);
					});
					library.waiting.length = 0;
					library.state = -1;
				});
			}, function (e) {
				onLoad.error(e);
			});
		}
	};
});
