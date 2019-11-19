"use strict";
cc._RF.push(module, '60afbDFBeVPw5hUV9l+N55T', 'SettingComponent');
// script/modules/settings/SettingComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var SwitchControlComponent_1 = require("./SwitchControlComponent");
var Constants_1 = require("../../Constants");
var StorageUtils_1 = require("../../utils/StorageUtils");
var JSInterfaceUtils_1 = require("../bridge/JSInterfaceUtils");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SettingComponent = /** @class */ (function (_super) {
    __extends(SettingComponent, _super);
    function SettingComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currencyLabel = null;
        _this.backButton = null;
        _this.buttonClickAudio = null;
        _this.soundsSwitchComponent = null;
        _this.vibrationSwitchComponent = null;
        _this.leftHandSwitchComponent = null;
        return _this;
    }
    SettingComponent.prototype.onLoad = function () {
        var _this = this;
        cc.log("SettingComponent onLoad()");
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        this.initSwitchComponent(Constants_1.Constants.KEY_SOUND_SWITCH, this.soundsSwitchComponent);
        this.initSwitchComponent(Constants_1.Constants.KEY_VIBRATION_SWITCH, this.vibrationSwitchComponent);
        this.initSwitchComponent(Constants_1.Constants.KEY_LEFT_HAND_SWITCH, this.leftHandSwitchComponent);
        this.backButton.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.backButton.getComponent(cc.AudioSource).clip, false);
            }
            _this.node.removeFromParent();
        }, this);
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Settings_Page_Viewed");
    };
    SettingComponent.prototype.start = function () {
    };
    SettingComponent.prototype.update = function (dt) {
    };
    SettingComponent.prototype.initSwitchComponent = function (settingItemKey, switchComponent) {
        var _this = this;
        if (!StorageUtils_1.default.shared.getString(settingItemKey)) {
            StorageUtils_1.default.shared.putBoolean(settingItemKey, settingItemKey != Constants_1.Constants.KEY_LEFT_HAND_SWITCH);
        }
        switchComponent.init(StorageUtils_1.default.shared.getBoolean(settingItemKey));
        switchComponent.setSwitchStateChangeCallback(function (checked) {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.buttonClickAudio, false);
            }
            StorageUtils_1.default.shared.putBoolean(settingItemKey, checked);
            switch (settingItemKey) {
                case Constants_1.Constants.KEY_VIBRATION_SWITCH:
                    JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Settings_Vibration_Switch", "operation", checked ? "turn_on" : "turn_off");
                    break;
                case Constants_1.Constants.KEY_SOUND_SWITCH:
                    JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Settings_Sounds_Switch", "operation", checked ? "turn_on" : "turn_off");
                    break;
                case Constants_1.Constants.KEY_LEFT_HAND_SWITCH:
                    JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Settings_LeftHand_Switch", "operation", checked ? "turn_on" : "turn_off");
                    break;
            }
        });
    };
    __decorate([
        property(cc.Label)
    ], SettingComponent.prototype, "currencyLabel", void 0);
    __decorate([
        property(cc.Button)
    ], SettingComponent.prototype, "backButton", void 0);
    __decorate([
        property(cc.AudioClip)
    ], SettingComponent.prototype, "buttonClickAudio", void 0);
    __decorate([
        property(SwitchControlComponent_1.default)
    ], SettingComponent.prototype, "soundsSwitchComponent", void 0);
    __decorate([
        property(SwitchControlComponent_1.default)
    ], SettingComponent.prototype, "vibrationSwitchComponent", void 0);
    __decorate([
        property(SwitchControlComponent_1.default)
    ], SettingComponent.prototype, "leftHandSwitchComponent", void 0);
    SettingComponent = __decorate([
        ccclass
    ], SettingComponent);
    return SettingComponent;
}(cc.Component));
exports.default = SettingComponent;

cc._RF.pop();