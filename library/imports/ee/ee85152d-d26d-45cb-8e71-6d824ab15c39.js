"use strict";
cc._RF.push(module, 'ee851Ut0m1Fy45xbYJKsVw5', 'AppComponent');
// script/AppComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var PlayStageControlComponent_1 = require("./modules/play/PlayStageControlComponent");
var MainControlComponent_1 = require("./modules/main/MainControlComponent");
var KnifeWarehouseComponent_1 = require("./modules/warehouse/KnifeWarehouseComponent");
var ContinueComponent_1 = require("./modules/done/ContinueComponent");
var DoneComponent_1 = require("./modules/done/DoneComponent");
var StorageUtils_1 = require("./utils/StorageUtils");
var Constants_1 = require("./Constants");
var ConfigUtil_1 = require("./utils/ConfigUtil");
var JSInterfaceUtils_1 = require("./modules/bridge/JSInterfaceUtils");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AppComponent = /** @class */ (function (_super) {
    __extends(AppComponent, _super);
    function AppComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mainPagePrefab = null;
        _this.playStagePrefab = null;
        _this.warehousePagePrefab = null;
        _this.continuePagePrefab = null;
        _this.donePagePrefab = null;
        _this.settingPagePrefabe = null;
        _this.canvasNode = null;
        _this.mainPageNode = null;
        _this.playStageNode = null;
        _this.warehousePageNode = null;
        _this.continuePageNode = null;
        _this.donePageNode = null;
        _this.settingPageNode = null;
        _this.stage = 1;
        _this.bestStage = 0;
        _this.bestScore = 0;
        _this.stageboss = 1;
        _this.totalStage = 0;
        _this.roundCount = 0;
        _this.enterGameTime = new Date().getTime();
        return _this;
    }
    AppComponent_1 = AppComponent;
    AppComponent.prototype.onLoad = function () {
        var _this = this;
        if (!AppComponent_1.instance) {
            AppComponent_1.instance = this;
        }
        StorageUtils_1.default.shared.init(function () {
            ConfigUtil_1.default.shared.init(function () {
                _this.jumpToMainPage();
                _this.preloadKnifesResource();
            });
        });
    };
    AppComponent.prototype.start = function () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDrawBoundingBox = true;
        // manager.enabledDebugDraw = true;
    };
    // update (dt) {}
    AppComponent.prototype.jumpToMainPage = function () {
        this.mainPageNode = cc.instantiate(this.mainPagePrefab);
        this.mainPageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.mainPageNode.getComponent(MainControlComponent_1.default).setClickEvents(this.node);
        this.mainPageNode.getComponent(MainControlComponent_1.default).updateUserKnife();
        this.canvasNode.removeAllChildren();
        this.canvasNode.addChild(this.mainPageNode);
    };
    AppComponent.prototype.jumpToPlayStage = function () {
        this.roundCount++;
        this.totalStage++;
        this.bestStage = (this.bestStage == 0 ? 1 : this.bestStage);
        this.stage = 1;
        this.stageboss = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_BOSS, 1);
        this.stageboss = this.stageboss - 2 > 1 ? this.stageboss - 2 : 1;
        this.stageboss = this.stageboss > Constants_1.Constants.COUNT_TOTAL_BOSS_STAGE ? 1 : this.stageboss;
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_ENTER_PLAY_TIME, new Date().getTime());
        this.playStageNode = cc.instantiate(this.playStagePrefab);
        this.playStageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.playStageNode.getComponent(PlayStageControlComponent_1.default).init(this.node, this.stage, this.stageboss, 0, false);
        this.canvasNode.removeAllChildren();
        this.canvasNode.addChild(this.playStageNode);
        JSInterfaceUtils_1.default.addShortcut();
    };
    AppComponent.prototype.continuePlay = function () {
        this.canvasNode.removeAllChildren();
        if (!this.playStageNode) {
            this.playStageNode = cc.instantiate(this.playStagePrefab);
        }
        this.canvasNode.addChild(this.playStageNode);
        this.playStageNode.getComponent(PlayStageControlComponent_1.default).continuePlay();
    };
    AppComponent.prototype.jumpToNextStage = function (score, stageboss, hasRewardKnife) {
        this.stage++;
        this.totalStage++;
        this.bestStage = (this.bestStage > this.stage ? this.bestStage : this.stage);
        this.bestScore = (this.bestScore > score ? this.bestScore : score);
        this.stageboss = stageboss;
        this.stageboss = this.stageboss > Constants_1.Constants.COUNT_TOTAL_BOSS_STAGE ? 1 : this.stageboss;
        if (this.stageboss > StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_BOSS, 1)) {
            StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_BOSS, this.stageboss);
        }
        if (this.stage > Constants_1.Constants.COUNT_TOTAL_STAGE) {
            this.playStageNode.getComponent(PlayStageControlComponent_1.default).onAllStagesWin();
        }
        else {
            StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_STAGE, this.stage);
            if (!this.playStageNode) {
                this.playStageNode = cc.instantiate(this.playStagePrefab);
                this.playStageNode.getComponent(cc.Widget).target = this.canvasNode;
            }
            this.playStageNode.getComponent(PlayStageControlComponent_1.default).init(this.node, this.stage, this.stageboss, score, hasRewardKnife);
        }
    };
    AppComponent.prototype.jumpToWarehousePage = function () {
        this.warehousePageNode = cc.instantiate(this.warehousePagePrefab);
        this.warehousePageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.warehousePageNode.getComponent(KnifeWarehouseComponent_1.default).init(this.node);
        this.canvasNode.addChild(this.warehousePageNode);
    };
    AppComponent.prototype.jumpToContinuePage = function (stage, score) {
        this.bestScore = (this.bestScore > score ? this.bestScore : score);
        if (!JSInterfaceUtils_1.default.hasRewardAd()) {
            this.jumpToDonePage(stage, score);
            return;
        }
        this.continuePageNode = cc.instantiate(this.continuePagePrefab);
        this.continuePageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.continuePageNode.getComponent(ContinueComponent_1.default).init(stage, score, this.node);
        this.canvasNode.addChild(this.continuePageNode);
    };
    AppComponent.prototype.jumpToDonePage = function (stage, score) {
        this.bestScore = (this.bestScore > score ? this.bestScore : score);
        this.canvasNode.removeChild(this.continuePageNode);
        this.donePageNode = cc.instantiate(this.donePagePrefab);
        this.donePageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.donePageNode.getComponent(DoneComponent_1.default).init(stage, score, this.node);
        this.canvasNode.addChild(this.donePageNode);
        JSInterfaceUtils_1.default.watchInterstitialAd(Constants_1.Constants.POSTION_GAME_END, "");
    };
    AppComponent.prototype.getCurrentStage = function () {
        if (this.playStageNode) {
            return this.playStageNode.getComponent(PlayStageControlComponent_1.default).getCurrentStage();
        }
        else {
            return 1;
        }
    };
    AppComponent.prototype.jumpToSettingPage = function () {
        this.settingPageNode = cc.instantiate(this.settingPagePrefabe);
        this.settingPageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.canvasNode.addChild(this.settingPageNode);
    };
    AppComponent.prototype.updateMainPageKnife = function () {
        if (this.mainPageNode) {
            this.mainPageNode.getComponent(MainControlComponent_1.default).updateUserKnife();
        }
    };
    AppComponent.endGame = function () {
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Life_Time", "game_time", String(Math.floor((new Date().getTime() - AppComponent_1.instance.enterGameTime) / 1000)), "game_round", String(AppComponent_1.instance.roundCount), "game_stage", String(AppComponent_1.instance.totalStage), "game_best_stage", String(AppComponent_1.instance.bestStage), "game_best_score", String(AppComponent_1.instance.bestScore), "coin_number", StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0"), "knife_unlock_number", String(StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",").length));
    };
    AppComponent.prototype.preloadKnifesResource = function () {
        var userKnifeId = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_KNIFE, Constants_1.Constants.DEFAULT_USER_KNIFE_ID);
        var userKnifeIndex = ConfigUtil_1.default.shared.getIndexFromKnifeId(userKnifeId);
        for (var index = userKnifeIndex - 3; index < userKnifeIndex; index++) {
            if (ConfigUtil_1.default.shared.hasKnife(ConfigUtil_1.default.shared.getKnifeId(index))) {
                ConfigUtil_1.default.shared.getKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeId(index));
            }
        }
        for (var index = userKnifeIndex + 1; index < userKnifeIndex + 4; index++) {
            if (ConfigUtil_1.default.shared.hasKnife(ConfigUtil_1.default.shared.getKnifeId(index))) {
                ConfigUtil_1.default.shared.getKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeId(index));
            }
        }
    };
    var AppComponent_1;
    AppComponent.instance = null;
    __decorate([
        property(cc.Prefab)
    ], AppComponent.prototype, "mainPagePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], AppComponent.prototype, "playStagePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], AppComponent.prototype, "warehousePagePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], AppComponent.prototype, "continuePagePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], AppComponent.prototype, "donePagePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], AppComponent.prototype, "settingPagePrefabe", void 0);
    __decorate([
        property(cc.Node)
    ], AppComponent.prototype, "canvasNode", void 0);
    AppComponent = AppComponent_1 = __decorate([
        ccclass
    ], AppComponent);
    return AppComponent;
}(cc.Component));
exports.default = AppComponent;

cc._RF.pop();