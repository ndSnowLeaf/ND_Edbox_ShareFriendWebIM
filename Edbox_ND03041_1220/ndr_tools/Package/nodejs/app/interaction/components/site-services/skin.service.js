define(["angularAMD"],function(e){e.factory("skin_service",["CustomEditorService","$rootScope","$q","$stateParams","$http",function(e,n,t,s,o){var i=null,a=!1;return{remove_all_skin:function(){angular.element(".themecss").remove()},get_skins:function(){var e=t.defer(),n=0;return i?e.resolve(i):(a||(a=!0,o.get("/interaction/components/site-directive/select-skin/skin.json").then(function(e){i=e.data[s.area]||[],a=!1},function(e,n,t,s){a=!1,window.console&&console.log(e)})),n=setInterval(function(){i&&(clearInterval(n),e.resolve(i))},20)),e.promise},loadStyle:function(e,t,s){var o="interaction/styles/"+e+"/assets/css/"+t+".css",i=angular.element("<link>",{rel:"stylesheet",class:"themecss",type:"text/css",href:o});s&&i.bind("load",function(){n.$broadcast("changgedSkin")}),angular.element("head").append(i)},set_skin:function(e,n){this.remove_all_skin(),n=n?"_"+n:"",this.loadStyle("common",e.code+n),this.loadStyle(s.area,e.code,!0)},set_skin_by_code:function(e,n){var t=this;if(i)for(var s=0;s<i.length;s++)e==i[s].code&&t.set_skin(i[s],n);else this.get_skins().then(function(s){for(var o=0;o<s.length;o++)e==s[o].code&&t.set_skin(s[o],n)})}}}])});