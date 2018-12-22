/**
 * Created by chenyoudong on 2015/12/30.
 */
define([
	'jquery',
	'css!./style.css',
	'text!./templates/template.html',
	'text!./templates/answer_item.html',
	'espEnvironment'
],function($,css,template,answer_item,espEnvironment){
	function MarkPointModuleEditor(){
		var button_top_value = 44;
		var button_left_value = -15;
		var max_count = 11;
		var default_title = '请给下列句子加上标点';
		var default_text = "请输入文字";
		var currentindex = 0;
		var allconfuseanswer = ["，","。","、","？","！","：","；","…","……","·","-","——","|","||","“","”","‘","’","《","》","<",">","（","）","【","】","[","]"];
		var cursorCharacter= "\uF155";//光标的特殊字符
		var nwc = '‌';
		/**
		 * 是否包含全角字符
		 */
		function hasDBC(str) {
			for (var i = 0; i < str.length; i++) {
				var strCode = str.charCodeAt(i);
				if ((strCode > 65248) || (strCode == 12288)) {
					return true;
				}
			}
		}

		/**
		 * 转全角字符
		 */
		function toDBC(str) {
			var result = "";
			var len = str.length;
			for (var i = 0; i < len; i++) {
				var cCode = str.charCodeAt(i);
				//全角与半角相差（除空格外）：65248(十进制)
				cCode = (cCode >= 0x0021 && cCode <= 0x007E) ? (cCode + 65248) : cCode;
				//处理空格
				cCode = (cCode == 0x0020) ? 0x03000 : cCode;
				result += String.fromCharCode(cCode);
			}
			return result;
		}

		/**
		 * 转半角字符并将英文标点转换成中文标点
		 */
		function toSBC(str) {
			var result = "";
			var len = str.length;
			var tmp  = '';
			for (var i = 0; i < len; i++) {
				var cCode = str.charCodeAt(i);
				if(String.fromCharCode(cCode) == cursorCharacter){
					result += cursorCharacter;
				}
				else{
					//全角与半角相差（除空格外）：65248（十进制）
					cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
					//处理空格
					cCode = (cCode == 0x03000) ? 0x0020 : cCode;
					//result += String.fromCharCode(cCode);
					tmp = String.fromCharCode(cCode);
					//将英文标点转化成中文标点
					tmp = toChinesePunctuation(tmp) || tmp;
					result += tmp;
				}

			}
			return result;
		}

		/**
		 * 半角英文标点转化成半角中文标点
		 */
		function toChinesePunctuation(str) {
			var enPuncations = [",",".",":",";","?","!","'","\"","(",")","`","-","_"],
					cnPuncations = ["，","。","：","；","？","！","’","”","（","）","·","—","——"];

			for (var i = 0; i < enPuncations.length; i++) {
				if(str == enPuncations[i]){
					return cnPuncations[i];
				}
			}
		}

		function formatText(input){
			return toSBC(input);
		}

		/**
		 * 将半角的标点符号转化成全角的标点符号
		 */
		function formatPunctuation(input) {
			var pReg = /[\u0021|\u0022|\u0023|\u0024|\u0025|\u0026|\u0027|\u0028|\u0029|\u002a|\u002b|\u002c|\u002d|\u002e|\u002f|\u003a|\u003b|\u003c|\u003d|\u003e|\u003f|\u0040|\u005b|\u005c|\u005d|\u005e|\u005f|\u0060|\u007b|\u007c|\u007d|\u007e]/g;
			return input.replace(pReg, function (p) {
				return toDBC(p);
			});
		}

		/**
		 * 标记出全部的中文标点符号
		 */
		function markPunctuation(input) {
			//。 ？ ！ ， 、 ； ： “ ” ‘ ’ （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ? ￥
			var pReg = /，|。|、|？|！|：|；|…{1,2}|·|-|—{1,2}|\|{1,2}|“|”|‘|’|《|》|<|>|（|）|【|】|\[|\]/g
			return input.replace(pReg, function (p) {
				var tpl = answer_item;
				return tpl.replace("{answer}",p);
			});
		}

		var hidetimeout = null;
		function clearHideAction(){
			if(hidetimeout){
				clearTimeout(hidetimeout);
				hidetimeout = null;
			}
		}
		var buttontimer = 0;
		//为每个可能的答案设置浮动按钮
		function addAnswerButton(wrap,element,contentElement,module){
			clearHideAction();
			var position = wrap.position();

			var button = $(element).find(".answer_button");

			var addAnswer = !wrap.hasClass("as_answer");
			if(addAnswer){
				button.text('设为选项');
				button.addClass('add_answer');
				button.removeClass('remove_answer');
			}
			else{
				button.text('删除选项');
				button.removeClass('add_answer');
				button.addClass('remove_answer');
			}
			button.unbind("click");
			button.click(function(){
				var last = buttontimer;
				if(wrap.hasClass("as_answer")){
					wrap.removeClass("as_answer");
				}
				else{
					wrap.addClass("as_answer");
				}
				syncData(module,contentElement);
				showCorrectAnswer(element,contentElement,module);
				//
				if(last==buttontimer){
					button.hide();
				}
			});

			var left = stage.transformScaleX(position.left);
			var top = stage.transformScaleY(position.top);
			button.css("left",left-button_left_value);
			button.css("top",top-button_top_value);
			button.css("display","block");
		}
		function appendNoneZeroCharacter(contentElement){
			$(contentElement).find(".mark_punctuation").each(function(){
				var $this = $(this);
				var next = this.nextSibling;
				if(next&&next.nodeType==3){
					//nothing todo
					if(next.nodeValue.indexOf(nwc)!=0){
						next.nodeValue = nwc+next.nodeValue;
					}
				}
				else{
					$this.after('&zwnj;');
				}
			});
		}
		function text(element,module) {
			var contentElement = $(element).find(".mark_point_content");
			saveCursor(contentElement);
			handleElement($(contentElement)[0]);
			appendNoneZeroCharacter(contentElement);
			resetCursor(contentElement);



			//移除备选但按的鼠标移动事件
			$(contentElement).find(".mark_punctuation").unbind("mouseover");
			$(contentElement).find(".mark_punctuation").unbind("mouseout");
			//设置备选但按的鼠标移动事件
			$(contentElement).find(".mark_punctuation").on('mouseover',function(event){
				clearHideAction();
				var wrap = $(this);
				addAnswerButton(wrap,element,contentElement,module);
				buttontimer++;
			});
			$(element).find(".answer_button").on('mouseover',function(){
				clearHideAction();
				$(this).css("display","block");
			});
			$(element).find(".answer_button").on('mouseout',function(){
				var button = $(element).find(".answer_button");
				clearHideAction();
				hidetimeout = window.setTimeout(function(){
					button.hide();
				},300);
			});
			//鼠标移出，隐藏按钮
			$(contentElement).find(".mark_punctuation").on('mouseout',function(){
				var button = $(element).find(".answer_button");
				clearHideAction();
				hidetimeout = window.setTimeout(function(){
					button.hide();
				},300);
			}).on('click',function(evnet){
				clearHideAction();
				var wrap = $(this);
				addAnswerButton(wrap,element,contentElement,module);
				buttontimer++;
			});
			//设置属性值，同步数据
			syncData(module,contentElement);
			//设置当前字符值
			$(element).find(".mark_point_content_size").html(calculateConentSize(contentElement.text()));
			showCorrectAnswer(element,contentElement,module);
		}
		function calculateConentSize(text){
			var striptext = stripNwcCode(text).trim();
			if(striptext == default_text){
				return 0;
			}
			return striptext.length;
		}
		function syncData(module,element){
			module.setPropertyValue("content",element.html());
		}
		//获取已设置答案，TODO 答案符号对照表
		function getAnswers(element){
			var answers = [];
			element.find(".mark_punctuation.as_answer").each(function(){
				var answer = $(this).text();
				answer = toChinesePunctuation(answer)||answer;
				if(answer!='&nbsp;'&&answers.indexOf(answer)==-1){
					answers.push(answer);
				}
			});
			return answers;
		}
		function findCharCss(text){
			text = toChinesePunctuation(text)||text;
			var maps = {
				"，":"pun_i_1",
				"。":"pun_i_2",
				"、":"pun_i_3",
				"？":"pun_i_4",
				"！":"pun_i_5",
				"：":"pun_i_6",
				"；":"pun_i_7",
				"…":"pun_i_8",
				"……":"pun_i_9",
				"·":"pun_i_10",
				"—":"pun_i_11",
				"——":"pun_i_12",
				"||":"pun_i_13",
				"|":"pun_i_14",
				"“":"pun_i_15",
				"”":"pun_i_16",
				"‘":"pun_i_17",
				"’":"pun_i_18",
				"《":"pun_i_19",
				"》":"pun_i_20",
				"<":"pun_i_21",
				">":"pun_i_22",
				"（":"pun_i_23",
				"）":"pun_i_24",
				"【":"pun_i_25",
				"】":"pun_i_26",
				"[":"pun_i_27",
				"]":"pun_i_28",
			};
			return maps[text]||'';
		}
		function renderAnswerLine(text,parent,licss){
			licss = licss || 'answer_item';
			var css = findCharCss(text);
			return $("<li class='"+licss+"'></li>").html("<a class='list_btn "+css+" '>"+text+"</a>").appendTo(parent);
		}
		function getAnswerStatus(root){
			var status = {
				isAllNotAnswer:true,
				isAllAnswer:true
			};
			var answers = $(root).find(".mark_punctuation");
			if(answers.length == 0 ){
				return status;
			}
			answers.each(function(){
				if($(this).hasClass("as_answer")){
					status.isAllNotAnswer = false;
				}
				else{
					status.isAllAnswer = false;
				}
			});
			return status;
		}
		function showCorrectAnswer(root,contentElement,module){
			var answers = getAnswers(contentElement);
			var confuseanswers = parseAnswer(module.getPropertyValue('confuse_answer'));
			//是否显示按钮： 设置混淆答案
			var operate = $(root).find(".mark_point_footer .foot_title_operate");
			if(answers.length==0&&confuseanswers.length==0){
				operate.hide();
			}
			else{
				operate.show();
			}
			//设置正确答案栏目
			var answerParent = $(root).find('.mark_point_footer .foot_content');
			answerParent.html('');
			var itemCount = 0;
			for(var i=0;i<answers.length;i++){
				renderAnswerLine(answers[i],answerParent);
				itemCount++;
			}

			for(var i=0;i<confuseanswers.length;i++){
				var answer = toChinesePunctuation(confuseanswers[i])||confuseanswers[i];
				if(answers.indexOf(answer)==-1){
					renderAnswerLine(answer,answerParent);
					itemCount++;
				}
			}
			//设置符号栏目左右导航
			showCorrectAnswerLimitLength(root);
			//设置混淆面板
			showConfuseAnswer(root,module);

			var answerStatus = getAnswerStatus(root);
			//全部设为答案后，样式变更
			if(answerStatus.isAllAnswer){
				$(root).find(".com_u_btn2").addClass("btn_disabled");
			}
			else{
				$(root).find(".com_u_btn2").removeClass("btn_disabled");
			}
			//全部不是答案后
			if(answerStatus.isAllNotAnswer){
				$(root).find(".com_u_btn3").addClass("btn_disabled");
			}
			else{
				$(root).find(".com_u_btn3").removeClass("btn_disabled");
			}

		}
		//设置符号栏目左右导航，配置文件设置最多的符号数
		function showCorrectAnswerLimitLength(root){
			var answerParent = $(root).find('.mark_point_footer .foot_content');
			var itemCount = answerParent.find(".answer_item").length;
			//取消绑定事件
			$(root).find('.answer_item_prev').unbind("click");
			$(root).find('.answer_item_next').unbind("click");
			if(itemCount == 0){
				$(root).find('.answer_item_prev').css("display","none");
				$(root).find('.answer_item_next').css("display","none");
			}
			else{
				$(root).find('.answer_item_prev').css("display","inline-block");
				$(root).find('.answer_item_next').css("display","inline-block");
			}
			//maxcount： 允许显示的最大符号数
			if(itemCount>max_count){
				//currentindex 是最左边符号的下标
				if(currentindex>itemCount-max_count){
					currentindex = itemCount-max_count;
				}
				answerParent.find(".answer_item").each(function(idx){
					//显示的符号的坐标:[currentindex,currentindex+max_count)
					if(idx<currentindex || currentindex+max_count<=idx){
						$(this).hide();
					}
					else{
						$(this).css("display","inline-block");
					}
				});
				//向左导航
				if(currentindex>0){
					$(root).find('.answer_item_prev').removeClass("inactive");
					$(root).find('.answer_item_prev').click(function(){
						currentindex = currentindex-1;
						showCorrectAnswerLimitLength(root);
					});
				}
				else{
					$(root).find('.answer_item_prev').addClass("inactive");
				}
				//向右导航
				if(currentindex<itemCount-max_count){
					$(root).find('.answer_item_next').removeClass("inactive");
					$(root).find('.answer_item_next').click(function(){
						currentindex = currentindex+1;
						showCorrectAnswerLimitLength(root);
					});
				}
				else{
					$(root).find('.answer_item_next').addClass("inactive");
				}
			}
			else{
				$(root).find('.answer_item_prev').addClass("inactive");
				$(root).find('.answer_item_next').addClass("inactive");
			}
		}
		var parseAnswer =function(text){
			var specialchars = ['…','—','|']
			var values = [];
			for(var i=0;text&&i<text.length;i++){
				if(specialchars.indexOf(text[i])!=-1&&text[i]==text[i+1]){
					values.push(text[i]+text[i]);
					i++;
				}
				else{
					values.push(toChinesePunctuation(text[i])||text[i]);
				}
			}
			return values;
		}

		//设置混淆符号按钮的面板
		function showConfuseAnswer(root,module){
			//todo create method getContentElement（root）
			var contentElement = $(root).find(".mark_point_content");
			var answers = getAnswers(contentElement);
			var confuseanswers = parseAnswer(module.getPropertyValue('confuse_answer'));
			var datas = allconfuseanswer;
			var parent = $(root).find(".confuse_answers .answer_list");
			parent.html("");
			for(var i=0;i<datas.length;i++){
				var char = toChinesePunctuation(datas[i])||datas[i];
				var itemElement =renderAnswerLine(char,parent,'confuse_answer_item');
				if(answers.indexOf(char)!=-1){
					//符号是备选答案，不允许点击
					itemElement.addClass("correct_answer");
				}
				else if(confuseanswers.indexOf(char)!=-1){
					//已设为混淆
					itemElement.addClass("confuse_answer_select");
					itemElement.click(function(){
						var code = $(this).find("a").text();
						var select = parseAnswer(module.getPropertyValue('confuse_answer'));
						var index = select.indexOf(code)
						if(index!=-1){
							select.splice(index,1);
							module.setPropertyValue('confuse_answer',select.join(''));
							showCorrectAnswer(root,contentElement,module);
						}
						$(this).removeClass("confuse_answer_select");
					});
				}
				else{
					itemElement.click(function(){
						var code = $(this).find("a").text();
						var select = parseAnswer(module.getPropertyValue('confuse_answer'));
						var index = select.indexOf(code)
						if(index==-1){
							select.push(code);
							currentindex = 10000;
							module.setPropertyValue('confuse_answer',select.join(''));
							showCorrectAnswer(root,contentElement,module);
						}
						$(this).addClass("confuse_answer_select");
					})
				}
			}

		}
		function stripNwcCode(text){
			var result = text.replace(nwc,'');
			while(result!=text){
				text = result;
				result = text.replace(nwc,'');
			}
			return result;
		}
		//循环处理，为标点符号打标签。，
		function handleElement(parent){
			var children = parent.childNodes;
			for(var i=0;i<children.length;i++){
				//所有不是答案备选的子元素，循环处理
				if(children[i].nodeType==1){
					if($(children[i]).hasClass('mark_punctuation')===false){
						//element
						handleElement(children[i]);
					}

				}
				//文本元素，格式化为标点符号添加标签。如果处理后的文本是html，需要填加一个div标签包裹。
				else if(children[i].nodeType==3){
					var text = children[i].data;
					text = stripNwcCode(text);
					text = formatText(text);
					var result = markPunctuation(text);
					if(result.indexOf("<div")==-1){
						children[i].data = result;
					}
					else{
						//var ele = $("<div class='inline-box'></div>").html(result);
						$(children[i]).replaceWith(result);
					}
				}
			}
		}
		function removeZeroCharacter(parent,prev){
			var children = parent.childNodes;
			for(var i=0;i<children.length;i++){
				//所有不是答案备选的子元素，循环处理
				if(children[i].nodeType==1){
					if($(children[i]).hasClass('mark_punctuation')===false){
						//element
						var result = removeZeroCharacter(children[i],prev);
						if(result){
							return true;
						}
					}

				}
				//文本元素，格式化为标点符号添加标签。
				else if(children[i].nodeType==3){
					var text = children[i].data;
					text = stripNwcCode(text);
					if(children[i].data.indexOf(cursorCharacter)!=-1){
						children[i].data = children[i].data.replace(cursorCharacter,'');
					}
				}
			}
		}
		function moveCursor(parent,prev){
			var children = parent.childNodes;
			for(var i=0;i<children.length;i++){
				//所有不是答案备选的子元素，循环处理
				if(children[i].nodeType==1){
					if($(children[i]).hasClass('mark_punctuation')===false){
						//element
						var result = moveCursor(children[i],prev);
						if(result){
							return true;
						}
					}

				}
				//文本元素，格式化为标点符号添加标签。如果处理后的文本是html，需要填加一个div标签包裹。
				else if(children[i].nodeType==3){
					var text = children[i].data;
					text = stripNwcCode(text);
					if(children[i].data.indexOf(cursorCharacter)!=-1){
						children[i].data = children[i].data.replace(cursorCharacter,'');
						if(prev){
							$(children[i-1]).before(cursorCharacter);
							return true;
						}
						else{
							$(children[i+1]).after(cursorCharacter);
							return true;
						}
					}
				}
			}
		}
		function exchangeCursorAndNwc(parent){
			var children = parent.childNodes;
			for(var i=0;i<children.length;i++){
				//所有不是答案备选的子元素，循环处理
				if(children[i].nodeType==1){
					if($(children[i]).hasClass('mark_punctuation')===false){
						//element
						var result = exchangeCursorAndNwc(children[i]);
						if(result){
							return true;
						}
					}

				}
				//文本元素，格式化为标点符号添加标签。如果处理后的文本是html，需要填加一个div标签包裹。
				else if(children[i].nodeType==3){
					var text = children[i].data;
					var cursorIndex = text.indexOf(cursorCharacter);
					if(cursorIndex>0){
						text = text.substring(0,cursorIndex-1)+cursorCharacter+text.substring(cursorIndex-1,1)+text.substring(cursorIndex+1);
						$(children[i]).replaceWith(text);
					}
				}
			}
		}
		function deleteMarkPoint(parent,prev){
			var children = parent.childNodes;
			for(var i=0;i<children.length;i++){
				//所有不是答案备选的子元素，循环处理
				if(children[i].nodeType==1){
					if($(children[i]).hasClass('mark_punctuation')===false){
						//element
						var result = deleteMarkPoint(children[i],prev);
						if(result){
							return true;
						}
					}

				}
				//文本元素，格式化为标点符号添加标签。如果处理后的文本是html，需要填加一个div标签包裹。
				else if(children[i].nodeType==3){
					var text = children[i].data;
					text = stripNwcCode(text);
					if(text.indexOf(cursorCharacter)!=-1){
						if(prev){
							$(children[i-1]).remove();
							return true;
						}
						else{
							$(children[i+1]).remove();
							return true;
						}
					}
				}
			}
		}
		//在光标位置添加特殊字符，用来保存光标位置
		function saveCursor(element){
			//todo check selection in current element
			var selection = window.getSelection();
			if(selection&&selection.rangeCount>0){
				var range = selection.getRangeAt(0);
				var child = range.endContainer;
				if($(element).has($(child)).length&&$(element).has($(range.startContainer)).length){
					if(range.endContainer.data){
						range.endContainer.data = range.endContainer.data.substring(0,range.endOffset)+cursorCharacter+range.endContainer.data.substring(range.endOffset);
						return true;
					}
				}
			}
			return false;
		}
		//寻找包含标签字符的子元素
		function findCursorChild(parent){
			if(!parent){
				return null;
			}
			var children = parent.childNodes;
			for(var i=0;i<children.length;i++){
				if(children[i].nodeType==1){
					//element
					var result = findCursorChild(children[i]);
					if(result){
						return result;
					}
				}
				//text node
				else if(children[i].nodeType==3&&children[i].data.indexOf(cursorCharacter)!=-1){
					return children[i];
				}
			}
			return null;
		}
		//文本中的标点标记后，重新设置光标位置。
		function resetCursor(element){
			var container = $(element);
			var cursorElement = findCursorChild(container[0]);
			if(cursorElement){
				var range = document.createRange();
				var text = cursorElement.data;
				var index = text.indexOf(cursorCharacter);
				text = text.replace(cursorCharacter,'');
				cursorElement.data = text;
				range.setStart(cursorElement,index);
				range.collapse(true);
				var selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
		//为输入框添加事件，可以正确处理中文输入法
		function handleKeypress(element,config,handle){
			var nohandle = false;
			element.bind("keydown", function(event) {
				var selection = window.getSelection();
				if(event.keyCode == 229){
					nohandle = true;
				}
				else if(event.keyCode==37||event.keyCode==39||event.keyCode==8||event.keyCode==46){
					var selection = window.getSelection();
					if(selection&&selection.rangeCount>0){
						var range = selection.getRangeAt(0);
						var differ = range.endOffset-range.startOffset;
						if(differ== 0&&range.endContainer.nodeType==3){
							var prev = event.keyCode == 8 || event.keyCode == 37;//删除之前的一个字符&元素
							var index = prev ? range.startOffset-1 : range.startOffset;
							var char = range.endContainer.nodeValue.substring(index,1);
							if(char == nwc){
								if(event.keyCode == 8||event.keyCode == 46){
									saveCursor(element);
									deleteMarkPoint(element[0],prev);
									appendNoneZeroCharacter(element);
									resetCursor(element);
								}
								else{
									saveCursor(element);
									moveCursor(element[0],prev);
									appendNoneZeroCharacter(element);
									resetCursor(element);
								}
							}
						}
					}
				}
				else if(config.oneline&&event.keyCode==13){
					//nohanle enter key
					event.preventDefault();
				}
				else{
					nohandle = false;
				}
			});
			element.bind("input", function(event) {
				if(!nohandle){
					handle();
				}else{
					var selection = window.getSelection();
					if(selection&&selection.rangeCount>0){
						var range = selection.getRangeAt(0);
						var differ = range.endOffset-range.startOffset;
						if(differ == 0){
							handle();
						}
					}
				}
			});
		}
		//处理标题部分逻辑（显示标题字数）
		function handle_title(element,module){
			var titleElement = $(element).find(".model_title");
			title = titleElement.text();
			var maxIndex =70;
			if(title.length>maxIndex){
				saveCursor(titleElement);
				title = titleElement.text();
				var cursorIndex = title.indexOf(cursorCharacter);
				if(title.indexOf(cursorCharacter)!=-1){
					title = cursorIndex>=maxIndex ? title.substring(0,maxIndex)+cursorCharacter:title.substring(0,maxIndex+1);
				}
				else{
					title = title.substring(0,maxIndex);
				}
				titleElement.text(title);
				resetCursor(titleElement);
			}
			var title = titleElement.text();
			if(title==default_title){
				titleElement.addClass("default_title");
			}
			else{
				titleElement.removeClass("default_title");
			}
			var count = title==default_title? 0 : title.length;
			if(count>40){
				titleElement.addClass("title_small");
			}
			else{
				titleElement.removeClass("title_small");
			}
			module.setPropertyValue("title",title);
			$(element).find(".model_title_count").html(count);
		}
		var discardSpanStyle = function(content){
			var div = $("<div></div>").html(content);
			div.find("span").attr("style","");
			div.find("div").attr("style","");
			return div.html();
		}

		var module, stage, config,element;
		this.init = function(m,s,c){
			module = m;
			stage = s;
			config = c;
			if(module.getPropertyValue('default_title')){
				default_title = module.getPropertyValue('default_title');
			}
		};
		this.initDefault = function(moduleWrap){
			moduleWrap.setPosition({top:0,left:0});
			moduleWrap.setSize({width:'100%',height:'100%'});

		};
		this.save=function(){
			var element = this.element;
			var title = element.find(".model_title").text();
			module.setPropertyValue("title",title);
			var content = element.find(".mark_point_content").html();

			module.setPropertyValue("content",discardSpanStyle(content));
			var message = '';
			if(title == '' ){
				title = default_title;
			}
			if(title.length>70){
				message = message + '标题最多允许输入70个字符<br/>';
			}
			var textcontent = element.find(".mark_point_content").text();
			textcontent = stripNwcCode(textcontent).trim();
			if(textcontent == '' || textcontent == default_text){
				message = message + '请输入文字内容<br/>';
			}
			if(textcontent.length>200){
				message = message + '文字最多允许输入200个字符<br/>';
			}
			var answers = getAnswers(element.find(".mark_point_content"));
			if(answers==0){
				message = message + '请添加答案<br/>';
			}
			module.setPropertyValue("question_id",stage.coursewareobjectId);

			return message == '' ? true : message;
		}
		this.render = function(moduleWrap){
			var element = this.element =  $(moduleWrap.getElement());
			element.html(template);

			$(element).find(".nes_example").on("click",function(){
				var params = $.extend({},espEnvironment.location.params);
				params.old_identifier =params.id;
				params.old_file_path = params.file_path;
				delete params.file_path;
				var url = espEnvironment.url.makeRoot('/basic-question/question.html#')('import_sample' , params);
				stage.prompter.dialog({
					title: '范例导入',
					//content: '<div><iframe src="'+url+'" style="width:100%;height:100%;border:none;"></iframe></div>',
					src: url,
					width: 1200,
					height: 840
				});
			});
			//处理内容部分
			var content = module.getPropertyValue("content");
			if(content == ''){
				$(element).find(".mark_point_content").text(default_text);
				$(element).find(".mark_point_content").addClass("default_text");
			}
			else{
				$(element).find(".mark_point_content").html(content);
			}
			handleKeypress($(element).find(".mark_point_content"),{oneline:false},function(){text(element,module);});
			text(element,module);

			//处理标题部分
			handleKeypress($(element).find(".mark_point_title"),{oneline:true},function(){
				handle_title(element,module);
			});
			$(element).find(".model_title").text(module.getPropertyValue('title'));
			handle_title(element,module);
			$(element).find(".model_title").on("focus",function(){
				var title = $(element).find(".model_title").text();
				if(title == default_title){
					$(element).find(".model_title").text("");
					$(element).find(".model_title").removeClass("default_title");
				}
			});
			$(element).find(".model_title").on("blur",function(){
				var title = $(element).find(".model_title").text();
				if(title == ''){
					$(element).find(".model_title").text(default_title);
					$(element).find(".model_title").addClass("default_title");
				}
			});
			$(element).find(".model_title").on("paste",function(event){
				var e = event.originalEvent;
				e.preventDefault();
				// get text representation of clipboard
				var text = e.clipboardData.getData("text/plain");
				// insert text manually
				document.execCommand("insertHTML", false, text);
			});
			$(element).find(".mark_point_content").on("paste",function(event){
				var e = event.originalEvent;
				e.preventDefault();
				// get text representation of clipboard
				var text = e.clipboardData.getData("text/plain");
				// insert text manually
				document.execCommand("insertHTML", false, text);
			});
			$(element).find(".mark_point_content").on("focus",function(){
				var content = $(element).find(".mark_point_content").text();
				if(content == default_text){
					$(element).find(".mark_point_content").text("");
					$(element).find(".mark_point_content").removeClass("default_text");
				}
			});
			$(element).find(".punctuation_container").on("blur",function(){
				var content = $(element).find(".mark_point_content").text();
				if(content == ''){
					$(element).find(".mark_point_content").text(default_text);
					$(element).find(".mark_point_content").addClass("default_text");
				}
				else{
					$(element).find(".mark_point_content").html($(element).find(".mark_point_content").html());
					text(element,module);
				}
			});
			//处理混淆操作符部分
			$(element).find(".com_u_btn4").on("click",function(){
				showConfuseAnswer(element,module);
				$(element).find(".confuse_answers").show();
			});

			//一键设置选项
			$(element).find(".com_u_btn2").on("click",function(){
				$(element).find(".mark_punctuation").each(function(){
					$(this).addClass("as_answer");
				});
				var contentElement = $(element).find(".mark_point_content");
				syncData(module,contentElement);
				showCorrectAnswer(element,contentElement,module);
			});
			//一键还原
			$(element).find(".com_u_btn3").on("click",function(){
				$(element).find(".mark_punctuation").each(function(){
					$(this).removeClass("as_answer");
				});
				var contentElement = $(element).find(".mark_point_content");
				syncData(module,contentElement);
				showCorrectAnswer(element,contentElement,module);
			});
			$(element).find(".confuse_answers_close_button").on("click",function(){
				$(element).find(".confuse_answers").hide();
			});

			$(element).find(".test").on("click",function(){
				var contentElement = $(element).find(".mark_point_content");
				saveCursor(contentElement);
			});
			this.render_timer();

		};
		this.render_timer = function(){
			var format =function(value){
				value = value*1;
				if(value<10){
					value = '0'+value;
				}
				return value;
			}
			var seconds = module.getPropertyValue("timer_time")||0;
			var type = module.getPropertyValue("timer_type");
			$(this.element).find('.GameQuestionTimer_minute').html(type=='sequence' ? '00' : format(Math.floor(seconds/60)));
			$(this.element).find('.GameQuestionTimer_second').html(type=='sequence' ? '00' :format(seconds%60));
		}
		var type = 'countdown', duration = 0;
		this.getInterfaceDefinition = function(){
			var _this = this;
			return ['Timer', {
				getType: function(){
					return module.getPropertyValue("timer_type");
				},
				getDuration: function(){
					return module.getPropertyValue("timer_time");
				},
				setType: function (t) {
					module.setPropertyValue("timer_type",t);
					_this.render_timer();
				},
				setDuration: function (d) {
					module.setPropertyValue("timer_time",d);
					_this.render_timer();
				}
			}];
		};
	}
	return MarkPointModuleEditor;
});