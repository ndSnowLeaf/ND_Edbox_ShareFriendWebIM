define(function(l){return l("plupload"),[function(){return{restrict:"A",link:function(l,e,i){var n=l.$eval(i.lcUpload)||{},r=angular.extend({runtimes:"html5,flash,silverlight,html4",browse_button:e[0],url:"#",flash_swf_url:"/lib/plu//lib/plu/Moxie.swf",silverlight_xap_url:"/lib/plu/Moxie.xap",chunkSize:"1mb",headers:{}},n);new plupload.Uploader(r).init()}}}]});