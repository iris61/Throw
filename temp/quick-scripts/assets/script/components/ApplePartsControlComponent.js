(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/components/ApplePartsControlComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a9e17vc1ZpL8J+2/iUOFo74', 'ApplePartsControlComponent', __filename);
// script/components/ApplePartsControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var FallingControlComponent_1 = require("./FallingControlComponent");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ApplePartsControlComponent = /** @class */ (function (_super) {
    __extends(ApplePartsControlComponent, _super);
    function ApplePartsControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.leftAppleNode = null;
        _this.rightAppleNode = null;
        return _this;
    }
    ApplePartsControlComponent.prototype.onLoad = function () {
        cc.log("ApplePartsControlComponent onLoad");
    };
    ApplePartsControlComponent.prototype.split = function () {
        this.leftAppleNode.getComponent(FallingControlComponent_1.default).split(90 + Math.random() * 90, FallingControlComponent_1.Direction.LEFT);
        this.rightAppleNode.getComponent(FallingControlComponent_1.default).split(Math.random() * 90, FallingControlComponent_1.Direction.RIGHT);
    };
    __decorate([
        property(cc.Node)
    ], ApplePartsControlComponent.prototype, "leftAppleNode", void 0);
    __decorate([
        property(cc.Node)
    ], ApplePartsControlComponent.prototype, "rightAppleNode", void 0);
    ApplePartsControlComponent = __decorate([
        ccclass
    ], ApplePartsControlComponent);
    return ApplePartsControlComponent;
}(cc.Component));
exports.default = ApplePartsControlComponent;

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
        //# sourceMappingURL=ApplePartsControlComponent.js.map
        