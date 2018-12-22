var fileSystem = require('fs');
var DOMImplementation = require('xmldom2').DOMImplementation;
var XMLSerializer = require('xmldom2').XMLSerializer;
var itemXml = require("./../common/itemXMLParser");
var itemParser = new itemXml.itemXMLParser.Parser();
var Path = require("path");

var QT_COMMON = "common";
var QT_GENERAL_TOOL = "general-tool";
var QT_TEXT_SELECT = "text-select";
var QT_MAGIC_BOX = "magic-box";
var QT_WORD_PUZZLE = "word-puzzle";
var QT_FILL_BLANK = "fill-blank";
var QT_GUESS_WORD = "guess-word";
var QT_POINT_SEQUENCING = "point-sequencing";
var QT_COMPARE = "compare";
var QT_IMAGE_MARK = "image-mark";
var QT_ARITHMETIC = "arithmetic";
var QT_CLASSIFIED = "classified";
var QT_ORDER = "order";
var QT_TABLE = "table";
var QT_MEMORYCARD = "memory-card";
var QT_LINKUP = "linkup";
var QT_FRACTION = "fraction";
var QT_COMICDIALOGUE = "comicdialogue";
var QT_SPELLPOEM = "spellpoem";
var QT_MINDJET = "mindjet";
var QT_GRAPHICS_CUTTING = "graphicscutting";

//公共模板：API-V2接口规范的题型
var COMMON_QUESTION_CONFIG = {
    "probabilitycard": {
        "addonId": "ProbabilityCard",
        "skin": "",
        "skinPath": ""
    },
    "catchball": {
        "addonId": "CatchBall",
        "skin": "",
        "skinPath": ""
    },
    "balance": {
        "addonId": "Balance",
        "skin": "",
        "skinPath": ""
    },
    "planting": {
        "addonId": "Planting",
        "skin": "",
        "skinPath": ""
    },
    "clock": {
        "addonId": "ClockThree",
        "skin": "",
        "skinPath": ""
    },
    "lego": {
        "addonId": "Lego",
        "skin": "",
        "skinPath": ""
    },
    "openshapetool": {
        "addonId": "OpenShapeTool",
        "skin": "",
        "skinPath": ""
    },
    "puzzle": {
        "addonId": "Three2DPuzzle",
        "skin": "",
        "skinPath": ""
    },
    "mathaxis": {
        "addonId": "MathAxis",
        "skin": "",
        "skinPath": ""
    },
    "spellpoem": {
        "addonId": "SpellPoem",
        "skin": "",
        "skinPath": ""
    },
    "intervalproblem": {
        "addonId": "IntervalProblem",
        "skin": "",
        "skinPath": ""
    },
    "counter": {
        "addonId": "Counter",
        "skin": "",
        "skinPath": ""
    },
    "abacus": {
        "addonId": "Abacus",
        "skin": "",
        "skinPath": ""
    },
    "makeword": {
        "addonId": "MakeWord",
        "skin": "",
        "skinPath": ""
    },
    "sentence_evaluat": {
        "addonId": "SentenceEvaluating",
        "skin": "",
        "skinPath": ""
    },
    "section_evaluating": {
        "addonId": "SectionEvaluating",
        "skin": "",
        "skinPath": ""
    },
    "highlight-mark": {
        "addonId": "HighlightMark",
        "skin": "",
        "skinPath": ""
    },
    "speechevaluating": {
        "addonId": "SpeechEvaluating",
        "skin": "",
        "skinPath": ""
    },
};

//一般互动工具类列表
var generalToolsList = [QT_GRAPHICS_CUTTING];

function isGeneralTool(question_type) {
    return generalToolsList.indexOf(question_type) > -1;
}

function convertQuestionType(question_type) {
    if (COMMON_QUESTION_CONFIG[question_type]) {
        return QT_COMMON;
    }

    return question_type;
}

