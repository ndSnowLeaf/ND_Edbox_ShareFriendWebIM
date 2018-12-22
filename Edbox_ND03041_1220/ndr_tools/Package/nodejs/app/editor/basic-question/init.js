define(['require','angular','angular-nd','angular-ngui-ex','angular-ui-router','angular-cookies','ui-bootstrap-tooltip',"./generate/template_cache"],function(require,angular){
	var module = angular.module('questions',['nd.ngui','nd.util','gettext','ui.router','ngCookies','ui.bootstrap.bindHtml','ui.bootstrap.tooltip','plugin.templates']);	
	return module;
});