var fileSys = require("fs");
var pathSys = require("path");
var CoursewareObjectContextCreator = require('./../../support/CoursewareObjectContext');
var INTERACTION_BASE = CoursewareObjectContextCreator.root + "/interaction/";
var SUBJECT_TOOL_CONFIG = CoursewareObjectContextCreator.serverRoot + "/prepare/tool.json";
var EDITABLE_SUBJECT_TOOL_TEMPLATE = "EditableSubjectTool";

var interationInfoList = [
    {"code": "$RE0401", "label": "连连看", "module_type": "linkup", "module_code": "linkup"},
    {"code": "$RE0402", "label": "排序题", "module_type": "nd_order", "module_code": "order"},
    {"code": "$RE0403", "label": "表格题", "module_type": "nd_table", "module_code": "table"},
    {"code": "$RE0406", "label": "字谜游戏", "module_type": "nd_wordpuzzle", "module_code": "word-puzzle"},
    {"code": "$RE0407", "label": "记忆卡片", "module_type": "nd_memorycard", "module_code": "memory-card"},
    {"code": "$RE0408", "label": "竖式计算", "module_type": "nd_arithmetic", "module_code": "arithmetic"},
    {"code": "$RE0409", "label": "比较大小", "module_type": "nd_compare", "module_code": "compare"},
    {"code": "$RE0410", "label": "猜词游戏", "module_type": "nd_guessword", "module_code": "guess-word"},
    {"code": "$RE0411", "label": "魔方盒游戏", "module_type": "nd_magicbox", "module_code": "magic-box"},
    {"code": "$RE0414", "label": "文本选择题", "module_type": "nd_textselect", "module_code": "text-select"},
    {"code": "$RE0415", "label": "分类题", "module_type": "nd_classified", "module_code": "classified"},
    {"code": "$RE0416", "label": "分式加减", "module_type": "nd_fraction", "module_code": "fraction"},
    {"code": "$RE0418", "label": "点排序", "module_type": "nd_pointsequencing", "module_code": "point-sequencing"},
    {"code": "$RE0421", "label": "选词填空题", "module_type": "nd_fillblank", "module_code": "fill-blank"},
    {"code": "$RE0423", "label": "连环填空", "module_type": "nd_sequencefill", "module_code": "sequence-fill"},
    {"code": "$RE0424", "label": "标签题", "module_type": "nd_imagemark", "module_code": "image-mark"},
    {"code": "$RE0425", "label": "划词标记", "module_type": "nd_highlightmark", "module_code": "highlight-mark"},
    {"code": "$RE0426", "label": "抽卡牌", "module_type": "nd_probabilitycard", "module_code": "probabilitycard"},
    {"code": "$RE0427", "label": "摸球", "module_type": "nd_catchball", "module_code": "catchball"},
    {"code": "$RE0429", "label": "天平", "module_type": "nd_balance", "module_code": "balance"},
    {"code": "$RE0430", "label": "植树", "module_type": "nd_planting", "module_code": "planting"},
    {"code": "$RE0431", "label": "模拟时钟", "module_type": "nd_clock", "module_code": "clock"},
    {"code": "$RE0432", "label": "方块塔", "module_type": "nd_lego", "module_code": "lego"},
    {"code": "$RE0442", "label": "拼图工具", "module_type": "nd_puzzle", "module_code": "puzzle"},
    {"code": "$RE0446", "label": "四格漫画", "module_type": "nd_comicdialogue", "module_code": "comicdialogue"},
    {"code": "$RE0447", "label": "数轴题", "module_type": "nd_mathaxis", "module_code": "mathaxis"},
    {"code": "$RE0451", "label": "连字拼诗", "module_type": "nd_spellpoem", "module_code": "spellpoem"},
    {"code": "$RE0452", "label": "区间题", "module_type": "nd_intervalproblem", "module_code": "intervalproblem"},
    {"code": "$RE0448", "label": "计数器", "module_type": "nd_counter", "module_code": "counter"},
    {"code": "$RE0434", "label": "英语句子发音评测", "module_type": "nd_sentence_evaluat", "module_code": "sentence_evaluat"},
    {
        "code": "$RE0443",
        "label": "英语句子发音评测",
        "module_type": "nd_section_evaluating",
        "module_code": "section_evaluating"
    },
    {"code": "$RE0444", "label": "算盘", "module_type": "nd_abacus", "module_code": "abacus"},
    {"code": "$RE0449", "label": "组词题", "module_type": "nd_makeword", "module_code": "makeword"},
    {"code": "$RE0453", "label": "思维导图", "module_type": "nd_mindjet", "module_code": "mindjet"},
    {"code": "$RE0428", "label": "英语单词发音评测", "module_type": "nd_speechevaluating", "module_code": "speechevaluating"},
    {"code": "$RE0435", "label": "图形切割", "module_type": "nd_graphicscutting", "module_code": "graphicscutting"},
    {"code": "$RE0454", "label": "立体展开还原", "module_type": "nd_openshapetool", "module_code": "openshapetool"}
];

