var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="reference.d.ts" />
var GameCircuitDiagram;
(function (GameCircuitDiagram) {
    var Loader = (function () {
        function Loader() {
            this.isConfigComplete = false;
            this.needLoadGroupName = '';
            this.loadingGroupName = '';
            this.status = Loader.STATUS_STAND;
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigError, this);
            var url = icCreatePlayer.presenter_circuitdiagram.url + "resources/";
            RES.loadConfig(url + 'resources.json', url + 'wood/images/');
        }
        Loader.prototype.loadGroup = function (groupName, cbResourceLoadComplete, cbResourceProgress) {
            if (this.status === Loader.STATUS_LOADING)
                return;
            this.cbResourceProgress = cbResourceProgress;
            this.cbResourceLoadComplete = cbResourceLoadComplete;
            if (!this.isConfigComplete) {
                this.needLoadGroupName = groupName;
            }
            else {
                this.status = Loader.STATUS_LOADING;
                this.loadingGroupName = groupName;
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.loadGroup(groupName);
            }
        };
        Loader.prototype.onConfigComplete = function (event) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            this.isConfigComplete = true;
            if (this.needLoadGroupName) {
                this.loadGroup(this.needLoadGroupName, this.cbResourceLoadComplete, this.cbResourceProgress);
                this.needLoadGroupName = '';
            }
        };
        Loader.prototype.onConfigError = function (event) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigError, this);
            console.error("event", event);
        };
        Loader.prototype.onResourceLoadComplete = function (event) {
            var cbResourceLoadComplete = this.cbResourceLoadComplete;
            if (event.groupName === this.loadingGroupName) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                this.cbResourceProgress = undefined;
                this.loadingGroupName = '';
                this.status = Loader.STATUS_STAND;
                if (cbResourceLoadComplete) {
                    this.cbResourceLoadComplete = undefined;
                    cbResourceLoadComplete();
                }
            }
        };
        Loader.prototype.onResourceLoadError = function (event) {
            console.warn('Group:' + event.groupName + ' has failed to load');
            this.onResourceLoadComplete(event);
        };
        Loader.prototype.onResourceProgress = function (event) {
            if (event.groupName === this.loadingGroupName && this.cbResourceProgress) {
                this.cbResourceProgress(event.itemsLoaded, event.itemsTotal);
            }
        };
        Loader.prototype.destroy = function () {
        };
        Loader.STATUS_STAND = 1;
        Loader.STATUS_LOADING = 0;
        Loader.count = 0;
        return Loader;
    })();
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.call(this);
            this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        Main.prototype.onAddToStage = function () {
            var _this = this;
            this.loader = new Loader();
            this.loader.loadGroup('circuit', function () {
                _this.init();
            });
        };
        Main.prototype.init = function () {
            this.stage.addEventListener('DestroyAction', this.destroy, this);
            this.mainScene = new scenes.MainScene();
            this.addChild(this.mainScene);
            this.mainScene.init();
        };
        Main.prototype.destroy = function (data) {
            egret.stopEgret();
            if (this.mainScene) {
                this.mainScene.destroy();
                this.mainScene = null;
            }
            var isDestroy = RES.destroyRes('circuit');
            if (isDestroy)
                console.log('destroy resource success');
            if (this.loader) {
                this.loader = null;
            }
            this.stage.removeEventListener("DestroyAction", this.destroy, this);
            this.stage.removeChildren();
        };
        return Main;
    })(egret.DisplayObjectContainer);
    GameCircuitDiagram.Main = Main;
    var utils;
    (function (utils) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.createBitmapbyName = function (name) {
                var result = new egret.Bitmap();
                result.texture = RES.getRes(name);
                return result;
            };
            Utils.hitTest = function (obj1, obj2) {
                var rect1 = obj1.getBounds();
                var rect2 = obj2.getBounds();
                rect1.x = obj1.x;
                rect1.y = obj1.y;
                rect2.x = obj2.x;
                rect2.y = obj2.y;
                return rect1.intersects(rect2);
            };
            Utils.uuid = function (len) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                var uuid = [], i;
                var radix = chars.length;
                if (len) {
                    for (i = 0; i < len; i++)
                        uuid[i] = chars[0 | Math.random() * radix];
                }
                else {
                    var r;
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }
                return uuid.join('');
            };
            return Utils;
        })();
        utils.Utils = Utils;
    })(utils || (utils = {}));
    var element;
    (function (element) {
        var CircuitEl = (function (_super) {
            __extends(CircuitEl, _super);
            function CircuitEl(x, y) {
                _super.call(this);
                this.addPlace = -1;
                this.letterIndex = 0;
                this.textName = "";
                this.x = x;
                this.y = y;
                this.uuid = utils.Utils.uuid(8);
                this.direction = element.Direction.Horizon;
            }
            CircuitEl.prototype.getUUid = function () {
                if (this.uuid) {
                    return this.uuid;
                }
                else {
                    this.uuid = utils.Utils.uuid(8);
                    return this.uuid;
                }
            };
            CircuitEl.prototype.setUUid = function (uuid) {
                this.uuid = uuid;
            };
            CircuitEl.prototype.setCircuitText = function (name, offset) {
                if (offset === void 0) { offset = 0; }
                this.circuitText = new egret.TextField();
                this.addChild(this.circuitText);
                this.circuitText.text = name;
                this.textName = name;
                this.circuitText.textColor = 0x000000;
                this.circuitText.anchorOffsetX = this.circuitText.width / 2;
                this.circuitText.anchorOffsetY = this.circuitText.height / 2;
                if (this.isSymbol) {
                    this.circuitText.y = this.circuitImage.height / 2 + this.circuitText.height + offset + 5;
                }
                else {
                    this.circuitText.y = this.circuitImage.height / 2 + this.circuitText.height;
                }
            };
            CircuitEl.prototype.changeLetter = function (symbol, index) {
                var _textField = this.circuitText;
                this.textName = symbol;
                this.letterIndex = index;
                if (_textField) {
                    if (index >= 0) {
                        _textField.textFlow = [
                            { text: symbol, style: { "size": 54 } },
                            { text: index, style: { "size": 32 } }
                        ];
                    }
                    else {
                        _textField.text = symbol;
                        _textField.size = 54;
                    }
                }
            };
            CircuitEl.prototype.setCircuitImage = function (image) {
                this.circuitImage = image;
                this.addChild(this.circuitImage);
                this.circuitImage.anchorOffsetX = this.circuitImage.width / 2;
                this.circuitImage.anchorOffsetY = this.circuitImage.height / 2;
            };
            CircuitEl.prototype.getCircuitImageWidth = function () {
                return this.circuitImage.width;
            };
            CircuitEl.prototype.getCircuitImageHeight = function () {
                return this.circuitImage.height;
            };
            CircuitEl.prototype.isCircuitTextShow = function () {
                if (this.circuitText && this.circuitText.visible == true) {
                    return true;
                }
                else {
                    return false;
                }
            };
            CircuitEl.prototype.setDisplayLetter = function (enable) {
                console.log("DisplayerLetter: " + enable);
                var _text = this.circuitText;
                if (_text) {
                    _text.visible = enable;
                }
            };
            CircuitEl.prototype.setHitPointShape = function (connectorPoints, circleRange) {
                if (circleRange === void 0) { circleRange = 45; }
                this.hitShapeArray = [];
                this.connectorPoints = connectorPoints;
                var _len = connectorPoints.length;
                for (var i = 0; i < _len; i++) {
                    var _shape = new egret.Shape();
                    _shape.graphics.beginFill(0xffff00, 0);
                    _shape.graphics.drawCircle(0, 0, circleRange);
                    _shape.graphics.endFill();
                    _shape.x = connectorPoints[i].relative_x;
                    _shape.y = connectorPoints[i].relative_y;
                    this.hitShapeArray.push(_shape);
                    this.addChild(_shape);
                }
            };
            CircuitEl.prototype.hitPointShape = function (x, y) {
                var _hitShapes = this.hitShapeArray;
                var _len = _hitShapes.length;
                for (var i = 0; i < _len; i++) {
                    if (_hitShapes[i].hitTestPoint(x, y)) {
                        return this.localToGlobal(_hitShapes[i].x, _hitShapes[i].y);
                    }
                }
                return null;
            };
            CircuitEl.prototype.hitPointShape4Symbol = function (x, y) {
                var _hitShape = this.hitShapeArray;
                var _that = this;
                if (!_that.startUUID) {
                    if (_hitShape[0].hitTestPoint(x, y)) {
                        return {
                            point: this.localToGlobal(_hitShape[0].x, _hitShape[0].y),
                            index: 0
                        };
                    }
                }
                if (!_that.endUUID) {
                    if (_hitShape[1].hitTestPoint(x, y)) {
                        return {
                            point: this.localToGlobal(_hitShape[1].x, _hitShape[1].y),
                            index: 1
                        };
                    }
                }
                return null;
            };
            CircuitEl.prototype.moveCircuit = function (x, y) {
                this.x = x;
                this.y = y;
            };
            CircuitEl.prototype.isNearConnector = function (x, y) {
            };
            CircuitEl.prototype.addConnectPoints = function (x, y) {
            };
            CircuitEl.prototype.addConnectRes = function (res) {
            };
            CircuitEl.prototype.getStateData = function () {
                return JSON.stringify({
                    "x": this.x,
                    "y": this.y,
                    "addPlace": this.addPlace,
                    "letterIndex": this.letterIndex,
                    "textName": this.textName,
                    "isSymbol": this.isSymbol,
                    "startUUID": this.startUUID,
                    "endUUID": this.endUUID,
                    "direction": this.direction
                });
            };
            CircuitEl.prototype.setStateData = function (data) {
                if (data) {
                    data = JSON.parse(data);
                    this.x = data["x"];
                    this.y = data["y"];
                    this.addPlace = data["addPlace"];
                    this.letterIndex = data["letterIndex"];
                    this.textName = data["textName"];
                    this.isSymbol = data["isSymbol"];
                    this.startUUID = data["startUUID"];
                    this.endUUID = data["endUUID"];
                    this.rotate(data["direction"]);
                    this.changeLetter(this.textName, this.letterIndex);
                }
            };
            CircuitEl.prototype.setOffSet = function (index) {
                if (index >= 0 && index < this.connectorPoints.length) {
                    if (this.direction == element.Direction.Horizon) {
                        this.x = this.x - this.connectorPoints[index].relative_x;
                        this.y = this.y - this.connectorPoints[index].relative_y;
                    }
                    else {
                        this.x = this.x + this.connectorPoints[index].relative_y;
                        this.y = this.y - this.connectorPoints[index].relative_x;
                    }
                }
            };
            CircuitEl.prototype.getConPoint = function (connectorPoint) {
                if (connectorPoint == "START") {
                    return this.localToGlobal(this.connectorPoints[0].relative_x, this.connectorPoints[0].relative_y);
                }
                else if (connectorPoint == "END") {
                    return this.localToGlobal(this.connectorPoints[1].relative_x, this.connectorPoints[1].relative_y);
                }
                else {
                    return null;
                }
            };
            CircuitEl.prototype.getConnectorPoint = function () {
                if (!this.endUUID) {
                    var _point = this.localToGlobal(this.connectorPoints[1].relative_x, this.connectorPoints[1].relative_y);
                    return {
                        x: _point.x,
                        y: _point.y,
                        offset: 0
                    };
                }
                else if (!this.startUUID) {
                    var _point = this.localToGlobal(this.connectorPoints[0].relative_x, this.connectorPoints[0].relative_y);
                    return {
                        x: _point.x,
                        y: _point.y,
                        offset: 1
                    };
                }
                else {
                    return null;
                }
            };
            CircuitEl.prototype.getDirection = function () {
                return this.direction;
            };
            CircuitEl.prototype.showVirtualView = function (x, y) {
                if (this.virtualImage) {
                    this.virtualImage.visible = true;
                    var _p = this.globalToLocal(x, y);
                    if (this.direction == element.Direction.Horizon) {
                        this.virtualImage.x = _p.x + this.connectorPoints[0].relative_y;
                        this.virtualImage.y = _p.y;
                    }
                    else {
                        this.virtualImage.x = _p.x - this.connectorPoints[0].relative_y;
                        this.virtualImage.y = _p.y;
                    }
                    return;
                }
                this.virtualImage = new egret.Bitmap();
                var _p = this.globalToLocal(x, y);
                console.log(_p);
                this.virtualImage.x = _p.x;
                this.virtualImage.y = _p.y;
                if (this.direction == element.Direction.Horizon) {
                    var _img = this.getImg("v_blue");
                    if (_img) {
                        this.virtualImage.texture = _img;
                    }
                    else {
                        this.virtualImage.texture = this.getImg("h_blue");
                        this.virtualImage.rotation = 90;
                        this.virtualImage.x = this.virtualImage.x + this.connectorPoints[0].relative_y;
                    }
                }
                else {
                    this.virtualImage.texture = this.getImg("h_blue");
                    this.virtualImage.rotation = -90;
                    this.virtualImage.y = this.virtualImage.y - this.connectorPoints[0].relative_y;
                }
                this.addChild(this.virtualImage);
                this.virtualImage.anchorOffsetX = this.virtualImage.width / 2;
                this.virtualImage.anchorOffsetY = this.virtualImage.height / 2;
            };
            CircuitEl.prototype.getVirtualViewConnectPoint = function (isStart) {
                var _x;
                var _y;
                if (isStart) {
                    if (this.direction == element.Direction.Horizon) {
                        _x = this.virtualImage.x - this.connectorPoints[0].relative_y;
                        _y = this.virtualImage.y + this.connectorPoints[0].relative_x;
                    }
                    else {
                        _x = this.virtualImage.x + this.connectorPoints[0].relative_y;
                        _y = this.virtualImage.y - this.connectorPoints[0].relative_x;
                    }
                }
                else {
                    if (this.direction == element.Direction.Horizon) {
                        _x = this.virtualImage.x - this.connectorPoints[1].relative_y;
                        _y = this.virtualImage.y + this.connectorPoints[1].relative_x;
                    }
                    else {
                        _x = this.virtualImage.x + this.connectorPoints[1].relative_y;
                        _y = this.virtualImage.y - this.connectorPoints[1].relative_x;
                    }
                }
                return this.localToGlobal(_x, _y);
            };
            CircuitEl.prototype.hiddenVirtualView = function () {
                if (this.virtualImage) {
                    this.virtualImage.visible = false;
                }
            };
            CircuitEl.prototype.isVirtualViewShow = function () {
                return this.virtualImage && this.virtualImage.visible;
            };
            CircuitEl.prototype.removeVirtualView = function () {
                if (this.virtualImage) {
                    this.removeChild(this.virtualImage);
                    this.virtualImage = null;
                }
            };
            CircuitEl.prototype.getImg = function (type) {
                return null;
            };
            CircuitEl.prototype.setVirtual2Real = function (direction) {
                this.rotate(direction);
                if (direction == element.Direction.Vertical) {
                    this.x = this.x + this.virtualImage.x;
                    this.y = this.y + this.virtualImage.y;
                }
                else {
                    this.x = this.x + this.virtualImage.y;
                    this.y = this.y + this.virtualImage.x;
                }
            };
            CircuitEl.prototype.rotate = function (direction) {
                if (direction != this.direction) {
                    if (direction == element.Direction.Horizon) {
                        this.circuitImage.rotation = 0;
                        this.circuitImage.x = 0;
                        this.circuitImage.y = 0;
                        this.rotation = 0;
                        this.circuitImage.texture = this.getImg("horizontal");
                        if (this.circuitText) {
                            this.circuitText.rotation = 0;
                            this.circuitText.y = this.circuitImage.height / 2 + this.circuitText.height / 2 + 5;
                        }
                        this.direction = direction;
                    }
                    else {
                        var _img = this.getImg("vertical");
                        if (_img) {
                            this.circuitImage.texture = _img;
                            this.circuitImage.rotation = -90;
                            this.circuitImage.x = this.circuitImage.x + this.connectorPoints[0].relative_x / 2;
                            this.circuitImage.y = this.circuitImage.y + this.connectorPoints[0].relative_x / 2 - 1.5;
                        }
                        else {
                            this.circuitImage.texture = this.getImg("horizontal");
                        }
                        this.rotation = 90;
                        if (this.circuitText) {
                            this.circuitText.rotation = -90;
                            this.circuitText.y = -this.circuitText.y;
                        }
                        this.direction = direction;
                    }
                }
            };
            return CircuitEl;
        })(egret.DisplayObjectContainer);
        element.CircuitEl = CircuitEl;
        var CircuitEl;
        (function (CircuitEl) {
            var ConnectorPoint = (function () {
                function ConnectorPoint(relative_x, relative_y) {
                    this.relative_x = relative_x;
                    this.relative_y = relative_y;
                }
                return ConnectorPoint;
            })();
            CircuitEl.ConnectorPoint = ConnectorPoint;
        })(CircuitEl = element.CircuitEl || (element.CircuitEl = {}));
    })(element || (element = {}));
    var element;
    (function (element) {
        var AmpereMeter = (function (_super) {
            __extends(AmpereMeter, _super);
            function AmpereMeter(x, y, isSymbol) {
                _super.call(this, x, y);
                this.hasVerticalImg = true;
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_dianliu'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 0));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 0));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_dianliu'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-50, 45));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(0, 45));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(50, 45));
                    this.setHitPointShape(connectorPoints, 30);
                }
            }
            AmpereMeter.prototype.getType = function () {
                return AmpereMeter.circuittype;
            };
            AmpereMeter.prototype.incLetter = function (index) {
            };
            AmpereMeter.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_dianliu');
                    case "h_blue":
                        return RES.getRes('sign_dianliu_blue');
                    case "vertical":
                        return RES.getRes('sign_dianliu_vertical');
                    case "v_blue":
                        return RES.getRes('sign_dianliu_vertical_blue');
                    default:
                        return null;
                }
            };
            AmpereMeter.prototype.getTextHeightOffset = function () {
                return 0;
            };
            AmpereMeter.prototype.getTextWidthOffset = function () {
                return 0;
            };
            AmpereMeter.SYMBOL = "A";
            AmpereMeter.circuittype = "AmpereMeter";
            return AmpereMeter;
        })(element.CircuitEl);
        element.AmpereMeter = AmpereMeter;
    })(element || (element = {}));
    var element;
    (function (element) {
        var Bell = (function (_super) {
            __extends(Bell, _super);
            function Bell(x, y, isSymbol) {
                _super.call(this, x, y);
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_dianling'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 26.5));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 26.5));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_dianling'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-63, 38));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(63, 38));
                    this.setHitPointShape(connectorPoints);
                }
            }
            Bell.prototype.getType = function () {
                return Bell.circuittype;
            };
            Bell.prototype.setcont = function (index, x, y) {
            };
            Bell.prototype.incLetter = function (index) {
            };
            Bell.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_dianling');
                    case "h_blue":
                        return RES.getRes('sign_dianling_blue');
                    default:
                        return null;
                }
            };
            Bell.prototype.getTextHeightOffset = function () {
                return 0;
            };
            Bell.prototype.getTextWidthOffset = function () {
                return 0;
            };
            Bell.SYMBOL = "B";
            Bell.circuittype = "Bell";
            return Bell;
        })(element.CircuitEl);
        element.Bell = Bell;
    })(element || (element = {}));
    var element;
    (function (element) {
        var Fan = (function (_super) {
            __extends(Fan, _super);
            function Fan(x, y, isSymbol) {
                _super.call(this, x, y);
                this.hasVerticalImg = true;
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_diandongji'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 0));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 0));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_diandongji'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-63, 33));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(63, 33));
                    this.setHitPointShape(connectorPoints);
                }
            }
            Fan.prototype.getType = function () {
                return Fan.circuittype;
            };
            Fan.prototype.incLetter = function (index) {
            };
            Fan.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_diandongji');
                    case "h_blue":
                        return RES.getRes('sign_diandongji_blue');
                    case "vertical":
                        return RES.getRes('sign_diandongji_vertical');
                    case "v_blue":
                        return RES.getRes('sign_diandongji_vertical_blue');
                    default:
                        return null;
                }
            };
            Fan.prototype.getTextHeightOffset = function () {
                return 0;
            };
            Fan.prototype.getTextWidthOffset = function () {
                return 0;
            };
            Fan.SYMBOL = "F";
            Fan.circuittype = "Fan";
            return Fan;
        })(element.CircuitEl);
        element.Fan = Fan;
    })(element || (element = {}));
    var element;
    (function (element) {
        var Light = (function (_super) {
            __extends(Light, _super);
            function Light(x, y, isSymbol) {
                _super.call(this, x, y);
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_dengpao'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 0));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 0));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_dengpao'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 20));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 20));
                    this.setHitPointShape(connectorPoints);
                }
                this.setCircuitText(Light.SYMBOL);
            }
            Light.prototype.getType = function () {
                return Light.circuittype;
            };
            Light.prototype.incLetter = function (index) {
                _super.prototype.changeLetter.call(this, Light.SYMBOL, index);
            };
            Light.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_dengpao');
                    case "h_blue":
                        return RES.getRes('sign_dengpao_blue');
                    default:
                        return null;
                }
            };
            Light.prototype.getTextHeightOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 67;
                }
                else {
                    return 0;
                }
            };
            Light.prototype.getTextWidthOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 75;
                }
                else {
                    return 0;
                }
            };
            Light.SYMBOL = "L";
            Light.circuittype = "Light";
            return Light;
        })(element.CircuitEl);
        element.Light = Light;
    })(element || (element = {}));
    var element;
    (function (element) {
        var Power = (function (_super) {
            __extends(Power, _super);
            function Power(x, y, isSymbol) {
                _super.call(this, x, y);
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_dianyuan'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 0));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 0));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_dianyuan'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-70, 3));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(70, 3));
                    this.setHitPointShape(connectorPoints);
                }
            }
            Power.prototype.getType = function () {
                return Power.circuittype;
            };
            Power.prototype.incLetter = function (index) {
            };
            Power.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_dianyuan');
                    case "h_blue":
                        return RES.getRes('sign_dianyuan_blue');
                    default:
                        return null;
                }
            };
            Power.prototype.getTextHeightOffset = function () {
                return 0;
            };
            Power.prototype.getTextWidthOffset = function () {
                return 0;
            };
            Power.SYMBOL = "P";
            Power.circuittype = "Power";
            return Power;
        })(element.CircuitEl);
        element.Power = Power;
    })(element || (element = {}));
    var element;
    (function (element) {
        var Resistance = (function (_super) {
            __extends(Resistance, _super);
            function Resistance(x, y, isSymbol) {
                _super.call(this, x, y);
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_dianzu'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 0));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 0));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_dianzu'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-62, 3));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(64, 3));
                    this.setHitPointShape(connectorPoints);
                }
                this.setCircuitText(Resistance.SYMBOL, 22.5);
            }
            Resistance.prototype.getType = function () {
                return Resistance.circuittype;
            };
            Resistance.prototype.incLetter = function (index) {
                _super.prototype.changeLetter.call(this, Resistance.SYMBOL, index);
            };
            Resistance.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_dianzu');
                    case "h_blue":
                        return RES.getRes('sign_dianzu_blue');
                    default:
                        return null;
                }
            };
            Resistance.prototype.getTextHeightOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 90;
                }
                else {
                    return 0;
                }
            };
            Resistance.prototype.getTextWidthOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 102;
                }
                else {
                    return 0;
                }
            };
            Resistance.SYMBOL = "R";
            Resistance.circuittype = "Resistance";
            return Resistance;
        })(element.CircuitEl);
        element.Resistance = Resistance;
    })(element || (element = {}));
    var element;
    (function (element) {
        var SlideRheostat = (function (_super) {
            __extends(SlideRheostat, _super);
            function SlideRheostat(x, y, isSymbol) {
                _super.call(this, x, y);
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_huadongbianzuqi'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 17.5));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 17.5));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_huadongbianzuqi'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-108, -28));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(108, -28));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-97, 12));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(97, 12));
                    this.setHitPointShape(connectorPoints, 28);
                }
                this.setCircuitText(SlideRheostat.SYMBOL, 22.5);
            }
            SlideRheostat.prototype.getType = function () {
                return SlideRheostat.circuittype;
            };
            SlideRheostat.prototype.incLetter = function (index) {
                _super.prototype.changeLetter.call(this, SlideRheostat.SYMBOL, index);
            };
            SlideRheostat.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_huadongbianzuqi');
                    case "h_blue":
                        return RES.getRes('sign_huadongbianzuqi_blue');
                    default:
                        return null;
                }
            };
            SlideRheostat.prototype.getTextHeightOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 95;
                }
                else {
                    return 0;
                }
            };
            SlideRheostat.prototype.getTextWidthOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 102;
                }
                else {
                    return 0;
                }
            };
            SlideRheostat.SYMBOL = "R";
            SlideRheostat.circuittype = "SlideRheostat";
            return SlideRheostat;
        })(element.CircuitEl);
        element.SlideRheostat = SlideRheostat;
    })(element || (element = {}));
    var element;
    (function (element) {
        var Switch = (function (_super) {
            __extends(Switch, _super);
            function Switch(x, y, isSymbol) {
                _super.call(this, x, y);
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_kaiguan'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 14));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 14));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_kaiguan'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 10));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 10));
                    this.setHitPointShape(connectorPoints);
                }
                this.setCircuitText(Switch.SYMBOL, 25);
            }
            Switch.prototype.getType = function () {
                return Switch.circuittype;
            };
            Switch.prototype.incLetter = function (index) {
                _super.prototype.changeLetter.call(this, Switch.SYMBOL, index);
            };
            Switch.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_kaiguan');
                    case "h_blue":
                        return RES.getRes('sign_kaiguan_blue');
                    default:
                        return null;
                }
            };
            Switch.prototype.getTextHeightOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 95;
                }
                else {
                    return 0;
                }
            };
            Switch.prototype.getTextWidthOffset = function () {
                if (_super.prototype.isCircuitTextShow.call(this)) {
                    return 102;
                }
                else {
                    return 0;
                }
            };
            Switch.SYMBOL = "S";
            Switch.circuittype = "Switch";
            return Switch;
        })(element.CircuitEl);
        element.Switch = Switch;
    })(element || (element = {}));
    var element;
    (function (element) {
        var Voltmeter = (function (_super) {
            __extends(Voltmeter, _super);
            function Voltmeter(x, y, isSymbol) {
                _super.call(this, x, y);
                this.hasVerticalImg = true;
                if (isSymbol) {
                    this.isSymbol = true;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('sign_dianyabiao'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-65, 0));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(65, 0));
                    this.setHitPointShape(connectorPoints);
                }
                else {
                    this.isSymbol = false;
                    this.setCircuitImage(utils.Utils.createBitmapbyName('main_dianyabiao'));
                    var connectorPoints = [];
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(-50, 45));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(0, 45));
                    connectorPoints.push(new element.CircuitEl.ConnectorPoint(50, 45));
                    this.setHitPointShape(connectorPoints, 30);
                }
            }
            Voltmeter.prototype.getType = function () {
                return Voltmeter.circuittype;
            };
            Voltmeter.prototype.incLetter = function (index) {
            };
            Voltmeter.prototype.getImg = function (type) {
                switch (type) {
                    case "horizontal":
                        return RES.getRes('sign_dianyabiao');
                    case "h_blue":
                        return RES.getRes('sign_dianyabiao_blue');
                    case "vertical":
                        return RES.getRes('sign_dianyabiao_vertical');
                    case "v_blue":
                        return RES.getRes('sign_dianyabiao_vertical_blue');
                    default:
                        return null;
                }
            };
            Voltmeter.prototype.getTextHeightOffset = function () {
                return 0;
            };
            Voltmeter.prototype.getTextWidthOffset = function () {
                return 0;
            };
            Voltmeter.SYMBOL = "V";
            Voltmeter.circuittype = "Voltmeter";
            return Voltmeter;
        })(element.CircuitEl);
        element.Voltmeter = Voltmeter;
    })(element || (element = {}));
    var element;
    (function (element) {
        (function (Direction) {
            Direction[Direction["Horizon"] = 0] = "Horizon";
            Direction[Direction["Vertical"] = 1] = "Vertical";
        })(element.Direction || (element.Direction = {}));
        var Direction = element.Direction;
        var Wire = (function (_super) {
            __extends(Wire, _super);
            function Wire(lineType, beginPoint, thickness, color) {
                if (thickness === void 0) { thickness = 6.2; }
                if (color === void 0) { color = 0x333333; }
                _super.call(this);
                this.blueColor = 0x00b7ee;
                this.blackColor = 0x333333;
                this.lineType = lineType;
                this.thickness = thickness;
                this.color = color;
                this.pathPoints = [];
                this.pathPoints.push(beginPoint);
                this.uuid = utils.Utils.uuid(8);
                this.once(egret.Event.ADDED_TO_STAGE, this.addOnToStage, this);
            }
            Wire.prototype.getUUid = function () {
                if (this.uuid) {
                    return this.uuid;
                }
                else {
                    this.uuid = utils.Utils.uuid(8);
                    return this.uuid;
                }
            };
            Wire.prototype.setUUid = function (uuid) {
                this.uuid = uuid;
            };
            Wire.prototype.getType = function () {
                return Wire.circuittype;
            };
            Wire.prototype.addOnToStage = function () {
                this.init();
            };
            Wire.prototype.init = function () {
                this.graphics.clear();
                this.graphics.lineStyle(this.thickness, this.color);
                var _beginPoint = this.pathPoints[0];
                this.graphics.moveTo(_beginPoint.posx, _beginPoint.posy);
                this.prePoint = _beginPoint;
                this.graphics.endFill();
            };
            Wire.prototype.getDirection4Point = function (index) {
                if (index == 0) {
                    var _len = this.pathPoints.length;
                    if (_len < 2) {
                        return 0;
                    }
                    else {
                        var _start = this.pathPoints[0];
                        var _next = this.pathPoints[1];
                        if (_start.posx > _next.posx) {
                            return 0;
                        }
                        else if (_start.posx == _next.posx) {
                            if (_start.posy >= _next.posy) {
                                return 0;
                            }
                            else {
                                return 1;
                            }
                        }
                        else {
                            return 1;
                        }
                    }
                }
                else if (index == 1) {
                    var _len = this.pathPoints.length;
                    if (_len < 2) {
                        return 0;
                    }
                    else {
                        var _end = this.pathPoints[_len - 1];
                        var _before = this.pathPoints[_len - 2];
                        if (_end.posx > _before.posx) {
                            return 0;
                        }
                        else if (_end.posx == _before.posx) {
                            if (_end.posy >= _before.posy) {
                                return 0;
                            }
                            else {
                                return 1;
                            }
                        }
                        else {
                            return 1;
                        }
                    }
                }
                else {
                    return 0;
                }
            };
            Wire.prototype.getFirstPoint = function () {
                if (this.pathPoints && this.pathPoints.length > 0) {
                    return this.pathPoints[0];
                }
                return null;
            };
            Wire.prototype.getEndPoint = function () {
                if (this.pathPoints && this.pathPoints.length > 0) {
                    return this.pathPoints[this.pathPoints.length - 1];
                }
                return null;
            };
            Wire.prototype.drawPointsLine = function (point) {
                this.graphics.moveTo(this.prePoint.posx, this.prePoint.posy);
                this.graphics.curveTo((this.prePoint.posx + point.posx) / 2, (this.prePoint.posy + point.posy) / 2, point.posx, point.posy);
                this.graphics.endFill();
                this.pathPoints.push(point);
                this.prePoint = point;
            };
            Wire.prototype.drawFollowLine = function (point, isStart, direction, color) {
                if (color === void 0) { color = this.blueColor; }
                if (direction !== void 0) {
                    this.lineDirection = direction;
                }
                if (this.lineDirection === void 0) {
                    this.lineDirection = Wire.calDirection(this.prePoint, point);
                }
                this.reDrawStraightLine();
                var _beginPoint = isStart ? this.pathPoints[0] : this.pathPoints[this.pathPoints.length - 1];
                var _nextPoint;
                var _endPoint = new Wire.PathPoint(point.posx, point.posy);
                if (this.lineDirection == element.Direction.Horizon) {
                    _nextPoint = new Wire.PathPoint(point.posx, _beginPoint.posy);
                }
                else {
                    _nextPoint = new Wire.PathPoint(_beginPoint.posx, point.posy);
                }
                this.graphics.lineStyle(this.thickness, color);
                this.graphics.moveTo(_beginPoint.posx, _beginPoint.posy);
                this.graphics.lineTo(_nextPoint.posx, _nextPoint.posy);
                this.graphics.moveTo(_nextPoint.posx, _nextPoint.posy);
                this.graphics.lineTo(_endPoint.posx, _endPoint.posy);
                this.graphics.endFill();
            };
            Wire.prototype.setFollowToReal = function (point, isStart) {
                var _beginPoint = isStart ? this.pathPoints[0] : this.pathPoints[this.pathPoints.length - 1];
                var _nextPoint;
                var _endPoint = new Wire.PathPoint(point.posx, point.posy);
                if (this.lineDirection == element.Direction.Horizon) {
                    _nextPoint = new Wire.PathPoint(point.posx, _beginPoint.posy);
                }
                else {
                    _nextPoint = new Wire.PathPoint(_beginPoint.posx, point.posy);
                }
                if (isStart) {
                    this.pathPoints.unshift(_endPoint, _nextPoint);
                }
                else {
                    this.pathPoints.push(_nextPoint);
                    this.pathPoints.push(_endPoint);
                }
                this.reDrawStraightLine();
            };
            Wire.prototype.drawStraightLine = function (point) {
                if (this.lineDirection === void 0) {
                    this.lineDirection = Wire.calDirection(this.prePoint, point);
                }
                var _len = this.pathPoints.length;
                var _lastPoint = this.pathPoints[_len - 1];
                if (Wire.isTurn(this.prePoint, point, this.lineDirection)) {
                    if (this.lineDirection == Direction.Horizon) {
                        var _turnPoint = new Wire.PathPoint(this.prePoint.posx, _lastPoint.posy);
                        if (Math.abs((point.posy - _turnPoint.posy)) < Wire.MIN_LENGTH) {
                            this.reDrawStraightLine(point.posx, _lastPoint.posy);
                        }
                        else {
                            this.pathPoints.push(_turnPoint);
                            this.reDrawStraightLine(_turnPoint.posx, point.posy);
                            this.lineDirection = Direction.Vertical;
                        }
                    }
                    else {
                        var _turnPoint = new Wire.PathPoint(_lastPoint.posx, this.prePoint.posy);
                        if (Math.abs((point.posx - _turnPoint.posx)) < Wire.MIN_LENGTH) {
                            this.reDrawStraightLine(_lastPoint.posx, point.posy);
                        }
                        else {
                            var _turnPoint = new Wire.PathPoint(_lastPoint.posx, this.prePoint.posy);
                            this.pathPoints.push(_turnPoint);
                            this.reDrawStraightLine(point.posx, _turnPoint.posy);
                            this.lineDirection = Direction.Horizon;
                        }
                    }
                }
                else {
                    if (this.lineDirection == Direction.Horizon) {
                        this.reDrawStraightLine(point.posx, _lastPoint.posy);
                    }
                    else {
                        this.reDrawStraightLine(_lastPoint.posx, point.posy);
                    }
                }
                this.graphics.endFill();
                this.prePoint = point;
            };
            Wire.prototype.reDrawStraightLine = function (endX, endY) {
                this.graphics.clear();
                this.graphics.lineStyle(this.thickness, this.color);
                var _len = this.pathPoints.length;
                for (var i = 1; i < _len; i++) {
                    this.graphics.moveTo(this.pathPoints[i - 1].posx, this.pathPoints[i - 1].posy);
                    this.graphics.lineTo(this.pathPoints[i].posx, this.pathPoints[i].posy);
                }
                if (endX !== void 0 && endY !== void 0) {
                    this.graphics.moveTo(this.pathPoints[i - 1].posx, this.pathPoints[i - 1].posy);
                    this.graphics.lineTo(endX, endY);
                }
                this.graphics.endFill();
            };
            Wire.prototype.endLine = function (x, y, isAdsorbed) {
                if (isAdsorbed === void 0) { isAdsorbed = false; }
                var _last = this.pathPoints[this.pathPoints.length - 1];
                if (this.lineType == "Line") {
                    if (this.lineDirection == Direction.Horizon) {
                        if (isAdsorbed) {
                            _last.posy = y;
                            this.pathPoints.push(new Wire.PathPoint(x, y));
                        }
                        else {
                            this.pathPoints.push(new Wire.PathPoint(x, _last.posy));
                        }
                        this.reDrawStraightLine();
                    }
                    else {
                        if (isAdsorbed) {
                            _last.posx = x;
                            this.pathPoints.push(new Wire.PathPoint(x, y));
                        }
                        else {
                            this.pathPoints.push(new Wire.PathPoint(_last.posx, y));
                        }
                        this.reDrawStraightLine();
                    }
                }
                else {
                    if (isAdsorbed) {
                        this.pathPoints.push(new Wire.PathPoint(x, y));
                        this.graphics.moveTo(_last.posx, _last.posy);
                        var _curvePoint = new Wire.PathPoint((_last.posx + x) / 2, (_last.posy + y) / 2);
                        this.graphics.curveTo(_curvePoint.posx, _curvePoint.posy, x, y);
                        this.graphics.endFill();
                    }
                }
            };
            Wire.prototype.onMoveEnd = function () {
                var _that = this;
                if (_that.lineType == "Line") {
                    var _len = _that.pathPoints.length;
                    var _offX = _that.x;
                    var _offY = _that.y;
                    _that.x = 0;
                    _that.y = 0;
                    for (var i = 0; i < _len; i++) {
                        var _point = this.pathPoints[i];
                        _point.posx = _point.posx + _offX;
                        _point.posy = _point.posy + _offY;
                    }
                    this.reDrawStraightLine();
                }
            };
            Wire.prototype.getStateData = function () {
                return JSON.stringify({
                    "lineType": this.lineType,
                    "color": this.color,
                    "thickness": this.thickness,
                    "lineDirection": this.lineDirection,
                    "pathPoint": this.pathPoints,
                    "prePoint": this.prePoint,
                    "startUUID": this.startUUID,
                    "endUUID": this.endUUID
                });
            };
            Wire.prototype.setStateData = function (data) {
                if (data) {
                    data = JSON.parse(data);
                    this.lineType = data["lineType"];
                    this.color = data["color"];
                    this.thickness = data["thickness"];
                    this.lineDirection = data["lineDirection"];
                    this.pathPoints = data["pathPoint"];
                    this.startUUID = data["startUUID"];
                    this.endUUID = data["endUUID"];
                }
            };
            Wire.prototype.reDraw = function () {
                if (this.lineType == "Line") {
                    this.reDrawStraightLine();
                }
                else {
                    this.reDrawPointLine();
                }
            };
            Wire.prototype.reDrawPointLine = function () {
                var _len = this.pathPoints.length;
                this.graphics.clear();
                this.graphics.lineStyle(this.thickness, this.color);
                for (var i = 1; i < _len; i++) {
                    this.graphics.moveTo(this.pathPoints[i - 1].posx, this.pathPoints[i - 1].posy);
                    this.graphics.curveTo((this.pathPoints[i - 1].posx + this.pathPoints[i].posx) / 2, (this.pathPoints[i - 1].posy + this.pathPoints[i].posy) / 2, this.pathPoints[i].posx, this.pathPoints[i].posy);
                }
                this.graphics.endFill();
            };
            Wire.prototype.getLineType = function () {
                return this.lineType;
            };
            Wire.prototype.getDirection = function () {
                return this.lineDirection;
            };
            Wire.calDirection = function (start, end) {
                if (Math.abs((end.posy - start.posy)) > Math.abs((end.posx - start.posx))) {
                    return Direction.Vertical;
                }
                else {
                    return Direction.Horizon;
                }
            };
            Wire.isTurn = function (start, end, direction) {
                switch (direction) {
                    case Direction.Horizon:
                        {
                            var _angle = Math.abs(Math.atan((end.posy - start.posy) / (end.posx - start.posx)) * 360 / (2 * Math.PI));
                            return _angle > 45;
                        }
                    case Direction.Vertical:
                        {
                            var _angle = Math.abs(Math.atan((end.posx - start.posx) / (end.posy - start.posy)) * 360 / (2 * Math.PI));
                            return _angle > 45;
                        }
                }
            };
            Wire.circuittype = "Wire";
            Wire.MIN_LENGTH = 30;
            return Wire;
        })(egret.Shape);
        element.Wire = Wire;
        var Wire;
        (function (Wire) {
            var PathPoint = (function () {
                function PathPoint(posx, posy) {
                    this.posx = posx;
                    this.posy = posy;
                }
                return PathPoint;
            })();
            Wire.PathPoint = PathPoint;
        })(Wire = element.Wire || (element.Wire = {}));
    })(element || (element = {}));
    var element;
    (function (element) {
        var CircuitElFactory = (function () {
            function CircuitElFactory() {
            }
            CircuitElFactory.createCircuitEl = function (type, x, y, isSymbol) {
                switch (type.toLocaleLowerCase()) {
                    case 'amperemeter':
                        return new element.AmpereMeter(x, y, isSymbol);
                    case 'bell':
                        return new element.Bell(x, y, isSymbol);
                    case 'fan':
                        return new element.Fan(x, y, isSymbol);
                    case 'light':
                        return new element.Light(x, y, isSymbol);
                    case 'power':
                        return new element.Power(x, y, isSymbol);
                    case 'resistance':
                        return new element.Resistance(x, y, isSymbol);
                    case 'sliderheostat':
                        return new element.SlideRheostat(x, y, isSymbol);
                    case 'switch':
                        return new element.Switch(x, y, isSymbol);
                    case 'voltmeter':
                        return new element.Voltmeter(x, y, isSymbol);
                    default:
                        return new element.CircuitEl(x, y);
                }
            };
            return CircuitElFactory;
        })();
        element.CircuitElFactory = CircuitElFactory;
    })(element || (element = {}));
    var scenes;
    (function (scenes) {
        var HistoryAction = (function () {
            function HistoryAction() {
                this.historyData = [];
                this.currentActionIndex = 0;
                this.allObj = {};
            }
            HistoryAction.prototype.canRedo = function () {
                if (this.currentActionIndex + 1 >= this.historyData.length) {
                    return false;
                }
                return true;
            };
            HistoryAction.prototype.canUndo = function () {
                if (this.currentActionIndex <= 0) {
                    return false;
                }
                return true;
            };
            HistoryAction.prototype.getData = function (action) {
                if (this.currentActionIndex < this.historyData.length && this.currentActionIndex >= 0) {
                    if (action) {
                        return this.historyData[++this.currentActionIndex];
                    }
                    else {
                        return this.historyData[--this.currentActionIndex];
                    }
                }
                else {
                    return "";
                }
            };
            HistoryAction.prototype.clear = function () {
                this.historyData = [];
                this.currentActionIndex = 0;
            };
            HistoryAction.prototype.pushData = function (data) {
                this.historyData.splice(this.currentActionIndex + 1);
                this.historyData.push(data);
                if (this.historyData.length > HistoryAction.maxAction) {
                    this.historyData.shift();
                    this.removeNotNeedObj();
                }
                this.currentActionIndex = this.historyData.length - 1;
            };
            HistoryAction.prototype.setData = function (data) {
                this.historyData[this.currentActionIndex] = data;
            };
            HistoryAction.prototype.pushObj = function (key, obj) {
                if (!this.allObj[key]) {
                    this.allObj[key] = obj;
                }
            };
            HistoryAction.prototype.getObj = function (key) {
                return this.allObj[key];
            };
            HistoryAction.prototype.removeNotNeedObj = function () {
                var keyMap = {};
                var that = this;
                for (var index = 0; index < this.historyData.length; index++) {
                    $.each(this.historyData[index], function (key, item) {
                        keyMap[key] = true;
                    });
                }
                $.each(this.allObj, function (key, item) {
                    if (!keyMap[key]) {
                        that.allObj[key] = null;
                    }
                });
            };
            HistoryAction.maxAction = 6;
            return HistoryAction;
        })();
        scenes.HistoryAction = HistoryAction;
    })(scenes || (scenes = {}));
    var scenes;
    (function (scenes) {
        var ModeType;
        (function (ModeType) {
            ModeType[ModeType["DrawPoint"] = 0] = "DrawPoint";
            ModeType[ModeType["DrawLine"] = 1] = "DrawLine";
            ModeType[ModeType["Select"] = 2] = "Select";
            ModeType[ModeType["Delete"] = 3] = "Delete";
        })(ModeType || (ModeType = {}));
        var MainScene = (function (_super) {
            __extends(MainScene, _super);
            function MainScene() {
                _super.call(this);
                this.addPosX = 0;
                this.addPosY = 0;
                this.addCircuitX = 200;
                this.addCircuitY = 200;
                this.addSymbolX = 1500;
                this.addSymbolY = 300;
                this.gapWidth = 300;
                this.gapHeight = 300;
                this.circuitArray = [];
                this.circuitSymbolArray = [];
                this.wireArray = [];
                this.straightLineArray = [];
                this.dragX = -1;
                this.dragY = -1;
                this.isSymbol = false;
                this.enableDisplayLetter = true;
                this.nineSquareArray = [];
                this.addTempPlace = -1;
                this.selectMode = ModeType.Select;
                this.firstSave = true;
                this.uuid = utils.Utils.uuid(8);
            }
            MainScene.prototype.getUUid = function () {
                if (this.uuid) {
                    return this.uuid;
                }
                else {
                    this.uuid = utils.Utils.uuid(8);
                    return this.uuid;
                }
            };
            MainScene.prototype.getPresenter = function () {
                return this.circuitPresenter;
            };
            MainScene.prototype.init = function () {
                this.stage.addEventListener('sendAction', this.dealAction, this);
                for (var index = 0; index < 9; index++) {
                    this.nineSquareArray.push({
                        "hasPut": false,
                        "x": this.addCircuitX + (this.gapWidth * (index % 3)),
                        "y": this.addCircuitY + (this.gapHeight * Math.floor(index / 3))
                    });
                }
                this.action = new scenes.HistoryAction();
                this.saveActionData();
            };
            MainScene.prototype.showTip = function (type) {
                var presenter = this.getPresenter();
                switch (type) {
                    case 'circuit': {
                        presenter.showTip("circuit");
                        break;
                    }
                    case 'symbol': {
                        presenter.showTip("symbol");
                        break;
                    }
                    case 'nospace': {
                        presenter.showTip("nospace");
                        break;
                    }
                }
            };
            MainScene.prototype.calOutOfBoder = function () {
                var _that = this;
                if (this.dragX == -1 && this.dragY == -1) {
                    if (_that.isSymbol) {
                        if (this.curSymbolOrLine && this.curSymbolOrLine.getDirection() == element.Direction.Horizon) {
                            if (_that.addPosX < 130 || _that.addPosX > _that.stage.stageWidth - 130) {
                                this.showTip("nospace");
                                return false;
                            }
                            if (_that.addPosY < 40 || _that.addPosY > _that.stage.stageHeight - 40) {
                                this.showTip("nospace");
                                return false;
                            }
                        }
                        else if (this.curSymbolOrLine && this.curSymbolOrLine.getDirection() == element.Direction.Vertical) {
                            if (_that.addPosX < 60 || _that.addPosX > _that.stage.stageWidth - 60) {
                                this.showTip("nospace");
                                return false;
                            }
                            if (_that.addPosY < 130 || _that.addPosY > _that.stage.stageHeight - 130) {
                                this.showTip("nospace");
                                return false;
                            }
                        }
                        else {
                            if (_that.addPosX < 130 || _that.addPosX > _that.stage.stageWidth - 130) {
                                this.showTip("nospace");
                                return false;
                            }
                            if (_that.addPosY < 40 || _that.addPosY > _that.stage.stageHeight - 40) {
                                this.showTip("nospace");
                                return false;
                            }
                        }
                    }
                }
                return true;
            };
            MainScene.prototype.calMaxCircuit = function () {
                if (this.isSymbol) {
                    if (this.circuitSymbolArray.length == 9) {
                        this.showTip('symbol');
                        return false;
                    }
                }
                else {
                    if (this.circuitArray.length == 9) {
                        this.showTip('circuit');
                        return false;
                    }
                }
                return true;
            };
            MainScene.prototype.calSymbolPositon = function () {
                if (this.dragX == -1 && this.dragY == -1) {
                    if (!this.curSymbolOrLine) {
                        this.addPosX = this.addSymbolX;
                        this.addPosY = this.addSymbolY;
                        return -1;
                    }
                    else {
                        if (this.curSymbolOrLine.constructor == element.Wire) {
                            var _wire = this.curSymbolOrLine;
                            if (!_wire.endUUID) {
                                var _point = _wire.getEndPoint();
                                var _endP = _wire.localToGlobal(_point.posx, _point.posy);
                                this.addPosX = _endP.x;
                                this.addPosY = _endP.y;
                                return _wire.getDirection4Point(1);
                            }
                            else if (!_wire.startUUID) {
                                var _point = _wire.getFirstPoint();
                                var _beginP = _wire.localToGlobal(_point.posx, _point.posy);
                                this.addPosX = _beginP.x;
                                this.addPosY = _beginP.y;
                                return _wire.getDirection4Point(0);
                            }
                            else {
                                this.addPosX = this.addSymbolX;
                                this.addPosY = this.addSymbolY;
                                return -1;
                            }
                        }
                        else {
                            var _circuitEl = this.curSymbolOrLine;
                            var _connector = _circuitEl.getConnectorPoint();
                            if (_connector) {
                                this.addPosX = _connector.x;
                                this.addPosY = _connector.y;
                                return _connector.offset;
                            }
                            else {
                                this.addPosX = this.addSymbolX;
                                this.addPosY = this.addSymbolY;
                                return -1;
                            }
                        }
                    }
                }
                else {
                    this.addTempPlace = -1;
                    this.addPosX = this.dragX;
                    this.addPosY = this.dragY;
                    return -1;
                }
            };
            MainScene.prototype.calCircuitPosition = function () {
                if (this.dragX == -1 && this.dragY == -1) {
                    for (var index = 0; index < this.nineSquareArray.length; index++) {
                        var item = this.nineSquareArray[index];
                        if (!item.hasPut) {
                            this.addPosX = item.x;
                            this.addPosY = item.y;
                            item.hasPut = true;
                            this.addTempPlace = index;
                            break;
                        }
                    }
                }
                else {
                    this.addTempPlace = -1;
                    this.addPosX = this.dragX;
                    this.addPosY = this.dragY;
                }
            };
            MainScene.prototype.dealAction = function (event) {
                var action = event.data.action;
                this.isSymbol = event.data.isSymbol;
                this.dragX = event.data.dragX ? event.data.dragX : -1;
                this.dragY = event.data.dragY ? event.data.dragY : -1;
                if (!action) {
                    return;
                }
                switch (action.toLowerCase()) {
                    case 'light':
                    case 'amperemeter':
                    case 'bell':
                    case 'fan':
                    case 'resistance':
                    case 'power':
                    case 'sliderheostat':
                    case 'switch':
                    case 'voltmeter': {
                        if (this.calMaxCircuit()) {
                            if (this.isSymbol) {
                                var _offsetIndex = this.calSymbolPositon();
                                if (this.calOutOfBoder()) {
                                    this.addAction(element.CircuitElFactory.createCircuitEl(action.toLowerCase(), this.addPosX, this.addPosY, this.isSymbol));
                                    var _last = this.circuitSymbolArray[this.circuitSymbolArray.length - 1];
                                    if (_offsetIndex != -1) {
                                        _last.rotate(this.curSymbolOrLine.getDirection());
                                        _last.setOffSet(_offsetIndex);
                                        if (this.curSymbolOrLine && this.curSymbolOrLine.constructor == element.Wire) {
                                            var _wire = this.curSymbolOrLine;
                                            if (!_wire.endUUID) {
                                                _wire.endUUID = _last.uuid;
                                            }
                                            else if (!_wire.startUUID) {
                                                _wire.startUUID = _last.uuid;
                                            }
                                        }
                                        else {
                                            var _circuitEl = this.curSymbolOrLine;
                                            if (_offsetIndex == 0) {
                                                _circuitEl.endUUID = _last.uuid;
                                            }
                                            else {
                                                _circuitEl.startUUID = _last.uuid;
                                            }
                                        }
                                        if (_offsetIndex == 0) {
                                            _last.startUUID = this.curSymbolOrLine.uuid;
                                        }
                                        else {
                                            _last.endUUID = this.curSymbolOrLine.uuid;
                                        }
                                    }
                                    if (this.dragX == -1 && this.dragY == -1) {
                                        this.curSymbolOrLine = _last;
                                    }
                                    if (!event.data.notSave)
                                        this.saveActionData();
                                }
                            }
                            else {
                                this.calCircuitPosition();
                                this.addAction(element.CircuitElFactory.createCircuitEl(action.toLowerCase(), this.addPosX, this.addPosY, this.isSymbol));
                                if (!event.data.notSave)
                                    this.saveActionData();
                            }
                        }
                        break;
                    }
                    case 'drawpoints': {
                        this.switchMode(ModeType.DrawPoint);
                        this.saveActionData(true);
                        break;
                    }
                    case 'drawline': {
                        this.switchMode(ModeType.DrawLine);
                        this.saveActionData(true);
                        break;
                    }
                    case 'delete': {
                        this.switchMode(ModeType.Delete);
                        this.saveActionData(true);
                        break;
                    }
                    case 'select': {
                        this.switchMode(ModeType.Select);
                        this.saveActionData(true);
                        break;
                    }
                    case 'undo': {
                        if (this.action.canUndo()) {
                            this.setActionData(this.action.getData(false), true);
                            this.getPresenter().switchButton('huifu', true);
                        }
                        if (this.action.canUndo()) {
                            this.getPresenter().switchButton('chexiao', true);
                        }
                        else {
                            this.getPresenter().switchButton('chexiao', false);
                        }
                        break;
                    }
                    case 'redo': {
                        if (this.action.canRedo()) {
                            this.setActionData(this.action.getData(true), true);
                            this.getPresenter().switchButton('chexiao', true);
                        }
                        if (this.action.canRedo()) {
                            this.getPresenter().switchButton('huifu', true);
                        }
                        else {
                            this.getPresenter().switchButton('huifu', false);
                        }
                        break;
                    }
                    case 'clear': {
                        this.clear();
                        break;
                    }
                    case 'displayletter': {
                        this.enableDisplayLetter = event.data.isDisplay;
                        this.switchLetterDisplay(this.enableDisplayLetter);
                        this.saveActionData(true);
                        break;
                    }
                    case 'presenterid': {
                        this.circuitPresenterId = event.data.uuid;
                        this.circuitPresenter = event.data.presenter;
                        this.circuitPresenter.hasSetToEgret();
                        break;
                    }
                    case 'recover': {
                        this.setActionData(event.data.recoverdata, false);
                        this.circuitPresenter.hasRecoverOver();
                        break;
                    }
                    case 'move': {
                        if (this.moveObj) {
                            this.moveObj.x = this.dragX;
                            this.moveObj.y = this.dragY;
                            var hasout = this.calHasOut(this.moveObj, this.dragX, this.dragY);
                            if (this.moveObj.isSymbol) {
                                if (this.curSymbolOrLine && !this.curSymbolConnectState) {
                                    if (!this.curSymbolOrLine.endUUID) {
                                        this.moveObj.startUUID = this.curSymbolOrLine.uuid;
                                        this.curSymbolOrLine.endUUID = this.moveObj.uuid;
                                    }
                                    else if (!this.curSymbolOrLine.startUUID) {
                                        this.moveObj.startUUID = this.curSymbolOrLine.uuid;
                                        this.curSymbolOrLine.startUUID = this.moveObj.uuid;
                                    }
                                    this.curSymbolOrLine = this.moveObj;
                                    this.setCurSymbolConnectState(this.moveObj);
                                }
                                if (this.curSymbolConnectState) {
                                    if (this.curSymbolConnectState == "START" || this.curSymbolConnectState == "END") {
                                        this.handleMoveCircuit(this.moveObj);
                                    }
                                }
                            }
                            if (!hasout) {
                                this.isFirstLeave = true;
                            }
                            if (this.isFirstLeave && hasout) {
                                this.getPresenter().cancelMove();
                                this.isFirstLeave = false;
                            }
                        }
                        break;
                    }
                    case 'moveend': {
                        if (this.moveObj) {
                            this.handleMoveCircuitEnd(this.moveObj);
                            if (this.moveObj.isSymbol) {
                                this.curSymbolOrLine = this.moveObj;
                            }
                            this.saveActionData();
                            this.moveObj = null;
                        }
                        break;
                    }
                    case 'moveoutside': {
                        this.stopMove(null);
                        this.onDrawWireEnd(null);
                        break;
                    }
                    case 'resize':{
                        this.stage.setContentSize(1920,1200)
                        break;
                    }
                }
            };
            MainScene.prototype.destroy = function () {
                this.switchMode(null);
                this.clear();
                this.stage.removeEventListener("sendAction", this.dealAction, this);
            };
            MainScene.prototype.clear = function () {
                this.removeChildren();
                this.wireArray.length = 0;
                this.straightLineArray.length = 0;
                this.circuitArray.length = 0;
                this.circuitSymbolArray.length = 0;
                this.curSymbolOrLine = null;
                this.nineSquareArray = [];
                for (var index = 0; index < 9; index++) {
                    this.nineSquareArray.push({
                        "hasPut": false,
                        "x": this.addCircuitX + (this.gapWidth * (index % 3)),
                        "y": this.addCircuitY + (this.gapHeight * Math.floor(index / 3))
                    });
                }
                this.getPresenter().switchButton('qingkong', false);
                this.saveActionData();
            };
            MainScene.prototype.cleartState = function () {
                if (!(this.wireArray.length == 0 && this.straightLineArray.length == 0
                    && this.circuitArray.length == 0 && this.circuitSymbolArray.length == 0)) {
                    this.getPresenter().switchButton('qingkong', true);
                }
                else {
                    this.getPresenter().switchButton('qingkong', false);
                }
            };
            MainScene.prototype.addLetterIndex = function (array, circuit) {
                var first = null;
                var index = 0;
                $.each(array, function (key, item) {
                    if (item.constructor == circuit.constructor) {
                        if (first == null) {
                            first = item;
                        }
                        if (index == 0) {
                            index = 1;
                            item.incLetter(-1);
                        }
                        else if (index == 1) {
                            first.incLetter(index++);
                            item.incLetter(index++);
                        }
                        else {
                            item.incLetter(index++);
                        }
                    }
                });
            };
            MainScene.prototype.switchLetterDisplay = function (enable) {
                $.each(this.circuitArray, function (key, item) {
                    item.setDisplayLetter(enable);
                });
                $.each(this.circuitSymbolArray, function (key, item) {
                    item.setDisplayLetter(enable);
                });
            };
            MainScene.prototype.switchMode = function (mode) {
                this.selectMode = mode;
                var that = this;
                if (mode == ModeType.DrawPoint || mode == ModeType.DrawLine) {
                    that.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, that.onDrawWireStart, that);
                    that.stage.removeEventListener(egret.TouchEvent.TOUCH_END, that.onDrawWireEnd, that);
                    that.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, that.onDrawWireStart, that);
                    that.stage.addEventListener(egret.TouchEvent.TOUCH_END, that.onDrawWireEnd, that);
                }
                else {
                    if (that.stage) {
                        that.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, that.onDrawWireStart, that);
                        that.stage.removeEventListener(egret.TouchEvent.TOUCH_END, that.onDrawWireEnd, that);
                    }
                }
                if (mode == ModeType.Delete) {
                    $.each(that.wireArray, function (key, item) {
                        item.addEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                    $.each(that.straightLineArray, function (key, item) {
                        item.addEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                    $.each(that.circuitArray, function (key, item) {
                        if (!item.hasEventListener(egret.TouchEvent.TOUCH_TAP))
                            item.addEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                    $.each(that.circuitSymbolArray, function (key, item) {
                        if (!item.hasEventListener(egret.TouchEvent.TOUCH_TAP))
                            item.addEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                }
                else {
                    $.each(that.wireArray, function (key, item) {
                        item.removeEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                    $.each(that.straightLineArray, function (key, item) {
                        item.removeEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                    $.each(that.circuitArray, function (key, item) {
                        if (item.hasEventListener(egret.TouchEvent.TOUCH_TAP))
                            item.removeEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                    $.each(that.circuitSymbolArray, function (key, item) {
                        if (item.hasEventListener(egret.TouchEvent.TOUCH_TAP))
                            item.removeEventListener(egret.TouchEvent.TOUCH_TAP, that.onDelete, that);
                    });
                }
                if (mode == ModeType.Select) {
                    $.each(that.straightLineArray, function (key, item) {
                        MainScene.addEvent(item, that);
                    });
                    $.each(that.circuitArray, function (key, item) {
                        MainScene.addEvent(item, that);
                    });
                    $.each(that.circuitSymbolArray, function (key, item) {
                        MainScene.addEvent(item, that);
                    });
                }
                else {
                    $.each(that.straightLineArray, function (key, item) {
                        MainScene.removeEvent(item, that);
                    });
                    $.each(that.circuitArray, function (key, item) {
                        MainScene.removeEvent(item, that);
                    });
                    $.each(that.circuitSymbolArray, function (key, item) {
                        MainScene.removeEvent(item, that);
                    });
                }
            };
            MainScene.removeEvent = function (circuit, that) {
                if (circuit.hasEventListener(egret.TouchEvent.TOUCH_BEGIN)) {
                    circuit.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, that.startMove, that);
                }
                if (circuit.hasEventListener(egret.TouchEvent.TOUCH_CANCEL)) {
                    circuit.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, that.stopMove, that);
                }
                if (circuit.hasEventListener(egret.TouchEvent.TOUCH_END)) {
                    circuit.removeEventListener(egret.TouchEvent.TOUCH_END, that.stopMove, that);
                }
            };
            MainScene.addEvent = function (circuit, that) {
                if (!circuit.hasEventListener(egret.TouchEvent.TOUCH_BEGIN)) {
                    circuit.addEventListener(egret.TouchEvent.TOUCH_BEGIN, that.startMove, that);
                }
                if (!circuit.hasEventListener(egret.TouchEvent.TOUCH_CANCEL)) {
                    circuit.addEventListener(egret.TouchEvent.TOUCH_CANCEL, that.stopMove, that);
                }
                if (!circuit.hasEventListener(egret.TouchEvent.TOUCH_END)) {
                    circuit.addEventListener(egret.TouchEvent.TOUCH_END, that.stopMove, that);
                }
            };
            MainScene.prototype.createLine = function (point) {
                var that = this;
                if (that.selectMode == ModeType.DrawPoint) {
                    $.each(that.circuitArray, function (key, item) {
                        var target = item.hitPointShape(point.posx, point.posy);
                        if (target) {
                            point.posx = target.x;
                            point.posy = target.y;
                            return false;
                        }
                    });
                    that.curWire = new element.Wire("Point", point, 6.5, 0x00b7ee);
                    that.wireArray.push(that.curWire);
                }
                else if (that.selectMode == ModeType.DrawLine) {
                    var connector = null;
                    var index = -1;
                    $.each(that.circuitSymbolArray, function (key, item) {
                        var target = item.hitPointShape4Symbol(point.posx, point.posy);
                        if (target) {
                            point.posx = target.point.x;
                            point.posy = target.point.y;
                            connector = item;
                            index = target.index;
                            return false;
                        }
                    });
                    that.curWire = new element.Wire("Line", point);
                    if (connector) {
                        that.curWire.startUUID = connector.uuid;
                        if (index == 0) {
                            connector.startUUID = that.curWire.uuid;
                        }
                        else if (index == 1) {
                            connector.endUUID = that.curWire.uuid;
                        }
                    }
                    that.curSymbolOrLine = that.curWire;
                    that.straightLineArray.push(that.curWire);
                }
                that.addChild(that.curWire);
                that.curWire.touchEnabled = true;
            };
            MainScene.prototype.onDrawWireStart = function (e) {
                this.drawPointID = e.touchPointID
                e.stopImmediatePropagation();
                var _point = new element.Wire.PathPoint(e.stageX, e.stageY);
                this.createLine(_point);
                this.touchEnabled = false;
                this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onDrawWireMove, this);
                this.cleartState();
            };
            MainScene.prototype.onDrawWireMove = function (e) {
                if(this.drawPointID == null || this.drawPointID != e.touchPointID){
                    return;
                }
                if (e.stageX < 10 || e.stageX > this.stage.stageWidth - 10 || e.stageY < 10 || e.stageY > this.stage.stageHeight - 10) {
                    this.onDrawWireEnd(null);
                    return;
                }
                var _point = new element.Wire.PathPoint(e.stageX, e.stageY);
                if (this.selectMode == ModeType.DrawPoint) {
                    this.curWire.drawPointsLine(_point);
                }
                else if (this.selectMode == ModeType.DrawLine) {
                    this.curWire.drawStraightLine(_point);
                }
            };
            MainScene.prototype.onDrawWireEnd = function (e) {
                this.drawPointID = null
                var that = this;
                if (that.curWire) {
                    that.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, that.onDrawWireMove, that);
                    that.touchEnabled = true;
                    var x = that.curWire.prePoint.posx;
                    var y = that.curWire.prePoint.posy;
                    if (that.selectMode == ModeType.DrawPoint) {
                        var isAdsorbed = false;
                        $.each(that.circuitArray, function (key, item) {
                            var target = item.hitPointShape(x, y);
                            if (target) {
                                x = target.x;
                                y = target.y;
                                isAdsorbed = true;
                                return false;
                            }
                        });
                        that.curWire.endLine(x, y, isAdsorbed);
                    }
                    else if (that.selectMode == ModeType.DrawLine) {
                        var connector = null;
                        var isAdsorbed = false;
                        var index = -1;
                        $.each(that.circuitSymbolArray, function (key, item) {
                            var target = item.hitPointShape4Symbol(x, y);
                            if (target) {
                                x = target.point.x;
                                y = target.point.y;
                                connector = item;
                                isAdsorbed = true;
                                index = target.index;
                                return false;
                            }
                        });
                        if (connector) {
                            that.curWire.endUUID = connector.uuid;
                            if (index == 0) {
                                connector.startUUID = that.curWire.uuid;
                            }
                            else if (index == 1) {
                                connector.endUUID = that.curWire.uuid;
                            }
                        }
                        that.curWire.endLine(x, y, isAdsorbed);
                    }
                    that.curWire = null;
                    that.saveActionData();
                }
            };
            MainScene.prototype.addAction = function (circiut) {
                this.moveObj = circiut;
                this.isFirstLeave = false;
                if (this.isSymbol) {
                    this.circuitSymbolArray.push(circiut);
                    this.addLetterIndex(this.circuitSymbolArray, circiut);
                }
                else {
                    this.circuitArray.push(circiut);
                    this.addLetterIndex(this.circuitArray, circiut);
                }
                circiut.addPlace = this.addTempPlace;
                circiut.touchEnabled = true;
                if (this.selectMode == ModeType.Select) {
                    MainScene.addEvent(circiut, this);
                }
                if (this.selectMode == ModeType.Delete) {
                    circiut.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
                }
                circiut.setDisplayLetter(this.enableDisplayLetter);
                this.addChild(circiut);
                this.cleartState();
            };
            MainScene.prototype.setCurSymbolConnectState = function (_target) {
                var _that = this;
                if (_target.startUUID && _target.endUUID) {
                    _that.curSymbolConnectState = "ALL";
                }
                else if (_target.startUUID && !_target.endUUID) {
                    _that.curSymbolConnectState = "START";
                }
                else if (!_target.startUUID && _target.endUUID) {
                    _that.curSymbolConnectState = "END";
                }
                else {
                    _that.curSymbolConnectState = "NONE";
                }
            };
            MainScene.prototype.startMove = function (e) {
                this.downPointID = e.touchPointID
                e.stopImmediatePropagation();
                this.draggedObject = e.currentTarget;
                if (this.draggedObject.addPlace != -1 && this.draggedObject.addPlace >= 0 && this.draggedObject.addPlace < 9) {
                    this.nineSquareArray[this.draggedObject.addPlace].hasPut = false;
                    this.draggedObject.addPlace = -1;
                }
                var _target = this.draggedObject;
                if (_target.constructor != element.Wire && _target.isSymbol) {
                    this.setCurSymbolConnectState(_target);
                }
                this.offsetX = e.stageX - this.draggedObject.x;
                this.offsetY = e.stageY - this.draggedObject.y;
                this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            };
            MainScene.prototype.stopMove = function (e) {
                this.downPointID = null
                if (this.draggedObject) {
                    var _that = this;
                    _that.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, _that.onMove, _that);
                    var _target = this.draggedObject;
                    var _constructor = _target.constructor;
                    if (_constructor == element.Wire) {
                        _that.handleMoveWireEnd(_target);
                    }
                    else {
                        _that.handleMoveCircuitEnd(_target);
                    }
                    this.draggedObject = null;
                    this.saveActionData();
                }
            };
            MainScene.prototype.calHasOut = function (obj, x, y) {
                var _that = this;
                var hasout = false;
                if (obj) {
                    var stageWidth;
                    var stageHeight;
                    if (_that && _that.stage && _that.stage.stageWidth && _that.stage.stageHeight) {
                        stageWidth = _that.stage.stageWidth;
                        stageHeight = _that.stage.stageHeight;
                    }
                    else {
                        stageWidth = 1920;
                        stageHeight = 1200;
                    }
                    if (obj.constructor == element.Wire) {
                        var offsetTop = obj.graphics.maxY;
                        var offsetBottom = obj.graphics.minY;
                        var offsetLeft = obj.graphics.minX;
                        var offsetRight = obj.graphics.maxX;
                        if (obj.x + offsetLeft < 0) {
                            obj.x = -offsetLeft;
                        }
                        if (obj.y + offsetBottom < 0) {
                            obj.y = -offsetBottom;
                        }
                        if (obj.x + offsetRight > stageWidth) {
                            obj.x = stageWidth - offsetRight;
                        }
                        if (obj.y + offsetTop > stageHeight) {
                            obj.y = stageHeight - offsetTop;
                        }
                    }
                    else {
                        var offsetTop = 0;
                        var offsetBottom = 0;
                        var offsetLeft = 0;
                        var offsetRight = 0;
                        if (obj.getDirection() == element.Direction.Horizon || obj.hasVerticalImg) {
                            offsetLeft = offsetRight = obj.getCircuitImageWidth() / 2;
                            offsetBottom = obj.getCircuitImageHeight() / 2;
                            offsetTop = obj.getCircuitImageHeight() / 2 + obj.getTextHeightOffset();
                        }
                        else {
                            offsetLeft = obj.getCircuitImageHeight() / 2;
                            offsetRight = obj.getCircuitImageHeight() / 2 + obj.getTextWidthOffset();
                            offsetBottom = offsetTop = obj.getCircuitImageWidth() / 2;
                        }
                        if (obj.x - offsetLeft < 0) {
                            obj.x = offsetLeft;
                        }
                        if (obj.y - offsetBottom < 0) {
                            obj.y = offsetBottom;
                        }
                        if (obj.x + offsetRight > stageWidth) {
                            obj.x = stageWidth - offsetRight;
                        }
                        if (obj.y + offsetTop > stageHeight) {
                            obj.y = stageHeight - offsetTop;
                        }
                    }
                    if (x < 10 || y < 10 || x > stageWidth - 10 || y > stageHeight - 10) {
                        hasout = true;
                    }
                }
                return hasout;
            };
            MainScene.prototype.onMove = function (e) {
                if(this.downPointID == null || this.downPointID != e.touchPointID)
                    return;
                var _that = this;
                _that.draggedObject.x = e.stageX - this.offsetX;
                _that.draggedObject.y = e.stageY - this.offsetY;
                var hasout = this.calHasOut(_that.draggedObject, e.stageX, e.stageY);
                if (_that.curSymbolConnectState) {
                    if (_that.curSymbolConnectState == "START" || _that.curSymbolConnectState == "END") {
                        this.handleMoveCircuit(_that.draggedObject);
                    }
                }
                if (hasout) {
                    console.log('hasout')
                    _that.stopMove(null);
                }
            };
            MainScene.prototype.handleMoveCircuit = function (circuitEl) {
                var _that = this;
                var _connectorUUID;
                if (_that.curSymbolConnectState == "START") {
                    _connectorUUID = circuitEl.startUUID;
                }
                else if (_that.curSymbolConnectState == "END") {
                    _connectorUUID = circuitEl.endUUID;
                }
                var _connector = _that.action.getObj(_connectorUUID);
                if (_connector == null) {
                    console.log("空对象");
                    _connector = _that.tempFollowWire;
                }
                var _uuid = circuitEl.uuid;
                var _wireDrawDirection;
                if (_connector.constructor != element.Wire) {
                    var _startPoint;
                    var _paramName;
                    if (_connector.startUUID == _uuid) {
                        _startPoint = _connector.getConPoint("START");
                        _paramName = "startUUID";
                    }
                    else if (_connector.endUUID == _uuid) {
                        _startPoint = _connector.getConPoint("END");
                        _paramName = "endUUID";
                    }
                    else {
                        console.log("error on handleMoveCircuit", "no connector");
                        return;
                    }
                    var _pathPoint = new element.Wire.PathPoint(_startPoint.x, _startPoint.y);
                    var _wire = new element.Wire("Line", _pathPoint);
                    _wire.startUUID = _connector.uuid;
                    _wire.endUUID = _uuid;
                    if (_connector.getDirection() == element.Direction.Horizon) {
                        _wireDrawDirection = element.Direction.Vertical;
                    }
                    else {
                        _wireDrawDirection = element.Direction.Horizon;
                    }
                    _connector[_paramName] = _wire.uuid;
                    if (_that.curSymbolConnectState == "START") {
                        circuitEl.startUUID = _wire.uuid;
                    }
                    else if (_that.curSymbolConnectState == "END") {
                        circuitEl.endUUID = _wire.uuid;
                    }
                    _connector = _wire;
                    _that.addChild(_wire);
                    _that.straightLineArray.push(_wire);
                    _wire.touchEnabled = true;
                    _wire.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _that.startMove, _that);
                    _wire.addEventListener(egret.TouchEvent.TOUCH_END, _that.stopMove, _that);
                    _that.tempFollowWire = _wire;
                }
                var isStart;
                var _beginPoint;
                if (_connector.startUUID == _uuid) {
                    isStart = true;
                    _beginPoint = _connector.getFirstPoint();
                }
                else if (_connector.endUUID == _uuid) {
                    _beginPoint = _connector.getEndPoint();
                    isStart = false;
                }
                else {
                    console.log("error on get wire draw follo line direction");
                    return;
                }
                _that.changeConnectorPoint(circuitEl, _beginPoint, _connector.uuid);
                var _nextPoint = circuitEl.getConPoint(_that.curSymbolConnectState);
                var _pathPoint = new element.Wire.PathPoint(_nextPoint.x, _nextPoint.y);
                _that.drawFollow(_connector, circuitEl, _beginPoint, _pathPoint, isStart, _wireDrawDirection);
            };
            MainScene.prototype.changeConnectorPoint = function (circuitEl, beginPoint, uuid) {
                if (circuitEl.getDirection() == element.Direction.Horizon) {
                    if (beginPoint.posx > circuitEl.x) {
                        if (this.curSymbolConnectState == "START") {
                            this.curSymbolConnectState = "END";
                            circuitEl.endUUID = uuid;
                            circuitEl.startUUID = null;
                        }
                    }
                    else if ((beginPoint.posx < circuitEl.x)) {
                        if (this.curSymbolConnectState == "END") {
                            this.curSymbolConnectState = "START";
                            circuitEl.startUUID = uuid;
                            circuitEl.endUUID = null;
                        }
                    }
                }
                else {
                    if (beginPoint.posy > circuitEl.y) {
                        if (this.curSymbolConnectState == "START") {
                            this.curSymbolConnectState = "END";
                            circuitEl.endUUID = uuid;
                            circuitEl.startUUID = null;
                        }
                    }
                    else if (beginPoint.posy < circuitEl.y) {
                        if (this.curSymbolConnectState == "END") {
                            this.curSymbolConnectState = "START";
                            circuitEl.startUUID = uuid;
                            circuitEl.endUUID = null;
                        }
                    }
                }
            };
            MainScene.prototype.drawFollow = function (wire, circuitEl, beginPoint, endPoint, isStart, wireDrawDirection) {
                if (circuitEl.getDirection() == element.Direction.Horizon) {
                    var isOut = (circuitEl.y + 68 > this.stage.stageHeight) || (circuitEl.y - 68 < 0);
                    if (Math.abs(beginPoint.posx - circuitEl.x) < 65 && Math.abs(beginPoint.posy - circuitEl.y) > 65 && !isOut) {
                        circuitEl.showVirtualView(beginPoint.posx, circuitEl.y);
                        var _isStart = beginPoint.posy < circuitEl.y;
                        var newPoint = circuitEl.getVirtualViewConnectPoint(_isStart);
                        var newPathPoint = new element.Wire.PathPoint(newPoint.x, newPoint.y);
                        if (_isStart) {
                            circuitEl.startUUID = wire.uuid;
                            circuitEl.endUUID = null;
                            this.curSymbolConnectState = "START";
                        }
                        else {
                            circuitEl.startUUID = null;
                            circuitEl.endUUID = wire.uuid;
                            this.curSymbolConnectState = "END";
                        }
                        wire.drawFollowLine(newPathPoint, isStart, wireDrawDirection);
                    }
                    else {
                        circuitEl.hiddenVirtualView();
                        wire.drawFollowLine(endPoint, isStart, wireDrawDirection);
                    }
                }
                else {
                    var isOut = (circuitEl.x + 68 > this.stage.stageWidth) || (circuitEl.x - 68 < 0);
                    if (Math.abs(beginPoint.posx - circuitEl.x) > 65 && Math.abs(beginPoint.posy - circuitEl.y) < 65 && !isOut) {
                        circuitEl.showVirtualView(circuitEl.x, beginPoint.posy);
                        var _isStart = beginPoint.posx < circuitEl.x;
                        var newPoint = circuitEl.getVirtualViewConnectPoint(_isStart);
                        var newPathPoint = new element.Wire.PathPoint(newPoint.x, newPoint.y);
                        if (_isStart) {
                            circuitEl.startUUID = wire.uuid;
                            circuitEl.endUUID = null;
                            this.curSymbolConnectState = "START";
                        }
                        else {
                            circuitEl.startUUID = null;
                            circuitEl.endUUID = wire.uuid;
                            this.curSymbolConnectState = "END";
                        }
                        wire.drawFollowLine(newPathPoint, isStart, wireDrawDirection);
                    }
                    else {
                        circuitEl.hiddenVirtualView();
                        wire.drawFollowLine(endPoint, isStart, wireDrawDirection);
                    }
                }
            };
            MainScene.prototype.handleMoveCircuitEnd = function (circuitEl) {
                var _that = this;
                if (circuitEl && circuitEl.isSymbol) {
                    if (_that.curSymbolConnectState) {
                        if (_that.curSymbolConnectState == "ALL") {
                            _that.removeConnectRelative(circuitEl, "startUUID");
                            _that.removeConnectRelative(circuitEl, "endUUID");
                        }
                        else if (_that.curSymbolConnectState == "START") {
                            var _wire = _that.action.getObj(circuitEl.startUUID);
                            if (_wire == null) {
                                console.log("空对象");
                                _wire = _that.tempFollowWire;
                            }
                            if (circuitEl.isVirtualViewShow()) {
                                if (circuitEl.getDirection() == element.Direction.Horizon) {
                                    circuitEl.setVirtual2Real(element.Direction.Vertical);
                                }
                                else {
                                    circuitEl.setVirtual2Real(element.Direction.Horizon);
                                }
                            }
                            circuitEl.removeVirtualView();
                            var _point = circuitEl.getConPoint("START");
                            var _pathPoint = new element.Wire.PathPoint(_point.x, _point.y);
                            if (_wire.startUUID == circuitEl.uuid) {
                                _wire.setFollowToReal(_pathPoint, true);
                            }
                            else if (_wire.endUUID == circuitEl.uuid) {
                                _wire.setFollowToReal(_pathPoint, false);
                            }
                        }
                        else if (_that.curSymbolConnectState == "END") {
                            var _wire = _that.action.getObj(circuitEl.endUUID);
                            if (_wire == null) {
                                _wire = _that.tempFollowWire;
                            }
                            if (circuitEl.isVirtualViewShow()) {
                                if (circuitEl.getDirection() == element.Direction.Horizon) {
                                    circuitEl.setVirtual2Real(element.Direction.Vertical);
                                }
                                else {
                                    circuitEl.setVirtual2Real(element.Direction.Horizon);
                                }
                            }
                            circuitEl.removeVirtualView();
                            var _point = circuitEl.getConPoint("END");
                            var _pathPoint = new element.Wire.PathPoint(_point.x, _point.y);
                            if (_wire.startUUID == circuitEl.uuid) {
                                _wire.setFollowToReal(_pathPoint, true);
                            }
                            else if (_wire.endUUID == circuitEl.uuid) {
                                _wire.setFollowToReal(_pathPoint, false);
                            }
                        }
                    }
                    _that.curSymbolConnectState = null;
                    _that.tempFollowWire = null;
                }
            };
            MainScene.prototype.removeConnectRelative = function (obj, param) {
                var _that = this;
                if (obj[param]) {
                    var connector = _that.action.getObj(obj[param]);
                    if (connector != null) {
                        if (connector.startUUID == obj.uuid) {
                            connector.startUUID = null;
                        }
                        if (connector.endUUID == obj.uuid) {
                            connector.endUUID = null;
                        }
                    }
                    obj[param] = null;
                }
            };
            MainScene.prototype.handleMoveWireEnd = function (wire) {
                var _that = this;
                _that.removeConnectRelative(wire, "startUUID");
                _that.removeConnectRelative(wire, "endUUID");
                var _beginPoint = wire.getFirstPoint();
                var _beginP = wire.localToGlobal(_beginPoint.posx, _beginPoint.posy);
                var _endPoint = wire.getEndPoint();
                var _endP = wire.localToGlobal(_endPoint.posx, _endPoint.posy);
                var _circuitSymbol = null;
                var _beginHit;
                var _endHit;
                $.each(_that.circuitSymbolArray, function (key, item) {
                    _beginHit = item.hitPointShape4Symbol(_beginP.x, _beginP.y);
                    _endHit = item.hitPointShape4Symbol(_endP.x, _endP.y);
                    if (_beginHit || _endHit) {
                        _circuitSymbol = item;
                        return false;
                    }
                });
                var offsetX = 0;
                var offsetY = 0;
                if (_circuitSymbol) {
                    if (_beginHit) {
                        wire.startUUID = _circuitSymbol.uuid;
                        if (_beginHit.index == 0) {
                            _circuitSymbol.startUUID = wire.uuid;
                        }
                        else if (_beginHit.index == 1) {
                            _circuitSymbol.endUUID = wire.uuid;
                        }
                        offsetX = _beginP.x - _beginHit.point.x;
                        offsetY = _beginP.y - _beginHit.point.y;
                    }
                    else if (_endHit) {
                        wire.endUUID = _circuitSymbol.uuid;
                        if (_endHit.index == 0) {
                            _circuitSymbol.startUUID = wire.uuid;
                        }
                        else if (_endHit.index == 1) {
                            _circuitSymbol.endUUID = wire.uuid;
                        }
                        offsetX = _endP.x - _endHit.point.x;
                        offsetY = _endP.y - _endHit.point.y;
                    }
                }
                wire.x = wire.x - offsetX;
                wire.y = wire.y - offsetY;
                wire.onMoveEnd();
            };
            MainScene.prototype.onDelete = function (e) {
                e.stopImmediatePropagation();
                var that = this;
                $.each(that.circuitArray, function (key, item) {
                    if (e.currentTarget == item) {
                        if (item.addPlace != -1 && item.addPlace >= 0 && item.addPlace < 9) {
                            that.nineSquareArray[item.addPlace].hasPut = false;
                        }
                        that.circuitArray.splice(key, 1);
                        return false;
                    }
                });
                $.each(that.circuitSymbolArray, function (key, item) {
                    if (e.currentTarget == item) {
                        that.circuitSymbolArray.splice(key, 1);
                        return false;
                    }
                });
                $.each(that.wireArray, function (key, item) {
                    if (e.currentTarget == item) {
                        that.wireArray.splice(key, 1);
                        return false;
                    }
                });
                $.each(that.straightLineArray, function (key, item) {
                    if (e.currentTarget == item) {
                        that.straightLineArray.splice(key, 1);
                        return false;
                    }
                });
                if (that.contains(e.currentTarget)) {
                    that.removeChild((e.currentTarget));
                }
                this.addLetterIndex(this.circuitArray, e.currentTarget);
                this.addLetterIndex(this.circuitSymbolArray, e.currentTarget);
                this.removeConnectRelative(e.currentTarget, "startUUID");
                this.removeConnectRelative(e.currentTarget, "endUUID");
                if (this.curSymbolOrLine == e.currentTarget) {
                    this.curSymbolOrLine = null;
                }
                this.cleartState();
                this.saveActionData();
            };
            MainScene.getKeyArray = function (array) {
                var keys = [];
                for (var index = 0; index < array.length; index++) {
                    keys.push({ "key": array[index].getUUid(), "type": array[index].getType() });
                }
                return keys;
            };
            MainScene.prototype.getItemFromKey = function (keys, onlyPart, isSymbolorIsStraight) {
                var array = [];
                for (var index = 0; index < keys.length; index++) {
                    if (!onlyPart) {
                        if (keys[index].type != "Wire") {
                            var item = element.CircuitElFactory.createCircuitEl(keys[index].type, 0, 0, isSymbolorIsStraight);
                            item.touchEnabled = true;
                            item.setUUid(keys[index].key);
                            array.push(item);
                            this.action.pushObj(item.getUUid(), item);
                        }
                        else {
                            var item = new element.Wire();
                            item.touchEnabled = true;
                            item.setUUid(keys[index].key);
                            array.push(item);
                            this.action.pushObj(item.getUUid(), item);
                        }
                    }
                    else {
                        array.push(this.action.getObj(keys[index].key));
                    }
                }
                return array;
            };
            MainScene.prototype.getStateData = function () {
                var curUUID = "";
                if (this.curSymbolOrLine) {
                    curUUID = this.curSymbolOrLine.getUUid();
                }
                return JSON.stringify({
                    "addPosX": this.addPosX,
                    "addPosY": this.addPosY,
                    "circuitArray": MainScene.getKeyArray(this.circuitArray),
                    "circuitSymbolArray": MainScene.getKeyArray(this.circuitSymbolArray),
                    "wireArray": MainScene.getKeyArray(this.wireArray),
                    "straightLineArray": MainScene.getKeyArray(this.straightLineArray),
                    "selectMode": this.selectMode,
                    "nineSquareArray": [].concat(this.nineSquareArray),
                    "enableDisplayLetter": this.enableDisplayLetter,
                    "curSymbolOrLine": curUUID
                });
            };
            MainScene.prototype.setStateData = function (data, onlyPart) {
                if (data) {
                    data = JSON.parse(data);
                    if (!onlyPart) {
                        this.enableDisplayLetter = data["enableDisplayLetter"];
                        this.selectMode = data["selectMode"];
                        this.getPresenter().switchButton('displayLetter', this.enableDisplayLetter);
                        this.getPresenter().switchButton('xuanze', false);
                        this.getPresenter().switchButton('huadaoxian', false);
                        this.getPresenter().switchButton('huazhidaoxian', false);
                        this.getPresenter().switchButton('shanchu', false);
                        switch (this.selectMode) {
                            case ModeType.Delete: {
                                this.getPresenter().switchButton('shanchu', true);
                                break;
                            }
                            case ModeType.DrawLine: {
                                this.getPresenter().switchButton('huazhidaoxian', true);
                                break;
                            }
                            case ModeType.DrawPoint: {
                                this.getPresenter().switchButton('huadaoxian', true);
                                break;
                            }
                            case ModeType.Select: {
                                this.getPresenter().switchButton('xuanze', true);
                                break;
                            }
                        }
                    }
                    this.addPosY = data["addPosY"];
                    this.circuitArray = this.getItemFromKey(data["circuitArray"], onlyPart, false);
                    this.circuitSymbolArray = this.getItemFromKey(data["circuitSymbolArray"], onlyPart, true);
                    this.wireArray = this.getItemFromKey(data["wireArray"], onlyPart, false);
                    this.straightLineArray = this.getItemFromKey(data["straightLineArray"], onlyPart, true);
                    this.nineSquareArray = data["nineSquareArray"];
                    if (data["curSymbolOrLine"] != "") {
                        this.curSymbolOrLine = this.action.getObj(data["curSymbolOrLine"]);
                    }
                    else {
                        this.curSymbolOrLine = null;
                    }
                    this.switchMode(this.selectMode);
                    this.switchLetterDisplay(this.enableDisplayLetter);
                }
            };
            MainScene.prototype.saveActionData = function (updatePart) {
                if (updatePart === void 0) { updatePart = false; }
                var that = this;
                var dataMap = {};
                $.each(this.circuitArray, function (key, item) {
                    dataMap[item.getUUid()] = item.getStateData();
                    that.action.pushObj(item.getUUid(), item);
                });
                $.each(this.circuitSymbolArray, function (key, item) {
                    dataMap[item.getUUid()] = item.getStateData();
                    that.action.pushObj(item.getUUid(), item);
                });
                $.each(this.wireArray, function (key, item) {
                    dataMap[item.getUUid()] = item.getStateData();
                    that.action.pushObj(item.getUUid(), item);
                });
                $.each(this.straightLineArray, function (key, item) {
                    dataMap[item.getUUid()] = item.getStateData();
                    that.action.pushObj(item.getUUid(), item);
                });
                dataMap[this.getUUid()] = this.getStateData();
                dataMap["mainSceneID"] = this.getUUid();
                if (updatePart) {
                    that.action.setData(dataMap);
                }
                else {
                    that.action.pushObj(this.getUUid(), this);
                    that.action.pushData(dataMap);
                    if (that.getPresenter()) {
                        that.getPresenter().switchButton('huifu', false);
                    }
                }
                if (that.getPresenter() && !that.firstSave && !updatePart) {
                    that.getPresenter().switchButton('chexiao', true);
                }
                that.firstSave = false;
                if (that.getPresenter()) {
                    that.getPresenter().setSaveData(dataMap);
                }
            };
            MainScene.prototype.setActionData = function (data, onlyPart) {
                if (data != "") {
                    var that = this;
                    this.removeChildren();
                    if (!onlyPart) {
                        this.uuid = data["mainSceneID"];
                    }
                    this.setStateData(data[this.getUUid()], onlyPart);
                    $.each(this.circuitArray, function (key, item) {
                        item.setStateData(data[item.getUUid()]);
                        that.addChild(item);
                    });
                    $.each(this.circuitSymbolArray, function (key, item) {
                        item.setStateData(data[item.getUUid()]);
                        that.addChild(item);
                    });
                    $.each(this.wireArray, function (key, item) {
                        item.setStateData(data[item.getUUid()]);
                        that.addChild(item);
                        item.reDraw();
                    });
                    $.each(this.straightLineArray, function (key, item) {
                        item.setStateData(data[item.getUUid()]);
                        that.addChild(item);
                        item.reDraw();
                    });
                }
                this.cleartState();
                if (!onlyPart) {
                    this.firstSave = true;
                    this.action.clear();
                    this.saveActionData();
                }
            };
            MainScene.prototype.removeConnectRelative = function (obj, param) {
                var _that = this;
                if (obj[param]) {
                    var connector = _that.action.getObj(obj[param]);
                    if (connector != null) {
                        if (connector.startUUID == obj.uuid) {
                            connector.startUUID = null;
                        }
                        if (connector.endUUID == obj.uuid) {
                            connector.endUUID = null;
                        }
                    }
                    obj[param] = null;
                }
            };
            return MainScene;
        })(egret.DisplayObjectContainer);
        scenes.MainScene = MainScene;
    })(scenes || (scenes = {}));
})(GameCircuitDiagram || (GameCircuitDiagram = {}));
