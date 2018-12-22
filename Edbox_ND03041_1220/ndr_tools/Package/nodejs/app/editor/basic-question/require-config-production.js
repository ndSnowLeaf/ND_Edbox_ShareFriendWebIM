require.config({
	//http://cdncs.101.com/v0.1/static/slides/
	baseUrl:'/questions',
	paths:{
		'jquery':'lib/jquery/1.11.2/jquery',
		'angular':'lib/angular/1.4.4/angular',
		'angular-cookies':'lib/angular/1.4.4/angular-cookies',
		'angular-ui-router':'lib/angular/1.4.4/angular-ui-router',
		'xml2json':'lib/xml2json/1.1.5/xml2json',
		'xml2json.min':'lib/util/xml2json.min',
		'cryptojs':'question/lib/cryptojs/3.1.2/cryptojs',		
		'ckeditor':'../lib/ckeditor/4.5.4/ckeditor',
		'angular-gettext':'lib/angular-gettext/2.1.0/angular-gettext',
		'angular-dragdrop':'lib/angular-dragdrop/1.1.2/draganddrop',
		'html2canvas':'lib/html2canvas/html2canvas',
		'messenger':'lib/messenger/messenger',
		'ztree':'lib/ztree/3.5.17/jquery.ztree.core-3.5',
		'plupload':'lib/plu/plupload.dev',
		'plupload-language':'lib/plu/i18n/zh_CN',
		'mediaelement':'lib/plu/mediaelement/js/mediaelement-and-player.sea',
		'angular-nd':'lib/angular-nd/0.1.0/util/nd-util',
		'angular-ngui':'lib/angular-nd/0.1.0/ngui/js/nd-ngui.sea',
		'angular-ngui-ex':'lib/angular-nd/0.1.0/ngui/js/nd-ngui-ex.sea',
		'fancybox':'lib/fancybox/1.3.1/jquery.fancybox.pack.sea',
		'ndrest':'question/lib/ndrest/cors_custom',
		'ui-bootstrap-tooltip':'lib/ui-bootstrap-tooltip/ui-bootstrap-tooltip'
	},
	map: {
		'*':{
			'css':'lib/require/2.1.11/require-css'
		}
	},
	shim:{
		'angular':{
			deps:['jquery'],
			exports:'angular'
		},
		'angular-cookies':{
			deps:['angular'] 
		},
		'angular-ui-router':{
			deps:['angular']
		},
		'lodash':{
            exports:'_'
        },
        'restangular':[ 'angular','lodash' ],
		'xml2json.min':{
        	exports: 'X2JS'
        },
		'cryptojs':{
			exports: 'CryptoJS'
		},		 
		'ckeditor':{
			deps:['../lib/ckeditor/4.5.4/ckeditor_common'],
			exports: 'CKEDITOR'
		},
		'angular-gettext':{
			deps:['angular']
		},
		'angular-dragdrop':{
			deps:['angular']
		},
		'moment':{
			exports:'moment'
		},
		'html2canvas':{
			
		},
		'messenger':{
			exports:'Messenger'
		},
		'ztree':{
			deps:['jquery']
		},
		'fancybox':{
			deps:['jquery']
		},
		'plupload':{
			deps:['lib/plu/moxie.js']
		},
		'plupload-language':{
			deps:['plupload']
		}
	} 
});
window.CKEDITOR_BASEPATH = '../lib/ckeditor/4.5.4/';
 
requirejs(["angular",'init','start','ndrest'], function(angular) {	
	angular.bootstrap(document,['questions']);
});