//获取用户设置的交互提示
function getInteractionHints(jsonObj) {
    var hintData = {};
    if (jsonObj.interaction_hints) {
        hintData.hints = jsonObj.interaction_hints;
        //delete jsonObj.interaction_hints;
    }

    return hintData;
}

/**
 * 生成main.xml内容
 * @param tmplObj
 * @param uuid
 * @param timestamp
 * @returns {*}
 */
function generateMainXMLContent(mainTemplate, uuid, timestamp) {
    return mainTemplate.replace(/\$\{uuid\}/g, uuid).replace("${timestamp}", timestamp);
}

/**
 * 将文本选择题的JSON格式转换为XML格式
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function textSelectParse(tmpl, jsonObj) {

    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };
    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/textselect/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))

    .replace("${question_url}", "../resources/textSelects.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/textSelects.json?v=" + currentTimeStamp);
    //题目的数据文件

    var questionData = {};
    questionData.id = jsonObj.id;
    questionData.prompt = jsonObj.prompt;
    questionData.skin = { code: "wood", css_url: "", name: "木纹", package_url: "" };
    questionData.timer = jsonObj.timer;
    questionData.title = jsonObj.title;

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "textSelects.json", content: JSON.stringify(questionData) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });

    return result;
}

/**
 * 将魔方盒的JSON格式转换为XML格式
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function magicBoxParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };
    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/magicBox/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/magicBox.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/magicBox.json?v=" + currentTimeStamp);
    //题目的数据

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "magicBox.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 将字谜游戏的JSON格式转换为XML格式
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function wordPuzzleParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };
    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/wordpuzzle/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/wordPuzzle.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/wordPuzzle.json?v=" + currentTimeStamp);
    //题目的数据

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "wordPuzzle.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 将四格漫画游戏的JSON格式转换为XML格式
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function comicdialogueParse(tmpl, jsonObj) {

    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };
    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/comicdialogue/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/comicdialogue.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/comicdialogue.json?v=" + currentTimeStamp);
    //题目的数据

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "comicdialogue.json", content: JSON.stringify(jsonObj) });
    return result;
}

/**
 * 将选词填空的JSON格式转换为XML格式
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function fillBlankParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/fillblank/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/fillblank.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/fillblank.json?v=" + currentTimeStamp);

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "fillblank.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 将猜词游戏的数据做本地化保存
 */
function guessWordParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/guessword/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/guessword.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    //sdp-package.xml
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/guessword.json?v=" + currentTimeStamp)
        .replace("${resourcePath}", "resources");

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "guessword.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });

    return result;
}

/**
 * 点排序的数据做本地化保存
 */
function pointSequencingParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "${ref-path}/skins/pointsequencing/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/pointsequencing.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    //sdp-package.xml
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/pointsequencing.json?v=" + currentTimeStamp)
        .replace("${resourcePath}", "resources");

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "pointsequencing.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 比大小题型的本地化处理
 * @param tmpl 比大小模板
 * @param jsonObj 编辑器传入的原始数据
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function compareParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        .replace("${question_title}", jsonObj.title)
        //.replace("${skin}", "../skins/compare/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${question_url}", "../resources/compare.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    //sdp-package.xml
    var sdpPackage = tmplObj.sdp_package
        .replace("${skinPath}", "../resources/compare.json?v=" + currentTimeStamp)
        .replace("${questionPath}", "resources");

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    var questionData = jsonObj.items;
    result.extend_files.push({ name: "compare.json", content: JSON.stringify(questionData) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 竖式计算题型的本地化处理
 * @param tmpl 竖式计算模板
 * @param jsonObj 编辑器传入的原始数据
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function arithmeticParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        .replace("${question_title}", jsonObj.title)
        //.replace("${skin}", "../skins/arithmetic/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/arithmetic.xml?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);

    //sdp-package.xml
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/arithmetic.json?v=" + currentTimeStamp)
        .replace("${questionPath}", "resources");

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "arithmetic.xml", content: covertArithmeticJSONtoXml(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });

    return result;
}

