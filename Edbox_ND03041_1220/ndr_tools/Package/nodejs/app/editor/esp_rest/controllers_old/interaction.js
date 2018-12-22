var nodeUuid = require("node-uuid");
var fileSys = require("fs");
var pathSys = require("path");
var FileUtils = require("./../support/FileUtils");
var http = require("http");
var Q = require("q");
var Client = require('node-rest-client').Client;
var util = require("../common/util");
var utils = require('util');
var InteractionUtils = require("./question_tools/InteractionUtils");
var CoursewareObjectContextCreator = require('./../support/CoursewareObjectContext'); //统一处理路径问题

var Json2XmlParser = require("../common/json2XmlParser");
var SubjectToolParser = require("../common/SubjectToolParser");
var ARCHIVE_FILE_PATH = pathSys.join(CoursewareObjectContextCreator.root,"archive_files");
var CS_STATIC_URL = "http://cs.101.com/v0.1/static";
var $i18n = require("../support/i18n").i18n;
console.log("init interactoin");

/** ****************************** 辅助函数 begin ****************************** */
/**
 * 习题颗粒文件项存储（main.xml、page.xml、sdp-package.xml）
 *
 * @param isSubjectTool 学科工具标识
 * @param req Request请求对象
 * @param question_type 颗粒类型
 * @param uuid 颗粒ID
 * @param origin 颗粒数据
 * @param metaData 元数据
 * @param isEdit  是否为编辑态(只适用于学科工具)
 */
function saveLocalFile(isSubjectTool, req, question_type, uuid, origin, metaData, isEdit) {
    var rootPath = InteractionUtils.getInteractionBase(uuid, req);
    var resourcePath = rootPath + "/resources";
    var pagesPath = rootPath + "/pages";

    //Step1. 初始化颗粒目录
    !fileSys.existsSync(rootPath) && fileSys.mkdirSync(rootPath);
    !fileSys.existsSync(pagesPath) && fileSys.mkdirSync(pagesPath);
    !fileSys.existsSync(resourcePath) && fileSys.mkdirSync(resourcePath);

    //Step2. 创建或更新颗粒数据
    var fileContent;
    if (isSubjectTool) { //学科工具
        var toolName = req.params.module_type;
        fileContent = SubjectToolParser.parser(toolName, uuid, origin, isEdit);
    } else {
        fileContent = Json2XmlParser.parser(question_type, uuid, origin);
    }

    fileSys.writeFileSync(rootPath + "/main.xml", fileContent.main);
    fileSys.writeFileSync(pagesPath + "/" + uuid + ".xml", fileContent.page);
    fileSys.writeFileSync(rootPath + "/sdp-package.xml", fileContent.sdp_package);

    ///Step3. 创建或更新颗粒资源文件
    if (fileContent.extend_files.length > 0) {
        for (var i = 0; i < fileContent.extend_files.length; i++) {
            fileSys.writeFileSync(resourcePath + "/" + fileContent.extend_files[i].name, fileContent.extend_files[i].content);
        }
    }
    if (!(question_type == 'mindjet' || isSubjectTool)) {
        fileSys.writeFileSync(resourcePath + "/editor.json", JSON.stringify(origin));
    }

    //Step4. 更新元数据
    !!metaData && fileSys.writeFileSync(rootPath + "/metadata.json", JSON.stringify(metaData));
}

function loadTemplate() {
    var templateBase = pathSys.join(__dirname, "../template/handwrite/page.xml");
    var result = fileSys.readFileSync(templateBase, "utf-8");
    return result;
}

function replaceByParams(template, params) {
    for (var key in params) {
        var value = params[key];
        var newTemplate = template.replace("{{" + key + "}}", value);
        while (newTemplate != template) {
            template = newTemplate;
            newTemplate = template.replace("{{" + key + "}}", value);
        }
    }
    return template;
}

function headers() {
    return {
        "Content-Type": "application/json;charset=utf-8"
    }
}

function isSubjectToolFn(req, module_type) {

    return req.param('is_subject_tool') === 'true';
}
/**
 * 学科工具插入课件需求[TQD52583_2]，传入的module_type是读取tool.json上对应的toolKey，所以需要在此做个映射处理
 * @param req
 * @param module_type
 * @returns {*}
 */
