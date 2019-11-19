"use strict";
cc._RF.push(module, '6e3ab8lYZ5JBrPmggoHxJtw', 'BoardControlComponent');
// script/modules/play/BoardControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_NAME_BOARD = "board";
var NODE_NAME_WHITE_BOARD = "white_board";
var DURATION_SHAKE = 0.1;
var STRENGTH_SHAKE = 15;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BoardControlComponent = /** @class */ (function (_super) {
    __extends(BoardControlComponent, _super);
    function BoardControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotation = [];
        _this.posX = 0;
        _this.posY = 0;
        _this.rotationInterval = 0;
        _this.rotationSpeed = 0;
        _this.totalRotationTime = 0;
        _this.shakeDuration = 0;
        _this.totalTwinkleTime = 0;
        _this.rotationEnable = false;
        _this.twinkleEnable = false;
        return _this;
    }
    BoardControlComponent.prototype.onLoad = function () {
        this.posX = this.node.getPositionX();
        this.posY = this.node.getPositionY();
    };
    BoardControlComponent.prototype.start = function () {
    };
    BoardControlComponent.prototype.update = function (dt) {
        if (this.rotationEnable) {
            this.totalRotationTime += dt;
            var currentIntervalSum = 0;
            var currentIntervalIndex = 0;
            for (; currentIntervalIndex < this.rotation.length; currentIntervalIndex++) {
                currentIntervalSum += this.rotation[currentIntervalIndex].interval;
                if (this.totalRotationTime % this.rotationInterval < currentIntervalSum) {
                    break;
                }
            }
            if (this.rotation[currentIntervalIndex].interpolator == "linear" &&
                this.rotation[currentIntervalIndex].interval != 0) {
                this.rotationSpeed =
                    this.rotation[currentIntervalIndex].targetSpeed - (currentIntervalIndex == 0 ? 0 : this.rotation[currentIntervalIndex - 1].targetSpeed) *
                        (this.totalRotationTime % this.rotationInterval + this.rotation[currentIntervalIndex].interval - currentIntervalSum) /
                        this.rotation[currentIntervalIndex].interval;
            }
            else {
                //fixed
                this.rotationSpeed = this.rotation[currentIntervalIndex].targetSpeed;
            }
            this.node.rotation += this.rotationSpeed * dt;
        }
        // if (this.twinkleEnable) {
        //     if (this.totalTwinkleTime > this.shakeDuration) {
        //         this.twinkleEnable = false;
        //         this.node.getChildByName(NODE_NAME_WHITE_BOARD).opacity = 0;
        //         return;
        //     }
        //     this.node.getChildByName(NODE_NAME_WHITE_BOARD).opacity = 255 * this.totalTwinkleTime * 3;
        //     this.totalTwinkleTime += dt;
        // }
    };
    BoardControlComponent.prototype.startRotation = function () {
        this.rotationEnable = true;
    };
    BoardControlComponent.prototype.stopRotation = function () {
        this.rotationEnable = false;
    };
    BoardControlComponent.prototype.onKnifeInserted = function () {
        this.shakeDuration = DURATION_SHAKE;
        this.startShake(STRENGTH_SHAKE);
        this.totalTwinkleTime = 0;
        this.twinkleEnable = true;
    };
    BoardControlComponent.prototype.setRotationSpeed = function (rotation) {
        this.rotation = rotation;
        this.totalRotationTime = 0;
        this.rotationInterval = 0;
        for (var i = 0; i < this.rotation.length; i++) {
            this.rotationInterval += this.rotation[i].interval;
        }
    };
    BoardControlComponent.prototype.startShake = function (strength) {
        // let shake: cc.ActionInterval = cc.sequence(
        //     cc.moveTo(this.shakeDuration, this.posX, this.posY + strength).easing(cc.easeBounceOut()),
        //     cc.moveTo(this.shakeDuration, this.posX, this.posY));
        // this.node.runAction(shake);
    };
    BoardControlComponent = __decorate([
        ccclass
    ], BoardControlComponent);
    return BoardControlComponent;
}(cc.Component));
exports.default = BoardControlComponent;

cc._RF.pop();