define(function(e){var t=e("lib/ztree/3.5.17/jquery.ztree.core-3.5.js");return["$identifier",function(e){return{restrict:"EA",replace:!0,template:'<div class="ztree"></div>',require:"?ngModel",scope:{idKey:"@",childrenKey:"@",nameKey:"@",titleKey:"@",expandAll:"@",selectedMulti:"@",data:"=lcTree",simpleData:"@",onSelect:"&",onInit:"&"},link:function(i,l,n,a){var r,c={view:{dblClickExpand:!1,showLine:!0,selectedMulti:"true"===i.selectedMulti,showIcon:!1},data:{simpleData:{enable:"false"!==i.simpleData,idKey:i.idKey||"identifier",pIdKey:"parent",rootPId:"root"},key:{children:i.childrenKey||"children",name:i.nameKey||"title",title:i.titleKey||"title"}},check:{autoCheckTrigger:"true"===i.selectedMulti,enable:!1,chkboxType:{Y:"",N:""},chkStyle:"checkbox",nocheckInherit:!1,chkDisabledInherit:!1,radioType:"all"},callback:{onClick:function(e,t,l){var n=c.view.selectedMulti?r.getSelectedNodes():l;"$apply"!=i.$root.$$phase&&"$digest"!=i.$root.$$phase?i.$apply(function(){a&&a.$setViewValue(n),i.onSelect({node:n})}):(a&&a.$setViewValue(n),i.onSelect({node:n}))}}},d=function(e){if(r&&e)if(angular.isArray(e))for(var t=0;t<e.length;t++)d(e[t]);else if(angular.isString(e)){var i=r.getNodesByParam(c.data.simpleData.idKey,e);i[0]&&r.selectNode(i[0])}else r.selectNode(e);else if(r){var i=r.getSelectedNodes();if(i.length)for(var t=0;t<i.length;t++)r.cancelSelectedNode(i[t])}};a&&(a.$render=function(e){d(a.$viewValue)}),i.$watch("data",function(n,a){n!=a&&(l.attr("id")||l.attr("id",e.guid()),r=t.fn.zTree.init(t(l[0]),c,n),"true"===i.expandAll&&r.expandAll(!0),i.onInit({instance:r}))})}}}]});