function handleSubjectToolCode(req, module_type) {
    if (isSubjectToolFn(req, module_type)) {
        if (!module_type.startsWith('nd_')) {

            return 'nd_' + module_type.toLowerCase();
        }
    }

    return module_type;
}
/** ****************************** 辅助函数 end ****************************** */


/** ****************************** API接口声明 begin ****************************** */

/**
 * 创建习题颗粒API
 *
 * @param req
 * @param res
 * @param next
 * @returns {*} 习题颗粒编辑端数据模型
 */
exports.create = function (req, res, next) {
    //检测是否存在趣味习题根目录, 若没有, 创建
    InteractionUtils.createInteractionBase();

    var params = {
        module_type: req.params.module_type == 'compare' ? 'nd_compare' : req.params.module_type,
        isEditable: req.param('isEditable')
    };
    params.module_type = handleSubjectToolCode(req, params.module_type);

    var isSubjectTool = isSubjectToolFn(req, params.module_type);
    var uuid = nodeUuid.v4();
    var metaData = InteractionUtils.createMetaData(params.module_type, uuid, req.body, isSubjectTool);
    var mCode = InteractionUtils.getModuleCode(params.module_type);

    if (isSubjectTool) {
        var toolName = req.params.module_type;
        var result = InteractionUtils.instanceSubjectToolData(toolName, uuid);
        saveLocalFile(true, req, mCode, uuid, result, metaData);

        result.physic_path = pathSys.normalize(InteractionUtils.getInteractionBase(result.id, req));
        result.isEditable = params.isEditable || false;

        return res.send(result);
    } else {
        var result;

        //判断传递输入数据是否为习题数据模型，若不是，则调用instanceModuleData初始化.
        if (!!req.body.nonQuestionData) {
            result = InteractionUtils.instanceModuleData(params.module_type, uuid);
        } else {
            result = req.body;
            result.id = uuid;

            InteractionUtils.updateMetaData(metaData, result.title);
        }

        if (mCode != "") {
            saveLocalFile(false, req, mCode, uuid, result, metaData);

            //连连看、记忆卡片 需要将精灵效果用的数据拷贝到习题包中
            if (params.module_type == "linkup" || params.module_type == "nd_memorycard") {
                InteractionUtils.copySpiritResource(params.module_type, uuid, req);
            }
        }

        //思维导图、图形切割
        if (InteractionUtils.isGeneralTool(params.module_type)) {
            result = {"id": uuid};
        }
        result.physic_path = pathSys.normalize(InteractionUtils.getInteractionBase(result.id, req));

        return res.send(result);
    }
};

function getEditorJsonFromLocale(resourcePath, params) {
    var result = {}, editorJsonPath = resourcePath + "/editor.json";
    if (fileSys.existsSync(editorJsonPath)) {
        var editor = fileSys.readFileSync(editorJsonPath);
        if (editor) {
            result = JSON.parse(editor.toString());

            if(!result.interaction_hints) {
                try {
                    var hintJsonPath = resourcePath + "/hint.json";
                    if (fileSys.existsSync(hintJsonPath)) {
                        var hintContent = fileSys.readFileSync(hintJsonPath);
                        if (!!hintContent) {
                            var hintObj = JSON.parse(hintContent);
                            result.interaction_hints = hintObj.hints;
                        }
                    }
                } catch (e) {
                }
            }
        }
    } else {
        /**
         * 针对备课系统上编辑的趣味习题(API-V02接口创建的习题)
         * 1. 根据pages/page.xml目录下的第一个name=question_url节点的 value属性获取 .json文件名
         * 2. 查找.json文件（hint.json除外）当做编辑端的输入数据模型
         * @type {{}}
         */
        if (!InteractionUtils.isUnsupportedReedit(params.module_type)) {
            var files = fileSys.readdirSync(resourcePath);
            files.forEach(function (item) {
                if (InteractionUtils.isEditorDataFile(item)) {
                    editorJsonPath = resourcePath + "/" + item;
                    if (fileSys.existsSync(editorJsonPath)) {
                        var editor = fileSys.readFileSync(editorJsonPath);
                        if (editor) {
                            result = JSON.parse(editor.toString());
                        }
                    }
                }
            });
        }
    }

    return result;
}