function covertArithmeticJSONtoXml(json) {
    var xmlDoc = new DOMImplementation().createDocument("", "", null);
    //创建两条处理指令
    var newPI = xmlDoc.createProcessingInstruction("xml", "version=\"1.0\" encoding=\"utf-8\"");
    xmlDoc.appendChild(newPI);

    var assessmentItem = xmlDoc.createElement("assessmentItem");
    assessmentItem.setAttribute("xmlns", "http://www.imsglobal.org/xsd/imsqti_v2p1");
    assessmentItem.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    assessmentItem.setAttribute("identifier", "");
    assessmentItem.setAttribute("title", "ND竖式计算题");
    assessmentItem.setAttribute("adaptive", "false");
    assessmentItem.setAttribute("timeDependent", "false");
    assessmentItem.setAttribute("xsi:schemaLocation", "http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/imsqti_v2p1.xsd");

    var rid_index = 0;
    var rid_prefix = "RESPONSE_1-";
    var sequence_fix = "1-";

    if (json.prompt) {
        var itemBody = xmlDoc.createElement("itemBody");
        var data = xmlDoc.createElement("div");
        data.setAttribute("questionType", "data");
        var div1 = xmlDoc.createElement("div");

        if (json.prompt.operator && json.prompt.operator.operator == "/") {
            var result = xmlDoc.createElement("div");
            result.setAttribute("type", "result");
            if (json.prompt.number_result) {
                var items = json.prompt.number_result.items;
                for (var index = 0; index < items.length; index++) {
                    if (!items[index].dot_show && items[index].num == ".") { continue; }

                    if (items[index].hide) {
                        var textEntryInteraction = xmlDoc.createElement("textEntryInteraction");
                        textEntryInteraction.setAttribute("responseIdentifier", rid_prefix + (++rid_index));
                        textEntryInteraction.setAttribute("keyboard", "number");
                        result.appendChild(textEntryInteraction);

                        var responseDeclaration = xmlDoc.createElement("responseDeclaration");
                        responseDeclaration.setAttribute("identifier", rid_prefix + rid_index);
                        responseDeclaration.setAttribute("cardinality", "single");
                        responseDeclaration.setAttribute("baseType", "multipleString");
                        responseDeclaration.setAttribute("sequence", sequence_fix + rid_index);

                        var correctResponse = xmlDoc.createElement("correctResponse");
                        var value = xmlDoc.createElement("value");
                        var text = xmlDoc.createTextNode(items[index].num);
                        value.appendChild(text);
                        correctResponse.appendChild(value);
                        responseDeclaration.appendChild(correctResponse)
                        assessmentItem.appendChild(responseDeclaration);
                    } else {
                        var textNode = xmlDoc.createTextNode(items[index].num);
                        result.appendChild(textNode);
                    }
                }
                div1.appendChild(result);
            }
        }

        var first = xmlDoc.createElement("div");
        first.setAttribute("type", "first");
        if (json.prompt.number_first) {
            var items = json.prompt.number_first.items;
            var dashed = false;
            for (var index = 0; index < items.length; index++) {
                if (!items[index].dot_show && items[index].num == ".") { continue; }
                if (items[index].dot_show && dashed) { continue; }
                if (items[index].dashed && items[index].num !== ".") { continue; }


                if (items[index].hide) {
                    var textEntryInteraction = xmlDoc.createElement("textEntryInteraction");
                    textEntryInteraction.setAttribute("responseIdentifier", rid_prefix + (++rid_index));
                    textEntryInteraction.setAttribute("keyboard", "number");
                    first.appendChild(textEntryInteraction);

                    var responseDeclaration = xmlDoc.createElement("responseDeclaration");
                    responseDeclaration.setAttribute("identifier", rid_prefix + rid_index);
                    responseDeclaration.setAttribute("cardinality", "single");
                    responseDeclaration.setAttribute("baseType", "multipleString");
                    responseDeclaration.setAttribute("sequence", sequence_fix + rid_index);

                    var correctResponse = xmlDoc.createElement("correctResponse");
                    var value = xmlDoc.createElement("value");
                    var text = xmlDoc.createTextNode(items[index].num);
                    value.appendChild(text);
                    correctResponse.appendChild(value);
                    responseDeclaration.appendChild(correctResponse)
                    assessmentItem.appendChild(responseDeclaration);
                } else {
                    var textNode = xmlDoc.createTextNode(items[index].num);
                    first.appendChild(textNode);
                }
                if (items[index].dot_show == true && items[index].dashed == true) {
                    dashed = true;
                }
            }
            div1.appendChild(first);
        }

        var operator = xmlDoc.createElement("div");
        operator.setAttribute("type", "operator");
        if (json.prompt.operator) {
            var text = xmlDoc.createTextNode(json.prompt.operator.operator);
            operator.appendChild(text);
            div1.appendChild(operator);
        }

        var second = xmlDoc.createElement("div");
        second.setAttribute("type", "second");
        if (json.prompt.number_second) {
            var items = json.prompt.number_second.items;

            for (var index = 0; index < items.length; index++) {
                if (!items[index].dot_show && items[index].num == ".") {
                    continue;
                }
                if (items[index].hide) {
                    var textEntryInteraction = xmlDoc.createElement("textEntryInteraction");
                    textEntryInteraction.setAttribute("responseIdentifier", rid_prefix + (++rid_index));
                    textEntryInteraction.setAttribute("keyboard", "number");
                    second.appendChild(textEntryInteraction);

                    var responseDeclaration = xmlDoc.createElement("responseDeclaration");
                    responseDeclaration.setAttribute("identifier", rid_prefix + rid_index);
                    responseDeclaration.setAttribute("cardinality", "single");
                    responseDeclaration.setAttribute("baseType", "multipleString");
                    responseDeclaration.setAttribute("sequence", sequence_fix + rid_index);

                    var correctResponse = xmlDoc.createElement("correctResponse");
                    var value = xmlDoc.createElement("value");
                    var text = xmlDoc.createTextNode(items[index].num);
                    value.appendChild(text);
                    correctResponse.appendChild(value);
                    responseDeclaration.appendChild(correctResponse)
                    assessmentItem.appendChild(responseDeclaration);
                } else {
                    var textNode = xmlDoc.createTextNode(items[index].num);
                    second.appendChild(textNode);
                }
            }
            div1.appendChild(second);
        }

        var procedure = xmlDoc.createElement("div");
        procedure.setAttribute("type", "procedure");
        if (json.prompt.procedure) {
            var procedures = json.prompt.procedure;
            for (var pindex = 0; pindex < procedures.length; pindex++) {
                var offset = xmlDoc.createElement("div");
                offset.setAttribute("offset", procedures[pindex].offset);

                var items = procedures[pindex].items;
                for (var index = 0; index < items.length; index++) {
                    if (!items[index].dot_show && items[index].num == ".") {
                        continue;
                    }
                    if (items[index].hide) {
                        var textEntryInteraction = xmlDoc.createElement("textEntryInteraction");
                        textEntryInteraction.setAttribute("responseIdentifier", rid_prefix + (++rid_index));
                        textEntryInteraction.setAttribute("keyboard", "number");
                        offset.appendChild(textEntryInteraction);

                        var responseDeclaration = xmlDoc.createElement("responseDeclaration");
                        responseDeclaration.setAttribute("identifier", rid_prefix + rid_index);
                        responseDeclaration.setAttribute("cardinality", "single");
                        responseDeclaration.setAttribute("baseType", "multipleString");
                        responseDeclaration.setAttribute("sequence", sequence_fix + rid_index);

                        var correctResponse = xmlDoc.createElement("correctResponse");
                        var value = xmlDoc.createElement("value");
                        var text = xmlDoc.createTextNode(items[index].num);
                        value.appendChild(text);
                        correctResponse.appendChild(value);
                        responseDeclaration.appendChild(correctResponse)
                        assessmentItem.appendChild(responseDeclaration);
                    } else {
                        var textNode = xmlDoc.createTextNode(items[index].num);
                        offset.appendChild(textNode);
                    }
                }
                procedure.appendChild(offset);
            }
            div1.appendChild(procedure);
        }

        if (json.prompt.operator && json.prompt.operator.operator != "/") {
            var result = xmlDoc.createElement("div");
            result.setAttribute("type", "result");
            if (json.prompt.number_result) {
                var items = json.prompt.number_result.items;
                for (var index = 0; index < items.length; index++) {
                    if (!items[index].dot_show && items[index].num == ".") {
                        continue;
                    }
                    if (items[index].hide) {
                        var textEntryInteraction = xmlDoc.createElement("textEntryInteraction");
                        textEntryInteraction.setAttribute("responseIdentifier", rid_prefix + (++rid_index));
                        textEntryInteraction.setAttribute("keyboard", "number");
                        result.appendChild(textEntryInteraction);

                        var responseDeclaration = xmlDoc.createElement("responseDeclaration");
                        responseDeclaration.setAttribute("identifier", rid_prefix + rid_index);
                        responseDeclaration.setAttribute("cardinality", "single");
                        responseDeclaration.setAttribute("baseType", "multipleString");
                        responseDeclaration.setAttribute("sequence", sequence_fix + rid_index);

                        var correctResponse = xmlDoc.createElement("correctResponse");
                        var value = xmlDoc.createElement("value");
                        var text = xmlDoc.createTextNode(items[index].num);
                        value.appendChild(text);
                        correctResponse.appendChild(value);
                        responseDeclaration.appendChild(correctResponse)
                        assessmentItem.appendChild(responseDeclaration);
                    } else {
                        var textNode = xmlDoc.createTextNode(items[index].num);
                        result.appendChild(textNode);
                    }
                }
                div1.appendChild(result);
            }
        }


        var remainder = xmlDoc.createElement("div");
        remainder.setAttribute("type", "remainder");
        if (json.prompt.remainder) {
            var offset = xmlDoc.createElement("div");
            offset.setAttribute("offset", json.prompt.remainder.offset.left_blank);

            var items = json.prompt.remainder.items;
            for (var index = 0; index < items.length; index++) {
                if (!items[index].dot_show && items[index].num == ".") {
                    continue;
                }
                if (items[index].hide) {
                    var textEntryInteraction = xmlDoc.createElement("textEntryInteraction");
                    textEntryInteraction.setAttribute("responseIdentifier", rid_prefix + (++rid_index));
                    textEntryInteraction.setAttribute("keyboard", "number");
                    offset.appendChild(textEntryInteraction);

                    var responseDeclaration = xmlDoc.createElement("responseDeclaration");
                    responseDeclaration.setAttribute("identifier", rid_prefix + rid_index);
                    responseDeclaration.setAttribute("cardinality", "single");
                    responseDeclaration.setAttribute("baseType", "multipleString");
                    responseDeclaration.setAttribute("sequence", sequence_fix + rid_index);

                    var correctResponse = xmlDoc.createElement("correctResponse");
                    var value = xmlDoc.createElement("value");
                    var text = xmlDoc.createTextNode(items[index].num);
                    value.appendChild(text);
                    correctResponse.appendChild(value);
                    responseDeclaration.appendChild(correctResponse)
                    assessmentItem.appendChild(responseDeclaration);
                } else {
                    var textNode = xmlDoc.createTextNode(items[index].num);
                    offset.appendChild(textNode);
                }
            }
            remainder.appendChild(offset);
            div1.appendChild(remainder);
        }
        data.appendChild(div1);
        itemBody.appendChild(data);
        assessmentItem.appendChild(itemBody);
    }
    var outcomeDeclaration = xmlDoc.createElement("outcomeDeclaration");
    outcomeDeclaration.setAttribute("identifier", "SCORE");
    outcomeDeclaration.setAttribute("cardinality", "single");
    outcomeDeclaration.setAttribute("baseType", "float");
    var defaultValue = xmlDoc.createElement("defaultValue");
    var value = xmlDoc.createElement("value");
    var text = xmlDoc.createTextNode("0.0");
    value.appendChild(text);
    defaultValue.appendChild(value);
    outcomeDeclaration.appendChild(defaultValue);

    var responseProcessing = xmlDoc.createElement("responseProcessing");
    responseProcessing.setAttribute("template", "http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct");

    var modalFeedback1 = xmlDoc.createElement("modalFeedback");
    modalFeedback1.setAttribute("showHide", "show");
    modalFeedback1.setAttribute("outcomeIdentifier", "FEEDBACK");
    modalFeedback1.setAttribute("identifier", "showHint");
    modalFeedback1.setAttribute("sequence", "1");

    var modalFeedback2 = xmlDoc.createElement("modalFeedback");
    modalFeedback2.setAttribute("showHide", "show");
    modalFeedback2.setAttribute("outcomeIdentifier", "FEEDBACK");
    modalFeedback2.setAttribute("identifier", "showHint");
    modalFeedback2.setAttribute("sequence", "1");

    assessmentItem.appendChild(outcomeDeclaration);
    assessmentItem.appendChild(responseProcessing);
    assessmentItem.appendChild(modalFeedback1);
    assessmentItem.appendChild(modalFeedback2);

    xmlDoc.appendChild(assessmentItem);
    return (new XMLSerializer()).serializeToString(xmlDoc);
}

