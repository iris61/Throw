(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/components/FallingControlComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9f1625edkBGna+t92vG0V41', 'FallingControlComponent', __filename);
// script/components/FallingControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 1] = "LEFT";
    Direction[Direction["RIGHT"] = 0] = "RIGHT";
})(Direction = exports.Direction || (exports.Direction = {}));
var FallingControlComponent = /** @class */ (function (_super) {
    __extends(FallingControlComponent, _super);
    function FallingControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.prefab = null;
        _this.verticalAccelerate = 3000;
        _this.horizentalAccelerate = 0;
        _this.lastPos = new cc.Vec2(0, 0);
        _this.speed = 800;
        _this.speedAngle = 0;
        _this.direction = Direction.RIGHT;
        return _this;
    }
    FallingControlComponent.prototype.onLoad = function () {
        cc.log("FallingControlComponent onLoad");
    };
    FallingControlComponent.prototype.start = function () {
    };
    FallingControlComponent.prototype.update = function (dt) {
        if (!this.node) {
            return;
        }
        var newPos = new cc.Vec2(0, 0);
        newPos.x = this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) * dt + this.lastPos.x;
        newPos.y = this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) * dt + this.lastPos.y;
        this.node.setPosition(newPos);
        this.lastPos = newPos;
        this.speedAngle = Math.atan((this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) - Number(this.verticalAccelerate) * dt)
            / (this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) + Number(this.horizentalAccelerate) * dt)) / 2 / Math.PI * 360 + this.direction * 180;
        this.speed = Math.sqrt((this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) + Number(this.horizentalAccelerate) * dt) *
            (this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) + Number(this.horizentalAccelerate) * dt) +
            (this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) - Number(this.verticalAccelerate) * dt) *
                (this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) - Number(this.verticalAccelerate) * dt));
    };
    FallingControlComponent.prototype.split = function (speedAngle, direction) {
        this.speedAngle = speedAngle;
        this.direction = direction;
        this.speed = 800;
        this.lastPos = new cc.Vec2(0, 0);
        if (this.node.childrenCount == 0) {
            var partNode = cc.instantiate(this.prefab);
            this.node.addChild(partNode);
        }
    };
    __decorate([
        property(cc.Prefab)
    ], FallingControlComponent.prototype, "prefab", void 0);
    __decorate([
        property(Number)
    ], FallingControlComponent.prototype, "verticalAccelerate", void 0);
    __decorate([
        property(Number)
    ], FallingControlComponent.prototype, "horizentalAccelerate", void 0);
    FallingControlComponent = __decorate([
        ccclass
    ], FallingControlComponent);
    return FallingControlComponent;
}(cc.Component));
exports.default = FallingControlComponent;

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
        //# sourceMappingURL=FallingControlComponent.js.map
        