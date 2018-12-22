/**
 * 习题颗粒的page.xml文件解析器
 * 其中，loadPageXML，loadXML 依赖jquery库
 *
 * @type {{_CONSTANTS_DEFINE: {PAGE: string, ADDON_MODULE: string, ADDON_ID: string, PROPERTY: string, KEY_NAME: string, KEY_TYPE: string, KEY_VALUE: string, KEY_HREF: string, TYPE_STRING: string, TYPE_HTML: string, TYPE_JSON: string}, parseXML: Function, loadPageXML: Function, loadXML: Function, isExistAddonModule: Function, getPropertiesModel: Function, getPageHref: Function, _getAddonModuleById: Function, _getProperty: Function}}
 */
var PageXmlParser = {
    /**
     * Constants Defined.
     */
    _CONSTANTS_DEFINE: {
        PAGE: 'page',
        ADDON_MODULE: 'addonModule',
        ADDON_ID: 'addonId',
        PROPERTY: 'property',
        KEY_NAME: 'name',
        KEY_TYPE: 'type',
        KEY_VALUE: 'value',
        KEY_HREF: 'href',

        TYPE_STRING: 'string',
        TYPE_HTML: 'html',
        TYPE_JSON: 'json'
    },
    /**
     * 解析XML字符串
     * @param xmlString XML字符串
     * @returns xml document
     */
    parseXML: function (xmlString) {
        var xmlDoc = null;
        //判断浏览器的类型
        //支持IE浏览器
        if (!window.DOMParser && window.ActiveXObject) {   //window.DOMParser 判断是否是非ie浏览器
            var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
            for (var i = 0; i < xmlDomVersions.length; i++) {
                try {
                    xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                    break;
                } catch (e) {
                }
            }
        }
        //支持Mozilla浏览器
        else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
            try {
                /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                 */
                domParser = new DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
            } catch (e) {
            }
        }
        else {
            return null;
        }

        return xmlDoc;
    },

    /**
     * 加载颗粒的page.xml 文件
     * @param courseWareObjectUrl
     * @param isAsync
     * @returns {*}
     */
    loadPageXML: function(courseWareObjectUrl, isAsync) {
        var self = this;
        var deferred = $.Deferred();

        //Step1. 获取颗粒main.xml
        self.loadXML(courseWareObjectUrl + '/main.xml', isAsync).then(function (mainXML) {
            //Step2. 获取颗粒page.xml
            var pageHref = PageXmlParser.getPageHref(mainXML);

            self.loadXML(courseWareObjectUrl + '/' + pageHref, isAsync).then(function (pageXML) {
                deferred.resolve(pageXML);
            }, function(XMLHttpRequest, textStatus, errorThrown) {
                deferred.reject(XMLHttpRequest);
            });
        }, function(XMLHttpRequest) {
            deferred.reject(XMLHttpRequest);
        });

        return deferred.promise();
    },

    /**
     * 加载XML 文件
     * @param xmlURL
     * @param isAsync
     * @returns {*} XML DOCUMENT
     * @private
     */
    loadXML: function (xmlURL, isAsync) {
        var deferred = $.Deferred();

        $.ajax({
            method: 'GET',
            url: xmlURL,
            dataType: 'xml',
            async: isAsync || false,
            cache: false
        }).done(function (xmlDoc) {
            console.log('Succeed to load XML file:[' + xmlURL + ']');
            deferred.resolve(xmlDoc);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (!!XMLHttpRequest.responseXML) {
                console.log('Warned to load XML file:[' + xmlURL + ']');
                deferred.resolve(XMLHttpRequest.responseXML);
            } else {
                console.log('Failed to load XML file:[' + xmlURL + ']');
                deferred.reject(XMLHttpRequest);
            }
        });

        return deferred.promise();
    },

    /**
     * 判断是否存在指定的AddonModule
     *
     * @param pageXmlDoc
     * @param addonId
     * @returns {boolean}
     */
    isExistAddonModule: function(pageXmlDoc, addonId) {
        var addonModule = this._getAddonModuleById(pageXmlDoc, addonId);

        return addonModule != null;
    },

    /**
     * 解析property节点的属性(name, value)，生成数据模型
     * @param pageXmlDoc page.xml DOM对象
     * @param addonId
     * @returns propertiesModel
     */
    getPropertiesModel: function (pageXmlDoc, addonId) {
        var propertiesModel = {};

        var propertyElements;
        if (!!addonId) {
            var addonModule = this._getAddonModuleById(pageXmlDoc, addonId);
            if (!!addonModule) {
                propertyElements = addonModule.getElementsByTagName(this._CONSTANTS_DEFINE.PROPERTY);
            }
        } else {
            propertyElements = pageXmlDoc.getElementsByTagName(this._CONSTANTS_DEFINE.PROPERTY);
        }

        if (!!propertyElements) {
            for (var i = 0; i < propertyElements.length; i++) {
                this._getProperty(propertyElements[i], propertiesModel);
            }
        }

        return propertiesModel;
    },

    /**
     * 获取main.xml文件里的page.xml文件地址
     * @param mainXmlDoc main.xml DOM对象
     * @returns {*}
     */
    getPageHref: function (mainXmlDoc) {
        var pageElements = mainXmlDoc.getElementsByTagName(this._CONSTANTS_DEFINE.PAGE);
        if (pageElements.length > 0) {
            return pageElements[0].getAttribute(this._CONSTANTS_DEFINE.KEY_HREF);
        }

        return null;
    },
    /****以下开始为Presenter的私有方法*****/
    /********私有的方法**********/
    /**
     * 通过addonId获取addonModule
     *
     * @param pageXmlDoc
     * @param addonId
     * @returns {*}
     */
    _getAddonModuleById: function (pageXmlDoc, addonId) {
        var addonModules = pageXmlDoc.getElementsByTagName(this._CONSTANTS_DEFINE.ADDON_MODULE);
        for (var i = 0; i < addonModules.length; i++) {
            var addonModule = addonModules[i];
            if (addonModule.getAttribute(this._CONSTANTS_DEFINE.ADDON_ID) == addonId) {
                return addonModule;
            }
        }

        return null;
    },
    /**
     * 获取property节点的键值对
     *
     * @param propertyElement
     * @param propertiesModel
     * @private
     */
    _getProperty: function (propertyElement, propertiesModel) {
        var name = propertyElement.getAttribute(this._CONSTANTS_DEFINE.KEY_NAME);
        var type = propertyElement.getAttribute(this._CONSTANTS_DEFINE.KEY_TYPE);

        switch (type) {
            case this._CONSTANTS_DEFINE.TYPE_HTML:
                propertiesModel[name] = propertyElement.textContent;

                break;
            case this._CONSTANTS_DEFINE.TYPE_JSON:
                var textContent = propertyElement.textContent;
                if (!!textContent) {
                    propertiesModel[name] = JSON.parse(textContent);
                } else {
                    propertiesModel[name] = null;
                }

                break;
            default:
                propertiesModel[name] = propertyElement.getAttribute(this._CONSTANTS_DEFINE.KEY_VALUE);

                break;
        }
    }
};