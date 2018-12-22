define([
	'text!./section.html',
	'text!./role.html',
	'text!./record.html'
], function(sectionTpl, roleTpl, recordTpl){
	var tpls = {};
	tpls.sectionTpl = sectionTpl;
	tpls.roleTpl = roleTpl;
	tpls.recordTpl = recordTpl;
	return tpls;
});