"use strict";
cc._RF.push(module, '103b75u2C5AJ4k3ZAQZlVJ8', 'KnifeWarehouseComponent');
// script/modules/warehouse/KnifeWarehouseComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var KnifeWarehousePageViewComponent_1 = require("./KnifeWarehousePageViewComponent");
var LotteryComponent_1 = require("./LotteryComponent");
var AppComponent_1 = require("../../AppComponent");
var RewardComponent_1 = require("./RewardComponent");
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var JSInterfaceUtils_1 = require("../bridge/JSInterfaceUtils");
var ConfigUtil_1 = require("../../utils/ConfigUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NODE_NAME_EQUIP_LABEL = "equip_label";
var NODE_NAME_UNLOCK_LABEL = "unlock_label";
var NODE_NAME_EQUIP_VIDEO_ICON = "equip_video_icon";
var NODE_NAME_COINS = "coins";
var NODE_NAME_MORE_LABEL = "more_label";
var NODE_NAME_LINE = "line";
var NODE_NAME_AD = "ad_image";
var KnifeWarehouseComponent = /** @class */ (function (_super) {
    __extends(KnifeWarehouseComponent, _super);
    function KnifeWarehouseComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pageView = null;
        _this.defeatBossLayout = null;
        _this.lotteyPrefab = null;
        _this.rewardPrefab = null;
        _this.previewSprite = null;
        _this.background = null;
        _this.knifeCntLabel = null;
        _this.currencyLabel = null;
        _this.lotteryButton = null;
        _this.equipButton = null;
        _this.backButton = null;
        _this.watchAdForCurrencyButton = null;
        _this.watchAdForCurrencyNoLotteryButton = null;
        _this.getKnifeAudio = null;
        _this.lotteryComponent = null;
        _this.knifeWarehousePageViewComponent = null;
        _this.appNode = null;
        _this.lotteryNode = null;
        _this.chooseKnife = function (event) {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.equipButton.getComponent(cc.AudioSource).clip, false);
            }
            var knifeId = _this.knifeWarehousePageViewComponent.getCurrentKnifeId();
            var gainedKnifes = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",");
            if (knifeId == Constants_1.Constants.DEFAULT_USER_KNIFE_ID || gainedKnifes.indexOf(knifeId) != -1) {
                StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_KNIFE, knifeId);
                _this.appNode.getComponent(AppComponent_1.default).jumpToPlayStage();
                JSInterfaceUtils_1.default.logAutopilotEvent("play_game_click");
                JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Store_Play_Game_Clicked");
            }
            else if (ConfigUtil_1.default.shared.getKnifeObtainMethod(knifeId) == ConfigUtil_1.KnifeObtainMethod.BUY) {
                var currency = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0);
                if (currency >= ConfigUtil_1.default.shared.getKnifePrice(knifeId)) {
                    currency = currency - ConfigUtil_1.default.shared.getKnifePrice(knifeId);
                    _this.currencyLabel.getComponent(cc.Label).string = String(currency);
                    StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, currency);
                    StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_KNIFE, knifeId);
                    gainedKnifes.push(knifeId);
                    StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));
                    _this.knifeCntLabel.getComponent(cc.Label).string = gainedKnifes.length + "/" + ConfigUtil_1.default.shared.getAllKnifesCount();
                    _this.updateEquipButtonStatus(ConfigUtil_1.default.shared.getIndexFromKnifeId(knifeId));
                    if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                        cc.audioEngine.playEffect(_this.getKnifeAudio, false);
                    }
                    _this.updateLottryButtonState();
                    JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "coins", "which_knives", knifeId);
                }
                else {
                    JSInterfaceUtils_1.default.showToast(Constants_1.Constants.TOAST_NEED_MORE_COINS);
                }
            }
            else if (ConfigUtil_1.default.shared.getKnifeObtainMethod(knifeId) == ConfigUtil_1.KnifeObtainMethod.REWARD_ADS) {
                JSInterfaceUtils_1.default.watchRewardAd(Constants_1.Constants.POSTION_STORE_GET_KNIFE, Constants_1.Constants.WATCH_AD_FOR_KNIFE + ConfigUtil_1.default.shared.getIndexFromKnifeId(knifeId));
                _this.updateLottryButtonState();
            }
        };
        _this.showLottery = function (event) {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.lotteryButton.getComponent(cc.AudioSource).clip, false);
            }
            var currency = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0);
            if (currency < Constants_1.Constants.LOTTERY_PRICE) {
                JSInterfaceUtils_1.default.showToast(Constants_1.Constants.TOAST_NEED_MORE_COINS);
                return;
            }
            currency = currency - Constants_1.Constants.LOTTERY_PRICE;
            _this.currencyLabel.getComponent(cc.Label).string = String(currency);
            StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, currency);
            _this.lotteryNode = cc.instantiate(_this.lotteyPrefab);
            _this.lotteryComponent = _this.lotteryNode.getComponentInChildren(LotteryComponent_1.default);
            _this.lotteryComponent.init(_this.lotteryCallback);
            _this.background.node.addChild(_this.lotteryNode);
        };
        _this.lotteryCallback = function () {
            _this.scheduleOnce(function () {
                var _this = this;
                var knifeIndex = this.lotteryComponent.getKnifeIndex();
                var gainedKnifes = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",");
                if (gainedKnifes.indexOf(ConfigUtil_1.default.shared.getKnifeId(knifeIndex)) == -1) {
                    gainedKnifes.push(ConfigUtil_1.default.shared.getKnifeId(knifeIndex));
                    StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));
                }
                var rewardNode = cc.instantiate(this.rewardPrefab);
                rewardNode.getComponent(RewardComponent_1.default).init(knifeIndex, function () {
                    _this.updateEquipButtonStatus(knifeIndex);
                });
                this.lotteryNode.removeFromParent();
                this.background.node.addChild(rewardNode);
                this.knifeWarehousePageViewComponent.scrollToKnife(knifeIndex);
                this.updateEquipButtonStatus(knifeIndex);
                this.knifeCntLabel.getComponent(cc.Label).string = gainedKnifes.length + "/" + ConfigUtil_1.default.shared.getAllKnifesCount();
                if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(this.getKnifeAudio, false);
                }
                this.appNode.getComponent(AppComponent_1.default).addUnlockKnifeCount();
                JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "random", "which_knives", ConfigUtil_1.default.shared.getKnifeId(knifeIndex));
            }, 1);
            _this.updateLottryButtonState();
        };
        _this.updateEquipButtonStatus = function (index) {
            var showButton = function () {
                _this.equipButton.node.opacity = 255;
                _this.defeatBossLayout.node.opacity = 0;
            };
            var showObtainMethod = function () {
                _this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).opacity = 255;
                _this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).opacity = 255;
                _this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 255;
                _this.equipButton.node.getChildByName(NODE_NAME_EQUIP_LABEL).opacity = 0;
            };
            var hasGained = index == ConfigUtil_1.default.shared.getIndexFromKnifeId(Constants_1.Constants.DEFAULT_USER_KNIFE_ID)
                || StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",").indexOf(ConfigUtil_1.default.shared.getKnifeId(index)) != -1;
            var obtainMethod = ConfigUtil_1.default.shared.getKnifeObtainMethod(ConfigUtil_1.default.shared.getKnifeId(index));
            var userKnifeIndex = ConfigUtil_1.default.shared.getIndexFromKnifeId(StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_KNIFE, Constants_1.Constants.DEFAULT_USER_KNIFE_ID));
            if (hasGained) {
                showButton();
                _this.equipButton.node.getChildByName(NODE_NAME_EQUIP_LABEL).opacity = 255;
                _this.equipButton.node.getChildByName(NODE_NAME_EQUIP_LABEL).getComponent(cc.Label).string = userKnifeIndex == index ? "CURRENT" : "EQUIP";
                _this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).opacity = 0;
                _this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).opacity = 0;
                _this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 0;
                _this.equipButton.node.getChildByName(NODE_NAME_COINS).opacity = 0;
                _this.equipButton.node.getChildByName(NODE_NAME_EQUIP_VIDEO_ICON).opacity = 0;
                _this.equipButton.node.getChildByName(NODE_NAME_AD).opacity = 0;
                return;
            }
            switch (obtainMethod) {
                case ConfigUtil_1.KnifeObtainMethod.BUY: {
                    showButton();
                    showObtainMethod();
                    _this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).color = new cc.Color(0xff, 0xee, 0x64, 0xff);
                    _this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).getComponent(cc.Label).string = String(ConfigUtil_1.default.shared.getKnifePrice(ConfigUtil_1.default.shared.getKnifeId(index)));
                    _this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).getComponent(cc.Label).string = "UNLOCK";
                    _this.equipButton.node.getChildByName(NODE_NAME_EQUIP_VIDEO_ICON).opacity = 0;
                    _this.equipButton.node.getChildByName(NODE_NAME_AD).opacity = 0;
                    _this.equipButton.node.getChildByName(NODE_NAME_COINS).opacity = 255;
                    _this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 100;
                    break;
                }
                case ConfigUtil_1.KnifeObtainMethod.REWARD_ADS: {
                    showButton();
                    showObtainMethod();
                    _this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).color = new cc.Color(0x1e, 0x5d, 0x11, 0xff);
                    var adCount = StorageUtils_1.default.shared.getInt(Constants_1.Constants.WATCH_AD_FOR_KNIFE + index, 0);
                    _this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).getComponent(cc.Label).string = adCount + "/" + ConfigUtil_1.default.shared.getKnifePrice(ConfigUtil_1.default.shared.getKnifeId(index));
                    _this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).getComponent(cc.Label).string = "WATCH\nVIDEO";
                    _this.equipButton.node.getChildByName(NODE_NAME_EQUIP_VIDEO_ICON).opacity = 255;
                    _this.equipButton.node.getChildByName(NODE_NAME_AD).opacity = 255;
                    _this.equipButton.node.getChildByName(NODE_NAME_COINS).opacity = 0;
                    _this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 100;
                    break;
                }
                case ConfigUtil_1.KnifeObtainMethod.DEFEAT_BOSS: {
                    _this.equipButton.node.opacity = 0;
                    _this.defeatBossLayout.node.opacity = 255;
                    _this.defeatBossLayout.node.getChildByName("boss_label").getComponent(cc.Label).string = "BOSS " + ConfigUtil_1.default.shared.getBossNameForKnife(ConfigUtil_1.default.shared.getKnifeId(index));
                    break;
                }
            }
        };
        return _this;
    }
    KnifeWarehouseComponent_1 = KnifeWarehouseComponent;
    KnifeWarehouseComponent.prototype.onLoad = function () {
        var _this = this;
        this.equipButton.node.on(cc.Node.EventType.TOUCH_END, this.chooseKnife);
        this.backButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.backButton.getComponent(cc.AudioSource).clip, false);
            }
            _this.node.removeFromParent();
            _this.appNode.getComponent(AppComponent_1.default).updateMainPageKnife();
        }, this);
        this.knifeWarehousePageViewComponent = this.pageView.getComponent(KnifeWarehousePageViewComponent_1.default);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        var gainedKnifes = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",");
        this.knifeCntLabel.getComponent(cc.Label).string = gainedKnifes.length + "/" + ConfigUtil_1.default.shared.getAllKnifesCount();
        this.updateLottryButtonState();
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Store_Page_Viewed");
        this.pageView.node.getComponent(KnifeWarehousePageViewComponent_1.default).init(this.updateEquipButtonStatus);
    };
    KnifeWarehouseComponent.prototype.init = function (appNode) {
        KnifeWarehouseComponent_1.instance = this;
        this.appNode = appNode;
    };
    KnifeWarehouseComponent.watchAdForCurrency = function () {
        if (KnifeWarehouseComponent_1.instance == null) {
            return;
        }
        var currency = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0);
        currency = currency + Constants_1.Constants.AD_PRICE;
        KnifeWarehouseComponent_1.instance.currencyLabel.getComponent(cc.Label).string = String(currency);
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, currency);
    };
    KnifeWarehouseComponent.watchAdForKnife = function (watchAdRuselt) {
        if (KnifeWarehouseComponent_1.instance == null) {
            return;
        }
        var adCount = StorageUtils_1.default.shared.getInt(watchAdRuselt, 0);
        adCount++;
        StorageUtils_1.default.shared.putInt(watchAdRuselt, adCount);
        var index = ConfigUtil_1.default.shared.getIndexFromAdResult(watchAdRuselt);
        var knifeId = ConfigUtil_1.default.shared.getKnifeId(index);
        var knifeUnlockAdCount = ConfigUtil_1.default.shared.getKnifePrice(knifeId);
        if (adCount >= knifeUnlockAdCount) {
            var gainedKnifes = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",");
            gainedKnifes.push(knifeId);
            StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_KNIFE, knifeId);
            StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "videos", "which_knives", knifeId);
        }
        KnifeWarehouseComponent_1.instance.knifeWarehousePageViewComponent.scrollToKnife(index);
        KnifeWarehouseComponent_1.instance.updateEquipButtonStatus(index);
    };
    KnifeWarehouseComponent.prototype.updateLottryButtonState = function () {
        var _this = this;
        if (ConfigUtil_1.default.shared.hasLotteryKnife()) {
            this.watchAdForCurrencyButton.node.on(cc.Node.EventType.TOUCH_END, function () {
                if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(_this.watchAdForCurrencyButton.getComponent(cc.AudioSource).clip, false);
                }
                JSInterfaceUtils_1.default.watchRewardAd(Constants_1.Constants.POSTION_STORE_GET_COINS, Constants_1.Constants.WATCH_AD_FOR_CURRENCY);
                JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Store_Get_Coins_Clicked");
            }, this);
            this.lotteryButton.node.on(cc.Node.EventType.TOUCH_END, this.showLottery);
            this.watchAdForCurrencyNoLotteryButton.node.opacity = 0;
            return;
        }
        this.watchAdForCurrencyButton.node.removeFromParent();
        this.lotteryButton.node.removeFromParent();
        this.watchAdForCurrencyNoLotteryButton.node.opacity = 255;
        this.watchAdForCurrencyNoLotteryButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.watchAdForCurrencyButton.getComponent(cc.AudioSource).clip, false);
            }
            JSInterfaceUtils_1.default.watchRewardAd(Constants_1.Constants.POSTION_STORE_GET_COINS, Constants_1.Constants.WATCH_AD_FOR_CURRENCY);
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Store_Get_Coins_Clicked");
        }, this);
    };
    var KnifeWarehouseComponent_1;
    KnifeWarehouseComponent.instance = null;
    __decorate([
        property(cc.PageView)
    ], KnifeWarehouseComponent.prototype, "pageView", void 0);
    __decorate([
        property(cc.Layout)
    ], KnifeWarehouseComponent.prototype, "defeatBossLayout", void 0);
    __decorate([
        property(cc.Prefab)
    ], KnifeWarehouseComponent.prototype, "lotteyPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], KnifeWarehouseComponent.prototype, "rewardPrefab", void 0);
    __decorate([
        property(cc.Sprite)
    ], KnifeWarehouseComponent.prototype, "previewSprite", void 0);
    __decorate([
        property(cc.Sprite)
    ], KnifeWarehouseComponent.prototype, "background", void 0);
    __decorate([
        property(cc.Label)
    ], KnifeWarehouseComponent.prototype, "knifeCntLabel", void 0);
    __decorate([
        property(cc.Label)
    ], KnifeWarehouseComponent.prototype, "currencyLabel", void 0);
    __decorate([
        property(cc.Button)
    ], KnifeWarehouseComponent.prototype, "lotteryButton", void 0);
    __decorate([
        property(cc.Button)
    ], KnifeWarehouseComponent.prototype, "equipButton", void 0);
    __decorate([
        property(cc.Button)
    ], KnifeWarehouseComponent.prototype, "backButton", void 0);
    __decorate([
        property(cc.Button)
    ], KnifeWarehouseComponent.prototype, "watchAdForCurrencyButton", void 0);
    __decorate([
        property(cc.Button)
    ], KnifeWarehouseComponent.prototype, "watchAdForCurrencyNoLotteryButton", void 0);
    __decorate([
        property(cc.AudioClip)
    ], KnifeWarehouseComponent.prototype, "getKnifeAudio", void 0);
    KnifeWarehouseComponent = KnifeWarehouseComponent_1 = __decorate([
        ccclass
    ], KnifeWarehouseComponent);
    return KnifeWarehouseComponent;
}(cc.Component));
exports.default = KnifeWarehouseComponent;

cc._RF.pop();