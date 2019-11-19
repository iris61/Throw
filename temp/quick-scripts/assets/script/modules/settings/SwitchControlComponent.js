(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/modules/settings/SwitchControlComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '836497h14BF+5ky5dtx+dWb', 'SwitchControlComponent', __filename);
// script/modules/settings/SwitchControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SwitchControlComponent = /** @class */ (function (_super) {
    __extends(SwitchControlComponent, _super);
    function SwitchControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checked = false;
        return _this;
    }
    SwitchControlComponent.prototype.onLoad = function () {
        var _this = this;
        this.updateSwitchState(this.node, this.checked);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            _this.checked = !_this.checked;
            _this.switchStateChangeCallback(_this.checked);
            _this.updateSwitchState(_this.node, _this.checked);
        });
    };
    SwitchControlComponent.prototype.init = function (checked) {
        this.checked = checked;
    };
    SwitchControlComponent.prototype.setSwitchStateChangeCallback = function (switchStateChangeCallback) {
        this.switchStateChangeCallback = switchStateChangeCallback;
    };
    SwitchControlComponent.prototype.updateSwitchState = function (node, state) {
        if (state) {
            ResourceUtil_1.default.loadSpriteRes("./settings/setting_switch_on", function (error, resource) {
                node.getComponent(cc.Sprite).spriteFrame = resource;
            });
        }
        else {
            ResourceUtil_1.default.loadSpriteRes("./settings/setting_switch_off", function (error, resource) {
                node.getComponent(cc.Sprite).spriteFrame = resource;
            });
        }
    };
    SwitchControlComponent = __decorate([
        ccclass
    ], SwitchControlComponent);
    return SwitchControlComponent;
}(cc.Component));
exports.default = SwitchControlComponent;

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
        //# sourceMappingURL=SwitchControlComponent.js.map
        