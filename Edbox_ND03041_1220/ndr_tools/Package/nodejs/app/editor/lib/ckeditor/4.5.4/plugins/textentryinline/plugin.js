"use strict";!function(){CKEDITOR.plugins.add("textentryinline",{requires:"widget",icons:"textentryinline",hidpi:!0,init:function(editor){var cls="textentryinline";editor.widgets.add("textentryinline",{button:"插入填空题的空",mask:!0,allowedContent:"span(*)",template:'<span class="'+cls+'" style="display:inline-block;"><span class="textentryinline_title"><p>12345</p></span></span>',editables:{title:{selector:".textentryinline_title",allowedContent:"br strong em"}},edit:function(){},upcast:function(el,data){if("span"==el.name&&el.hasClass(cls)&&1==el.children.length&&el.children[0].type==CKEDITOR.NODE_TEXT){data.value=CKEDITOR.tools.htmlDecode(el.children[0].value);var attrs=el.attributes;return attrs.style?attrs.style+=";display:inline-block":attrs.style="display:inline-block",attrs["data-cke-survive"]=1,el.children[0].remove(),el}},downcast:function(el){el.children[0]&&el.children[0].replaceWith(new CKEDITOR.htmlParser.text(CKEDITOR.tools.htmlEncode(this.data.value)));var attrs=el.attributes;return attrs.style=attrs.style.replace(/display:\s?inline-block;?\s?/,""),""===attrs.style&&delete attrs.style,el}})}})}();