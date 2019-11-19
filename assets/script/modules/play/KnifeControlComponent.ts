import BoardControlComponent, { NODE_NAME_BOARD } from "./BoardControlComponent";
import PlayStageControlComponent, { NODE_NAME_BACKGROUND } from "./PlayStageControlComponent";
import ResourceUtil from "../../utils/ResourceUtil";
import JSInterfaceUtils from "../bridge/JSInterfaceUtils";
import StorageUtils from "../../utils/StorageUtils";
import { Constants } from "../../Constants";

const { ccclass, property } = cc._decorator;

const GROUP_NAME_DEFAULT = "default";

const EPS = 0.000001;

const READY_ANIMATION_DURATION = 0.24;
const READY_ANIMATION_FLYING_DISTANCE = 100;

const FLYING_DURATION = 0.08;

const TAG_APPLE = 3;
const TAG_KNIFE_HEAD = 1;

const THROWABLE_OPACITY_THRESHOLD = 100;

const enum KnifeState {
    STATE_HIDDEN = 0,
    STATE_READYING = 1,
    STATE_READY = 2,
    STATE_FLYING = 3,
    STATE_INSERTING = 4,
    STATE_INSERTED = 5,
    STATE_BOUNCE_BACK = 6,
    STATE_ROTATING = 7,
    STATE_FALLING = 8,
}

@ccclass
export default class KnifeControlComponent extends cc.Component {

    @property(cc.AudioClip)
    knifeHitAudio: cc.AudioClip = null;

    public stageNode: cc.Node = null;
    public boardContainerNode: cc.Node = null;

    public knifeRealLength: number = 355;
    public knifeInsertLength: number = 170;

    private state: KnifeState = KnifeState.STATE_HIDDEN;

    private remainFlyingDistance: number = 0;
    private remainDeltaOpacity: number = 0;
    private flyingSpeed: number = 1200;
    private currentGoAheadDistance: number = 0;
    private bounceAngle: number = 0;

    private rotateTime: number = 0;
    private totalRotateTime: number = 0.2;

    private throwable: boolean = false;
    private isLastKnife: boolean = false;
    private hasAddedToBoardNode: boolean = false;
    private firstFrameOfInserted: boolean = true;

    public reset() {
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
    }

    onLoad() {
        cc.log("KnifeControlComponent onLoad");
    }

    start() {
    }

    update(dt) {
        if (this.remainDeltaOpacity > EPS) {
            let dtOpacity = 255 / READY_ANIMATION_DURATION * dt;
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
                let dtY = READY_ANIMATION_FLYING_DISTANCE / READY_ANIMATION_DURATION * dt;
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
                let dtY = Math.min(this.flyingSpeed * dt, this.remainFlyingDistance + this.knifeInsertLength);
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

                let distance = this.flyingSpeed * dt;
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
                    this.stageNode.getComponent(PlayStageControlComponent).onKnifeInserted();
                    if (!this.isLastKnife) {
                        // this.boardContainerNode.getComponent(BoardControlComponent).onKnifeInserted();
                    } else {
                        this.stageNode.getComponent(PlayStageControlComponent).onStageFinished();
                    }
                    this.firstFrameOfInserted = false;
                }

                break;
            }

