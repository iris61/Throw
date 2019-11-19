import KnifeControlComponent from "./KnifeControlComponent";
import BoardControlComponent, { NODE_NAME_BOARD } from "./BoardControlComponent";
import RemainedKnifesComponent from "./RemainedKnifesComponent";
import AppleControlComponent from "./AppleControlComponent";
import ApplePartsControlComponent from "../../components/ApplePartsControlComponent";
import BoardPartsControlComponent from "./BoardPartsControlComponent";
import AppComponent from "../../AppComponent";
import StageProgressBarComponent from "../../components/StageProgressBarComponent";
import JSInterfaceUtils from "../bridge/JSInterfaceUtils";
import ResourceUtil from "../../utils/ResourceUtil";
import StorageUtils from "../../utils/StorageUtils";
import { Constants } from "../../Constants";
import ConfigUtil from "../../utils/ConfigUtil";

export const NODE_NAME_BACKGROUND = "background";

const NODE_NAME_GIFT_COIN_COUNT = "gift_coin_count";
const NODE_NAME_GIFT_COIN_COUNT_CONTAINER = "gift_coin_count_container";

const GROUP_NAME_DEFAULT = "default";
const COINS_REWARD_ALL_STAGES_WIN = 500;

const { ccclass, property } = cc._decorator;

class Knifes {
    public count: number = 8;
    public presetKnifes: {
        resourceUrl: string,
        position: number,
        length: number,
        insertLength: number
    }[] = [];

    private knifeNodesPool: cc.NodePool = new cc.NodePool();
    private userKnifeNodes: cc.Node[] = [];
    private presetKnifesNodes: cc.Node[] = [];

    private userKnifeResourceUrl: string = null;

    private currentKnifeIndex: number = 0;
    private userKnifeRealLength: number = 420;
    private userKnifeInsertedLength: number = 240;

    public pushKnifeNodes(knifePrefab: cc.Prefab, boardContainerNode: cc.Node, backgroundNode: cc.Node, stageNode: cc.Node): void {
        for (let i = 0; i < this.count; i++) {
            let knifeNode: cc.Node = this.knifeNodesPool.size() == 0 ?
                cc.instantiate(knifePrefab) :
                this.knifeNodesPool.get();

            ResourceUtil.loadSpriteRes(this.userKnifeResourceUrl, (error: Error, resource: cc.SpriteFrame) => {
                knifeNode.getComponent(cc.Sprite).spriteFrame = resource;
            });

            knifeNode.getComponent(KnifeControlComponent).boardContainerNode = boardContainerNode;
            knifeNode.getComponent(KnifeControlComponent).stageNode = stageNode;
            knifeNode.getComponent(KnifeControlComponent).knifeRealLength = this.userKnifeRealLength;
            knifeNode.getComponent(KnifeControlComponent).knifeInsertLength = this.userKnifeInsertedLength;
            knifeNode.setPosition(0, -backgroundNode.getContentSize().height / 2 + 100);

            this.userKnifeNodes.push(knifeNode);
        }
    }

    public getCurrentKnifeNode(): cc.Node {
        if (this.currentKnifeIndex < this.count) {
            return this.userKnifeNodes[this.currentKnifeIndex];
        }
        return null;
    }

    public getNextKnifeNode(): cc.Node {
        if (this.currentKnifeIndex + 1 < this.count) {
            return this.userKnifeNodes[this.currentKnifeIndex + 1];
        }
        return null;
    }

    public moveToNextKnife(): void {
        this.currentKnifeIndex++;
    }

    public rollbackKnife(): void {
        this.currentKnifeIndex--;
    }

    public getUserKnifes(): cc.Node[] {
        return this.userKnifeNodes;
    }

    public getPresetKnifes(): cc.Node[] {
        return this.presetKnifesNodes;
    }

