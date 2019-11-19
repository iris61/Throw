(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/modules/done/ContinueComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '00ac9kvMq5MwZuCQKkK6uXd', 'ContinueComponent', __filename);
// script/modules/done/ContinueComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var StageProgressBarComponent_1 = require("../../components/StageProgressBarComponent");
var AppComponent_1 = require("../../AppComponent");
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var JSInterfaceUtils_1 = require("../bridge/JSInterfaceUtils");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ContinueComponent = /** @class */ (function (_super) {
    __extends(ContinueComponent, _super);
    function ContinueComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stageProgressBarLayoutNode = null;
        _this.circleAnimationNode = null;
        _this.stageLabel = null;
        _this.scoreLabel = null;
        _this.topScoreLabel = null;
        _this.currencyLabel = null;
        _this.quitButton = null;
        _this.continueButton = null;
        _this.countdownAudio = null;
        _this.appNode = null;
        _this.stage = 1;
        _this.score = 0;
        _this.watchingAd = false;
        _this.continueGame = false;
        return _this;
    }
    ContinueComponent_1 = ContinueComponent;
    ContinueComponent.prototype.onLoad = function () {
        var _this = this;
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        this.stageProgressBarLayoutNode.getComponent(StageProgressBarComponent_1.default).init(this.stage);
        this.stageTitle = Constants_1.Constants.PREFIX_STAGE_TITLE + this.stage;
        this.stageLabel.string = this.stageTitle;
        this.scoreLabel.string = String(this.score);
        this.topScoreLabel.string = String(this.score);
        this.scheduleOnce(function () {
            var _this = this;
            this.quitButton.node.on(cc.Node.EventType.TOUCH_END, function () {
                cc.audioEngine.stopAllEffects();
                if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(_this.quitButton.getComponent(cc.AudioSource).clip, false);
                }
                _this.appNode.getComponent(AppComponent_1.default).jumpToDonePage(_this.stage, _this.score);
                JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Continue_Page_Clicked", "operation", "no_thanks");
            }, this);
            this.quitButton.node.opacity = 110;
        }, 2);
        this.continueButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            cc.audioEngine.stopAllEffects();
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.continueButton.getComponent(cc.AudioSource).clip, false);
            }
            JSInterfaceUtils_1.default.watchRewardAd(Constants_1.Constants.POSTION_CONTINUE, Constants_1.Constants.WATCH_AD_FOR_CONTINUE_GAME);
            _this.watchingAd = true;
            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Continue_Page_Clicked", "operation", "continue");
            JSInterfaceUtils_1.default.logAutopilotEvent("continue_button_click");
        }, this);
        this.circleAnimationNode.getComponent(cc.Animation).on(Constants_1.Constants.EVENT_ANIMATION_STOP, function () {
            _this.appNode.getComponent(AppComponent_1.default).jumpToDonePage(_this.stage, _this.score);
            cc.audioEngine.stopAllEffects();
        });
        this.circleAnimationNode.getComponent(cc.Animation).play();
        if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.countdownAudio, false);
        }
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Continue_Page_Viewed");
    };
    ContinueComponent.prototype.init = function (stage, score, appNode) {
        ContinueComponent_1.instance = this;
        this.stage = stage;
        this.stageTitle = Constants_1.Constants.PREFIX_STAGE_TITLE + stage;
        this.score = score;
        this.appNode = appNode;
    };
    ContinueComponent.watchAdForContinueGame = function () {
        ContinueComponent_1.instance.appNode.getComponent(AppComponent_1.default).continuePlay();
        ContinueComponent_1.instance.continueGame = true;
    };
    ContinueComponent.isWatchingAd = function () {
        return ContinueComponent_1.instance && ContinueComponent_1.instance.watchingAd;
    };
    ContinueComponent.closeAd = function () {
        ContinueComponent_1.instance.watchingAd = false;
    };
    ContinueComponent.getContinueGame = function () {
        return ContinueComponent_1.instance.continueGame;
    };
    var ContinueComponent_1;
    ContinueComponent.instance = null;
    __decorate([
        property(cc.Node)
    ], ContinueComponent.prototype, "stageProgressBarLayoutNode", void 0);
    __decorate([
        property(cc.Node)
    ], ContinueComponent.prototype, "circleAnimationNode", void 0);
    __decorate([
        property(cc.Label)
    ], ContinueComponent.prototype, "stageLabel", void 0);
    __decorate([
        property(cc.Label)
    ], ContinueComponent.prototype, "scoreLabel", void 0);
    __decorate([
        property(cc.Label)
    ], ContinueComponent.prototype, "topScoreLabel", void 0);
    __decorate([
        property(cc.Label)
    ], ContinueComponent.prototype, "currencyLabel", void 0);
    __decorate([
        property(cc.Button)
    ], ContinueComponent.prototype, "quitButton", void 0);
    __decorate([
        property(cc.Button)
    ], ContinueComponent.prototype, "continueButton", void 0);
    __decorate([
        property(cc.AudioClip)
    ], ContinueComponent.prototype, "countdownAudio", void 0);
    ContinueComponent = ContinueComponent_1 = __decorate([
        ccclass
    ], ContinueComponent);
    return ContinueComponent;
}(cc.Component));
exports.default = ContinueComponent;

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
        //# sourceMappingURL=ContinueComponent.js.map
        