/* 标签题的XML生成
 /**
 * 分类题本地化处理
 * @param tmpl
 * @param jsonObj
 */
function classifiedParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/classified/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/classified.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    //sdp-package.xml
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/classified.json?v=" + currentTimeStamp)
        .replace("${resourcePath}", "resources");

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "classified.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });

    return result;
}

/* 标签题的XML生成
 * @param tmpl 颗粒文件模板
 * @param jsonObj 原始Editor请求
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function imageMarkParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${question_title}", jsonObj.title)
        //.replace("${skin}", "../skins/imagemark/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${question_url}", "../resources/imagemark.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    //sdp-package.xml
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/imagemark.json?v=" + currentTimeStamp);

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "imagemark.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 排序题的本地化处理
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function orderParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/seqencing/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/item.xml?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/item.xml?v=" + currentTimeStamp);
    //题目的数据

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "item.xml", content: itemParser.generateOrder(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 表格题的本地化处理
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function tableParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/table/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_url}", "../resources/item.xml?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/item.xml?v=" + currentTimeStamp);
    //题目的数据

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "item.xml", content: itemParser.generateTable(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 记忆卡片的本地化处理
 * @param json 编辑器给出的JSON数据
 * @return
 * {
 *   "main": [Main.xml数据]
 *   "page": [Page.xml数据]
 *   "sdp_package": [sdp_package数据]
 * }
 */
