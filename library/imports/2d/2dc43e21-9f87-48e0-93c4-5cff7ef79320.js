"use strict";
cc._RF.push(module, '2dc434hn4dI4JPEXP9+95Mg', 'MainControlComponent');
// script/modules/main/MainControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AppComponent_1 = require("../../AppComponent");
var StorageUtils_1 = require("../../utils/StorageUtils");
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var Constants_1 = require("../../Constants");
var JSInterfaceUtils_1 = require("../bridge/JSInterfaceUtils");
var GiftComponent_1 = require("../../components/GiftComponent");
var ConfigUtil_1 = require("../../utils/ConfigUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var MainControlComponent = /** @class */ (function (_super) {
    __extends(MainControlComponent, _super);
    function MainControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.knifeNode = null;
        _this.currencyLabel = null;
        _this.playButton = null;
        _this.shopButton = null;
        _this.settingButton = null;
        _this.giftButton = null;
        return _this;
    }
    MainControlComponent.prototype.onLoad = function () {
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
    };
    MainControlComponent.prototype.start = function () {
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Home_Page_Viewed", "gift_status", this.giftButton.getComponent(GiftComponent_1.default).isReady() ? "ready" : "not_ready");
    };
    MainControlComponent.prototype.setClickEvents = function (appNode) {
        var _this = this;
        this.playButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.playButton.getComponent(cc.AudioSource).clip, false);
            }
            appNode.getComponent(AppComponent_1.default).jumpToPlayStage();
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Home_Play_Game_Clicked");
            JSInterfaceUtils_1.default.logAutopilotEvent("play_game_click");
        }, this);
        this.shopButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.shopButton.getComponent(cc.AudioSource).clip, false);
            }
            appNode.getComponent(AppComponent_1.default).jumpToWarehousePage();
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Home_Icon_Clicked", "which_icon", "store");
        }, this);
        this.settingButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.settingButton.getComponent(cc.AudioSource).clip, false);
            }
            appNode.getComponent(AppComponent_1.default).jumpToSettingPage();
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Home_Icon_Clicked", "which_icon", "setting");
        }, this);
        this.giftButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Home_Icon_Clicked", "which_icon", "gift");
        }, this);
    };
    MainControlComponent.prototype.updateUserKnife = function () {
        var _this = this;
        ResourceUtil_1.default.loadSpriteRes(ConfigUtil_1.default.shared.getKnifeResourceUrl(StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_KNIFE, Constants_1.Constants.DEFAULT_USER_KNIFE_ID)), function (error, resource) {
            _this.knifeNode.getComponent(cc.Sprite).spriteFrame = resource;
            _this.knifeNode.opacity = 255;
        });
    };
    __decorate([
        property(cc.Node)
    ], MainControlComponent.prototype, "knifeNode", void 0);
    __decorate([
        property(cc.Label)
    ], MainControlComponent.prototype, "currencyLabel", void 0);
    __decorate([
        property(cc.Button)
    ], MainControlComponent.prototype, "playButton", void 0);
    __decorate([
        property(cc.Button)
    ], MainControlComponent.prototype, "shopButton", void 0);
    __decorate([
        property(cc.Button)
    ], MainControlComponent.prototype, "settingButton", void 0);
    __decorate([
        property(cc.Button)
    ], MainControlComponent.prototype, "giftButton", void 0);
    MainControlComponent = __decorate([
        ccclass
    ], MainControlComponent);
    return MainControlComponent;
}(cc.Component));
exports.default = MainControlComponent;

cc._RF.pop();