    public pushPresetKnifeNodes(knifePrefab: cc.Prefab, boardContainerNode: cc.Node, stageNode: cc.Node): void {
        for (let i = 0; i < this.presetKnifes.length; i++) {
            let presetKnife: cc.Node = this.knifeNodesPool.size() == 0 ?
                cc.instantiate(knifePrefab) :
                this.knifeNodesPool.get();

            this.presetKnifesNodes.push(presetKnife);
            presetKnife.getComponent(KnifeControlComponent).boardContainerNode = boardContainerNode;
            presetKnife.getComponent(KnifeControlComponent).stageNode = stageNode;
            presetKnife.getComponent(KnifeControlComponent).knifeRealLength = this.presetKnifes[i].length;
            presetKnife.getComponent(KnifeControlComponent).knifeInsertLength = this.presetKnifes[i].insertLength;

            presetKnife.getComponent(KnifeControlComponent).addToBoard(this.presetKnifes[i].resourceUrl, this.presetKnifes[i].position);
        }
    }

    public setUserKnifeResourceUrl(userKnifeResourceUrl: string): void {
        this.userKnifeResourceUrl = userKnifeResourceUrl;
    }

    public setUserKnifeRealLength(userKnifeRealLength: number): void {
        this.userKnifeRealLength = userKnifeRealLength;
    }

    public setUserKnifeInsertedLength(userKnifeInsertedLength: number): void {
        this.userKnifeInsertedLength = userKnifeInsertedLength;
    }

    public reset(): void {
        for (let i = 0; i < this.userKnifeNodes.length; i++) {
            this.userKnifeNodes[i].getComponent(KnifeControlComponent).reset();
            this.knifeNodesPool.put(this.userKnifeNodes[i]);
        }

        for (let i = 0; i < this.presetKnifesNodes.length; i++) {
            this.presetKnifesNodes[i].getComponent(KnifeControlComponent).reset();
            this.knifeNodesPool.put(this.presetKnifesNodes[i]);
        }

        this.userKnifeNodes = [];
        this.presetKnifesNodes = [];
        this.currentKnifeIndex = 0;
    }
}

class Board {
    public resourceUrl: string;

    public rotation: {
        targetSpeed: number,
        interpolator: string,
        interval: number
    }[] = [];

    public init(boardContainerNode: cc.Node, boardNode: cc.Node, isBossStage: boolean): void {
        ResourceUtil.loadSpriteRes(this.resourceUrl, (error: Error, resource: cc.SpriteFrame) => {
            boardNode.getComponent(cc.Sprite).spriteFrame = resource;

            if (!isBossStage) {
                boardContainerNode.opacity = 255;
            }
        });
        boardContainerNode.getComponent(BoardControlComponent).setRotationSpeed(this.rotation);
    }
}

class Apples {
    public strategy: string;

    public items: {
        resourceUrl: string,
        position: number
    }[] = [];

    public appleNodes: cc.Node[] = [];

    private appleNodesPool: cc.NodePool = new cc.NodePool();

    public pushAppleNodes(applePrefab: cc.Prefab, boardContainerNode: cc.Node, boardNode: cc.Node, stageNode: cc.Node) {
        for (let i = 0; i < this.items.length; i++) {
            let appleNode: cc.Node = this.appleNodesPool.size() == 0 ?
                cc.instantiate(applePrefab) :
                this.appleNodesPool.get();

            ResourceUtil.loadSpriteRes(this.items[i].resourceUrl, (error: Error, resource: cc.SpriteFrame) => {
                appleNode.getComponent(cc.Sprite).spriteFrame = resource;
            });

            let radius: number = boardNode.width / 2 - 15;
            appleNode.getComponent(AppleControlComponent).setPlayStageNode(stageNode);
            appleNode.setPosition(
                radius * Math.sin(this.items[i].position / 360 * 2 * Math.PI),
                radius * Math.cos(this.items[i].position / 360 * 2 * Math.PI));
            appleNode.rotation = this.items[i].position;
            boardNode.addChild(appleNode);

            this.appleNodes.push(appleNode);
        }
    }

    public rollback(appleNode: cc.Node) {
        if (this.appleNodes.indexOf(appleNode) != -1) {
            appleNode.removeFromParent();
            this.appleNodes.splice(this.appleNodes.indexOf(appleNode), 1);
            this.appleNodesPool.put(appleNode);
        }
    }

    public reset(): void {
        for (let i = 0; i < this.appleNodes.length; i++) {
            this.appleNodes[i].removeFromParent();
            this.appleNodesPool.put(this.appleNodes[i]);
        }
        this.appleNodes = [];
    }
}