//一般互动工具类列表
var generalToolsList = ["nd_mindjet"];
var isGeneralTool = function (quesiton_type) {

    return generalToolsList.indexOf(quesiton_type) > -1;
};

//不支持离线重新编辑的在线备课系统创建的习题列表
var unReeditableModuleTypes = [
    "linkup",          //连连看
    "nd_memorycard",   //记忆卡片
    "nd_order",        //排序题
    "nd_table",        //分类表格题
    "nd_arithmetic",   //竖式计算
    "nd_compare"       //比大小
];

var isUnsupportedReedit = function (module_type) {
    for (var i = 0; i < unReeditableModuleTypes.length; i++) {
        if (module_type === unReeditableModuleTypes[i]) {
            return true;
        }
    }

    return false;
};

var getInteractionInfo = function (mType) {
    for (var i = 0; i < interationInfoList.length; i++) {
        if (interationInfoList[i].module_type == mType) {
            return interationInfoList[i];
        }
    }

    return {code: '', label: '学科工具', module_type: mType, module_code: mType};
};

var getModuleCode = function (mType) {
    var interaction = getInteractionInfo(mType);

    return interaction.module_code;
};

//function replicateArray(object, size) {
//    var array = [];
//    for (var i = 0; i < size; i++) array.push(object);
//
//    return array;
//}

/**
 * 初始化学科工具数据
 *
 * @param toolName 工具编码
 * @param uuid 颗粒ID
 * @returns {{id: *, title: string}}
 */
var instanceSubjectToolData = function (toolName, uuid) {
    var result = {
        "id": uuid,
        "title": "学科工具"
    };

    if (fileSys.existsSync(SUBJECT_TOOL_CONFIG)) {
        var content = fileSys.readFileSync(SUBJECT_TOOL_CONFIG);
        if (!!content) {
            var subjectToolConfig = JSON.parse(content.toString());
            var toolInfo = subjectToolConfig[toolName];
            if (!!toolInfo) {
                result.title = toolInfo.title;

                var initModel = toolInfo['init_model'];
                if (!!initModel) {
                    for (var key in initModel) {
                        if (initModel.hasOwnProperty(key)) {
                            result[key] = initModel[key];
                        }
                    }
                }
            }
        }
    }

    return result;
};

