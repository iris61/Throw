"use strict";
cc._RF.push(module, 'ec0de89yTNDFo4nsekwLBYw', 'DoneComponent');
// script/modules/done/DoneComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AppComponent_1 = require("../../AppComponent");
var StorageUtils_1 = require("../../utils/StorageUtils");
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var Constants_1 = require("../../Constants");
var JSInterfaceUtils_1 = require("../bridge/JSInterfaceUtils");
var GiftComponent_1 = require("../../components/GiftComponent");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var DoneComponent = /** @class */ (function (_super) {
    __extends(DoneComponent, _super);
    function DoneComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bestRecordBackground = null;
        _this.coinIcon = null;
        _this.adsOrWarehouseIcon = null;
        _this.currencyLabel = null;
        _this.stageLabel = null;
        _this.scoreLabel = null;
        _this.adsOrWarehouseLabel = null;
        _this.adsOrWarehouseButton = null;
        _this.restartButton = null;
        _this.settingButton = null;
        _this.homeButton = null;
        _this.shopButton = null;
        _this.giftButton = null;
        _this.adSprite = null;
        _this.appNode = null;
        _this.stageTitle = "STAGE 1";
        _this.score = 0;
        return _this;
    }
    DoneComponent_1 = DoneComponent;
    DoneComponent.prototype.onLoad = function () {
        var _this = this;
        this.stageLabel.string = this.stageTitle;
        this.scoreLabel.string = String(this.score);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        this.homeButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.homeButton.getComponent(cc.AudioSource).clip, false);
            }
            _this.appNode.getComponent(AppComponent_1.default).jumpToMainPage();
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "home");
        }, this);
        this.shopButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.shopButton.getComponent(cc.AudioSource).clip, false);
            }
            _this.appNode.getComponent(AppComponent_1.default).jumpToWarehousePage();
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "store");
        }, this);
        this.settingButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.settingButton.getComponent(cc.AudioSource).clip, false);
            }
            _this.appNode.getComponent(AppComponent_1.default).jumpToSettingPage();
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "setting");
        }, this);
        this.restartButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.restartButton.getComponent(cc.AudioSource).clip, false);
            }
            _this.appNode.getComponent(AppComponent_1.default).jumpToPlayStage();
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_Restart_Clicked", "first_button", _this.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins");
            JSInterfaceUtils_1.default.logAutopilotEvent("play_game_click");
        }, this);
        var bestScore = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_BEST_SCORE, 0);
        if (bestScore < this.score) {
            bestScore = this.score;
            StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_BEST_SCORE, this.score);
            this.bestRecordBackground.node.opacity = 255;
        }
        else {
            this.bestRecordBackground.node.opacity = 0;
        }
        if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_DONE_PAGE_SHOWN, false)) {
            this.coinIcon.node.opacity = 255;
            this.adSprite.node.opacity = 255;
            this.adsOrWarehouseLabel.string = "FREE COINS";
            ResourceUtil_1.default.loadSpriteRes("done/video", function (error, resource) {
                _this.adsOrWarehouseIcon.spriteFrame = resource;
            });
            this.adsOrWarehouseButton.node.on(cc.Node.EventType.TOUCH_END, function () {
                if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(_this.adsOrWarehouseButton.getComponent(cc.AudioSource).clip, false);
                }
                JSInterfaceUtils_1.default.watchRewardAd(Constants_1.Constants.POSTION_DONE_GET_COINS, Constants_1.Constants.WATCH_AD_FOR_CURRENCY);
                JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_First_Button_Clicked", "first_button", _this.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins");
            }, this);
        }
        else {
            this.coinIcon.node.opacity = 0;
            this.adSprite.node.opacity = 0;
            this.adsOrWarehouseLabel.string = "MORE KINIVES";
            ResourceUtil_1.default.loadSpriteRes("done/knives", function (error, resource) {
                _this.adsOrWarehouseIcon.spriteFrame = resource;
            });
            this.adsOrWarehouseButton.node.on(cc.Node.EventType.TOUCH_END, function () {
                if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(_this.adsOrWarehouseButton.getComponent(cc.AudioSource).clip, false);
                }
                _this.appNode.getComponent(AppComponent_1.default).jumpToWarehousePage();
                JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_First_Button_Clicked", "first_button", _this.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins");
            }, this);
            StorageUtils_1.default.shared.putBoolean(Constants_1.Constants.KEY_DONE_PAGE_SHOWN, true);
        }
        this.giftButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "gift");
        }, this);
    };
    DoneComponent.prototype.start = function () {
        DoneComponent_1.logFlurryDonePageViewed();
    };
    DoneComponent.prototype.init = function (stage, score, appNode) {
        this.stageTitle = Constants_1.Constants.PREFIX_STAGE_TITLE + stage;
        this.score = score;
        this.appNode = appNode;
        DoneComponent_1.instance = this;
    };
    DoneComponent.watchAdForCurrency = function () {
        if (!DoneComponent_1.instance) {
            return;
        }
        var currency = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0);
        currency = currency + Constants_1.Constants.AD_PRICE;
        DoneComponent_1.instance.currencyLabel.getComponent(cc.Label).string = String(currency);
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, currency);
    };
    DoneComponent.logFlurryDonePageViewed = function () {
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Done_Page_Viewed", "first_button", DoneComponent_1.instance.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins", "gift_status", DoneComponent_1.instance.giftButton.getComponent(GiftComponent_1.default).isReady() ? "ready" : "not_ready");
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Life_Time_per_Play_Game", "game_time", String(Math.ceil((new Date().getTime() - StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_ENTER_PLAY_TIME)) / 1000)), "game_over_stage", String(DoneComponent_1.instance.appNode.getComponent(AppComponent_1.default).getCurrentStage()));
    };
    var DoneComponent_1;
    DoneComponent.instance = null;
    __decorate([
        property(cc.Sprite)
    ], DoneComponent.prototype, "bestRecordBackground", void 0);
    __decorate([
        property(cc.Sprite)
    ], DoneComponent.prototype, "coinIcon", void 0);
    __decorate([
        property(cc.Sprite)
    ], DoneComponent.prototype, "adsOrWarehouseIcon", void 0);
    __decorate([
        property(cc.Label)
    ], DoneComponent.prototype, "currencyLabel", void 0);
    __decorate([
        property(cc.Label)
    ], DoneComponent.prototype, "stageLabel", void 0);
    __decorate([
        property(cc.Label)
    ], DoneComponent.prototype, "scoreLabel", void 0);
    __decorate([
        property(cc.Label)
    ], DoneComponent.prototype, "adsOrWarehouseLabel", void 0);
    __decorate([
        property(cc.Button)
    ], DoneComponent.prototype, "adsOrWarehouseButton", void 0);
    __decorate([
        property(cc.Button)
    ], DoneComponent.prototype, "restartButton", void 0);
    __decorate([
        property(cc.Button)
    ], DoneComponent.prototype, "settingButton", void 0);
    __decorate([
        property(cc.Button)
    ], DoneComponent.prototype, "homeButton", void 0);
    __decorate([
        property(cc.Button)
    ], DoneComponent.prototype, "shopButton", void 0);
    __decorate([
        property(cc.Button)
    ], DoneComponent.prototype, "giftButton", void 0);
    __decorate([
        property(cc.Sprite)
    ], DoneComponent.prototype, "adSprite", void 0);
    DoneComponent = DoneComponent_1 = __decorate([
        ccclass
    ], DoneComponent);
    return DoneComponent;
}(cc.Component));
exports.default = DoneComponent;

cc._RF.pop();