function orderMemorycard(tmpl, jsonObj) {

    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    var questionType = "p2p";
    switch (jsonObj.module_subtype) {
        case "image2text":
            questionType = "p2w";
            break;
        case "image2image":
            questionType = "p2p";
            break;
        case "text2text":
            questionType = "w2w";
            break;
    }
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/memorycard/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_type}", questionType)
        .replace("${question_url}", "../resources/item.xml?v=" + currentTimeStamp)
        //.replace("${spirit_root}", "../skins/memorycard/wood")
        .replace("${spirit_root}", "${ref-path}/memorycard/spirit_root")
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${questionPath}", "resources");
    //题目的数据

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    var questionData = itemParser.generateLinkup(jsonObj);
    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "item.xml", content: questionData });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 连连看的生成
 * @param tmpl
 * @param jsonObj
 */
function linkupParse(tmpl, jsonObj) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    var questionType = "p2p";
    switch (jsonObj.module_subtype) {
        case "image2text":
            questionType = "p2w";
            break;
        case "image2image":
            questionType = "p2p";
            break;
        case "text2text":
            questionType = "w2w";
            break;
    }
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${skin}", "../skins/linkup/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${question_type}", questionType)
        .replace("${question_url}", "../resources/item.xml?v=" + currentTimeStamp)
        //.replace("${spirit_root}", "../skins/linkup/wood")
        .replace("${spirit_root}", "${ref-path}/linkup/spirit_root")
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);
    var sdpPackage = tmplObj.sdp_package.replace("${questionPath}", "resources");
    //题目的数据
    var questionData = itemParser.generateLinkup(jsonObj);

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "item.xml", content: questionData });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });
    return result;
}