//初始化互动习题数据
var instanceModuleData = function (module_type, uuid) {
    var result;
    switch (module_type) {
        case "nd_textselect": //文本选择
        case "nd_arithmetic": //竖式计算
        case "nd_fraction":   //分式加减
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "prompt": null
            };

            break;
        case "nd_magicbox": //魔方盒
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "chars": [],
                "border": {"width": 0, "height": 0},
                "words": []
            };

            break;
        case "nd_wordpuzzle": //字谜游戏
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "border": {"width": 7, "height": 7},
                "words": [],
                "chars": []
            };

            break;
        case "nd_fillblank": //选词填空
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "candidates": [],
                "article": ""
            };

            break;
        case "nd_guessword": //猜词游戏
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "items": null
            };

            break;
        case "nd_compare": //比大小
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "items": null
            };

            break;
        case "nd_pointsequencing": //点排序
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "points": null,
                "background": null
            };

            break;
        case "nd_classified": //分类题
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "categories": [{"id": "", "name": "", "items": []}, {"id": "", "name": "", "items": []}],
                "classified_options": []
            };

            break;
        case "nd_imagemark": //标签题
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "background": "",
                "image_item": {"text": "", "asset_type": "", "asset": "", "other": {}},
                "mark_type": null,
                "tags": null
            };

            break;
        case "nd_order": //新排序题
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "items": [],
                "description": {
                    "text": "",
                    "asset_type": "",
                    "asset": "",
                    "image_extend": {
                        "asset": "",
                        "image_extend": {
                            "resize": ""
                        }
                    }
                }
            };

            break;
        case "nd_table": //分类表格题
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "horizontal_items": [""],
                "vertical_items": ["", ""],
                "items": [],
                "description": {
                    "text": "",
                    "asset": "",
                    "image_extend": {
                        "rotate": "",
                        "resize": ""
                    }
                }
            };

            break;
        case "linkup": //连连看、记忆卡片
        case "nd_memorycard":
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "module_subtype": "",
                "items": []
            };

            break;
        case "nd_puzzle":              //拼图工具
        case "nd_mathaxis":            //数轴题
        case "nd_intervalproblem":     //区间题
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "properties": [	//模块静态数据模型
                    {
                        "name": "question_id",
                        "display_name": "题目ID",
                        "type": "string",
                        "value": "",
                        "is_localized": false
                    },
                    {
                        "name": "question_url",
                        "display_name": "题目内容",
                        "type": "jsonFile",
                        "value": "",
                        "is_localized": false
                    }
                ],
                "content": {}
            };

            break;
        case "nd_comicdialogue": //四格漫画
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "content": {
                    "allow_addtip": false,
                    "title": "",
                    "desc": "",
                    "background": {
                        "url": "",
                        "scale": 1
                    },
                    "dialogues": []
                }
            };

            break;
        case "nd_spellpoem": //连字拼诗
            result = {
                "id": uuid,
                "module_code": "nd_spellpoem", // 题目类型
                "title": "", //标题
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "content": { //Editor数据模型正文
                    "title": "",
                    "author": "",
                    "dynasty": "",
                    "sentences": [
                        {"words": ""},
                        {"words": ""},
                        {"words": ""},
                        {"words": ""}
                    ]
                }
            };

            break;
        case "nd_mindjet": //思维导图
        case "nd_graphicscutting": //图形切割
            result = {};

            break;
        default:
            result = {
                "id": uuid,
                "title": "",
                "skin": {"code": "", "css_url": "", "package_url": "", "name": ""},
                "timer": {"timer_type": "sequence", "time_minute": null, "time_second": null},
                "properties": [	//模块静态数据模型
                    {
                        "name": "question_id",
                        "display_name": "题目ID",
                        "type": "string",
                        "value": "",
                        "is_localized": false
                    },
                    {
                        "name": "question_url",
                        "display_name": "题目内容",
                        "type": "jsonFile",
                        "value": "",
                        "is_localized": false
                    }
                ],
                "content": {}
            };
    }

    return result;
};

//针对一般类互动工具，直接返回命令对象
var returnCommder = function (req, res, params, isModify) {
    var interactionInfoObj = getInteractionInfo(params.module_type);
    var _data = {
        message: "QuestionAdd",
        id: params.module_instance_id,
        question_type: interactionInfoObj.module_type,
        question_code: interactionInfoObj.code,
        action: "save",
        file_path: pathSys.normalize(getInteractionBase(params.module_instance_id, req))
    };

    var commandText = "";
    if (!!isModify || req.param("is_modify") === "true") {
        _data.message = "QuestionSaved";
        commandText = "PCInterface.questionEdit('" + JSON.stringify(_data).replace(/\\/g, "\\\\") + "')";
    } else {
        commandText = "PCInterface.questionInsert('" + JSON.stringify(_data).replace(/\\/g, "\\\\") + "')";
    }

    return res.send({isInterface: true, text: commandText});
};

var isEditorDataFile = function (item) {
    if (item != 'hint.json' && item.indexOf('.json') > -1) {
        return true;
    }

    return false;
};

function removeTailDiagonal(content) {
    if (!!content) {
        if (content.lastIndexOf("/") != content.length - 1) {
            content = content + "/";
        }
    }

    return content;
}

function getModulePackage(module_id) {
    return module_id + ".pkg";
}