@ccclass
export default class PlayStageControlComponent extends cc.Component {

    @property(cc.Node)
    boardContainerNode: cc.Node = null;

    @property(cc.Node)
    boardNode: cc.Node = null;

    @property(cc.Node)
    backgroundNode: cc.Node = null;

    @property(cc.Node)
    remainedKnifesLayoutNode: cc.Node = null;

    @property(cc.Node)
    stageProgressBarLayoutNode: cc.Node = null;

    @property(cc.Node)
    knifeShowAnimNode: cc.Node = null;

    @property(cc.Node)
    rewardCoinShowAnimNode: cc.Node = null;

    @property(cc.Node)
    rewardCoinLabel: cc.Node = null;

    @property(cc.Node)
    rewardDialogNode: cc.Node = null;

    @property(cc.Node)
    rewardDialogBackgroundNode: cc.Node = null;

    @property(cc.Node)
    sparkNode: cc.Node = null;

    @property(cc.Node)
    rewardKnifeNode: cc.Node = null;

    @property(cc.Node)
    giftMask: cc.Node = null;

    @property(cc.Prefab)
    boardPartsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    knifePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    applePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    applePartsPrefab: cc.Prefab = null;

    @property(cc.Label)
    currencyLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    stageLabel: cc.Label = null;

    @property(cc.Label)
    bossNameLabel: cc.Label = null;

    @property(cc.Button)
    equipButton: cc.Button = null;

    @property(cc.Button)
    rewardDialogCloseButton: cc.Button = null;

    @property(cc.AudioClip)
    knifeThrowAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    hitNormalBoardAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    hitAppleAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    boardBreakAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    bossBoardBreakAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    bossAppearAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    bossDefeatedAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    getKnifeAudio: cc.AudioClip = null;

    private knifes: Knifes = null;
    private apples: Apples = null;
    private board: Board = null;

    private boardNodePool: cc.NodePool = null;
    private applePartsNodePool: cc.NodePool = null;

    private applePartsNodes: cc.Node[] = [];
    private giftApples: cc.Node[] = [];
    private appNode: cc.Node = null;
    private nextKnifeNode: cc.Node = null;
    private currentKnifeNode: cc.Node = null;
    private boardPartsNode: cc.Node = null;

    private stageTitle: string = "";
    private boss: string = "";
    private rewardKnifeId: string = "";
    private bossHitAudioResource: string = "";

    private score: number = 0;
    private fallKnifesCount: number = 0;
    private stage: number = 1;
    private stageboss: number = 1;

    private isBossStage: boolean = false;
    private hasThrownKnifes: boolean = false;
    private hasRewardKnife: boolean = false;
    private isMaskShow: boolean = false;

