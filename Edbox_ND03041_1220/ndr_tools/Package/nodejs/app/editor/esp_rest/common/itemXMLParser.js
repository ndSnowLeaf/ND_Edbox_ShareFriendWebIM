var fileSystem = require('fs');
var path = require("path");
var itemXMLParser;
(function (itemXMLParser) {
    /*
     if(!String.prototype.simpleReplace) {
         String.prototype.simpleReplace = function(substr, replacement) {
             return this.replace(substr, function(){
                return replacement;
             });
         };
     }
     */

    function simpleReplace(template, substr, replacement) {
		if(template === null || template === undefined) return template;
		
        var result = template, params = arguments, length = arguments.length;
        for (var i = 1; i < length; i += 2) {
            result = result.replace(params[i], function () {
                return params[i + 1]
            });
        }

        return result;
    }

    var Parser = (function () {
        function Parser() {
        }

        /**
         * 排序题item.xml生成
         * @param jsonObj
         * @returns {string}
         */
        Parser.prototype.generateOrder = function (jsonObj) {
            var itemXML = loadTemplate("order"),
                correctResponseValueTemplate = "<value>%s</value>",
                orderItemTemplate = loadTemplate("order-item");

            var correctResponseValues = "", simpleChoices = "";
            for (var i = 0; i < jsonObj.items.length; i++) {
                var identifier = "p" + (i + 1);
                correctResponseValues += simpleReplace(correctResponseValueTemplate, "%s", identifier);
                simpleChoices += simpleReplace(orderItemTemplate, "${identifier}", identifier, "${text}", jsonObj.items[i].text);
            }

            var promptMedia = "";
            switch (jsonObj.description.asset_type) {
                case "image":
                    promptMedia = "<img src='" + jsonObj.description.asset + "' " + translateImageEffect(jsonObj.description.other) + "/>";
                    break;
                case "audio":
                    promptMedia = "<audio src='" + jsonObj.description.asset + "' controls='controls'></audio>";
                    break;
                case "video":
                    promptMedia = "<video src='" + jsonObj.description.asset + "' controls='controls'></video>";
                    break;
                default:
            }

            itemXML = simpleReplace(itemXML, "${promptText}", jsonObj.description.text,
                "${promptMedia}", promptMedia,
                "${correctResponseValues}", correctResponseValues,
                "${simpleChoices}", simpleChoices);

            return itemXML;
        };

        /**
         * 表格题item.xml生成
         * @param jsonObj
         * @returns {string}
         */
        Parser.prototype.generateTable = function (jsonObj) {
            var itemXML = loadTemplate("table"),
                correctResponseValueTemplate = "<value>%s</value>",
                textItemTemplate = loadTemplate("table-text-item"),
                imageItemTemplate = loadTemplate("table-image-item"),
                tableContentTemplate = loadTemplate("table-content"),
                tableRowTemplate = loadTemplate("table-row"),
                tableRowColTemplate = loadTemplate("table-row-col");

            var correctResponseValues = "", gapTexts = "", tableContent, columnHeader = "", tableRows = "";
            for (var i = 0; i < jsonObj.items.length; i++) {
                var item = jsonObj.items[i];
                var identifier = "p" + (i + 1);
                var gapIdentifier = getGapIdentifier(parseInt(item.vertical_index), parseInt(item.horizontal_index));

                correctResponseValues += simpleReplace(correctResponseValueTemplate, "%s", identifier + " " + gapIdentifier);
                if (item.content_type === "text") {
                    gapTexts += simpleReplace(textItemTemplate, "${identifier}", identifier, "${text}", item.content);
                } else {
                    gapTexts += simpleReplace(imageItemTemplate, "${identifier}", identifier, "${imageSrc}", item.content);
                }
            }

            //列处理
            var columnCount = jsonObj.horizontal_items.length;
            for (var i = 0; i < columnCount; i++) {
                columnHeader += "<td>" + jsonObj.horizontal_items[i] + "</td>";
            }

            //行处理
            var rowCount = jsonObj.vertical_items.length;
            for (var k = 0; k < rowCount; k++) {
                var tableRow = "", tableCols = "";
                for (var j = 0; j < columnCount; j++) {
                    var gapIdentifier = getGapIdentifier(k, j);
                    tableCols += simpleReplace(tableRowColTemplate, "${identifier}", gapIdentifier);
                }

                tableRow = simpleReplace(tableRowTemplate, "${rowHeader}", jsonObj.vertical_items[k], "${columns}", tableCols);
                tableRows += tableRow;
            }
            tableContent = simpleReplace(tableContentTemplate, "${columnHeader}", columnHeader, "${rows}", tableRows);

            var promptMedia = "";
            switch (jsonObj.description.asset_type) {
                case "image":
                    promptMedia = "<img src='" + jsonObj.description.asset + "' " + translateImageEffect(jsonObj.description.other) + "/>";
                    break;
                case "audio":
                    promptMedia = "<audio src='" + jsonObj.description.asset + "' controls='controls'></audio>";
                    break;
                case "video":
                    promptMedia = "<video src='" + jsonObj.description.asset + "' controls='controls'></video>";
                    break;
                default:
            }

            itemXML = simpleReplace(itemXML, "${promptText}", jsonObj.description.text,
                "${promptMedia}", promptMedia,
                "${correctResponseValues}", correctResponseValues,
                "${gapTexts}", gapTexts,
                "${tableContent}", tableContent);

            return itemXML;
        };
        /**
         * 连连看的item.xml生成
         * @param jsonObj 编辑器提交的JSON对象
         * @returns {*} item.xml的数据
         */
        Parser.prototype.generateLinkup = function (jsonObj) {
            var linkupTmpl = loadTemplate("linkup");
            var imageItemTmpl, textItemTmpl;
            if (jsonObj.module_subtype == "image2text") {
                imageItemTmpl = loadTemplate("linkup-image-item");
                textItemTmpl = loadTemplate("linkup-text-item");
            }
            if (jsonObj.module_subtype == "image2image") {
                imageItemTmpl = loadTemplate("linkup-image-item");
            }
            if (jsonObj.module_subtype == "text2text") {
                textItemTmpl = loadTemplate("linkup-text-item");
            }
            var source = "", target = "", pair = "";
            var identifier = 0; //选项标识计数器
            for (var index = 0; index < jsonObj.items.length; index++) {
                var item = jsonObj.items[index];
                //source
                if (item.source.item_type == "image") {
                    source += simpleReplace(imageItemTmpl, "${identifier}", "p" + identifier, "${imageSrc}", item.source.href);
                } else if (item.source.item_type = "text") {
                    source += simpleReplace(textItemTmpl, "${identifier}", "p" + identifier, "${content}", item.source.text);
                }
                //target
                if (item.target.item_type == "image") {
                    target += simpleReplace(imageItemTmpl, "${identifier}", "p" + (identifier + 1), "${imageSrc}", item.target.href);
                } else if (item.target.item_type = "text") {
                    target += simpleReplace(textItemTmpl, "${identifier}", "p" + (identifier + 1), "${content}", item.target.text);
                }
                //pair
                pair += "<value>p" + identifier + " p" + (identifier + 1) + "</value>";

                identifier += 2; //选项标识计数器+2
            }
            var result = simpleReplace(linkupTmpl, "${correctResponse}", pair,
                "${prompt}", jsonObj.title,
                "${leftSimpleMatchSet}", source,
                "${rightSimpleMatchSet}", target);
            return result;
        };


        Parser.prototype.generateMemorycard = function (jsonObj) {
            var itemXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" identifier=\"\" title=\"记忆卡片\" adaptive=\"false\" timeDependent=\"false\""
                + "     xsi:schemaLocation=\"http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/imsqti_v2p1.xsd\">"
                + "     <responseDeclaration identifier=\"RESPONSE_1-1\" cardinality=\"multiple\" baseType=\"pair\" sequence=\"1-1\">"
                + "         <correctResponse>"
                + "             ${correctResponseValues}"
                + "         </correctResponse>"
                + "     </responseDeclaration>"
                + "     <outcomeDeclaration identifier=\"SCORE\" cardinality=\"single\" baseType=\"float\">"
                + "         <defaultValue>"
                + "             <value>0.0</value>"
                + "         </defaultValue>"
                + "     </outcomeDeclaration>"
                + "     <itemBody>"
                + "         <matchInteraction responseIdentifier=\"RESPONSE_1-1\" questionType=\"match\" shuffle=\"true\" maxAssociations=\"3\">"
                + "             <prompt>"
                + "                 <p>${promptText}</p>"
                + "             </prompt>"
                + "             <simpleMatchSet>"
                + "                 ${simpleMatchSetSource}"
                + "             </simpleMatchSet>"
                + "             <simpleMatchSet>"
                + "                 ${simpleMatchSetTarget}"
                + "             </simpleMatchSet>"
                + "         </matchInteraction>"
                + "     </itemBody>"
                + "     <responseProcessing template=\"http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct\"/>"
                + "     <modalFeedback showHide=\"show\" outcomeIdentifier=\"FEEDBACK\" identifier=\"showHint\" sequence=\"1\"/>"
                + "     <modalFeedback showHide=\"show\" outcomeIdentifier=\"FEEDBACK\" identifier=\"showAnswer\" sequence=\"1\"/>"
                + "</assessmentItem>"

            var correctResponseValueTemplate = "<value>%s</value>";
            var choiceTemplate = "<simpleAssociableChoice identifier=\"${identifier}\" fixed=\"false\" matchMax=\"1\"><p>${text}</p></simpleAssociableChoice>";

            var correctResponseValues = ""; // 正确答案
            var simpleMatchSetSource = "";
            var simpleMatchSetTarget = "";
            var j = 0;
            for (var i = 0; i < jsonObj.items.length; i++) {
                var item = jsonObj.items[i];
                var identifierSource = "p" + j;
                j++;
                var identifierTarget = "P" + j;
                j++;
                correctResponseValues += simpleReplace(correctResponseValueTemplate, "%s", identifierSource + " " + identifierTarget);

                simpleMatchSetSource += simpleReplace(choiceTemplate, "${identifier}", identifierSource, "${text}", item.source.text);
                simpleMatchSetTarget += simpleReplace(choiceTemplate, "${identifier}", identifierTarget, "${text}", item.target.text);
            }

            itemXML = simpleReplace(itemXML, "${promptText}", jsonObj.title,
                "${correctResponseValues}", correctResponseValues,
                "${simpleMatchSetSource}", simpleMatchSetSource,
                "${simpleMatchSetTarget}", simpleMatchSetTarget);

            //console.log('generateMemorycard itemXML = ' + itemXML);
            return itemXML;
        };

        /**
         * 表格题 生成表格中单元格的identifier
         * @param verticalIndex
         * @param horizontalIndex
         * @returns {string}
         */
        function getGapIdentifier(verticalIndex, horizontalIndex) {
            return "G" + (verticalIndex + 1) + "_" + parseInt(horizontalIndex + 1);
        }

        /**
         * 图片各类效果转化成dom元素属性
         * @param effectObj
         * @returns {string}
         */
        function translateImageEffect(effectObj) {
            var effectAttrs = "";
            if (effectObj) {
                for (var attr in effectObj) {
                    effectAttrs += (attr + "='" + effectObj[attr] + "' ");
                }
            }

            return effectAttrs;
        }

        function loadTemplate(templateName) {
            var tmpl = fileSystem.readFileSync(path.join(__dirname, "./tmpls/qti-item/" + templateName + ".xml"));
            if (tmpl) {
                return tmpl.toString();
            } else {
                return null;
            }
        }

        return Parser;
    })();
    itemXMLParser.Parser = Parser;
})(itemXMLParser = exports.itemXMLParser || (exports.itemXMLParser = {}));
