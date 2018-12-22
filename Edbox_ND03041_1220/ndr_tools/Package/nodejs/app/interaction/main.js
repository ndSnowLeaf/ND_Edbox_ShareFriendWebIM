requirejs.config({
	"waitSeconds": 0,
	"baseUrl": "/interaction",
	"paths": {
		"css": "bower_components/require-css/css.min",
		"css-builder": "bower_components/require-css/css-builder",
		"normalize": "bower_components/require-css/normalize",
		"angular": "bower_components/angular/angular.min",
		"angular-ui-router": "bower_components/angular-ui-router/angular-ui-router.min",
		"angular-bindonce": "bower_components/angular-bindonce/bindonce.min",
		"angularAMD": "bower_components/angularAMD/angularAMD.min",
		"restangular": "bower_components/restangular/restangular.min",
		"lodash": "bower_components/lodash/lodash.min",
		"angular-cookies": "bower_components/angular-cookies/angular-cookies.min",
		"moment": "bower_components/moment/mymoment",
		"angular-ui-select": "bower_components/angular-ui-select/dist/select",
		"angular-ui-select-css": "bower_components/angular-ui-select/dist/select",
		"angular.drag.drop": "bower_components/angular-drag-and-drop-lists-master/angular-drag-and-drop-lists",
		"jquery": "bower_components/jquery/jquery.min",
		"tripledes": "bower_components/encrypt/tripledes",
		"uuid": "bower_components/node-uuid/uuid",
		"angular-translate": "bower_components/angular-translate/angular-translate.min",
		"jquery.mousewheel": "components/jquery-plugin/jquery.mousewheel/jquery.mousewheel-3.1.12",
		"placeholder": "components/placeholder/placeholder",
		"sortable": "components/sortable/sortable",
		"messenger": "components/messenger/messenger",
		"ngDialog": "components/ngDialog/ngDialog",
		"enc-base64": "components/http-auth/enc-base64-min",
		"hmac-auth": "components/http-auth/hmac-auth",
		"hmac-sha256": "components/http-auth/hmac-sha256",
		"http-auth": "components/http-auth/http-auth",
		"userdata.service": "components/site-services/userdata.service",
		"skin.service": "components/site-services/skin.service",
		"site.filter": "components/site-filter/site.filter",
		"customeditor.service": "components/site-services/customeditor.service",
		"diskpath.service": "components/site-services/diskpath.service",
		"lifecycle.service": "components/site-services/lifecycle.service",
		"ui-bootstrap-tooltip": "components/site-directive/ui-bootstrap-tooltip/ui-bootstrap-tooltip",
		"question-guide": "components/site-directive/question-guide/question-guide",
		"threejs": "bower_components/three.js/three.min",
		"TweenMax": "bower_components/TweenMax/TweenMax.min",
		"knockout": "bower_components/knockout/knockout",
		"threex_dynamictexture": "bower_components/threex_dynamictexture/threex.dynamictexture",
		"threejs_projector": "bower_components/threejs_projector/Projector",
		"threejs_canvasrender": "bower_components/threejs_canvasrender/CanvasRenderer",
		"mobiscroll": "bower_components/mobiscroll.select/js/mobiscroll.custom-2.6.2.min",
		"addon-puzzle": "puzzle/directive/addon-puzzle",
		"addon-mathaxis": "mathaxis/directive/addon-mathaxis",
		"mathjs": "bower_components/mathjs/dist/math.min",
		"jqueryui": "bower_components/jqueryui/jqueryui"
	},
	"shim": {
		"messenger": {
			"exports": "messenger"
		},
		"moment": {
			"exports": "moment"
		},
		"angular": {
			"exports": "angular",
			"deps": [
				"jquery"
			]
		},
		"lodash": {
			"exports": "_"
		},
		"enc-base64": {
			"deps": [
				"hmac-sha256"
			]
		},
		"tripledes": {
			"exports": "tripledes",
			"deps": [
				"hmac-sha256"
			]
		},
		"hmac-auth": {
			"deps": [
				"enc-base64"
			]
		},
		"angular-ui-router": [
			"angular"
		],
		"restangular": [
			"angular",
			"lodash"
		],
		"angularAMD": [
			"angular",
			"jquery"
		],
		"angular-translate": [
			"angular"
		],
		"angular-ui-select": [
			"angular"
		],
		"http-auth": [
			"enc-base64",
			"hmac-auth"
		],
		"jquery.mousewheel": [
			"jquery"
		],
		"angular.drag.drop": [
			"angular"
		],
		"sortable": [
			"angular",
			"jqueryui"
		],
		"angular-bindonce": [
			"angular"
		],
		"threejs_projector": [
			"threejs"
		],
		"threejs_canvasrender": [
			"threejs_projector"
		],
		"addon-puzzle": [
			"mobiscroll",
			"threejs"
		],
		"addon-mathaxis": [
			"threejs",
			"threex_dynamictexture"
		],
		"jqueryui": [
			"jquery"
		]
	},
	"deps": [
		"app"
	],
	"urlArgs": "v="+config.js_version
});