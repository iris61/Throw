(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/modules/play/KnifeControlComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f92d7BOY+JNx6T+bWoWEFR1', 'KnifeControlComponent', __filename);
// script/modules/play/KnifeControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BoardControlComponent_1 = require("./BoardControlComponent");
var PlayStageControlComponent_1 = require("./PlayStageControlComponent");
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var JSInterfaceUtils_1 = require("../bridge/JSInterfaceUtils");
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GROUP_NAME_DEFAULT = "default";
var EPS = 0.000001;
var READY_ANIMATION_DURATION = 0.24;
var READY_ANIMATION_FLYING_DISTANCE = 100;
var FLYING_DURATION = 0.08;
var TAG_APPLE = 3;
var TAG_KNIFE_HEAD = 1;
var THROWABLE_OPACITY_THRESHOLD = 100;
var KnifeState;
(function (KnifeState) {
    KnifeState[KnifeState["STATE_HIDDEN"] = 0] = "STATE_HIDDEN";
    KnifeState[KnifeState["STATE_READYING"] = 1] = "STATE_READYING";
    KnifeState[KnifeState["STATE_READY"] = 2] = "STATE_READY";
    KnifeState[KnifeState["STATE_FLYING"] = 3] = "STATE_FLYING";
    KnifeState[KnifeState["STATE_INSERTING"] = 4] = "STATE_INSERTING";
    KnifeState[KnifeState["STATE_INSERTED"] = 5] = "STATE_INSERTED";
    KnifeState[KnifeState["STATE_BOUNCE_BACK"] = 6] = "STATE_BOUNCE_BACK";
    KnifeState[KnifeState["STATE_ROTATING"] = 7] = "STATE_ROTATING";
    KnifeState[KnifeState["STATE_FALLING"] = 8] = "STATE_FALLING";
})(KnifeState || (KnifeState = {}));
var KnifeControlComponent = /** @class */ (function (_super) {
    __extends(KnifeControlComponent, _super);
    function KnifeControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.knifeHitAudio = null;
        _this.stageNode = null;
        _this.boardContainerNode = null;
        _this.knifeRealLength = 355;
        _this.knifeInsertLength = 170;
        _this.state = KnifeState.STATE_HIDDEN;
        _this.remainFlyingDistance = 0;
        _this.remainDeltaOpacity = 0;
        _this.flyingSpeed = 1200;
        _this.currentGoAheadDistance = 0;
        _this.bounceAngle = 0;
        _this.rotateTime = 0;
        _this.totalRotateTime = 0.2;
        _this.throwable = false;
        _this.isLastKnife = false;
        _this.hasAddedToBoardNode = false;
        _this.firstFrameOfInserted = true;
        return _this;
    }
    KnifeControlComponent_1 = KnifeControlComponent;
    KnifeControlComponent.prototype.reset = function () {
        this.state = KnifeState.STATE_HIDDEN;
        this.remainFlyingDistance = 0;
        this.remainDeltaOpacity = 0;
        this.flyingSpeed = 1500;
        this.currentGoAheadDistance = 0;
        this.bounceAngle = 0;
        this.rotateTime = 0;
        this.totalRotateTime = 0.2;
        this.throwable = false;
        this.isLastKnife = false;
        this.hasAddedToBoardNode = false;
        this.firstFrameOfInserted = true;
        this.node.rotation = 0;
        this.node.setAnchorPoint(0.5, 0);
        this.node.removeFromParent();
    };
    KnifeControlComponent.prototype.onLoad = function () {
        cc.log("KnifeControlComponent onLoad");
    };
    KnifeControlComponent.prototype.start = function () {
    };
    KnifeControlComponent.prototype.update = function (dt) {
        if (this.remainDeltaOpacity > EPS) {
            var dtOpacity = 255 / READY_ANIMATION_DURATION * dt;
            if (dtOpacity > this.remainDeltaOpacity) {
                dtOpacity = this.remainDeltaOpacity;
            }
            this.node.opacity += dtOpacity;
            this.remainDeltaOpacity -= dtOpacity;
        }
        switch (this.state) {
            case KnifeState.STATE_HIDDEN: {
                break;
            }
            case KnifeState.STATE_READYING: {
                var dtY = READY_ANIMATION_FLYING_DISTANCE / READY_ANIMATION_DURATION * dt;
                if (dtY > this.remainFlyingDistance) {
                    dtY = this.remainFlyingDistance;
                }
                this.goAhead(dtY);
                this.remainFlyingDistance -= dtY;
                if (this.node.opacity > THROWABLE_OPACITY_THRESHOLD) {
                    this.throwable = true;
                }
                if (this.remainFlyingDistance < EPS) {
                    this.state = KnifeState.STATE_READY;
                }
                break;
            }
            case KnifeState.STATE_READY: {
                break;
            }
            case KnifeState.STATE_FLYING: {
                var dtY = Math.min(this.flyingSpeed * dt, this.remainFlyingDistance + this.knifeInsertLength);
                this.goAhead(dtY);
                this.remainFlyingDistance -= dtY;
                if (this.remainFlyingDistance < EPS) {
                    this.remainFlyingDistance += this.knifeInsertLength;
                    this.state = KnifeState.STATE_INSERTING;
                }
                break;
            }
            case KnifeState.STATE_INSERTING: {
                if (!this.hasAddedToBoardNode) {
                    this.insertIntoBoard();
                    this.hasAddedToBoardNode = true;
                }
                var distance = this.flyingSpeed * dt;
                if (distance > this.remainFlyingDistance) {
                    distance = this.remainFlyingDistance;
                }
                this.goAhead(distance);
                this.remainFlyingDistance -= distance;
                if (this.remainFlyingDistance < EPS) {
                    this.state = KnifeState.STATE_INSERTED;
                }
                break;
            }
            case KnifeState.STATE_INSERTED: {
                if (this.firstFrameOfInserted) {
                    this.stageNode.getComponent(PlayStageControlComponent_1.default).onKnifeInserted();
                    if (!this.isLastKnife) {
                        // this.boardContainerNode.getComponent(BoardControlComponent).onKnifeInserted();
                    }
                    else {
                        this.stageNode.getComponent(PlayStageControlComponent_1.default).onStageFinished();
                    }
                    this.firstFrameOfInserted = false;
                }
                break;
            }
            case KnifeState.STATE_BOUNCE_BACK: {
                if (this.hasAddedToBoardNode) {
                    var backgroundNode = this.stageNode.getComponent(PlayStageControlComponent_1.default).backgroundNode;
                    var worldPosition = this.node.parent.convertToWorldSpaceAR(this.node.position);
                    this.node.removeFromParent();
                    backgroundNode.addChild(this.node, -1);
                    this.node.setPosition(this.node.parent.convertToNodeSpaceAR(worldPosition));
                    this.hasAddedToBoardNode = false;
                }
                this.node.group = "default";
                this.node.setAnchorPoint(0.5, 0.5);
                var worldPos = this.stageNode.getChildByName(PlayStageControlComponent_1.NODE_NAME_BACKGROUND).convertToWorldSpaceAR(new cc.Vec2(this.node.getPositionX(), this.node.getPositionY()));
                var nextPos = this.stageNode.getChildByName(PlayStageControlComponent_1.NODE_NAME_BACKGROUND).convertToNodeSpaceAR(new cc.Vec2(worldPos.x + this.flyingSpeed * Math.cos(this.bounceAngle / 360 * 2 * Math.PI) * dt, worldPos.y - this.flyingSpeed * Math.sin(this.bounceAngle / 360 * 2 * Math.PI) * dt));
                this.node.setPosition(nextPos);
                this.node.rotation = this.node.rotation + Math.random() * 3000 * dt;
                if (this.node.getPositionY() < -1500) {
                    this.state = KnifeState.STATE_HIDDEN;
                    this.stageNode.getComponent(PlayStageControlComponent_1.default).onStageFailed();
                }
                break;
            }
            case KnifeState.STATE_ROTATING: {
                this.node.rotation += (Math.random() * 100 + 400) * dt;
                this.rotateTime += dt;
                if (this.rotateTime >= this.totalRotateTime) {
                    this.state = KnifeState.STATE_FALLING;
                }
                break;
            }
            case KnifeState.STATE_FALLING: {
                this.node.rotation += 500 * dt;
                this.node.setPositionY(this.node.getPositionY() - 3000 * dt);
                if (this.node.getPositionY() < -1500) {
                    this.state = KnifeState.STATE_HIDDEN;
                    this.stageNode.getComponent(PlayStageControlComponent_1.default).onKnifeFall();
                }
                break;
            }
        }
    };
    KnifeControlComponent.prototype.setLastKnife = function (isLastKnife) {
        this.isLastKnife = isLastKnife;
    };
    KnifeControlComponent.prototype.ready = function () {
        cc.log("ready, position =", this.node.position.toString());
        if (this.state == KnifeState.STATE_HIDDEN) {
            this.state = KnifeState.STATE_READYING;
            this.remainDeltaOpacity = 255;
            this.remainFlyingDistance = READY_ANIMATION_FLYING_DISTANCE;
        }
    };
    KnifeControlComponent.prototype.startFalling = function () {
        this.state = KnifeState.STATE_ROTATING;
        this.node.setAnchorPoint(0.5, 0.5);
        this.node.setPositionX(this.node.getPositionX() + (Math.random() - 0.5) * 500);
        this.node.setPositionY(this.node.getPositionY() + (Math.random() - 0.5) * 500);
    };
    KnifeControlComponent.prototype.addToBoard = function (resourceUrl, angle) {
        var _this = this;
        ResourceUtil_1.default.loadSpriteRes(resourceUrl, function (error, resource) {
            _this.node.getComponent(cc.Sprite).spriteFrame = resource;
        });
        this.node.group = "knife";
        this.boardContainerNode.addChild(this.node, -1);
        var length = this.boardContainerNode.getChildByName(BoardControlComponent_1.NODE_NAME_BOARD).width / 2 + (this.knifeRealLength - this.knifeInsertLength);
        this.node.position = new cc.Vec2((length) * Math.sin(angle / 360 * 2 * Math.PI), -length * Math.cos(angle / 360 * 2 * Math.PI));
        this.node.rotation = -angle;
    };
    KnifeControlComponent.prototype.throw = function (toPosY) {
        if (this.throwable && this.state != KnifeState.STATE_HIDDEN) {
            this.throwable = false;
            this.state = KnifeState.STATE_FLYING;
            this.remainFlyingDistance = toPosY - this.node.position.y;
            this.flyingSpeed = Math.max(1000, this.remainFlyingDistance / FLYING_DURATION);
            this.node.group = "knife";
            return true;
        }
        return false;
    };
    KnifeControlComponent.prototype.goAhead = function (distance) {
        this.currentGoAheadDistance = distance;
        if (Math.abs(this.node.rotation) < EPS) {
            this.node.setPosition(this.node.position.x, this.node.position.y + distance);
        }
        else {
            var dtX = distance * Math.sin(this.node.rotation * Math.PI / 180);
            var dtY = distance * Math.cos(this.node.rotation * Math.PI / 180);
            this.node.setPosition(this.node.position.x + dtX, this.node.position.y + dtY);
        }
    };
    KnifeControlComponent.prototype.goBack = function (distance) {
        if (Math.abs(this.node.rotation) < EPS) {
            this.node.setPosition(this.node.position.x, this.node.position.y - distance);
        }
        else {
            var dtX = distance * Math.sin(this.node.rotation * Math.PI / 180);
            var dtY = distance * Math.cos(this.node.rotation * Math.PI / 180);
            this.node.setPosition(this.node.position.x - dtX, this.node.position.y - dtY);
        }
    };
    KnifeControlComponent.prototype.insertIntoBoard = function () {
        if (this.boardContainerNode) {
            var worldPosition = this.node.parent.convertToWorldSpaceAR(this.node.position);
            this.node.removeFromParent();
            this.boardContainerNode.addChild(this.node, -1);
            this.node.rotation = -this.boardContainerNode.rotation;
            this.node.setPosition(this.node.parent.convertToNodeSpaceAR(worldPosition));
        }
    };
    KnifeControlComponent.prototype.onCollisionEnter = function (other, self) {
        if (self.node.getComponent(KnifeControlComponent_1).state == KnifeState.STATE_INSERTED) {
            return;
        }
        if (other.tag == TAG_KNIFE_HEAD && self.tag == TAG_KNIFE_HEAD) {
            return;
        }
        if (other.tag == TAG_APPLE && self.tag == TAG_KNIFE_HEAD) {
            return;
        }
        if (self.tag == TAG_KNIFE_HEAD) {
            //用于碰撞后刀子退回
            // let selfWorld = self.world;
            // let otherWorld = other.world;
            // if (selfWorld && otherWorld) {
            //     let selfPoints = selfWorld.points;
            //     let otherPoints = otherWorld.points;
            //     if (selfPoints instanceof Array && otherPoints instanceof Array) {
            //         let i = 1, j = 0;
            //         for (; i < this.currentGoAheadDistance; i += 3) {
            //             j = 0;
            //             for (; j < selfPoints.length; j++) {
            //                 selfPoints[j].set(new cc.Vec2(selfPoints[j].x, selfPoints[j].y - 3));
            //             }
            //             if (!cc.Intersection.polygonPolygon(selfPoints, otherPoints)) {
            //                 break;
            //             }
            //         }
            //         i = Math.min(this.currentGoAheadDistance, i);
            //         this.goBack(i);
            //     }
            // }
            this.node.group = GROUP_NAME_DEFAULT;
            this.state = KnifeState.STATE_BOUNCE_BACK;
            this.remainFlyingDistance = 2000;
            this.flyingSpeed = 3000;
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.knifeHitAudio, false);
            }
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_VIBRATION_SWITCH, true)) {
                JSInterfaceUtils_1.default.vibrate(300.1);
            }
            var otherPos = new cc.Vec2(other.node.getPositionX(), other.node.getPositionY());
            otherPos = this.boardContainerNode.convertToWorldSpaceAR(otherPos);
            var boardPos = this.stageNode.convertToWorldSpaceAR(this.boardContainerNode.getPosition());
            var otherAngle = Math.atan((otherPos.x - boardPos.x) / (otherPos.y - boardPos.y) * 360 / 2 / Math.PI);
            this.bounceAngle = 90 - 10 * otherAngle;
            this.boardContainerNode.getComponent(BoardControlComponent_1.default).stopRotation();
        }
    };
    var KnifeControlComponent_1;
    __decorate([
        property(cc.AudioClip)
    ], KnifeControlComponent.prototype, "knifeHitAudio", void 0);
    KnifeControlComponent = KnifeControlComponent_1 = __decorate([
        ccclass
    ], KnifeControlComponent);
    return KnifeControlComponent;
}(cc.Component));
exports.default = KnifeControlComponent;

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
        //# sourceMappingURL=KnifeControlComponent.js.map
        