//习题根目录，存放main.xml
var getInteractionBase = function (id, req) {
    var filePath = req.param('file_path');
    if (!!filePath) {
        return removeTailDiagonal(filePath);
    } else {
        var base = req.param('question_base');
        if (!base) {
            //离线编辑器本地服务下的趣味习题存放目录
            base = pathSys.join(INTERACTION_BASE, getModulePackage(id)) + "/";

            return base;
        } else {

            return removeTailDiagonal(base) + getModulePackage(id) + "/";
        }
    }
};

/** ****************************** 文件系统管理 begin ****************************** */
//同步创建多级目录
var mkdirsSync = function (fullDir, mode) {
    if (!!fullDir && !fileSys.existsSync(fullDir)) {
        var parentDir;
        fullDir.split(/\/|\\/g).forEach(function (subDir) {
            if (parentDir) {
                parentDir = parentDir + pathSys.sep + subDir;
            } else {
                parentDir = subDir;
            }

			if(!!parentDir) {
				if (!fileSys.existsSync(parentDir)) {
					if (!fileSys.mkdirSync(parentDir, mode)) {

						return false;
					}
				}
			}
        });
    }

    return true;
};

//递归拷贝文件夹
var copyDirectory = function (dist, src) {
    mkdirsSync(dist);

    var files = fileSys.readdirSync(src);
    files.forEach(function (item) {
        var srcPath = src + "/" + item;
        if (fileSys.lstatSync(srcPath).isDirectory()) {
            copyDirectory(dist + "/" + item, srcPath);
        } else {
            copyFile(dist + "/" + item, srcPath);
        }
    });
};

//递归文件
var copyFile = function (dist, src) {
    var rs = fileSys.createReadStream(src);
    var ws = fileSys.createWriteStream(dist);

    rs.pipe(ws);
};

var createInteractionBase = function () {
    mkdirsSync(INTERACTION_BASE);
};

//针对连连看，记忆卡片需要拷贝精灵动画所需资源
var copySpiritResource = function (moduleType, uuid, req) {
    var sourceRoot = pathSys.join(__dirname, "../../skins");
    var spiritRoot;
    if (moduleType == "linkup") {
        spiritRoot = getInteractionBase(uuid, req) + '/_ref/linkup/spirit_root/';
    } else {
        spiritRoot = getInteractionBase(uuid, req) + '/_ref/memorycard/spirit_root/';
    }

    if (!fileSys.existsSync(spiritRoot)) {
        mkdirsSync(spiritRoot);

        if (moduleType == "linkup") { //连连看、记忆卡片 需要将精灵效果用的数据拷贝到习题包中
            copyFile(spiritRoot + "/default_img.jpg", sourceRoot + "/linkup/wood/default_img.jpg");
            copyFile(spiritRoot + "/game_canvas_bg.png", sourceRoot + "/linkup/wood/game_canvas_bg.png");
            copyFile(spiritRoot + "/skin.json", sourceRoot + "/linkup/wood/skin.json");

            copyDirectory(spiritRoot + "/effects", sourceRoot + "/linkup/wood/effects");
        } else if (moduleType == "nd_memorycard") {
            copyFile(spiritRoot + "/default_img.jpg", sourceRoot + "/memorycard/wood/default_img.jpg");
            copyFile(spiritRoot + "/game_canvas_bg.png", sourceRoot + "/memorycard/wood/game_canvas_bg.png");
            copyFile(spiritRoot + "/game_canvas_ft.png", sourceRoot + "/memorycard/wood/game_canvas_ft.png");
            copyFile(spiritRoot + "/skin.json", sourceRoot + "/memorycard/wood/skin.json");

            copyDirectory(spiritRoot + "/effects", sourceRoot + "/memorycard/wood/effects");
        }
    }
};
/** ****************************** 文件系统管理 end ****************************** */


/** ****************************** 元数据管理 begin ****************************** */
/**
 * 获取趣味习题元数据
 * @param mType 题型类型 参照interationList的module_type
 * @param uuid  习题ID
 * @param metaInfo 基础元数据
 * @param isEditableSubjectTool 是否为可编辑学科工具
 * @returns {*}
 */
