var fileSystem = require('fs');
var Path = require("path");
var TOOL_NAME_DICE = "Dice";

/**
 * Load subject-tool-launcher.tmpl
 * @returns {*}
 */
function loadTemplate() {
    var tmpl = fileSystem.readFileSync(Path.join(__dirname, "./tmpls/courseware-object/subject-tool-launcher.tmpl.json"));

    if (tmpl) {
        return tmpl.toString();
    } else {
        return null;
    }
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
 * 生成模板数据
 *
 * @param questionId
 * @param toolName
 * @param initModel
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function generateResult(questionId, toolName, initModel) {
    var template = loadTemplate();

    var result = {
        main: "",
        page: "",
        sdp_package: "",
        extend_files: []
    };

    var templateObject = JSON.parse(template);
    var currentTimeStamp = new Date().valueOf();

    //main.xml
    var mainStr = generateMainXMLContent(templateObject.main, questionId, currentTimeStamp);

    //page.xml
    var pageStr = templateObject.page.replace("${questionId}", questionId)
        .replace("${toolName}", toolName)
        .replace("${initModel}", JSON.stringify(initModel));

    //sdp_package.xml
    var sdpPackage = templateObject.sdp_package;

    result.main = mainStr;
    result.page = pageStr;
    result.sdp_package = sdpPackage;

    return result;
}

/**
 * 满足学科工具通用结构
 *
 * @param questionId
 * @param questionModel
 * @returns {*}
 */
function dataModelParser(toolName, questionId, questionModel, isEdit) {
    var initModel = [
        {
            "name": "question_id",
            "displayName": "题目ID",
            "type": "string",
            "value": questionId,
            "isLocalized": false
        },
        {
            "name": "question_url",
            "displayName": "题目内容",
            "type": "json",
            "text": isEdit ? "{}" : JSON.stringify(questionModel),
            "isLocalized": false
        }
    ];
    isEdit && initModel.push(questionModel);

    return generateResult(questionId, toolName, initModel);
}
/**
 * 掷骰子
 * @param questionId
 * @returns {{main: string, page: string, sdp_package: string, extend_files: Array}}
 */
function diceDataModelParser(questionId, questionModel, isEdit) {
    var initModel = [
        {
            "name": "question_id",
            "displayName": "题目ID",
            "type": "string",
            "value": questionId,
            "isLocalized": false
        },
        {
            "name": "stat_mode",
            "displayName": "统计模式",
            "type": "string",
            "value": "none",
            "isLocalized": false
        }
    ];
    isEdit && initModel.push(questionModel);

    return generateResult(questionId, TOOL_NAME_DICE, initModel);
}
var parser = function (toolName, questionId, questionModel, isEdit) {
    var result = null;
    switch(toolName) {
        case TOOL_NAME_DICE:
            result = diceDataModelParser(questionId, questionModel, isEdit);

            break;
        default:
            result = dataModelParser(toolName, questionId, questionModel, isEdit);
    }

    return result;
};

exports.parser = parser;
