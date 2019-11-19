"use strict";
cc._RF.push(module, 'cc96fAm6TVKULIyVNZcrchR', 'RewardComponent');
// script/modules/warehouse/RewardComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var ConfigUtil_1 = require("../../utils/ConfigUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var RewardComponent = /** @class */ (function (_super) {
    __extends(RewardComponent, _super);
    function RewardComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rewardKnifeSprite = null;
        _this.equipButton = null;
        _this.closeButton = null;
        _this.knifeIndex = 1;
        _this.equipCallback = null;
        return _this;
    }
    RewardComponent.prototype.onLoad = function () {
        var _this = this;
        ResourceUtil_1.default.loadSpriteRes(ConfigUtil_1.default.shared.getKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeId(this.knifeIndex)), function (error, resource) {
            _this.rewardKnifeSprite.spriteFrame = resource;
        });
        this.equipButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.equipButton.getComponent(cc.AudioSource).clip, false);
            }
            StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_KNIFE, ConfigUtil_1.default.shared.getKnifeId(_this.knifeIndex));
            _this.equipCallback();
            _this.node.removeFromParent();
        }, this);
        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.closeButton.getComponent(cc.AudioSource).clip, false);
            }
            _this.node.removeFromParent();
        }, this);
    };
    RewardComponent.prototype.start = function () {
    };
    // update (dt) {}
    RewardComponent.prototype.init = function (knifeIndex, equipCallback) {
        this.knifeIndex = knifeIndex;
        this.equipCallback = equipCallback;
    };
    __decorate([
        property(cc.Sprite)
    ], RewardComponent.prototype, "rewardKnifeSprite", void 0);
    __decorate([
        property(cc.Button)
    ], RewardComponent.prototype, "equipButton", void 0);
    __decorate([
        property(cc.Button)
    ], RewardComponent.prototype, "closeButton", void 0);
    RewardComponent = __decorate([
        ccclass
    ], RewardComponent);
    return RewardComponent;
}(cc.Component));
exports.default = RewardComponent;

cc._RF.pop();