/**
 * 分式加减题型的本地化处理
 * @param tmpl 分式加减模板
 * @param jsonObj 编辑器传入的原始数据
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function fractionParse(tmpl, jsonObj) {

    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };


    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    //开始转换
    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);
    //page.xml
    var questionType = "p2p";
    switch (jsonObj.module_subtype) {
        case "image2text":
            questionType = "p2w";
            break;
        case "image2image":
            questionType = "p2p";
            break;
        case "text2text":
            questionType = "w2w";
            break;
    }
    //console.log(pageStr,tmplObj)
    var pageStr = tmplObj.page.replace("${question_id}", jsonObj.id)
        //.replace("${question_title}", jsonObj.title)
        //.replace("${skin}", "../skins/fraction/wood/css/wood.css?v=" + currentTimeStamp)
        .replace("${skin}", "")
        .replace("${timer_type}", jsonObj.timer.timer_type)
        .replace("${time_limit}", jsonObj.timer.time_minute * 60 + parseInt(jsonObj.timer.time_second))
        .replace("${questionType}", questionType)
        .replace("${question_url}", "../resources/fraction.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);

    //sdp-package.xml
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", "../resources/fraction.json?v=" + currentTimeStamp)
        .replace("${questionPath}", "resources");

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "fraction.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });


    return result;
}

/**
 * 公共模板：API-V2接口规范的题型  本地化处理
 * @param tmpl 公共模板
 * @param jsonObj 数据模型
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function commonParse(tmpl, jsonObj, question_type) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };


    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();
    var questionConfig = COMMON_QUESTION_CONFIG[question_type];

    //开始转换
    //template1. main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, jsonObj.id, currentTimeStamp);

    //template2. page.xml
    var pageStr = tmplObj.page.replace(/\$\{addonId\}/g, questionConfig.addonId)
        //.replace("${skin}", (questionConfig.skin ? (questionConfig.skin + "?v=" + currentTimeStamp) : ""))
        .replace("${skin}", "")
        .replace("${question_id}", jsonObj.id)
        .replace("${question_url}", "../resources/item.json?v=" + currentTimeStamp)
        .replace("${hint_url}", "../resources/hint.json?v=" + currentTimeStamp);

    //template3. sdp-package.xml
    var sdpPackage = tmplObj.sdp_package.replace("${skinPath}", questionConfig.skinPath || "");
    var resourcePathBuffer = "";
    if (jsonObj.packages) {
        var packageTemplate = "<add type='${type}' src='${src}' />";
        for (var i = 0; i < jsonObj.packages.length; i++) {
            var packageItem = jsonObj.packages[i];
            resourcePathBuffer += packageTemplate.replace("${type}", packageItem.type).replace("${src}", packageItem.src);
        }
    }
    sdpPackage.replace("${resourcePath}", resourcePathBuffer);

    //获取用户设置的交互提示
    var hintData = getInteractionHints(jsonObj);

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;
    result.extend_files.push({ name: "item.json", content: JSON.stringify(jsonObj) });
    result.extend_files.push({ name: "hint.json", content: JSON.stringify(hintData) });


    return result;
}

/**
 * 思维导图
 * @param tmpl 思维导图颗粒模板
 * @param jsonObj 数据模型
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function mindjetParse(tmpl, jsonObj, question_id) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };
    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();

    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, question_id, currentTimeStamp);

    //page.xml
    var pageStr = tmplObj.page.replace("${questionId}", question_id)
        .replace("${questionData}", "../resources/mindjet.json?v=" + currentTimeStamp);

    //sdp-package.xml
    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = tmplObj.sdp_package;
    result.extend_files.push({ name: "mindjet.json", content: JSON.stringify(jsonObj) });

    return result;
}

/**
 * 图形切割
 * @param tmpl 图形切割颗粒模板
 * @param jsonObj 数据模型
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function graphicsCuttingParse(tmpl, jsonObj, question_id) {
    return generalToolParse(tmpl, jsonObj, question_id, "GraphicsCutting");
}

/**
 * 一般类互动工具
 * @param tmpl 公共模板
 * @param jsonObj 数据模型
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function generalToolParse(tmpl, jsonObj, question_id, addonId) {
    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };
    var tmplObj = JSON.parse(tmpl);
    var currentTimeStamp = (new Date()).valueOf();

    //main.xml
    var mainStr = generateMainXMLContent(tmplObj.main, question_id, currentTimeStamp);

    //page.xml
    var pageStr = tmplObj.page.replace("${question_id}", question_id)
        .replace("${question_url}", "../resources/" + addonId + ".json?v=" + currentTimeStamp)
        .replace(/\$\{addon_id\}/g, addonId);

    //sdp-package.xml
    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = tmplObj.sdp_package;
    result.extend_files.push({ name: addonId + ".json", content: JSON.stringify(jsonObj) });

    return result;
}

function loadTemplate(question_type) {
    var tmpl = fileSystem.readFileSync(Path.join(__dirname, "./tmpls/courseware-object/" + question_type + ".tmpl.json"));
    if (tmpl) {
        return tmpl.toString();
    } else {
        return null;
    }
}


var parser = function(question_type, question_id, originJsonObject) {
    var _question_type, tmpl;

    if (isGeneralTool(question_type)) {
        _question_type = question_type;
        tmpl = loadTemplate(QT_GENERAL_TOOL);
    } else {
        _question_type = convertQuestionType(question_type);
        tmpl = loadTemplate(_question_type);
    }

    switch (_question_type) {
        case QT_TEXT_SELECT:
            return textSelectParse(tmpl, originJsonObject);
        case QT_MAGIC_BOX:
            return magicBoxParse(tmpl, originJsonObject);
        case QT_WORD_PUZZLE:
            return wordPuzzleParse(tmpl, originJsonObject);
        case QT_FILL_BLANK:
            return fillBlankParse(tmpl, originJsonObject);
        case QT_GUESS_WORD:
            return guessWordParse(tmpl, originJsonObject);
        case QT_POINT_SEQUENCING:
            return pointSequencingParse(tmpl, originJsonObject);
        case QT_COMPARE:
            return compareParse(tmpl, originJsonObject);
        case QT_ARITHMETIC:
            return arithmeticParse(tmpl, originJsonObject);
        case QT_CLASSIFIED:
            return classifiedParse(tmpl, originJsonObject);
        case QT_IMAGE_MARK:
            return imageMarkParse(tmpl, originJsonObject);
        case QT_ORDER:
            return orderParse(tmpl, originJsonObject);
        case QT_TABLE:
            return tableParse(tmpl, originJsonObject);
        case QT_MEMORYCARD:
            return orderMemorycard(tmpl, originJsonObject);
        case QT_LINKUP:
            return linkupParse(tmpl, originJsonObject);
        case QT_FRACTION:
            return fractionParse(tmpl, originJsonObject);
        case QT_COMMON:
            return commonParse(tmpl, originJsonObject, question_type);
        case QT_COMICDIALOGUE:
            return comicdialogueParse(tmpl, originJsonObject);
        case QT_MINDJET:
            return mindjetParse(tmpl, originJsonObject, question_id);
        case QT_GRAPHICS_CUTTING:
            return graphicsCuttingParse(tmpl, originJsonObject, question_id);
        default:
            return null;
    }
};

exports.parser = parser;