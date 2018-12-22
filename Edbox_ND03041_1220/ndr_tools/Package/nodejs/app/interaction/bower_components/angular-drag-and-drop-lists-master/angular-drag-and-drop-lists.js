angular.module("dndLists",[]).directive("dndDraggable",["$parse","$timeout","dndDropEffectWorkaround","dndDragTypeWorkaround",function(e,n,r,t){return function(a,o,d){o.attr("draggable","true"),d.dndDisableIf&&a.$watch(d.dndDisableIf,function(e){o.attr("draggable",!e)}),o.on("dragstart",function(i){i=i.originalEvent||i,i.dataTransfer.setData("Text",angular.toJson(a.$eval(d.dndDraggable))),i.dataTransfer.effectAllowed=d.dndEffectAllowed||"move",o.addClass("dndDragging"),n(function(){o.addClass("dndDraggingSource")},0),r.dropEffect="none",t.isDragging=!0,t.dragType=d.dndType?a.$eval(d.dndType):void 0,e(d.dndDragstart)(a,{event:i}),i.stopPropagation()}),o.on("dragend",function(n){n=n.originalEvent||n;var i=r.dropEffect;a.$apply(function(){switch(i){case"move":e(d.dndMoved)(a,{event:n});break;case"copy":e(d.dndCopied)(a,{event:n})}}),o.removeClass("dndDragging"),o.removeClass("dndDraggingSource"),t.isDragging=!1,n.stopPropagation()}),o.on("click",function(n){n=n.originalEvent||n,a.$apply(function(){e(d.dndSelected)(a,{event:n})}),n.stopPropagation()}),o.on("selectstart",function(){return this.dragDrop&&this.dragDrop(),!1})}}]).directive("dndList",["$parse","$timeout","dndDropEffectWorkaround","dndDragTypeWorkaround",function(e,n,r,t){return function(a,o,d){function i(e,n,r){var t=D?e.offsetX||e.layerX:e.offsetY||e.layerY,a=D?n.offsetWidth:n.offsetHeight,o=D?n.offsetLeft:n.offsetTop;return o=r?o:0,t<o+a/2}function f(){return Array.prototype.indexOf.call(v.children,c)}function l(e){if(!t.isDragging&&!y)return!1;if(!u(e.dataTransfer.types))return!1;if(d.dndAllowedTypes&&t.isDragging){var n=a.$eval(d.dndAllowedTypes);if(angular.isArray(n)&&-1===n.indexOf(t.dragType))return!1}return!d.dndDisableIf||!a.$eval(d.dndDisableIf)}function g(){return p.remove(),o.removeClass("dndDragover"),!0}function s(n,r,o){return e(n)(a,{event:r,index:f(),item:o||void 0,external:!t.isDragging,type:t.isDragging?t.dragType:void 0})}function u(e){if(!e)return!0;for(var n=0;n<e.length;n++)if("Text"===e[n]||"text/plain"===e[n])return!0;return!1}var p=angular.element("<li class='dndPlaceholder'></li>"),c=p[0],v=o[0],D=d.dndHorizontalList&&a.$eval(d.dndHorizontalList),y=d.dndExternalSources&&a.$eval(d.dndExternalSources);o.on("dragover",function(e){if(e=e.originalEvent||e,!l(e))return!0;if(c.parentNode!=v&&o.append(p),e.target!==v){for(var n=e.target;n.parentNode!==v&&n.parentNode;)n=n.parentNode;n.parentNode===v&&n!==c&&(i(e,n)?v.insertBefore(c,n):v.insertBefore(c,n.nextSibling))}else if(i(e,c,!0))for(;c.previousElementSibling&&(i(e,c.previousElementSibling,!0)||0===c.previousElementSibling.offsetHeight);)v.insertBefore(c,c.previousElementSibling);else for(;c.nextElementSibling&&!i(e,c.nextElementSibling,!0);)v.insertBefore(c,c.nextElementSibling.nextElementSibling);return d.dndDragover&&!s(d.dndDragover,e)?g():(o.addClass("dndDragover"),e.preventDefault(),e.stopPropagation(),!1)}),o.on("drop",function(e){if(e=e.originalEvent||e,!l(e))return!0;e.preventDefault();var n,t=e.dataTransfer.getData("Text")||e.dataTransfer.getData("text/plain");try{n=JSON.parse(t)}catch(e){return g()}if(d.dndDrop&&!(n=s(d.dndDrop,e,n)))return g();var o=a.$eval(d.dndList);return a.$apply(function(){o.splice(f(),0,n)}),"none"===e.dataTransfer.dropEffect?"copy"===e.dataTransfer.effectAllowed||"move"===e.dataTransfer.effectAllowed?r.dropEffect=e.dataTransfer.effectAllowed:r.dropEffect=e.ctrlKey?"copy":"move":r.dropEffect=e.dataTransfer.dropEffect,g(),e.stopPropagation(),!1}),o.on("dragleave",function(e){e=e.originalEvent||e,o.removeClass("dndDragover"),n(function(){o.hasClass("dndDragover")||p.remove()},100)})}}]).factory("dndDragTypeWorkaround",function(){return{}}).factory("dndDropEffectWorkaround",function(){return{}});