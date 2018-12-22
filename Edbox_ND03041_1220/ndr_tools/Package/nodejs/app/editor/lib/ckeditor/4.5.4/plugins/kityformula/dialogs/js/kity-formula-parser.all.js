!function(){function use(name){_p.r([moduleMapping[name]])}var _p={r:function(index){if(_p[index].inited)return _p[index].value;if("function"!=typeof _p[index].value)return _p[index].inited=!0,_p[index].value;var module={exports:{}},returnValue=_p[index].value(null,module.exports,module);if(_p[index].inited=!0,_p[index].value=returnValue,void 0!==returnValue)return returnValue;for(var key in module.exports)if(module.exports.hasOwnProperty(key))return _p[index].inited=!0,_p[index].value=module.exports,module.exports}};_p[0]={value:function(require){function Assembly(formula){this.formula=formula}function generateExpression(originTree,tree,objTree,mapping,selectInfo){var ConstructorProxy,currentOperand=null,exp=null,cursorLocation=[],operand=tree.operand||[],constructor=null;if(objTree.operand=[],-1===tree.name.indexOf("text")){for(var i=0,len=operand.length;i<len;i++)currentOperand=operand[i],currentOperand!==CURSOR_CHAR?currentOperand?"string"==typeof currentOperand?("brackets"===tree.name&&i<2?operand[i]=currentOperand:"function"===tree.name&&0===i?operand[i]=currentOperand:operand[i]=createObject("text",currentOperand),objTree.operand.push(operand[i])):(objTree.operand.push({}),operand[i]=generateExpression(originTree.operand[i],currentOperand,objTree.operand[objTree.operand.length-1],mapping,selectInfo)):(operand[i]=createObject("empty"),objTree.operand.push(operand[i])):(cursorLocation.push(i),selectInfo.hasOwnProperty("startOffset")||(selectInfo.startOffset=i),selectInfo.endOffset=i,tree.attr&&tree.attr.id&&(selectInfo.groupId=tree.attr.id));for(2===cursorLocation.length&&(selectInfo.endOffset-=1);i=cursorLocation.length;)i=cursorLocation[i-1],operand.splice(i,1),cursorLocation.length--,originTree.operand.splice(i,1)}if(!(constructor=getConstructor(tree.name)))throw new Error("operator type error: not found "+tree.operator);ConstructorProxy=function(){},ConstructorProxy.prototype=constructor.prototype,exp=new ConstructorProxy,constructor.apply(exp,operand),objTree.func=exp;for(var fn in tree.callFn)tree.callFn.hasOwnProperty(fn)&&exp[fn]&&exp[fn].apply(exp,tree.callFn[fn]);return tree.attr&&(tree.attr.id&&(mapping[tree.attr.id]={objGroup:exp,strGroup:originTree}),tree.attr["data-root"]&&(mapping.root={objGroup:exp,strGroup:originTree}),exp.setAttr(tree.attr)),exp}function createObject(type,value){switch(type){case"empty":return new kf.EmptyExpression;case"text":return new kf.TextExpression(value)}}function getConstructor(name){return CONSTRUCT_MAPPING[name]||kf[name.replace(/^[a-z]/i,function(match){return match.toUpperCase()}).replace(/-([a-z])/gi,function(match,char){return char.toUpperCase()})+"Expression"]}function deepCopy(source){var target={};if("[object Array]"==={}.toString.call(source)){target=[];for(var i=0,len=source.length;i<len;i++)target[i]=doCopy(source[i])}else for(var key in source)source.hasOwnProperty(key)&&(target[key]=doCopy(source[key]));return target}function doCopy(source){return source?"object"!=typeof source?source:deepCopy(source):source}var CONSTRUCT_MAPPING={},CURSOR_CHAR="";return Assembly.prototype.generateBy=function(data){var tree=data.tree,objTree={},selectInfo={},mapping={};if("string"==typeof tree)throw new Error("Unhandled error");var exp=generateExpression(tree,deepCopy(tree),objTree,mapping,selectInfo);return this.formula.appendExpression(exp),{select:selectInfo,parsedTree:tree,tree:objTree,mapping:mapping}},Assembly.prototype.regenerateBy=function(data){return this.formula.clearExpressions(),this.generateBy(data)},Assembly}},_p[1]={value:function(require){return{toRPNExpression:_p.r(3),generateTree:_p.r(4)}}},_p[2]={value:function(require){var QUALIFIER_LIST=["limits"],Utils=_p.r(5);return{isQualifier:function(input){return QUALIFIER_LIST.indexOf(input.replace(/^\\/,""))>-1},appendQualifierTo:function(structs,qualifier){qualifier=qualifier.replace(/^\\/,"");for(var j=structs.length-1;j>=0;j--){var struct=structs[j];if("object"==typeof struct&&!Utils.isArray(struct)){struct.qualifiers?struct.qualifiers.push(qualifier):struct.qualifiers=[qualifier];break}}},qualifiersToAttrs:function(unit){unit.qualifiers&&(unit.attr||(unit.attr={}),unit.attr["data-qualifiers"]=unit.qualifiers)},reverseQualifiers:function(unit){if(unit.attr&&unit.attr["data-qualifiers"]){for(var qualifiers=unit.attr["data-qualifiers"],tmpArray=[],i=0,len=qualifiers.length;i<len;i++)tmpArray.push("\\"+qualifiers[i]);return tmpArray.join("")}return""}}}},_p[3]={value:function(require){function rpn(units){var signStack=[],currentUnit=null;for(units=processFunction(units);currentUnit=units.shift();)"combination"!==currentUnit.name||1!==currentUnit.operand.length||"brackets"!==currentUnit.operand[0].name&&currentUnit.operand[0].type!==TYPE.ENV||(currentUnit=currentUnit.operand[0]),Utils.isArray(currentUnit)?signStack.push(rpn(currentUnit)):signStack.push(currentUnit);return signStack}function processFunction(units){for(var processed=[],currentUnit=null;void 0!==(currentUnit=units.pop());)if(!currentUnit||"object"!=typeof currentUnit||!1!==currentUnit.sign&&"function"!==currentUnit.name)processed.push(currentUnit);else{var tt=currentUnit.handler(currentUnit,[],processed.reverse());processed.unshift(tt),processed.reverse()}return processed.reverse()}var Utils=_p.r(5),TYPE=_p.r(16);return rpn}},_p[4]={value:function(require){function generateTree(units){for(var currentUnit=null,tree=[],i=0,len=units.length;i<len;i++)Utils.isArray(units[i])&&(units[i]=generateTree(units[i]));for(;currentUnit=units.shift();)"object"==typeof currentUnit&&currentUnit.handler?tree.push(currentUnit.handler(currentUnit,tree,units)):tree.push(currentUnit),QualifierUtils.qualifiersToAttrs(currentUnit);return mergeHandler(tree)}var mergeHandler=_p.r(24),Utils=_p.r(5),QualifierUtils=_p.r(2);return generateTree}},_p[5]={value:function(require){var OPERATOR_LIST=_p.r(12),FUNCTION_LIST=_p.r(11),FUNCTION_HANDLER=_p.r(37),ENVIRONMENT_LIST=_p.r(8),Utils={getLatexType:function(str){return str=str.replace(/^\\/,""),OPERATOR_LIST[str]?"operator":FUNCTION_LIST[str]?"function":"text"},isArray:function(obj){return obj&&"[object Array]"===Object.prototype.toString.call(obj)},isEnvironment:function(type){return ENVIRONMENT_LIST.hasOwnProperty(type)},getDefine:function(str){return Utils.extend({},OPERATOR_LIST[str.replace("\\","")])},getFuncDefine:function(str){return{name:"function",params:str.replace(/^\\/,""),handler:FUNCTION_HANDLER}},getBracketsDefine:function(leftBrackets,rightBrackets){return Utils.extend({params:[leftBrackets,rightBrackets]},OPERATOR_LIST.brackets)},getEnvironmentDefine:function(type){return Utils.extend({environmentType:type},ENVIRONMENT_LIST[type])},extractArgumentsAndSubunit:function(define,subunits){return define.argumentExtractor?define.argumentExtractor(define,subunits):subunits},extend:function(target,sources){for(var key in sources)sources.hasOwnProperty(key)&&(target[key]=sources[key]);return target}};return Utils}},_p[6]={value:function(require){return{toString:function(obj){var string=[];if(null===obj)string.push(JSON.stringify(obj));else if("object"==typeof obj&&void 0===obj.join){string.push("{");for(var prop in obj)obj&&string.push(prop,": ",this.toString(obj[prop]),",");string.push("}")}else if("object"==typeof obj&&void 0!==obj.join){string.push("["),string.push("(");for(var prop in obj)isNaN(prop)&&string.push(prop,": ",this.toString(obj[prop]),",");string.push(")|");for(var i=0,len=obj.length;i<len;i++)string.push(this.toString(obj[i])),i<len-1&&string.push(",");string.push("]")}else"function"==typeof obj?string.push("[[function]]"):string.push(JSON.stringify(obj));return string.join("")},log:function(prefix,message){if(message){var outMessage=this.toString(message);console.log(prefix+" - "+outMessage)}else console.log(prefix)}}}},_p[7]={value:function(){var t=!0;return{".":t,"{":t,"}":t,"[":t,"]":t,"(":t,")":t,"|":t}}},_p[8]={value:function(require){var TYPE=_p.r(16);return{gathered:{name:"equations",type:TYPE.ENV,handler:_p.r(27)},gather:{name:"equations",type:TYPE.ENV,handler:_p.r(27)},"gather*":{name:"equations",type:TYPE.ENV,handler:_p.r(27)},align:{name:"equations",type:TYPE.ENV,handler:_p.r(27)},"align*":{name:"equations",type:TYPE.ENV,handler:_p.r(27)},aligned:{name:"equations",type:TYPE.ENV,handler:_p.r(27)},array:{name:"array",type:TYPE.ENV,handler:_p.r(26),argumentExtractor:_p.r(25)},matrix:{name:"matrix",type:TYPE.ENV,handler:_p.r(30)},pmatrix:{name:"matrix",type:TYPE.ENV,handler:_p.r(30)},bmatrix:{name:"matrix",type:TYPE.ENV,handler:_p.r(30)},Bmatrix:{name:"matrix",type:TYPE.ENV,handler:_p.r(30)},vmatrix:{name:"matrix",type:TYPE.ENV,handler:_p.r(30)},Vmatrix:{name:"matrix",type:TYPE.ENV,handler:_p.r(30)}}}},_p[9]={value:function(require){return{rowSeparator:_p.r(18),optionalParameter:_p.r(17),spaceInText:_p.r(19)}}},_p[10]={value:function(require){var ScriptFactory=_p.r(21),scriptFactory=new ScriptFactory;scriptFactory.keys=["prod","coprod","bigcup","bigcap","bigvee","bigwedge"];var OptionParamFactory=_p.r(20),optionParamFactory=new OptionParamFactory;optionParamFactory.keys=["xrightleftharpoons","xrightarrow","sqrt"];var SimpleFactory=_p.r(22),simpleFactory=new SimpleFactory;return simpleFactory.keys=["vec","bar","widehat","hat","cancel","underrightarrow","overrightarrow"],[scriptFactory,optionParamFactory,simpleFactory]}},_p[11]={value:function(){return{sin:1,arcsin:1,cos:1,arccos:1,cosh:1,det:1,inf:1,limsup:1,Pr:1,tan:1,arctan:1,cot:1,dim:1,ker:1,ln:1,sec:1,tanh:1,coth:1,exp:1,lg:1,log:1,arg:1,csc:1,gcd:1,lim:1,max:1,sinh:1,deg:1,hom:1,liminf:1,min:1,sup:1}}},_p[12]={value:function(require){for(var scriptHandler=_p.r(44),TYPE=_p.r(16),objects={"^":{name:"superscript",type:TYPE.OP,handler:scriptHandler},_:{name:"subscript",type:TYPE.OP,handler:scriptHandler},frac:{name:"fraction",type:TYPE.FN,sign:!1,handler:_p.r(36)},sum:{name:"summation",type:TYPE.FN,traversal:"rtl",handler:_p.r(46)},int:{name:"integration",type:TYPE.FN,traversal:"rtl",handler:_p.r(38)},brackets:{name:"brackets",type:TYPE.FN,handler:_p.r(23)},mathcal:{name:"mathcal",type:TYPE.FN,sign:!1,handler:_p.r(41)},mathfrak:{name:"mathfrak",type:TYPE.FN,sign:!1,handler:_p.r(42)},mathbb:{name:"mathbb",type:TYPE.FN,sign:!1,handler:_p.r(40)},mathrm:{name:"mathrm",type:TYPE.FN,sign:!1,handler:_p.r(43)},text:{name:"text",type:TYPE.OP,handler:_p.r(33)},mathop:{name:"mathop",type:TYPE.OP,handler:_p.r(29)},overset:{name:"overset",type:TYPE.OP,handler:_p.r(32)},underset:{name:"underset",type:TYPE.OP,handler:_p.r(32)},stackrel:{name:"stackrel",type:TYPE.OP,handler:_p.r(32)},overline:{name:"overline",type:TYPE.OP,handler:_p.r(31)},underline:{name:"underline",type:TYPE.OP,handler:_p.r(31)},xlongequal:{name:"xlongequal",type:TYPE.FN,handler:_p.r(35)}},factory=_p.r(10),i=0;i<factory.length;i++)for(var keys=factory[i].getSupportKeys(),j=0;j<keys.length;j++){var key=keys[j];objects[key]=factory[i].getOperator(key)}return objects}},_p[13]={value:function(require){return{int:_p.r(48),quot:_p.r(49)}}},_p[14]={value:function(require){for(var objects={combination:_p.r(51),fraction:_p.r(62),function:_p.r(63),integration:_p.r(64),subscript:_p.r(71),superscript:_p.r(73),script:_p.r(69),radical:_p.r(70),summation:_p.r(72),brackets:_p.r(50),mathcal:_p.r(66),mathfrak:_p.r(67),mathbb:_p.r(65),mathrm:_p.r(68),equations:_p.r(53),array:_p.r(52),xarrow:_p.r(60),text:_p.r(59),mathop:_p.r(55),"over-under-set":_p.r(58),matrix:_p.r(56),"over-under-line":_p.r(57),xlongequal:_p.r(61)},factory=_p.r(10),i=0;i<factory.length;i++)for(var keys=factory[i].getSupportKeys(),j=0;j<keys.length;j++){var key=keys[j];objects[key]=factory[i].getReverseOperator(key)}return objects}},_p[15]={value:function(){return{"#":1,$:1,"%":1,_:1,"&":1,"{":1,"}":1,"^":1,"~":1}}},_p[16]={value:function(){return{OP:1,FN:2,ENV:3}}},_p[17]={value:function(){function wrap(match,p1,p2,p3){return p1+"{"+p2+"}"+p3}return{escape:function(input){return input=input.replace(/(\\xlongequal\s*\[)(.*?)(\])/gi,wrap)}}}},_p[18]={value:function(){return{escape:function(input){return input.replace(/\\\\/g,"￰")},unescape:function(input){return input.replace("￰","\\\\")}}}},_p[19]={value:function(){function escapeSpace(input){return input.replace(/\s/g,spaceCharInText)}var spaceCharInText="￳";return{escape:function(input){return input.replace(/(\\text{)(.+?)(})/gi,function(match,p1,p2,p3){return p1+escapeSpace(p2)+p3})},unescape:function(input){return input.replace(spaceCharInText," ")}}}},_p[20]={value:function(require){var TYPE=_p.r(16),OptionParamFactory=function(){this.keys=[]};OptionParamFactory.prototype.getSupportKeys=function(){return this.keys};var formatKey=function(key){return{sqrt:"radical"}[key]||key};return OptionParamFactory.prototype.getOperator=function(key){var mergeHandler=_p.r(24),handler=function(info,processedStack,unprocessedStack){var exponent=unprocessedStack.shift(),tmp=null,radicand=null;if("["===exponent){for(exponent=[];(tmp=unprocessedStack.shift())&&"]"!==tmp;)exponent.push(tmp);exponent=0===exponent.length?null:1===exponent.length?exponent[0]:mergeHandler(exponent),radicand=unprocessedStack.shift()}else radicand=exponent,exponent=null;return info.operand=[radicand,exponent],delete info.handler,info};return{name:formatKey(key),type:TYPE.FN,sign:!1,handler:handler}},OptionParamFactory.prototype.getReverseOperator=function(key){return function(operands){var result=["\\"+key];return operands[1]&&result.push("["+operands[1]+"]"),result.push(" "+operands[0]),result.join("")}},OptionParamFactory}},_p[21]={value:function(require){var TYPE=_p.r(16),ScriptFactory=function(){this.keys=[]};ScriptFactory.prototype.getSupportKeys=function(){return this.keys},ScriptFactory.prototype.getOperator=function(key){var ScriptExtractor=_p.r(39),handler=function(info,processedStack,unprocessedStack){var params=ScriptExtractor.exec(unprocessedStack);return info.operand=[params.expr,params.superscript,params.subscript],delete info.handler,info};return{name:key,type:TYPE.FN,sign:!1,handler:handler}};var useLimits=function(operator){return["prod","coprod","bigcup","bigcap","bigvee","bigwedge"].indexOf(operator)>-1};return ScriptFactory.prototype.getReverseOperator=function(key){return function(operands){var operator="\\"+key;useLimits(key)&&(operator+=" \\limits");var result=[operator];return operands[1]&&result.push("^"+operands[1]),operands[2]&&result.push("_"+operands[2]),operands[0]&&result.push(" "+operands[0]),result.join("")}},ScriptFactory}},_p[22]={value:function(require){var TYPE=_p.r(16),SimpleFactory=function(){this.keys=[]};return SimpleFactory.prototype.getSupportKeys=function(){return this.keys},SimpleFactory.prototype.getOperator=function(key){var handler=function(info,processedStack,unprocessedStack){var data=unprocessedStack.shift();return info.operand=[data],delete info.handler,info};return{name:key,type:TYPE.FN,sign:!1,handler:handler}},SimpleFactory.prototype.getReverseOperator=function(key){return function(operands){var value=operands[0]?operands[0]+"":null;return operands[0]&&""!=value&&"{}"!=value?["\\"+key,operands[0]||""].join(""):""}},SimpleFactory}},_p[23]={value:function(require){var BRACKETS_TYPE=_p.r(7);return function(info,processedStack,unprocessedStack){for(var i=0,len=info.params.length;i<len;i++)if(!(info.params[i]in BRACKETS_TYPE))throw new Error("Brackets: invalid params");return info.operand=info.params,info.params[2]=unprocessedStack.shift(),delete info.handler,delete info.params,info}}},_p[24]={value:function(){return function(){return{name:"combination",operand:arguments[0]||[]}}}},_p[25]={value:function(){function extractTableLocation(define,subunits){var end=subunits.indexOf("]");return"["===subunits[0]&&end>-1&&(define.tableLocation=joinArray(subunits.slice(0,end+1),!1)),subunits.slice(end+1)}function extractColClass(define,subunits){var subunit=subunits.shift();return subunit&&(define.colClass=isArray(subunit)?joinArray(subunit,!0):subunit),subunits}function joinArray(array,wrapped){for(var i=0,len=array.length;i<len;i++)isArray(array[i])&&(array[i]=joinArray(array[i],wrapped));return wrapped?"{"+array.join("")+"}":array.join("")}function isArray(obj){return obj&&"[object Array]"===Object.prototype.toString.call(obj)}return function(define,subunits){return subunits&&subunits.length>0?extractColClass(define,extractTableLocation(define,subunits)):subunits}}},_p[26]={value:function(require){function isColSeparator(item){return"string"==typeof item&&"&"==item}function isRowSeparator(item){return"string"==typeof item&&/\\+/.test(item)}var mergeHandler=_p.r(24);return function(info,processedStack,unprocessedStack){info.attr={"data-table-location":info.tableLocation,"data-col-class":info.colClass},info.operand=[];for(var originalOperands=unprocessedStack.shift().operand,matrixItem=[],originalOperand=null,i=0,len=originalOperands.length;i<len;i++){originalOperand=originalOperands[i];var rowSeparator=isRowSeparator(originalOperand);isColSeparator(originalOperand)||rowSeparator?(info.operand.push(mergeHandler(matrixItem)),rowSeparator&&info.operand.push(""),matrixItem=[]):(matrixItem.push(originalOperand),i==len-1&&info.operand.push(mergeHandler(matrixItem)))}return delete info.handler,info}}},_p[27]={value:function(require){function isIgnoredOperand(operand){return-1!=ignoreOperands.indexOf(operand)}function isRowSeparator(item){return"string"==typeof item&&/^\\+$/.test(item)}var mergeHandler=_p.r(24),hanldeOperand=function(arrays){return 1==arrays.length?arrays[0]:mergeHandler(arrays)},ignoreOperands=["\\hfill\\","&"];return function(info,processedStack,unprocessedStack){info.attr={"data-equations-type":info.environmentType};var originalOperands=unprocessedStack.shift().operand;info.operand=[];for(var matrixItem=[],i=0,len=originalOperands.length;i<len;i++){var originalOperand=originalOperands[i];isIgnoredOperand(originalOperand)?i==len-1&&info.operand.push(hanldeOperand(matrixItem)):isRowSeparator(originalOperand)?(info.operand.push(hanldeOperand(matrixItem)),matrixItem=[]):(matrixItem.push(originalOperand),i==len-1&&info.operand.push(hanldeOperand(matrixItem)))}return delete info.handler,info}}},_p[28]={value:function(require){var mergeHandler=_p.r(24);return function(units){if("["===units[0]){units.shift();for(var tmp=null,optionalArgument=[];(tmp=units.shift())&&"]"!==tmp;)optionalArgument.push(tmp);return optionalArgument=0===optionalArgument.length?null:mergeHandler(optionalArgument)}}}},_p[29]={value:function(){return function(info,processedStack,unprocessedStack){var operand=unprocessedStack.shift();return"object"==typeof operand&&"combination"===operand.name&&0===operand.operand.length&&(operand=" "),info.operand=[operand],delete info.handler,info}}},_p[30]={value:function(require){function isColSeparator(item){return"&"===item}function isRowSeparator(item){return"string"==typeof item&&/\\+/.test(item)}var mergeHandler=_p.r(24),hanldeOperand=function(arrays){return 1==arrays.length?arrays[0]:mergeHandler(arrays)};return function(info,processedStack,unprocessedStack){info.attr={"data-matrix-type":info.environmentType},info.operand=[];for(var originalOperands=unprocessedStack.shift().operand,matrixItem=[],originalOperand=null,i=0,len=originalOperands.length;i<len;i++){originalOperand=originalOperands[i];var rowSeparator=isRowSeparator(originalOperand);isColSeparator(originalOperand)||rowSeparator?(info.operand.push(hanldeOperand(matrixItem)),rowSeparator&&info.operand.push(""),matrixItem=[]):(matrixItem.push(originalOperand),i==len-1&&info.operand.push(hanldeOperand(matrixItem)))}return delete info.handler,info}}},_p[31]={value:function(){return function(info,processedStack,unprocessedStack){return info.operand=[unprocessedStack.shift()],info.actualName=info.name,info.name="over-under-line",info.attr={"data-line-type":info.actualName.substring(0,info.actualName.indexOf("line")),_reverse:"over-under-line"},delete info.handler,info}}},_p[32]={value:function(){function isUnder(type){return"underset"===type}return function(info,processedStack,unprocessedStack){var sup=isUnder(info.name)?null:unprocessedStack.shift(),sub=isUnder(info.name)?unprocessedStack.shift():null;return info.operand=[unprocessedStack.shift(),sup,sub],info.actualName=info.name,info.name="script",info.attr={"data-script-mode":"UP_DOWN","data-not-contains-additional-space":"true",_reverse:"over-under-set"},delete info.handler,info}}},_p[33]={value:function(){return function(info,processedStack,unprocessedStack){var chars=unprocessedStack.shift();return"object"==typeof chars&&"combination"===chars.name&&(chars=chars.operand.join("")),info.callFn={setFamily:["KF AMS ROMAN"]},info.operand=[chars],delete info.handler,info}}},_p[34]={value:function(require){var optionalArgumentExtractor=_p.r(28);return function(info,processedStack,unprocessedStack){info.attr={"data-arrow-type":info.name},info.operand=[];var downOperand=optionalArgumentExtractor(unprocessedStack);return downOperand&&(info.operand[1]=downOperand),info.operand[0]=unprocessedStack.shift(),info.name="xarrow",delete info.handler,info}}},_p[35]={value:function(require){var optionalArgumentExtractor=_p.r(28);return function(info,processedStack,unprocessedStack){info.operand=[];var downOperand=optionalArgumentExtractor(unprocessedStack);return downOperand&&(info.operand[1]=downOperand),info.operand[0]=unprocessedStack.shift(),delete info.handler,info}}},_p[36]={value:function(){return function(info,processedStack,unprocessedStack){var numerator=unprocessedStack.shift(),denominator=unprocessedStack.shift();if(void 0===numerator||void 0===denominator)throw new Error("Frac: Syntax Error");return info.operand=[numerator,denominator],delete info.handler,info}}},_p[37]={value:function(require){var ScriptExtractor=_p.r(39);return function(info,processedStack,unprocessedStack){var params=ScriptExtractor.exec(unprocessedStack);return info.operand=[info.params,params.expr,params.superscript,params.subscript],delete info.params,delete info.handler,info}}},_p[38]={value:function(require){var ScriptExtractor=_p.r(39);return function(info,processedStack,unprocessedStack){var count=unprocessedStack.shift(),params=ScriptExtractor.exec(unprocessedStack);return info.operand=[params.expr,params.superscript,params.subscript],info.callFn={setType:[0|count]},delete info.handler,info}}},_p[39]={value:function(){function extractScript(stack){var scriptGroup=extract(stack),nextGroup=null,result={superscript:null,subscript:null};if(!scriptGroup)return result;if(nextGroup=extract(stack),result[scriptGroup.type]=scriptGroup.value||null,nextGroup){if(nextGroup.type===scriptGroup.type)throw new Error("Script: syntax error!");result[nextGroup.type]=nextGroup.value||null}return result}function extract(stack){var forward=stack.shift();return forward?"subscript"===forward.name||"superscript"===forward.name?{type:forward.name,value:stack.shift()}:(stack.unshift(forward),null):null}return{exec:function(stack){var result=extractScript(stack),expr=stack.shift();if(expr&&expr.name&&-1!==expr.name.indexOf("script"))throw new Error("Script: syntax error!");return result.expr=expr||null,result}}}},_p[40]={value:function(){return function(info,processedStack,unprocessedStack){var chars=unprocessedStack.shift();return"object"==typeof chars&&"combination"===chars.name&&(chars=chars.operand.join("")),info.name="text",info.attr={_reverse:"mathbb"},info.callFn={setFamily:["KF AMS BB"]},info.operand=[chars],delete info.handler,info}}},_p[41]={value:function(){return function(info,processedStack,unprocessedStack){var chars=unprocessedStack.shift();return"object"==typeof chars&&"combination"===chars.name&&(chars=chars.operand.join("")),info.name="text",info.attr={_reverse:"mathcal"},info.callFn={setFamily:["KF AMS CAL"]},info.operand=[chars],delete info.handler,info}}},_p[42]={value:function(){return function(info,processedStack,unprocessedStack){var chars=unprocessedStack.shift();return"object"==typeof chars&&"combination"===chars.name&&(chars=chars.operand.join("")),info.name="text",info.attr={_reverse:"mathfrak"},info.callFn={setFamily:["KF AMS FRAK"]},info.operand=[chars],delete info.handler,info}}},_p[43]={value:function(){return function(info,processedStack,unprocessedStack){var chars=unprocessedStack.shift();return"object"==typeof chars&&"combination"===chars.name&&(chars=chars.operand.join("")),info.name="text",info.attr={_reverse:"mathrm"},info.callFn={setFamily:["KF AMS ROMAN"]},info.operand=[chars],delete info.handler,info}}},_p[44]={value:function(){return function(info,processedStack,unprocessedStack){var base=processedStack.pop(),script=unprocessedStack.shift()||null;if(!script)throw new Error("Missing script");if(base=base||"",base.name===info.name||"script"===base.name)throw new Error("script error");return"subscript"===base.name?(base.name="script",base.operand[2]=base.operand[1],base.operand[1]=script,base):"superscript"===base.name?(base.name="script",base.operand[2]=script,base):(info.operand=[base,script],delete info.handler,info)}}},_p[45]={value:function(require){var mergeHandler=_p.r(24);return function(info,processedStack,unprocessedStack){var exponent=unprocessedStack.shift(),tmp=null,radicand=null;if("["===exponent){for(exponent=[];(tmp=unprocessedStack.shift())&&"]"!==tmp;)exponent.push(tmp);exponent=0===exponent.length?null:mergeHandler(exponent),radicand=unprocessedStack.shift()}else radicand=exponent,exponent=null;return info.operand=[radicand,exponent],delete info.handler,info}}},_p[46]={value:function(require){var ScriptExtractor=_p.r(39);return function(info,processedStack,unprocessedStack){var params=ScriptExtractor.exec(unprocessedStack);return info.operand=[params.expr,params.superscript,params.subscript],delete info.handler,info}}},_p[47]={value:function(require){function parseStruct(str){if(isSpecialCharacter(str))return str.substring(1);switch(Utils.getLatexType(str)){case"operator":return Utils.getDefine(str);case"function":return Utils.getFuncDefine(str);default:return transformSpecialCharacters(str)}}function transformSpecialCharacters(char){return 0===char.indexOf("\\")?char+"\\":char}function isSpecialCharacter(char){return 0===char.indexOf("\\")&&!!SPECIAL_LIST[char.substring(1)]}function clearEmpty(data){return data.replace(/\\\s+/,"").replace(/\s*([^a-z0-9\s])\s*/gi,function(match,symbol){return symbol})}var Parser=_p.r(75).Parser,LatexUtils=_p.r(1),PRE_HANDLER=_p.r(13),serialization=_p.r(74),OP_DEFINE=_p.r(12),REVERSE_DEFINE=_p.r(14),SPECIAL_LIST=_p.r(15),Utils=_p.r(5),ESCAPE_HANDLER=_p.r(9),QualifierUtils=_p.r(2),DebugUtils=_p.r(6),clearCharPattern=new RegExp("￸|￼","g"),leftCharPattern=new RegExp("￸","g"),rightCharPattern=new RegExp("￼","g");Parser.register("latex",Parser.implement({parse:function(data){DebugUtils.log("input",data);var units=this.split(this.format(data));DebugUtils.log("units",units),units=this.parseToGroup(units),DebugUtils.log("parseToGroup",units),units=this.parseToStruct(units),DebugUtils.log("parseToStruct",units);var tree=this.generateTree(units);return DebugUtils.log("tree",tree),tree},serialization:function(tree,options){return serialization(tree,options)},expand:function(expandObj){var parseObj=expandObj.parse,formatKey=null,preObj=expandObj.pre,reverseObj=expandObj.reverse,escapeObj=expandObj.escape;for(var key in parseObj)parseObj.hasOwnProperty(key)&&(formatKey=key.replace(/\\/g,""),OP_DEFINE[formatKey]=parseObj[key]);for(var key in reverseObj)reverseObj.hasOwnProperty(key)&&(REVERSE_DEFINE[key.replace(/\\/g,"")]=reverseObj[key]);if(preObj)for(var key in preObj)preObj.hasOwnProperty(key)&&(PRE_HANDLER[key.replace(/\\/g,"")]=preObj[key]);if(escapeObj)for(var key in escapeObj)escapeObj.hasOwnProperty(key)&&(ESCAPE_HANDLER[key.replace(/\\/g,"")]=escapeObj[key])},escape:function(input){for(var key in ESCAPE_HANDLER)if(ESCAPE_HANDLER.hasOwnProperty(key)){var escapeHandler=ESCAPE_HANDLER[key];escapeHandler.escape&&(input=escapeHandler.escape(input),DebugUtils.log("EscapeHandler["+key+"]",input))}return input},unescape:function(input){for(var key in ESCAPE_HANDLER)if(ESCAPE_HANDLER.hasOwnProperty(key)){var escapeHandler=ESCAPE_HANDLER[key];escapeHandler.unescape&&(input=escapeHandler.unescape(input))}return input},format:function(input){input=this.escape(input),input=clearEmpty(input),DebugUtils.log("clearEmpty",input),input=input.replace(clearCharPattern,"").replace(/\\{/gi,"￸").replace(/\\}/gi,"￼");for(var key in PRE_HANDLER)PRE_HANDLER.hasOwnProperty(key)&&(input=PRE_HANDLER[key](input),DebugUtils.log("PreHandler["+key+"]",input));return DebugUtils.log("formatted input",input),input},split:function(data){var units=[],pattern=/(?:\\[^a-z]\s*)|(?:\\[a-z]+\s*)|(?:[{}]\s*)|(?:[^\\{}]\s*)/gi,match=null;for(data=data.replace(/^\s+|\s+$/g,"");match=pattern.exec(data);)(match=match[0].replace(/^\s+|\s+$/g,""))&&units.push(match);return units},generateTree:function(units){for(var tree=[],currentUnit=null;currentUnit=units.shift();)Utils.isArray(currentUnit)?tree.push(this.generateTree(currentUnit)):tree.push(currentUnit);return tree=LatexUtils.toRPNExpression(tree),LatexUtils.generateTree(tree)},parseToGroup:function(units){for(var group=[],groupStack=[group],groupCount=0,bracketsCount=0,environmentConunt=0,i=0,len=units.length;i<len;i++)switch(units[i]){case"{":groupCount++,groupStack.push(group),group.push([]),group=group[group.length-1];break;case"}":groupCount--,group=groupStack.pop();break;case"\\left":bracketsCount++,groupStack.push(group),group.push([[]]),group=group[group.length-1][0],group.type="brackets",i++,group.leftBrackets=units[i].replace(leftCharPattern,"{").replace(rightCharPattern,"}");break;case"\\right":bracketsCount--,i++,group.rightBrackets=units[i].replace(leftCharPattern,"{").replace(rightCharPattern,"}"),group=groupStack.pop();break;case"\\begin":environmentConunt++,groupStack.push(group),group.push([[]]),group=group[group.length-1][0],group.type="environment",group.environmentType=this.extractEnvironmentType(i,units),i+=group.environmentType.length+2;break;case"\\end":environmentConunt--,group=groupStack.pop(),i+=this.extractEnvironmentType(i,units).length+2;break;default:group.push(this.unescape(units[i]).replace(leftCharPattern,"\\{").replace(rightCharPattern,"\\}"))}if(0!==groupCount)throw new Error("Group Error!");if(0!==bracketsCount)throw new Error("Brackets Error!");if(0!==environmentConunt)throw new Error("Environment Error!");return groupStack[0]},extractEnvironmentType:function(start,units){var end=units.indexOf("}",start);return units.slice(start+2,end).join("")},parseToStruct:function(units){for(var structs=[],i=0,len=units.length;i<len;i++)if(Utils.isArray(units[i]))if("brackets"===units[i].type)structs.push(Utils.getBracketsDefine(units[i].leftBrackets,units[i].rightBrackets)),structs.push(this.parseToStruct(units[i]));else if("environment"===units[i].type&&Utils.isEnvironment(units[i].environmentType)){var define=Utils.getEnvironmentDefine(units[i].environmentType),subunits=Utils.extractArgumentsAndSubunit(define,units[i]);structs.push(define),structs.push(this.parseToStruct(subunits))}else structs.push(this.parseToStruct(units[i]));else QualifierUtils.isQualifier(units[i])?QualifierUtils.appendQualifierTo(structs,units[i]):structs.push(parseStruct(units[i]));return structs}}))}},_p[48]={value:function(){return function(input){return input.replace(/\\(i+)nt(\b|[^a-zA-Z])/g,function(match,sign,suffix){return"\\int "+sign.length+suffix})}}},_p[49]={value:function(){return function(input){return input.replace(/``/g,"“")}}},_p[50]={value:function(){return function(operands){return"{"!==operands[0]&&"}"!==operands[0]||(operands[0]="\\"+operands[0]),"{"!==operands[1]&&"}"!==operands[1]||(operands[1]="\\"+operands[1]),["\\left",operands[0],operands[2],"\\right",operands[1]].join(" ")}}},_p[51]={value:function(){return function(operands){return this.attr&&(this.attr["data-root"]||this.attr["data-placeholder"])?operands.join(""):"{"+operands.join("")+"}"}}},_p[52]={value:function(){return function(operands){
for(var argsString=(this.tableLocation||"")+(this.colClass||""),items=["\\begin{array}"+argsString],i=0,len=operands.length;i<len;i++){operands[i]?(items.push(operands[i]),i<len-1&&items.push("&")):(items.pop(),items.push("\\\\"))}return items.push("\\end{array}"),items.join(" ")}}},_p[53]={value:function(){return function(operands){for(var equationsType=this.environmentType,items=["\\begin{"+equationsType+"}"],i=0,len=operands.length;i<len;i++)items.push(operands[i]),i<len-1&&""!=operands[i]&&items.push("\\\\");return items.push("\\end{"+equationsType+"}"),console.log("equations "+items.join(" ")),items.join(" ")}}},_p[54]={value:function(){var qualifiers=["limits"];return{reverse:function(unit){var result=[];if(unit.attr&&unit.attr["data-qualifiers"]&&unit.attr["data-qualifiers"].length>0)for(var i=0,len=qualifiers.length;i<len;i++)result.push(this.reverseQualifier(unit,qualifiers[i]));return result.join(" ")},reverseQualifier:function(unit,qualifier){return unit.attr["data-qualifiers"].indexOf(qualifier)>-1?"\\"+qualifier:""}}}},_p[55]={value:function(require){var QualifierReversor=_p.r(54);return function(operands){var result="\\mathop",operand=operands.shift();return operand&&"{"===operand.charAt(0)&&"}"===operand.charAt(operand.length-1)?result+=operand:result+="{"+operand+"}",result+=QualifierReversor.reverse(this)}}},_p[56]={value:function(){return function(operands){for(var matrixType=this.environmentType,items=["\\begin{"+matrixType+"}"],i=0,len=operands.length;i<len;i++){operands[i]?(items.push(operands[i]),i<len-1&&items.push("&")):(items.pop(),items.push("\\\\"))}return items.push("\\end{"+matrixType+"}"),items.join(" ")}}},_p[57]={value:function(){return function(operands){return["\\"+this.actualName,"{",operands[0],"}"].join(" ")}}},_p[58]={value:function(){return function(operands){return["\\"+this.actualName,operands[1]||operands[2],operands[0]].join(" ")}}},_p[59]={value:function(){return function(operands){return["\\",this.name,"{",operands.shift()||"","}"].join("")}}},_p[60]={value:function(){return function(operands){var items=["\\"+this.attr["data-arrow-type"]];return operands.length>1&&items.push("["+operands[1]+"]"),items.push(operands[0]),items.join("")}}},_p[61]={value:function(){return function(operands){var items=["\\xlongequal"];return operands[1]&&items.push("["+operands[1]+"]"),items.push(operands[0]),items.join("")}}},_p[62]={value:function(){return function(operands){return"\\frac "+operands[0]+" "+operands[1]}}},_p[63]={value:function(require){var QualifierUtils=_p.r(2);return function(operands){var result=["\\"+operands[0]];return result.push(QualifierUtils.reverseQualifiers(this)),operands[2]&&result.push("^"+operands[2]),operands[3]&&result.push("_"+operands[3]),operands[1]&&result.push(" "+operands[1]),result.join("")}}},_p[64]={value:function(){return function(operands){var result=["\\int "];if(this.callFn&&this.callFn.setType){result=["\\"];for(var i=0,len=this.callFn.setType;i<len;i++)result.push("i");result.push("nt ")}return operands[1]&&result.push("^"+operands[1]),operands[2]&&result.push("_"+operands[2]),operands[0]&&result.push(" "+operands[0]),result.join("")}}},_p[65]={value:function(){return function(operands){return"\\mathbb{"+operands[0]+"}"}}},_p[66]={value:function(){return function(operands){return"\\mathcal{"+operands[0]+"}"}}},_p[67]={value:function(){return function(operands){return"\\mathfrak{"+operands[0]+"}"}}},_p[68]={value:function(){return function(operands){return"\\mathrm{"+operands[0]+"}"}}},_p[69]={value:function(){return function(operands){return operands[0]+"^"+operands[1]+"_"+operands[2]}}},_p[70]={value:function(){return function(operands){var result=["\\sqrt"];return operands[1]&&result.push("["+operands[1]+"]"),result.push(" "+operands[0]),result.join("")}}},_p[71]={value:function(){return function(operands){return operands[0]+"_"+operands[1]}}},_p[72]={value:function(){return function(operands){var result=["\\sum ","\\limits"];return operands[1]&&result.push("^"+operands[1]),operands[2]&&result.push("_"+operands[2]),operands[0]&&result.push(" "+operands[0]),result.join("")}}},_p[73]={value:function(){return function(operands){return operands[0]+"^"+operands[1]}}},_p[74]={value:function(require){function reverseParse(tree,options){var operands=[],reverseHandlerName=null,originalOperands=null;if("object"!=typeof tree)return isSpecialCharacter(tree)?"\\"+tree+" ":tree.replace(specialCharPattern,function(match,group){return group+" "});"combination"===tree.name&&1===tree.operand.length&&"combination"===tree.operand[0].name&&(tree=tree.operand[0]),originalOperands=tree.operand;for(var i=0,len=originalOperands.length;i<len;i++)originalOperands[i]?operands.push(reverseParse(originalOperands[i])):operands.push(originalOperands[i]);return reverseHandlerName=tree.attr&&tree.attr._reverse?tree.attr._reverse:tree.name,reverseHandlerTable[reverseHandlerName].call(tree,operands,options)}function isSpecialCharacter(char){return!!SPECIAL_LIST[char]}var reverseHandlerTable=_p.r(14),SPECIAL_LIST=_p.r(15),specialCharPattern=/(\\(?:[\w]+)|(?:[^a-z]))\\/gi;return function(tree,options){return reverseParse(tree,options)}}},_p[75]={value:function(require,exports,module){function ParserProxy(ParserImpl){this.impl=new ParserImpl,this.conf={}}function ParserInterface(){this.conf={}}var CONF={},IMPL_POLL={},Utils={extend:function(target,sources){var source=null;sources=[].slice.call(arguments,1);for(var i=0,len=sources.length;i<len;i++){source=sources[i];for(var key in source)source.hasOwnProperty(key)&&(target[key]=source[key])}},setData:function(container,key,value){if("string"==typeof key)container[key]=value;else{if("object"!=typeof key)throw new Error("invalid option");for(value in key)key.hasOwnProperty(value)&&(container[value]=key[value])}}},Parser={use:function(type){if(!IMPL_POLL[type])throw new Error("unknown parser type");return this.proxy(IMPL_POLL[type])},config:function(key,value){return Utils.setData(CONF,key,value),this},register:function(type,parserImpl){return IMPL_POLL[type.toLowerCase()]=parserImpl,this},implement:function(parser){var Impl=function(){},constructor=parser.constructor||function(){},result=function(){ParserInterface.call(this),constructor.call(this)};Impl.prototype=ParserInterface.prototype,result.prototype=new Impl,delete parser.constructor;for(var key in parser)"constructor"!==key&&parser.hasOwnProperty(key)&&(result.prototype[key]=parser[key]);return result},proxy:function(parserImpl){return new ParserProxy(parserImpl)}};Utils.extend(ParserProxy.prototype,{config:function(key,value){Utils.setData(this.conf,key,value)},set:function(key,value){this.impl.set(key,value)},parse:function(data){var result={config:{},tree:this.impl.parse(data)};return Utils.extend(result.config,CONF,this.conf),result},serialization:function(tree,options){return this.impl.serialization(tree,options)},expand:function(obj){this.impl.expand(obj)}}),Utils.extend(ParserInterface.prototype,{set:function(key,value){Utils.extend(this.conf,key,value)},parse:function(){throw new Error("Abstract function")}}),module.exports={Parser:Parser,ParserInterface:ParserInterface}}},_p[76]={value:function(require){var Parser=_p.r(75).Parser;_p.r(47),window.kf.Parser=Parser,window.kf.Assembly=_p.r(0)}};var moduleMapping={"kf.start":76};!function(global){try{use("kf.start")}catch(e){}}()}();