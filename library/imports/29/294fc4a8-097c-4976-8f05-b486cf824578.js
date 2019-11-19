"use strict";
cc._RF.push(module, '294fcSoCXxJdo8FtIbPgkV4', 'AppleControlComponent');
// script/modules/play/AppleControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var PlayStageControlComponent_1 = require("./PlayStageControlComponent");
var TAG_APPLE = 3;
var TAG_KNIFE_HEAD = 1;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AppleControlComponent = /** @class */ (function (_super) {
    __extends(AppleControlComponent, _super);
    function AppleControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stageNode = null;
        return _this;
    }
    AppleControlComponent.prototype.onLoad = function () {
        cc.log("AppleControlComponent onLoad");
    };
    AppleControlComponent.prototype.start = function () {
    };
    // update (dt) {}
    AppleControlComponent.prototype.onCollisionEnter = function (other, self) {
        if (other.tag == TAG_KNIFE_HEAD && self.tag == TAG_APPLE) {
            this.stageNode.getComponent(PlayStageControlComponent_1.default).onAppleHit(this.node, this.node.convertToWorldSpace(this.node.getAnchorPoint()).x, this.node.convertToWorldSpace(this.node.getAnchorPoint()).y);
        }
    };
    AppleControlComponent.prototype.setPlayStageNode = function (stageNode) {
        this.stageNode = stageNode;
    };
    AppleControlComponent = __decorate([
        ccclass
    ], AppleControlComponent);
    return AppleControlComponent;
}(cc.Component));
exports.default = AppleControlComponent;

cc._RF.pop();