    onLoad() {
        this.boardNodePool = new cc.NodePool();
        this.applePartsNodePool = new cc.NodePool();

        this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent).loadRes();
    }

    start() {
    }

    // update (dt) {}

    // 为了更方便检查错误以及更方便修改json文件，在这里把json文件转换成能用语法检查出错误的结构，如果修改了json文件格式，只需要在这里修改即可
    public init(appNode: cc.Node, stage: number, stageboss: number, score: number, hasRewardKnife: boolean): void {
        this.stage = stage;
        this.stageboss = stageboss;
        let stageId: string = ConfigUtil.shared.getStageIdByIndex(stage, stageboss);

        this.isBossStage = stage % Constants.INTERVAL_BOSS_STAGE == 0;
        this.hasRewardKnife = hasRewardKnife;

        if (this.isBossStage) {
            this.boss = ConfigUtil.shared.getBossName(stageboss);
            this.rewardKnifeId = ConfigUtil.shared.getBossRewardKnife(stageboss);
            this.bossHitAudioResource = ConfigUtil.shared.getBossHitAudioResourceUrl(stageboss);
        }

        this.stageTitle = (this.isBossStage ? "BOSS: " + this.boss : Constants.PREFIX_STAGE_TITLE + stage);

        this.appNode = appNode;

        this.score = score;
        this.scoreLabel.string = String(this.score);

        if (!this.knifes) {
            this.knifes = new Knifes();
        }
        this.knifes.count = ConfigUtil.shared.getPlayStageUserKnifesCount(stageId);

        let userKnifeId: string = StorageUtils.shared.getString(Constants.KEY_USER_KNIFE, Constants.DEFAULT_USER_KNIFE_ID);
        this.knifes.setUserKnifeResourceUrl(ConfigUtil.shared.getKnifeResourceUrl(userKnifeId));
        this.knifes.setUserKnifeInsertedLength(ConfigUtil.shared.getKnifeInsertLength(userKnifeId));
        this.knifes.setUserKnifeRealLength(ConfigUtil.shared.getKnifeLength(userKnifeId));

        this.knifes.presetKnifes = [];
        for (let i = 0; i < ConfigUtil.shared.getPresetKnifesArray(stageId).length; i++) {
            let presetKnifeId: string = ConfigUtil.shared.getPresetKnifeId(stageId, i);

            this.knifes.presetKnifes.push({
                resourceUrl: ConfigUtil.shared.getKnifeResourceUrl(presetKnifeId),
                position: ConfigUtil.shared.getPresetKnifePositionAngle(stageId, i),
                length: ConfigUtil.shared.getKnifeLength(presetKnifeId),
                insertLength: ConfigUtil.shared.getKnifeInsertLength(presetKnifeId)
            });
        }

        if (!this.apples) {
            this.apples = new Apples();
        }
        this.apples.items = [];

        for (let i = 0; i < ConfigUtil.shared.getPresetApplesArray(stageId).length; i++) {
            let appleId: string = ConfigUtil.shared.getPresetAppleId(stageId, i);

            this.apples.items.push({
                resourceUrl: ConfigUtil.shared.getAppleResourceUrl(appleId),
                position: ConfigUtil.shared.getPresetApplePositionAngle(stageId, i)
            });
        }

        if (this.boardNodePool && this.boardNodePool.size() > 0) {
            this.boardNode = this.boardNodePool.get();
            this.boardContainerNode.addChild(this.boardNode);
        }

        this.board = new Board();
        let boardId: string = ConfigUtil.shared.getBoardId(stageId);
        this.board.resourceUrl = ConfigUtil.shared.getBoardResourceUrl(boardId);
        this.board.rotation = ConfigUtil.shared.getBoardRotation(stageId);
        this.board.init(this.boardContainerNode, this.boardNode, this.isBossStage);

        this.setUpPlayStage();
    }

    public onKnifeFall(): void {
        this.fallKnifesCount++;

        if (this.fallKnifesCount >= this.knifes.count + this.knifes.presetKnifes.length) {
            if (this.isBossStage && !this.hasRewardKnife) {
                let gainedKnifes: Array<string> = StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, "").split(",");

                if (gainedKnifes.indexOf(this.rewardKnifeId) == -1) {
                    this.equipButton.getComponent(cc.Button).enabled = true;

                    gainedKnifes.push(this.rewardKnifeId);
                    StorageUtils.shared.putString(Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));

                    if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                        cc.audioEngine.playEffect(this.getKnifeAudio, false);
                    }

                    ResourceUtil.loadSpriteRes(ConfigUtil.shared.getKnifeResourceUrl(this.rewardKnifeId), (error: Error, resource: cc.SpriteFrame) => {
                        this.rewardKnifeNode.getComponent(cc.Sprite).spriteFrame = resource;
                        this.bossNameLabel.getComponent(cc.Label).string = this.boss;

                        this.rewardDialogNode.opacity = 255;
                        this.rewardDialogNode.getComponent(cc.BlockInputEvents).enabled = true;

                        this.rewardDialogCloseButton.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END, () => {
                            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                                cc.audioEngine.playEffect(this.rewardDialogCloseButton.getComponent(cc.AudioSource).clip, false);
                            }

                            this.jumpToNextStage(this.score, this.stageboss, true);

                            this.equipButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            this.rewardDialogCloseButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            this.rewardDialogNode.getComponent(cc.BlockInputEvents).enabled = false;

                            this.rewardDialogNode.opacity = 0;
                            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Reward_Card_Clicked", "operation", "cancel");
                        }, this);

                        this.equipButton.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END, () => {
                            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                                cc.audioEngine.playEffect(this.equipButton.getComponent(cc.AudioSource).clip, false);
                            }

                            for (let i = 0; i < this.knifes.getUserKnifes().length; i++) {
                                this.knifes.getUserKnifes()[i].getComponent(cc.Sprite).spriteFrame = resource;
                            }

                            StorageUtils.shared.putString(Constants.KEY_USER_KNIFE, this.rewardKnifeId);
                            this.jumpToNextStage(this.score, this.stageboss, true);
                            
                            this.equipButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            this.rewardDialogCloseButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            this.rewardDialogNode.getComponent(cc.BlockInputEvents).enabled = false;

                            this.rewardDialogNode.opacity = 0;
                            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Reward_Card_Clicked", "operation", "equip");
                        }, this);

                        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Reward_Card_Viewed");
                        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "boss", "which_knives", this.rewardKnifeId);
                    });
                } else {
                    this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);;
                }
            } else {
                this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);
            }
        }
    }

    public onStageFailed(): void {
        this.fallKnifesCount = 0;
        this.appNode.getComponent(AppComponent).jumpToContinuePage(this.stage, this.score);
    }

    public onStageFinished(): void {
        this.boardContainerNode.getComponent(BoardControlComponent).stopRotation();
        this.boardContainerNode.rotation = 0;

        if (!this.isBossStage) {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.boardBreakAudio, false);
            }

            let boardPos: cc.Vec2 = this.boardContainerNode.getPosition();

            if (!this.boardPartsNode) {
                this.boardPartsNode = cc.instantiate(this.boardPartsPrefab);
                this.node.addChild(this.boardPartsNode);
            }

            this.boardPartsNode.opacity = 255;
            this.boardPartsNode.setPosition(boardPos);
            this.boardPartsNode.getComponent(BoardPartsControlComponent).split();
        } else {
            this.stageboss++;

            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.bossDefeatedAudio, false);
            }

            if (this.hasRewardKnife || StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, "").split(",").indexOf(this.rewardKnifeId) != -1) {
                let rewardCoinsAnims = this.rewardCoinShowAnimNode.children;

                let rewardCoins = Math.floor(Math.random() * 10 + 50);
                this.rewardCoinLabel.getComponent(cc.Label).string = "+" + rewardCoins;
                StorageUtils.shared.putInt(Constants.KEY_CURRENCY, StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0) + rewardCoins);

                this.rewardCoinShowAnimNode.opacity = 255;
                for (let i = 0; i < rewardCoinsAnims.length; i++) {
                    rewardCoinsAnims[i].getComponent(cc.Animation).play();
                }
            }
        }

        this.boardNode.removeAllChildren();
        this.boardNode.removeFromParent();
        this.boardNodePool.put(this.boardNode);

        this.fallAllKnifes();
    }

    public onAppleHit(appleNode: cc.Node, posX: number, posY: number): void {
        this.apples.rollback(appleNode);

        StorageUtils.shared.putInt(Constants.KEY_CURRENCY, StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0) + 2);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");

        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.hitAppleAudio, false);
        }

        let applePartsNode: cc.Node = null;
        if (this.applePartsNodePool.size() == 0) {
            applePartsNode = cc.instantiate(this.applePartsPrefab);
        } else {
            applePartsNode = this.applePartsNodePool.get();
        }

        this.node.addChild(applePartsNode);
        applePartsNode.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(posX, posY)));
        applePartsNode.getComponent(ApplePartsControlComponent).split();

        this.applePartsNodes.push(applePartsNode);
    }

    public onKnifeInserted(): void {
        this.score++;
        this.scoreLabel.string = String(this.score);

        this.sparkNode.rotation = -this.node.rotation;
        this.sparkNode.getComponent(cc.ParticleSystem).resetSystem();

        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            if (!this.isBossStage) {
                cc.audioEngine.playEffect(this.hitNormalBoardAudio, false);
            } else {
                ResourceUtil.loadAudioClip(this.bossHitAudioResource, (err, audioClip) => {
                    cc.audioEngine.playEffect(audioClip, false);
                });
            }
        }

        if (this.nextKnifeNode) {
            this.nextKnifeNode.removeFromParent();
            this.backgroundNode.addChild(this.nextKnifeNode, 1);
            this.nextKnifeNode.getComponent(KnifeControlComponent).ready();
            this.backgroundNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback);
        }
    }

    public getCurrentStage(): number {
        return this.stage;
    }

    public continuePlay(): void {
        this.rewardDialogNode.opacity = 0;

        if (this.currentKnifeNode) {
            this.currentKnifeNode.getComponent(KnifeControlComponent).reset();

            for (let i = 0; i < this.applePartsNodes.length; i++) {
                this.applePartsNodes[i].removeFromParent();
                this.applePartsNodePool.put(this.applePartsNodes[i]);
            }

            this.currentKnifeNode.removeFromParent();
            this.backgroundNode.addChild(this.currentKnifeNode, 1);

            this.currentKnifeNode.setAnchorPoint(0.5, 0);
            this.currentKnifeNode.setPosition(new cc.Vec2(0, -(this.backgroundNode.height / 2 - 100)));
            this.currentKnifeNode.rotation = 0;

            this.backgroundNode.off(cc.Node.EventType.TOUCH_START);
            this.backgroundNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback);

            this.currentKnifeNode.getComponent(KnifeControlComponent).ready();
            this.boardContainerNode.getComponent(BoardControlComponent).startRotation();

            if (this.hasThrownKnifes) {
                this.knifes.rollbackKnife();
                this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent).rollbackOneKnife();
            }
        } else {
            this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);
        }
    }

    public setUpPlayStage(): void {
        this.stageLabel.getComponent(cc.Label).string = this.stageTitle;
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");
        this.stageProgressBarLayoutNode.getComponent(StageProgressBarComponent).init(this.stage);

        if (this.isBossStage) {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.bossAppearAudio, false);
            }

            let anims = this.knifeShowAnimNode.children;
            for (let i = 0; i < anims.length; i++) {
                anims[i].getComponent(cc.Animation).play();
            }

            anims[0].getComponent(cc.Animation).on(Constants.EVENT_ANIMATION_FINISH, () => {
                anims[0].getComponent(cc.Animation).off(Constants.EVENT_ANIMATION_FINISH);
                this.boardContainerNode.opacity = 255;
                this.initPlayView();
            }, this);
        } else {
            this.initPlayView();
        }

        if (StorageUtils.shared.getBoolean(Constants.KEY_LEFT_HAND_SWITCH, false)) {
            this.remainedKnifesLayoutNode.getComponent(cc.Widget).isAlignLeft = false;
            this.remainedKnifesLayoutNode.getComponent(cc.Widget).isAlignRight = true;
            this.remainedKnifesLayoutNode.getComponent(cc.Widget).right = 48;
        }

        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Game_Stage_Page_Viewed");
    }

    private initPlayView(): void {
        this.knifes.pushPresetKnifeNodes(this.knifePrefab, this.boardContainerNode, this.node);
        this.knifes.pushKnifeNodes(this.knifePrefab, this.boardContainerNode, this.backgroundNode, this.node);

        this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent).addKnifes(this.knifes.count);

        this.apples.pushAppleNodes(this.applePrefab, this.boardContainerNode, this.boardNode, this.node);

        this.currentKnifeNode = this.knifes.getCurrentKnifeNode();
        if (this.currentKnifeNode) {
            this.currentKnifeNode.getComponent(KnifeControlComponent).stageNode = this.node;

            this.backgroundNode.off(cc.Node.EventType.TOUCH_START);
            this.backgroundNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback);
            //之前是-1不显示
            this.currentKnifeNode.removeFromParent();
            this.backgroundNode.addChild(this.currentKnifeNode, 1);

            this.currentKnifeNode.getComponent(KnifeControlComponent).ready();
            this.boardContainerNode.getComponent(BoardControlComponent).startRotation();
        } else {
            this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);
        }

        this.equipButton.getComponent(cc.Button).enabled = false;
    }

    public onAllStagesWin(): void {
        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.getKnifeAudio, false);
        }

        StorageUtils.shared.putInt(Constants.KEY_CURRENCY, StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0) + COINS_REWARD_ALL_STAGES_WIN);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");

        this.isMaskShow = true;
        this.giftMask.opacity = 200;
        this.giftMask.getChildByName(NODE_NAME_GIFT_COIN_COUNT_CONTAINER).getChildByName(NODE_NAME_GIFT_COIN_COUNT).getComponent(cc.Label).string = "+" + String(COINS_REWARD_ALL_STAGES_WIN);
        for (let i = 0; i < Constants.COUNT_GIFT_APPLES; i++) {
            let applePartsNode = cc.instantiate(this.applePartsPrefab);

            applePartsNode.setPosition(new cc.Vec2(Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1) + 100,
                Math.random() * 400 - 100));
            this.giftMask.addChild(applePartsNode);
            applePartsNode.getComponent(ApplePartsControlComponent).split();

            this.giftApples.push(applePartsNode);
        }

        this.giftMask.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeGiftMask();
        }, this);

        this.scheduleOnce(() => {
            this.closeGiftMask();
        }, 2);
    }

    private closeGiftMask(): void {
        if (this.isMaskShow) {
            for (let i = 0; i < this.giftApples.length; i++) {
                this.node.removeChild(this.giftApples[i]);
            }

            this.giftMask.opacity = 0;
            this.isMaskShow = false;
            this.giftMask.off(cc.Node.EventType.TOUCH_END);

            this.appNode.getComponent(AppComponent).jumpToMainPage();
        }
    }

    private onTouchCallback = (event: cc.Event) => {
        this.backgroundNode.off(cc.Node.EventType.TOUCH_START);

        let currentKnifeNodeTemp = this.knifes.getCurrentKnifeNode();

        if (!currentKnifeNodeTemp) {
            this.backgroundNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback);
            return;
        }
        if (currentKnifeNodeTemp.getComponent(KnifeControlComponent).throw(this.boardContainerNode.position.y
            - this.boardNode.getContentSize().height / 2
            - currentKnifeNodeTemp.getComponent(KnifeControlComponent).knifeRealLength)) {

            this.currentKnifeNode = currentKnifeNodeTemp;
            this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent).throwOneKnife();

            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.knifeThrowAudio, false);
            }

            this.hasThrownKnifes = true;

            this.nextKnifeNode = this.knifes.getNextKnifeNode();
            if (!this.nextKnifeNode) {
                this.backgroundNode.off(cc.Node.EventType.TOUCH_START);
                this.currentKnifeNode.getComponent(KnifeControlComponent).setLastKnife(true);
            }
            this.knifes.moveToNextKnife();
        } else {
            this.backgroundNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback);
        }
    }

    private fallAllKnifes(): void {
        for (let i = 0; i < this.knifes.getUserKnifes().length; i++) {
            this.knifes.getUserKnifes()[i].group = GROUP_NAME_DEFAULT;
        }

        for (let i = 0; i < this.knifes.getPresetKnifes().length; i++) {
            this.knifes.getPresetKnifes()[i].group = GROUP_NAME_DEFAULT;
        }

        for (let i = 0; i < this.knifes.getUserKnifes().length; i++) {
            this.knifes.getUserKnifes()[i].getComponent(KnifeControlComponent).startFalling();
        }

        for (let i = 0; i < this.knifes.getPresetKnifes().length; i++) {
            this.knifes.getPresetKnifes()[i].getComponent(KnifeControlComponent).stageNode = this.node;
            this.knifes.getPresetKnifes()[i].getComponent(KnifeControlComponent).startFalling();
        }
    }

    private jumpToNextStage(score: number, stageboss: number, hasRewardKnife: boolean): void {
        for (let i = 0; i < this.applePartsNodes.length; i++) {
            this.applePartsNodes[i].removeFromParent();
            this.applePartsNodePool.put(this.applePartsNodes[i]);
        }
        this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent).reset();
        this.knifes.reset();
        this.apples.reset();

        this.boardContainerNode.opacity = 0;
        this.boardPartsNode.opacity = 0;
        this.rewardCoinShowAnimNode.opacity = 0;

        this.fallKnifesCount = 0;

        this.appNode.getComponent(AppComponent).jumpToNextStage(score, stageboss, hasRewardKnife);
    }
}
