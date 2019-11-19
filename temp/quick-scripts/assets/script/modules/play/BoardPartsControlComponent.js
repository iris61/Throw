(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/modules/play/BoardPartsControlComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '290e6d+z8xIALqsdHlgVWo4', 'BoardPartsControlComponent', __filename);
// script/modules/play/BoardPartsControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var FallingControlComponent_1 = require("../../components/FallingControlComponent");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BoardPartsControlComponent = /** @class */ (function (_super) {
    __extends(BoardPartsControlComponent, _super);
    function BoardPartsControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.firstBoardNode = null;
        _this.secondBoardNode = null;
        _this.thirdBoardNode = null;
        _this.fourthBoardNode = null;
        return _this;
    }
    BoardPartsControlComponent.prototype.onLoad = function () {
        cc.log("BoardPartsControlComponent onLoad");
    };
    BoardPartsControlComponent.prototype.start = function () {
    };
    BoardPartsControlComponent.prototype.split = function () {
        this.firstBoardNode.getComponent(FallingControlComponent_1.default).split(Math.random() * 60, FallingControlComponent_1.Direction.RIGHT);
        this.secondBoardNode.getComponent(FallingControlComponent_1.default).split(Math.random() * 60 + 60, FallingControlComponent_1.Direction.LEFT);
        this.thirdBoardNode.getComponent(FallingControlComponent_1.default).split(Math.random() * 60 + 150, FallingControlComponent_1.Direction.LEFT);
        this.fourthBoardNode.getComponent(FallingControlComponent_1.default).split(Math.random() * 60 + 210, FallingControlComponent_1.Direction.LEFT);
    };
    __decorate([
        property(cc.Node)
    ], BoardPartsControlComponent.prototype, "firstBoardNode", void 0);
    __decorate([
        property(cc.Node)
    ], BoardPartsControlComponent.prototype, "secondBoardNode", void 0);
    __decorate([
        property(cc.Node)
    ], BoardPartsControlComponent.prototype, "thirdBoardNode", void 0);
    __decorate([
        property(cc.Node)
    ], BoardPartsControlComponent.prototype, "fourthBoardNode", void 0);
    BoardPartsControlComponent = __decorate([
        ccclass
    ], BoardPartsControlComponent);
    return BoardPartsControlComponent;
}(cc.Component));
exports.default = BoardPartsControlComponent;

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
        //# sourceMappingURL=BoardPartsControlComponent.js.map
        