            case KnifeState.STATE_BOUNCE_BACK: {
                if (this.hasAddedToBoardNode) {
                    let backgroundNode = this.stageNode.getComponent(PlayStageControlComponent).backgroundNode;
                    let worldPosition = this.node.parent.convertToWorldSpaceAR(this.node.position);

                    this.node.removeFromParent();
                    backgroundNode.addChild(this.node, -1);
                    this.node.setPosition(this.node.parent.convertToNodeSpaceAR(worldPosition));
                    this.hasAddedToBoardNode = false;
                }

                this.node.group = "default";
                this.node.setAnchorPoint(0.5, 0.5);
                let worldPos: cc.Vec2 = this.stageNode.getChildByName(NODE_NAME_BACKGROUND).convertToWorldSpaceAR(
                    new cc.Vec2(this.node.getPositionX(), this.node.getPositionY()));
                let nextPos: cc.Vec2 = this.stageNode.getChildByName(NODE_NAME_BACKGROUND).convertToNodeSpaceAR(
                    new cc.Vec2(
                        worldPos.x + this.flyingSpeed * Math.cos(this.bounceAngle / 360 * 2 * Math.PI) * dt,
                        worldPos.y - this.flyingSpeed * Math.sin(this.bounceAngle / 360 * 2 * Math.PI) * dt));
                this.node.setPosition(nextPos);
                this.node.rotation = this.node.rotation + Math.random() * 3000 * dt;

                if (this.node.getPositionY() < -1500) {
                    this.state = KnifeState.STATE_HIDDEN;
                    this.stageNode.getComponent(PlayStageControlComponent).onStageFailed();
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
                    this.stageNode.getComponent(PlayStageControlComponent).onKnifeFall();
                }
                break;
            }
        }
    }

    public setLastKnife(isLastKnife): void {
        this.isLastKnife = isLastKnife;
    }

    public ready(): void {
        cc.log("ready, position =", this.node.position.toString());

        if (this.state == KnifeState.STATE_HIDDEN) {
            this.state = KnifeState.STATE_READYING;

            this.remainDeltaOpacity = 255;
            this.remainFlyingDistance = READY_ANIMATION_FLYING_DISTANCE;
        }
    }

    public startFalling(): void {
        this.state = KnifeState.STATE_ROTATING;

        this.node.setAnchorPoint(0.5, 0.5);
        this.node.setPositionX(this.node.getPositionX() + (Math.random() - 0.5) * 500);
        this.node.setPositionY(this.node.getPositionY() + (Math.random() - 0.5) * 500);
    }

    public addToBoard(resourceUrl: string, angle: number): void {
        ResourceUtil.loadSpriteRes(resourceUrl, (error: Error, resource: cc.SpriteFrame) => {
            this.node.getComponent(cc.Sprite).spriteFrame = resource;
        });

        this.node.group = "knife";
        this.boardContainerNode.addChild(this.node, -1);

        let length: number = this.boardContainerNode.getChildByName(NODE_NAME_BOARD).width / 2 + (this.knifeRealLength - this.knifeInsertLength);
        this.node.position = new cc.Vec2((length) * Math.sin(angle / 360 * 2 * Math.PI), -length * Math.cos(angle / 360 * 2 * Math.PI));
        this.node.rotation = -angle;
    }

    public throw(toPosY: number): boolean {
        if (this.throwable && this.state != KnifeState.STATE_HIDDEN) {
            this.throwable = false;
            this.state = KnifeState.STATE_FLYING;

            this.remainFlyingDistance = toPosY - this.node.position.y;
            this.flyingSpeed = Math.max(1000, this.remainFlyingDistance / FLYING_DURATION);

            this.node.group = "knife";
            return true;
        }

        return false;
    }

    private goAhead(distance: number): void {
        this.currentGoAheadDistance = distance;

        if (Math.abs(this.node.rotation) < EPS) {
            this.node.setPosition(this.node.position.x, this.node.position.y + distance);
        } else {
            let dtX = distance * Math.sin(this.node.rotation * Math.PI / 180);
            let dtY = distance * Math.cos(this.node.rotation * Math.PI / 180);

            this.node.setPosition(this.node.position.x + dtX, this.node.position.y + dtY);
        }
    }

    private goBack(distance: number): void {
        if (Math.abs(this.node.rotation) < EPS) {
            this.node.setPosition(this.node.position.x, this.node.position.y - distance);
        } else {
            let dtX = distance * Math.sin(this.node.rotation * Math.PI / 180);
            let dtY = distance * Math.cos(this.node.rotation * Math.PI / 180);

            this.node.setPosition(this.node.position.x - dtX, this.node.position.y - dtY);
        }
    }

    private insertIntoBoard(): void {
        if (this.boardContainerNode) {
            let worldPosition = this.node.parent.convertToWorldSpaceAR(this.node.position);

            this.node.removeFromParent();
            this.boardContainerNode.addChild(this.node, -1);
            this.node.rotation = -this.boardContainerNode.rotation;
            this.node.setPosition(this.node.parent.convertToNodeSpaceAR(worldPosition));
        }
    }

    onCollisionEnter(other, self) {
        if (self.node.getComponent(KnifeControlComponent).state == KnifeState.STATE_INSERTED) {
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

            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.knifeHitAudio, false);
            }

            if (StorageUtils.shared.getBoolean(Constants.KEY_VIBRATION_SWITCH, true)) {
                JSInterfaceUtils.vibrate(300.1);
            }

            let otherPos: cc.Vec2 = new cc.Vec2(other.node.getPositionX(), other.node.getPositionY());
            otherPos = this.boardContainerNode.convertToWorldSpaceAR(otherPos);
            let boardPos: cc.Vec2 = this.stageNode.convertToWorldSpaceAR(this.boardContainerNode.getPosition());
            let otherAngle = Math.atan((otherPos.x - boardPos.x) / (otherPos.y - boardPos.y) * 360 / 2 / Math.PI);
            this.bounceAngle = 90 - 10 * otherAngle;
            this.boardContainerNode.getComponent(BoardControlComponent).stopRotation();
        }
    }
}