function getEditorJsonFromRemote(resourcePath, params) {
    var deferred = Q.defer(),
        editorJsonPath = resourcePath + "/editor.json";

    http.get(editorJsonPath, function (res) {
        res.on('data', function (data) {
            var formatData = data.toString();
            if(formatData.indexOf('${ref-path}') < 0) {
                deferred.resolve(JSON.parse(formatData));
            } else {
                http.get(resourcePath + "/_ref", function (response) {
                    response.on('data', function (data2) {
                        var rtnData = JSON.parse(data2);
                        if(rtnData.code === 'CS/DOWNLOAD_DENTRY_NOT_FOUND') { //无_ref目录,在线创建的习题
                            deferred.resolve(JSON.parse(formatData.replace(/\$\{ref-path\}/g, CS_STATIC_URL)));
                        } else { //离线创建的习题
                            deferred.resolve(JSON.parse(formatData.replace(/\$\{ref-path\}/g, resourcePath)));
                        }
                    });
                });
            }
        });
    });

    return deferred.promise;
}

/**
 * 获取习题颗粒API
 *
 * @param req
 * @param res
 * @param next
 * @returns {*} 习题颗粒编辑端数据模型
 */
exports.get = function (req, res, next) {
    var result,
        params = {
            module_type: req.params.module_type,
            module_instance_id: req.params.module_instance_id
        },
        resourcePath = InteractionUtils.getInteractionBase(params.module_instance_id, req) + "/resources";

    if (resourcePath.indexOf("http://") < 0) {
        result = getEditorJsonFromLocale(resourcePath, params);
        result.physic_path = pathSys.normalize(InteractionUtils.getInteractionBase(req.params.module_instance_id, req));

        return res.send(result);
    } else {
        getEditorJsonFromRemote(resourcePath, params).then(function (result) {
            result.physic_path = pathSys.normalize(InteractionUtils.getInteractionBase(req.params.module_instance_id, req));
            res.send(result)
        });

        return;
    }
};

/**
 * 保存数据前的一些操作
 * @param params
 * @param data
 * @private
 */
var beforeSaveData = function (req, params, data) {
    //标签题
    if (params.module_type == "nd_imagemark") {
        data.background = "<img src='" + data.image_item.asset + "' ";
        for (var item in data.image_item.other) {
            data.background += item + "='" + data.image_item.other[item] + "' ";
        }

        data.background += "/>";
    }

    //更新元数据
    var metaData = InteractionUtils.readMetaData(params.module_instance_id, req);
    var title = data.title;
    if (params.module_type === "nd_mindjet") { //思维导图
        if (!!data.root && !!data.root.data && !!data.root.data.text) {
            title = data.root.data.text;
        }
    }
    InteractionUtils.updateMetaData(metaData, title);

    return metaData;
};
/**
 * 更新习题颗粒API
 *
 * @param req
 * @param res
 * @param next
 * @returns {*} 习题颗粒编辑端数据模型
 */
exports.modify = function (req, res, next) {
    var params = {
        module_type: req.params.module_type,
        module_instance_id: req.params.module_instance_id
    };
    var data = req.body;
    var mCode = InteractionUtils.getModuleCode(params.module_type);
    if (mCode != "") {
        //保存数据前的一些操作
        var metaData = beforeSaveData(req, params, data);

        //保存数据
        saveLocalFile(false, req, mCode, params.module_instance_id, data, metaData);

        //连连看、记忆卡片 需要将精灵效果用的数据拷贝到习题包中
        if (params.module_type == "linkup" || params.module_type == "nd_memorycard") {
            InteractionUtils.copySpiritResource(params.module_type, params.module_instance_id, req);
        }
    }

    //针对一般类互动工具，直接返回命令对象
    if (InteractionUtils.isGeneralTool(params.module_type)) {

        return InteractionUtils.returnCommder(req, res, params);
    } else {

        return res.send(data);
    }
};

/**
 * 更新学科工具颗粒API
 *
 * @param req
 * @param res
 * @param next
 * @returns {*} 命令对象
 */
exports.modifySubjectTool = function (req, res, next) {
    var data = req.body;
    var params = {
        module_type: req.params.module_type,
        module_instance_id: req.params.module_instance_id
    };

    //更新元数据
    var metaData = InteractionUtils.readMetaData(params.module_instance_id, req);
    InteractionUtils.updateMetaData(metaData, data.title);

    //保存数据
    saveLocalFile(true, req, null, params.module_instance_id, data, metaData, true);

    return InteractionUtils.returnCommder(req, res, params, true);
};

