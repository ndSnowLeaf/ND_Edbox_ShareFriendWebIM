define(function(e){var t=e("lib/ztree/3.5.17/jquery.ztree.core-3.5.js");return function(e){var t,c,a,h={event:{CHECK:"ztree_check"},id:{CHECK:"_check"},checkbox:{STYLE:"checkbox",DEFAULT:"chk",DISABLED:"disable",FALSE:"false",TRUE:"true",FULL:"full",PART:"part",FOCUS:"focus"},radio:{STYLE:"radio",TYPE_ALL:"all",TYPE_LEVEL:"level"}},i={check:{enable:!1,autoCheckTrigger:!1,chkStyle:h.checkbox.STYLE,nocheckInherit:!1,chkDisabledInherit:!1,radioType:h.radio.TYPE_LEVEL,chkboxType:{Y:"ps",N:"ps"}},data:{key:{checked:"checked"}},callback:{beforeCheck:null,onCheck:null}};t=function(e,t){if(!0===t.chkDisabled)return!1;var c=d.getSetting(e.data.treeId),a=c.data.key.checked;return 0==n.apply(c.callback.beforeCheck,[c.treeId,t],!0)||(t[a]=!t[a],r.checkNodeRelation(c,t),a=s(t,k.id.CHECK,c),r.setChkClass(c,a,t),r.repairParentChkClassWithSelf(c,t),c.treeObj.trigger(k.event.CHECK,[e,c.treeId,t]),!0)},c=function(e,t){if(!0===t.chkDisabled)return!1;var c=d.getSetting(e.data.treeId),a=s(t,k.id.CHECK,c);return t.check_Focus=!0,r.setChkClass(c,a,t),!0},a=function(e,t){if(!0===t.chkDisabled)return!1;var c=d.getSetting(e.data.treeId),a=s(t,k.id.CHECK,c);return t.check_Focus=!1,r.setChkClass(c,a,t),!0},e.extend(!0,e.fn.zTree.consts,h),e.extend(!0,e.fn.zTree._z,{tools:{},view:{checkNodeRelation:function(e,t){var c,a,h,i=e.data.key.children,n=e.data.key.checked;if(c=k.radio,e.check.chkStyle==c.STYLE){var o=d.getRadioCheckedList(e);if(t[n])if(e.check.radioType==c.TYPE_ALL){for(a=o.length-1;a>=0;a--)c=o[a],c[n]&&c!=t&&(c[n]=!1,o.splice(a,1),r.setChkClass(e,s(c,k.id.CHECK,e),c),c.parentTId!=t.parentTId&&r.repairParentChkClassWithSelf(e,c));o.push(t)}else for(o=t.parentTId?t.getParentNode():d.getRoot(e),a=0,h=o[i].length;a<h;a++)c=o[i][a],c[n]&&c!=t&&(c[n]=!1,r.setChkClass(e,s(c,k.id.CHECK,e),c));else if(e.check.radioType==c.TYPE_ALL)for(a=0,h=o.length;a<h;a++)if(t==o[a]){o.splice(a,1);break}}else t[n]&&(!t[i]||0==t[i].length||e.check.chkboxType.Y.indexOf("s")>-1)&&r.setSonNodeCheckBox(e,t,!0),!t[n]&&(!t[i]||0==t[i].length||e.check.chkboxType.N.indexOf("s")>-1)&&r.setSonNodeCheckBox(e,t,!1),t[n]&&e.check.chkboxType.Y.indexOf("p")>-1&&r.setParentNodeCheckBox(e,t,!0),!t[n]&&e.check.chkboxType.N.indexOf("p")>-1&&r.setParentNodeCheckBox(e,t,!1)},makeChkClass:function(e,t){var c=e.data.key.checked,a=k.checkbox,h=k.radio,i="",i=!0===t.chkDisabled?a.DISABLED:t.halfCheck?a.PART:e.check.chkStyle==h.STYLE?t.check_Child_State<1?a.FULL:a.PART:t[c]?2===t.check_Child_State||-1===t.check_Child_State?a.FULL:a.PART:t.check_Child_State<1?a.FULL:a.PART,c=e.check.chkStyle+"_"+(t[c]?a.TRUE:a.FALSE)+"_"+i,c=t.check_Focus&&!0!==t.chkDisabled?c+"_"+a.FOCUS:c;return k.className.BUTTON+" "+a.DEFAULT+" "+c},repairAllChk:function(e,t){if(e.check.enable&&e.check.chkStyle===k.checkbox.STYLE)for(var c=e.data.key.checked,a=e.data.key.children,h=d.getRoot(e),i=0,n=h[a].length;i<n;i++){var s=h[a][i];!0!==s.nocheck&&!0!==s.chkDisabled&&(s[c]=t),r.setSonNodeCheckBox(e,s,t)}},repairChkClass:function(e,t){if(t&&(d.makeChkFlag(e,t),!0!==t.nocheck)){var c=s(t,k.id.CHECK,e);r.setChkClass(e,c,t)}},repairParentChkClass:function(e,t){if(t&&t.parentTId){var c=t.getParentNode();r.repairChkClass(e,c),r.repairParentChkClass(e,c)}},repairParentChkClassWithSelf:function(e,t){if(t){var c=e.data.key.children;t[c]&&t[c].length>0?r.repairParentChkClass(e,t[c][0]):r.repairParentChkClass(e,t)}},repairSonChkDisabled:function(e,t,c,a){if(t){var h=e.data.key.children;if(t.chkDisabled!=c&&(t.chkDisabled=c),r.repairChkClass(e,t),t[h]&&a)for(var i=0,n=t[h].length;i<n;i++)r.repairSonChkDisabled(e,t[h][i],c,a)}},repairParentChkDisabled:function(e,t,c,a){t&&(t.chkDisabled!=c&&a&&(t.chkDisabled=c),r.repairChkClass(e,t),r.repairParentChkDisabled(e,t.getParentNode(),c,a))},setChkClass:function(e,t,c){t&&(!0===c.nocheck?t.hide():t.show(),t.attr("class",r.makeChkClass(e,c)))},setParentNodeCheckBox:function(e,t,c,a){var h=e.data.key.children,i=e.data.key.checked,n=s(t,k.id.CHECK,e);if(a||(a=t),d.makeChkFlag(e,t),!0!==t.nocheck&&!0!==t.chkDisabled&&(t[i]=c,r.setChkClass(e,n,t),e.check.autoCheckTrigger&&t!=a&&e.treeObj.trigger(k.event.CHECK,[null,e.treeId,t])),t.parentTId){if(n=!0,!c)for(var h=t.getParentNode()[h],o=0,l=h.length;o<l;o++)if(!0!==h[o].nocheck&&!0!==h[o].chkDisabled&&h[o][i]||(!0===h[o].nocheck||!0===h[o].chkDisabled)&&h[o].check_Child_State>0){n=!1;break}n&&r.setParentNodeCheckBox(e,t.getParentNode(),c,a)}},setSonNodeCheckBox:function(e,t,c,a){if(t){var h=e.data.key.children,i=e.data.key.checked,n=s(t,k.id.CHECK,e);a||(a=t);var o=!1;if(t[h])for(var l=0,C=t[h].length;l<C&&!0!==t.chkDisabled;l++){var g=t[h][l];r.setSonNodeCheckBox(e,g,c,a),!0===g.chkDisabled&&(o=!0)}t!=d.getRoot(e)&&!0!==t.chkDisabled&&(o&&!0!==t.nocheck&&d.makeChkFlag(e,t),!0!==t.nocheck&&!0!==t.chkDisabled?(t[i]=c,o||(t.check_Child_State=t[h]&&t[h].length>0?c?2:0:-1)):t.check_Child_State=-1,r.setChkClass(e,n,t),e.check.autoCheckTrigger&&t!=a&&!0!==t.nocheck&&!0!==t.chkDisabled&&e.treeObj.trigger(k.event.CHECK,[null,e.treeId,t]))}}},event:{},data:{getRadioCheckedList:function(e){for(var t=d.getRoot(e).radioCheckedList,c=0,a=t.length;c<a;c++)d.getNodeCache(e,t[c].tId)||(t.splice(c,1),c--,a--);return t},getCheckStatus:function(e,t){if(!e.check.enable||t.nocheck||t.chkDisabled)return null;var c=e.data.key.checked;return{checked:t[c],half:t.halfCheck?t.halfCheck:e.check.chkStyle==k.radio.STYLE?2===t.check_Child_State:t[c]?t.check_Child_State>-1&&t.check_Child_State<2:t.check_Child_State>0}},getTreeCheckedNodes:function(e,t,c,a){if(!t)return[];for(var h=e.data.key.children,i=e.data.key.checked,n=c&&e.check.chkStyle==k.radio.STYLE&&e.check.radioType==k.radio.TYPE_ALL,a=a||[],r=0,s=t.length;r<s&&(!0===t[r].nocheck||!0===t[r].chkDisabled||t[r][i]!=c||(a.push(t[r]),!n))&&(d.getTreeCheckedNodes(e,t[r][h],c,a),!(n&&a.length>0));r++);return a},getTreeChangeCheckedNodes:function(e,t,c){if(!t)return[];for(var a=e.data.key.children,h=e.data.key.checked,c=c||[],i=0,n=t.length;i<n;i++)!0!==t[i].nocheck&&!0!==t[i].chkDisabled&&t[i][h]!=t[i].checkedOld&&c.push(t[i]),d.getTreeChangeCheckedNodes(e,t[i][a],c);return c},makeChkFlag:function(e,t){if(t){var c=e.data.key.children,a=e.data.key.checked,h=-1;if(t[c])for(var i=0,n=t[c].length;i<n;i++){var r=t[c][i],d=-1;if(e.check.chkStyle==k.radio.STYLE){if(2==(d=!0===r.nocheck||!0===r.chkDisabled?r.check_Child_State:!0===r.halfCheck?2:r[a]?2:r.check_Child_State>0?2:0)){h=2;break}0==d&&(h=0)}else if(e.check.chkStyle==k.checkbox.STYLE){if(1===(d=!0===r.nocheck||!0===r.chkDisabled?r.check_Child_State:!0===r.halfCheck?1:r[a]?-1===r.check_Child_State||2===r.check_Child_State?2:1:r.check_Child_State>0?1:0)){h=1;break}if(2===d&&h>-1&&i>0&&d!==h){h=1;break}if(2===h&&d>-1&&d<2){h=1;break}d>-1&&(h=d)}}t.check_Child_State=h}}}});var e=e.fn.zTree,n=e._z.tools,k=e.consts,r=e._z.view,d=e._z.data,s=n.$;d.exSetting(i),d.addInitBind(function(e){e.treeObj.bind(k.event.CHECK,function(t,c,a,h){t.srcEvent=c,n.apply(e.callback.onCheck,[t,a,h])})}),d.addInitUnBind(function(e){e.treeObj.unbind(k.event.CHECK)}),d.addInitCache(function(){}),d.addInitNode(function(e,t,c,a){c&&(t=e.data.key.checked,"string"==typeof c[t]&&(c[t]=n.eqs(c[t],"true")),c[t]=!!c[t],c.checkedOld=c[t],"string"==typeof c.nocheck&&(c.nocheck=n.eqs(c.nocheck,"true")),c.nocheck=!!c.nocheck||e.check.nocheckInherit&&a&&!!a.nocheck,"string"==typeof c.chkDisabled&&(c.chkDisabled=n.eqs(c.chkDisabled,"true")),c.chkDisabled=!!c.chkDisabled||e.check.chkDisabledInherit&&a&&!!a.chkDisabled,"string"==typeof c.halfCheck&&(c.halfCheck=n.eqs(c.halfCheck,"true")),c.halfCheck=!!c.halfCheck,c.check_Child_State=-1,c.check_Focus=!1,c.getCheckStatus=function(){return d.getCheckStatus(e,c)},e.check.chkStyle==k.radio.STYLE&&e.check.radioType==k.radio.TYPE_ALL&&c[t]&&d.getRoot(e).radioCheckedList.push(c))}),d.addInitProxy(function(e){var h=e.target,i=d.getSetting(e.data.treeId),r="",s=null,o="",l=null;if(n.eqs(e.type,"mouseover")?i.check.enable&&n.eqs(h.tagName,"span")&&null!==h.getAttribute("treeNode"+k.id.CHECK)&&(r=n.getNodeMainDom(h).id,o="mouseoverCheck"):n.eqs(e.type,"mouseout")?i.check.enable&&n.eqs(h.tagName,"span")&&null!==h.getAttribute("treeNode"+k.id.CHECK)&&(r=n.getNodeMainDom(h).id,o="mouseoutCheck"):n.eqs(e.type,"click")&&i.check.enable&&n.eqs(h.tagName,"span")&&null!==h.getAttribute("treeNode"+k.id.CHECK)&&(r=n.getNodeMainDom(h).id,o="checkNode"),r.length>0)switch(s=d.getNodeCache(i,r),o){case"checkNode":l=t;break;case"mouseoverCheck":l=c;break;case"mouseoutCheck":l=a}return{stop:"checkNode"===o,node:s,nodeEventType:o,nodeEventCallback:l,treeEventType:"",treeEventCallback:null}},!0),d.addInitRoot(function(e){d.getRoot(e).radioCheckedList=[]}),d.addBeforeA(function(e,t,c){e.check.enable&&(d.makeChkFlag(e,t),c.push("<span ID='",t.tId,k.id.CHECK,"' class='",r.makeChkClass(e,t),"' treeNode",k.id.CHECK,!0===t.nocheck?" style='display:none;'":"","></span>"))}),d.addZTreeTools(function(e,t){t.checkNode=function(e,t,c,a){var h=this.setting.data.key.checked;!0===e.chkDisabled||(!0!==t&&!1!==t&&(t=!e[h]),a=!!a,e[h]===t&&!c||a&&0==n.apply(this.setting.callback.beforeCheck,[this.setting.treeId,e],!0)||!n.uCanDo(this.setting)||!this.setting.check.enable||!0===e.nocheck)||(e[h]=t,t=s(e,k.id.CHECK,this.setting),(c||this.setting.check.chkStyle===k.radio.STYLE)&&r.checkNodeRelation(this.setting,e),r.setChkClass(this.setting,t,e),r.repairParentChkClassWithSelf(this.setting,e),a&&this.setting.treeObj.trigger(k.event.CHECK,[null,this.setting.treeId,e]))},t.checkAllNodes=function(e){r.repairAllChk(this.setting,!!e)},t.getCheckedNodes=function(e){var t=this.setting.data.key.children;return d.getTreeCheckedNodes(this.setting,d.getRoot(this.setting)[t],!1!==e)},t.getChangeCheckedNodes=function(){var e=this.setting.data.key.children;return d.getTreeChangeCheckedNodes(this.setting,d.getRoot(this.setting)[e])},t.setChkDisabled=function(e,t,c,a){t=!!t,c=!!c,r.repairSonChkDisabled(this.setting,e,t,!!a),r.repairParentChkDisabled(this.setting,e.getParentNode(),t,c)};var c=t.updateNode;t.updateNode=function(e,a){if(c&&c.apply(t,arguments),e&&this.setting.check.enable&&s(e,this.setting).get(0)&&n.uCanDo(this.setting)){var h=s(e,k.id.CHECK,this.setting);(1==a||this.setting.check.chkStyle===k.radio.STYLE)&&r.checkNodeRelation(this.setting,e),r.setChkClass(this.setting,h,e),r.repairParentChkClassWithSelf(this.setting,e)}}});var o=r.createNodes;r.createNodes=function(e,t,c,a){o&&o.apply(r,arguments),c&&r.repairParentChkClassWithSelf(e,a)};var l=r.removeNode;r.removeNode=function(e,t){var c=t.getParentNode();l&&l.apply(r,arguments),t&&c&&(r.repairChkClass(e,c),r.repairParentChkClass(e,c))};var C=r.appendNodes;r.appendNodes=function(e,t,c,a,h,i){var n="";return C&&(n=C.apply(r,arguments)),a&&d.makeChkFlag(e,a),n}}(t),t});