var createMetaData = function (mType, uuid, metaInfo, isEditableSubjectTool) {
    metaInfo = metaInfo || {};

    var interaction = getInteractionInfo(mType);
    if (!!interaction) {
        var metaData = {
            "identifier": uuid,
            "title": interaction.label,
            "description": "<p>" + interaction.label + "</p>",
            "language": "zh_CN",
            "preview": {},
            "tags": [],
            "keywords": [],
            "question_type": interaction.module_type,
            "custom_properties": {
                "question_type": interaction.module_type
            },
            "categories": {
                "res_type": [
                    {
                        "identifier": "c2397920-3bb5-4269-9231-a5fade63ab0b",
                        "taxonpath": null,
                        "taxonname": "游戏化习题",
                        "taxoncode": "$RE0400"
                    },
                    {
                        "identifier": uuid,
                        "taxonpath": null,
                        "taxonname": interaction.label,
                        "taxoncode": interaction.code
                    },
                    {
                        "identifier": "55c21f2f-8715-4a96-bc45-7cd269bbd1ab",
                        "taxonpath": null,
                        "taxonname": "课件颗粒",
                        "taxoncode": "$RT0204"
                    }
                ],
                "mediatype": [
                    {
                        "identifier": null,
                        "taxonpath": "",
                        "taxonname": "其他媒体类型",
                        "taxoncode": "$F990000"
                    }
                ]
            },
            "life_cycle": {
                "version": "v1.0",
                "status": "CREATED",
                "enable": true,
                "creator": metaInfo.creator,
                "publisher": null,
                "provider": null,
                "provider_source": null,
                "create_time": new Date().toISOString(),
                "last_update": null
            },
            "education_info": {
                "interactivity": 0,
                "interactivity_level": 0,
                "end_user_type": null,
                "semantic_density": null,
                "context": null,
                "age_range": null,
                "difficulty": null,
                "learning_time": null,
                "description": null,
                "language": null
            },
            "relations": [
                {
                    "source": metaInfo.chapter_id,
                    "source_title": metaInfo.chapter_name,
                    "source_type": "chapters",
                    "relation_type": "ASSOCIATE"
                }
            ],
            "tech_info": {
                "href": {
                    "format": "xml",
                    "size": 0,
                    "location": "${ref-path}/edu/esp/coursewareobjects/" + getModulePackage(uuid) + "/main.xml",
                    "requirements": [],
                    "md5": null,
                    "entry": null
                }
            },
            "copyright": {
                "right": null,
                "description": null,
                "author": null
            }
        };

        if (isEditableSubjectTool) {
            //将通用可编辑学科工具模板名称
            metaData.custom_properties.template_code = EDITABLE_SUBJECT_TOOL_TEMPLATE;
        }

        return metaData;
    }

    return {};
};

var readMetaData = function (uuid, req) {
    var metaDataPath = getInteractionBase(uuid, req) + "/metadata.json";

    if (fileSys.existsSync(metaDataPath)) {
        var metaData = fileSys.readFileSync(metaDataPath);
        if (!!metaData) {
            return JSON.parse(metaData.toString());
        }
    }

    return null;
};

var updateMetaData = function (metaData, title) {
    //更新title
    if (!!title) {
        metaData.title = title;
        metaData.description = "<p>" + title + "</p>";
    }

    //更新时间
    if (!!metaData.life_cycle) {
        metaData.life_cycle.last_update = new Date().toISOString();
    }
};
/** ****************************** 元数据管理 end ****************************** */


//接口声明
exports.instanceSubjectToolData = instanceSubjectToolData;
exports.instanceModuleData = instanceModuleData;
exports.getInteractionInfo = getInteractionInfo;
exports.getModuleCode = getModuleCode;
exports.isGeneralTool = isGeneralTool;
exports.returnCommder = returnCommder;
exports.isUnsupportedReedit = isUnsupportedReedit;
exports.isEditorDataFile = isEditorDataFile;
exports.getInteractionBase = getInteractionBase;
exports.createInteractionBase = createInteractionBase;
exports.mkdirsSync = mkdirsSync;
exports.copyDirectory = copyDirectory;
exports.copyFile = copyFile;
exports.createMetaData = createMetaData;
exports.readMetaData = readMetaData;
exports.updateMetaData = updateMetaData;
exports.copySpiritResource = copySpiritResource;