/**
 * 动态创建题目
 *
 * @param req
 * @param res
 */
exports.dynamicCreateQuestion = function (req, res) {
    var physicPath = null;
    var questionId = null;
    var template_code = req.body.questionCode;
    //截图图片URL
    var imgUrl = req.body.imgUrl;
    //截图图片的宽度
    var imgWidth = req.body.imgWidth;
    //截图图片的高度
    var imgHeight = req.body.imgHeight;
    var chapterId = req.body.chapterId;
    var chapterName = req.body.chapterName;
    var creator = req.body.creator;
    var protocolHost = 'http://' + req.headers.host;
    var client = new Client();

    //1、创建基础题型
    var url = protocolHost + '/v2.0/courseware_objects/actions/from_template?template_code=' + template_code;
    if (!!chapterId) {
        url = url + '&chapter_id=' + chapterId;
    }
    if (!!chapterName) {
        url = url + '&chapter_name=' + encodeURIComponent(chapterName);
    }
    if (!!creator) {
        url = url + '&creator=' + creator;
    }
    client.post(url, {headers: headers()}, function (data) {
        physicPath = data.physic_path;
        CoursewareObjectContextCreator.getContext({query: {file_path: physicPath}}).then(function (context) {
            //图片要保存到resources下面
            var suffix = imgUrl.substring(imgUrl.lastIndexOf('.') + 1);
            var fileName = new Date().getTime() + '.' + suffix;
            var path = physicPath + '\\resources\\';
            FileUtils.copy(imgUrl, path + fileName, true).then(function (target) {
                var targetUrl = context.fileToRefUrl(target);
                //手写题型
                if (template_code == 'nd_handwritequestion') {
                    questionId = context.id;
                    var template = loadTemplate();
                    var writerJson = {
                        content: "<p></p>",
                        isWhole: 1,
                        background: {
                            "url": targetUrl,
                            "type": 3,
                            "left": 0,
                            "top": 0,
                            "right": 0,
                            "bottom": 0,
                            "width": imgWidth,
                            "height": imgHeight
                        }
                    }
                    var handwriteparams = {
                        question_id: context.id,
                        question_prompt: writerJson.content,
                        background_content: JSON.stringify(writerJson.background),
                        is_whole: writerJson.isWhole
                    };
                    FileUtils.saveToFile(pathSys.join(context.basepath, "pages/" + context.id + ".xml"), replaceByParams(template, handwriteparams)).then(function () {
                        res.send({physicPath: physicPath, questionId: questionId});
                    }).catch(function (err) {
                        res.status(500).send({physicPath: null, questionId: null, errorMsg: '保存题目失败'});
                    });
                    return;
                } else {
                    //2、获取题目数据
                    questionId = data.identifier;
                    url = protocolHost + '/v1.3/questions/' + data.identifier + '/item?file_path=' + encodeURIComponent(data.physic_path);
                    client.get(url, {headers: headers()}, function (data2) {
                        switch (template_code) {
                            //单选题
                            case 'choice':
                                data2.responses = [];
                                data2.items[0].prompt = '<p><img src="' + targetUrl + '"/></p>';
                                for (var i = data2.items[0].choices.length; i < 6; i++) {
                                    data2.items[0].choices.push({
                                        "identifier": String.fromCharCode(65 + i),
                                        "fixed": true,
                                        "text": "<p></p>\n",
                                        "group_id": "",
                                        "correct": false,
                                        "match_max": 1
                                    });
                                }
                                break;
                            //判断题型
                            case 'judge':
                                data2.responses = [];
                                data2.items[0].prompt = '<p><img src="' + targetUrl + '"/></p>';
                                for (var i = 0, iLen = data2.items[0].choices.length; i < iLen; i++) {
                                    if (data2.items[0].choices[i].identifier == 'YES') {
                                        data2.items[0].choices[i].text = $i18n('interaction.dynamic.create.question.yes');
                                    } else {
                                        data2.items[0].choices[i].text = $i18n('interaction.dynamic.create.question.no');
                                    }
                                }
                                break;
                            case 'subjectivebase':
                                data2.responses = [];
                                data2.items[0].prompt = '<div class="subjectivebase_text"><p><img src="' + targetUrl + '"/></p></div><div class="subjectivebase_asset"></div>';
                                break;
                            default:
                                res.send({physicPath: null, questionId: null, errorMsg: '不支持的该题型:' + template_code});
                                return;
                        }
                        //3、保存题目数据
                        client.put(url, {data: data2, headers: headers()}, function (data3) {
                            res.send({physicPath: physicPath, questionId: questionId});
                        })
                    });
                }

            }).catch(function (err) {
                res.send({physicPath: null, questionId: null, errorMsg: '复制图片失败'});
            });
        });


    });
};

