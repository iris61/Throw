(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/components/GiftComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bb633EdaAJEwaGL8zdkySw5', 'GiftComponent', __filename);
// script/components/GiftComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var StorageUtils_1 = require("../utils/StorageUtils");
var Constants_1 = require("../Constants");
var ApplePartsControlComponent_1 = require("../components/ApplePartsControlComponent");
var NODE_NAME_GIFT_COIN_COUNT = "gift_coin_count";
var NODE_NAME_GIFT_COIN_COUNT_CONTAINER = "gift_coin_count_container";
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GiftComponent = /** @class */ (function (_super) {
    __extends(GiftComponent, _super);
    function GiftComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.giftMask = null;
        _this.applePartsPrefab = null;
        _this.timerLabel = null;
        _this.currencyLabel = null;
        _this.giftOpenAudio = null;
        _this.giftApples = [];
        _this.giftCountDown = Constants_1.Constants.GIFT_COUNTDOWN_TIME;
        _this.isMaskShow = false;
        return _this;
    }
    GiftComponent.prototype.onLoad = function () {
        var _this = this;
        cc.log("GiftComponent onLoad");
        this.updateGiftCountdown();
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (_this.giftCountDown <= 0) {
                _this.openGift(50 + Math.floor(Math.random() * 10));
            }
        }, this);
    };
    GiftComponent.prototype.start = function () {
    };
    GiftComponent.prototype.update = function (dt) {
        this.updateGiftCountdown();
    };
    GiftComponent.prototype.transNumberToString = function (num) {
        return num < 10 ? "0" + num : String(num);
    };
    GiftComponent.prototype.openGift = function (coins) {
        var _this = this;
        if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.giftOpenAudio, false);
        }
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_NEXT_GIFT_TIME, new Date().getTime() + Constants_1.Constants.GIFT_COUNTDOWN_TIME);
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0) + coins);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        this.isMaskShow = true;
        this.giftMask.opacity = 200;
        this.giftMask.getChildByName(NODE_NAME_GIFT_COIN_COUNT_CONTAINER).getChildByName(NODE_NAME_GIFT_COIN_COUNT).getComponent(cc.Label).string = "+" + String(coins);
        for (var i = 0; i < Constants_1.Constants.COUNT_GIFT_APPLES; i++) {
            var applePartsNode = cc.instantiate(this.applePartsPrefab);
            applePartsNode.setPosition(new cc.Vec2(Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1) + 100, Math.random() * 400 - 100));
            this.giftMask.addChild(applePartsNode);
            applePartsNode.getComponent(ApplePartsControlComponent_1.default).split();
            this.giftApples.push(applePartsNode);
            this.giftCountDown = Constants_1.Constants.GIFT_COUNTDOWN_TIME;
        }
        this.giftMask.on(cc.Node.EventType.TOUCH_END, function () {
            _this.closeGiftMask();
        }, this);
        this.scheduleOnce(function () {
            _this.closeGiftMask();
        }, 2);
    };
    GiftComponent.prototype.updateGiftCountdown = function () {
        var giftNextTime = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_NEXT_GIFT_TIME, 0);
        this.giftCountDown = giftNextTime - new Date().getTime();
        this.giftCountDown = Math.max(this.giftCountDown, 0);
        this.giftCountDown = Math.min(this.giftCountDown, Constants_1.Constants.GIFT_COUNTDOWN_TIME);
        if (giftNextTime == 0) {
            StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_NEXT_GIFT_TIME, new Date().getTime());
            this.giftCountDown = 0;
        }
        if (this.giftCountDown <= 0) {
            this.timerLabel.string = "FREE GIFT";
            return;
        }
        this.timerLabel.getComponent(cc.Label).string = this.transNumberToString(Math.floor(this.giftCountDown / 60 / 1000 / 60)) + ":" +
            this.transNumberToString(Math.floor((this.giftCountDown % (60 * 1000 * 60) / 60 / 1000))) + ":" +
            this.transNumberToString(Math.floor((this.giftCountDown % (60 * 1000)) / 1000));
    };
    GiftComponent.prototype.isReady = function () {
        return this.giftCountDown <= 0;
    };
    GiftComponent.prototype.closeGiftMask = function () {
        if (this.isMaskShow) {
            for (var i = 0; i < this.giftApples.length; i++) {
                this.node.removeChild(this.giftApples[i]);
            }
            this.giftMask.opacity = 0;
            this.isMaskShow = false;
            this.giftMask.off(cc.Node.EventType.TOUCH_END);
        }
    };
    __decorate([
        property(cc.Node)
    ], GiftComponent.prototype, "giftMask", void 0);
    __decorate([
        property(cc.Prefab)
    ], GiftComponent.prototype, "applePartsPrefab", void 0);
    __decorate([
        property(cc.Label)
    ], GiftComponent.prototype, "timerLabel", void 0);
    __decorate([
        property(cc.Label)
    ], GiftComponent.prototype, "currencyLabel", void 0);
    __decorate([
        property(cc.AudioClip)
    ], GiftComponent.prototype, "giftOpenAudio", void 0);
    GiftComponent = __decorate([
        ccclass
    ], GiftComponent);
    return GiftComponent;
}(cc.Component));
exports.default = GiftComponent;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GiftComponent.js.map
        