/**
 * presenter 重力悬挂的用户向导，首次打开才显示用户向导
 * @param req
 * @param res
 */
exports.moduleMeasureGravityUserGuide = function (req, res) {
    FileUtils.readFile(pathSys.join(__dirname, 'MeasureGravity.json')).then(function (content) {
        var config = null;
        try {
            config = JSON.parse(content);
        } catch (e) {
            config = {};
        }
        //判断有没有值
        if (config.opened) {
            return true;
        } else {
            config.opened = true;
            return FileUtils.saveToFile(pathSys.join(__dirname, 'MeasureGravity.json'), JSON.stringify(config)).then(function () {
                return false;
            });
        }
    }).then(function (opened) {
        res.send({opened: opened});
    });
};

/**
 * 习题颗粒-素材资源上传
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.uploadRefAsset = function (req, res, next) {
    var params = {
        module_instance_id: req.params.module_instance_id
    };

    var uuid = nodeUuid.v4();
    var file = req.files.file;

    var assetsPath = InteractionUtils.getInteractionBase(params.module_instance_id, req) + '/_ref/edu/esp/assets/';
    InteractionUtils.mkdirsSync(assetsPath);

    var extend = file.name.split('.')[1];
    var targetFile = assetsPath + uuid + '.' + extend;
    var readStream = fileSys.createReadStream(file.path);
    var writeStream = fileSys.createWriteStream(targetFile);

    utils.pump(readStream, writeStream, function () {
        fileSys.unlinkSync(file.path);
    });

    return res.send('${ref-path}/edu/esp/assets/' + uuid + '.' + extend);
};

/**
 * 习题颗粒-素材资源读取
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.getRefAsset = function (req, res, next) {
    var fromRefBase = req.query.from_ref_base;
    var filepath = req.query.filepath;
    var module_instance_id = req.params.module_instance_id;
    if (!module_instance_id) {
        return res.status(400).send({code: "LS/MISSING_QUESTION_ID", message: "参数不正确，缺少习题ID。"});
    }
    if (filepath && filepath.indexOf("?") != -1) {
        filepath = filepath.substring(0, filepath.indexOf("?"));
    }
    if (filepath && filepath.indexOf("/") === 0) {
        filepath = filepath.substring(1);
    }

    var realPath = InteractionUtils.getInteractionBase(module_instance_id, req);
    if (fromRefBase == 'true') {
        realPath += filepath;
    } else {
        realPath += '_ref/' + filepath;
    }

    return res.sendFile(pathSys.resolve(realPath));
};

/**
 * 文件上传(文件存放目录：ARCHIVE_FILE_PATH)
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.saveAchiveFile = function (req, res, next) {
    try {
        var params = {
            file_name: req.params.file_name
        };

        var filePath = ARCHIVE_FILE_PATH + params.file_name;

        if (!fileSys.existsSync(ARCHIVE_FILE_PATH)) {
            fileSys.mkdirSync(ARCHIVE_FILE_PATH);
        }

        fileSys.writeFileSync(filePath, JSON.stringify(req.body));

        return res.send("success");
    } catch (err) {
        return res.send("fail");
    }
};

/**
 * 文件读取(文件存放目录：ARCHIVE_FILE_PATH)
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.loadAchiveFile = function (req, res, next) {
    var params = {
        file_name: req.params.file_name
    };
    var result;
    var filePath = ARCHIVE_FILE_PATH + params.file_name;

    if (fileSys.existsSync(ARCHIVE_FILE_PATH) && fileSys.existsSync(filePath)) {
        var fileContent = fileSys.readFileSync(filePath);

        if (fileContent) {
            result = fileContent.toString();
        } else {
            result = null;
        }
    } else {
        result = null;
    }

    return res.send(result);
};
