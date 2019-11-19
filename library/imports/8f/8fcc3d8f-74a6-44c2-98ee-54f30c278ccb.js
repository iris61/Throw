"use strict";
cc._RF.push(module, '8fcc32PdKZEwpjuVPMMJ4zL', 'PlayStageControlComponent');
// script/modules/play/PlayStageControlComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var KnifeControlComponent_1 = require("./KnifeControlComponent");
var BoardControlComponent_1 = require("./BoardControlComponent");
var RemainedKnifesComponent_1 = require("./RemainedKnifesComponent");
var AppleControlComponent_1 = require("./AppleControlComponent");
var ApplePartsControlComponent_1 = require("../../components/ApplePartsControlComponent");
var BoardPartsControlComponent_1 = require("./BoardPartsControlComponent");
var AppComponent_1 = require("../../AppComponent");
var StageProgressBarComponent_1 = require("../../components/StageProgressBarComponent");
var JSInterfaceUtils_1 = require("../bridge/JSInterfaceUtils");
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var ConfigUtil_1 = require("../../utils/ConfigUtil");
exports.NODE_NAME_BACKGROUND = "background";
var NODE_NAME_GIFT_COIN_COUNT = "gift_coin_count";
var NODE_NAME_GIFT_COIN_COUNT_CONTAINER = "gift_coin_count_container";
var GROUP_NAME_DEFAULT = "default";
var COINS_REWARD_ALL_STAGES_WIN = 500;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Knifes = /** @class */ (function () {
    function Knifes() {
        this.count = 8;
        this.presetKnifes = [];
        this.knifeNodesPool = new cc.NodePool();
        this.userKnifeNodes = [];
        this.presetKnifesNodes = [];
        this.userKnifeResourceUrl = null;
        this.currentKnifeIndex = 0;
        this.userKnifeRealLength = 420;
        this.userKnifeInsertedLength = 240;
    }
    Knifes.prototype.pushKnifeNodes = function (knifePrefab, boardContainerNode, backgroundNode, stageNode) {
        var _loop_1 = function (i) {
            var knifeNode = this_1.knifeNodesPool.size() == 0 ?
                cc.instantiate(knifePrefab) :
                this_1.knifeNodesPool.get();
            ResourceUtil_1.default.loadSpriteRes(this_1.userKnifeResourceUrl, function (error, resource) {
                knifeNode.getComponent(cc.Sprite).spriteFrame = resource;
            });
            knifeNode.getComponent(KnifeControlComponent_1.default).boardContainerNode = boardContainerNode;
            knifeNode.getComponent(KnifeControlComponent_1.default).stageNode = stageNode;
            knifeNode.getComponent(KnifeControlComponent_1.default).knifeRealLength = this_1.userKnifeRealLength;
            knifeNode.getComponent(KnifeControlComponent_1.default).knifeInsertLength = this_1.userKnifeInsertedLength;
            knifeNode.setPosition(0, -backgroundNode.getContentSize().height / 2 + 100);
            this_1.userKnifeNodes.push(knifeNode);
        };
        var this_1 = this;
        for (var i = 0; i < this.count; i++) {
            _loop_1(i);
        }
    };
    Knifes.prototype.getCurrentKnifeNode = function () {
        if (this.currentKnifeIndex < this.count) {
            return this.userKnifeNodes[this.currentKnifeIndex];
        }
        return null;
    };
    Knifes.prototype.getNextKnifeNode = function () {
        if (this.currentKnifeIndex + 1 < this.count) {
            return this.userKnifeNodes[this.currentKnifeIndex + 1];
        }
        return null;
    };
    Knifes.prototype.moveToNextKnife = function () {
        this.currentKnifeIndex++;
    };
    Knifes.prototype.rollbackKnife = function () {
        this.currentKnifeIndex--;
    };
    Knifes.prototype.getUserKnifes = function () {
        return this.userKnifeNodes;
    };
    Knifes.prototype.getPresetKnifes = function () {
        return this.presetKnifesNodes;
    };
    Knifes.prototype.pushPresetKnifeNodes = function (knifePrefab, boardContainerNode, stageNode) {
        for (var i = 0; i < this.presetKnifes.length; i++) {
            var presetKnife = this.knifeNodesPool.size() == 0 ?
                cc.instantiate(knifePrefab) :
                this.knifeNodesPool.get();
            this.presetKnifesNodes.push(presetKnife);
            presetKnife.getComponent(KnifeControlComponent_1.default).boardContainerNode = boardContainerNode;
            presetKnife.getComponent(KnifeControlComponent_1.default).stageNode = stageNode;
            presetKnife.getComponent(KnifeControlComponent_1.default).knifeRealLength = this.presetKnifes[i].length;
            presetKnife.getComponent(KnifeControlComponent_1.default).knifeInsertLength = this.presetKnifes[i].insertLength;
            presetKnife.getComponent(KnifeControlComponent_1.default).addToBoard(this.presetKnifes[i].resourceUrl, this.presetKnifes[i].position);
        }
    };
    Knifes.prototype.setUserKnifeResourceUrl = function (userKnifeResourceUrl) {
        this.userKnifeResourceUrl = userKnifeResourceUrl;
    };
    Knifes.prototype.setUserKnifeRealLength = function (userKnifeRealLength) {
        this.userKnifeRealLength = userKnifeRealLength;
    };
    Knifes.prototype.setUserKnifeInsertedLength = function (userKnifeInsertedLength) {
        this.userKnifeInsertedLength = userKnifeInsertedLength;
    };
    Knifes.prototype.reset = function () {
        for (var i = 0; i < this.userKnifeNodes.length; i++) {
            this.userKnifeNodes[i].getComponent(KnifeControlComponent_1.default).reset();
            this.knifeNodesPool.put(this.userKnifeNodes[i]);
        }
        for (var i = 0; i < this.presetKnifesNodes.length; i++) {
            this.presetKnifesNodes[i].getComponent(KnifeControlComponent_1.default).reset();
            this.knifeNodesPool.put(this.presetKnifesNodes[i]);
        }
        this.userKnifeNodes = [];
        this.presetKnifesNodes = [];
        this.currentKnifeIndex = 0;
    };
    return Knifes;
}());
var Board = /** @class */ (function () {
    function Board() {
        this.rotation = [];
    }
    Board.prototype.init = function (boardContainerNode, boardNode, isBossStage) {
        ResourceUtil_1.default.loadSpriteRes(this.resourceUrl, function (error, resource) {
            boardNode.getComponent(cc.Sprite).spriteFrame = resource;
            if (!isBossStage) {
                boardContainerNode.opacity = 255;
            }
        });
        boardContainerNode.getComponent(BoardControlComponent_1.default).setRotationSpeed(this.rotation);
    };
    return Board;
}());
var Apples = /** @class */ (function () {
    function Apples() {
        this.items = [];
        this.appleNodes = [];
        this.appleNodesPool = new cc.NodePool();
    }
    Apples.prototype.pushAppleNodes = function (applePrefab, boardContainerNode, boardNode, stageNode) {
        var _loop_2 = function (i) {
            var appleNode = this_2.appleNodesPool.size() == 0 ?
                cc.instantiate(applePrefab) :
                this_2.appleNodesPool.get();
            ResourceUtil_1.default.loadSpriteRes(this_2.items[i].resourceUrl, function (error, resource) {
                appleNode.getComponent(cc.Sprite).spriteFrame = resource;
            });
            var radius = boardNode.width / 2 - 15;
            appleNode.getComponent(AppleControlComponent_1.default).setPlayStageNode(stageNode);
            appleNode.setPosition(radius * Math.sin(this_2.items[i].position / 360 * 2 * Math.PI), radius * Math.cos(this_2.items[i].position / 360 * 2 * Math.PI));
            appleNode.rotation = this_2.items[i].position;
            boardNode.addChild(appleNode);
            this_2.appleNodes.push(appleNode);
        };
        var this_2 = this;
        for (var i = 0; i < this.items.length; i++) {
            _loop_2(i);
        }
    };
    Apples.prototype.rollback = function (appleNode) {
        if (this.appleNodes.indexOf(appleNode) != -1) {
            appleNode.removeFromParent();
            this.appleNodes.splice(this.appleNodes.indexOf(appleNode), 1);
            this.appleNodesPool.put(appleNode);
        }
    };
    Apples.prototype.reset = function () {
        for (var i = 0; i < this.appleNodes.length; i++) {
            this.appleNodes[i].removeFromParent();
            this.appleNodesPool.put(this.appleNodes[i]);
        }
        this.appleNodes = [];
    };
    return Apples;
}());
var PlayStageControlComponent = /** @class */ (function (_super) {
    __extends(PlayStageControlComponent, _super);
    function PlayStageControlComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.boardContainerNode = null;
        _this.boardNode = null;
        _this.backgroundNode = null;
        _this.remainedKnifesLayoutNode = null;
        _this.stageProgressBarLayoutNode = null;
        _this.knifeShowAnimNode = null;
        _this.rewardCoinShowAnimNode = null;
        _this.rewardCoinLabel = null;
        _this.rewardDialogNode = null;
        _this.rewardDialogBackgroundNode = null;
        _this.sparkNode = null;
        _this.rewardKnifeNode = null;
        _this.giftMask = null;
        _this.boardPartsPrefab = null;
        _this.knifePrefab = null;
        _this.applePrefab = null;
        _this.applePartsPrefab = null;
        _this.currencyLabel = null;
        _this.scoreLabel = null;
        _this.stageLabel = null;
        _this.bossNameLabel = null;
        _this.equipButton = null;
        _this.rewardDialogCloseButton = null;
        _this.knifeThrowAudio = null;
        _this.hitNormalBoardAudio = null;
        _this.hitAppleAudio = null;
        _this.boardBreakAudio = null;
        _this.bossBoardBreakAudio = null;
        _this.bossAppearAudio = null;
        _this.bossDefeatedAudio = null;
        _this.getKnifeAudio = null;
        _this.knifes = null;
        _this.apples = null;
        _this.board = null;
        _this.boardNodePool = null;
        _this.applePartsNodePool = null;
        _this.applePartsNodes = [];
        _this.giftApples = [];
        _this.appNode = null;
        _this.nextKnifeNode = null;
        _this.currentKnifeNode = null;
        _this.boardPartsNode = null;
        _this.stageTitle = "";
        _this.boss = "";
        _this.rewardKnifeId = "";
        _this.bossHitAudioResource = "";
        _this.score = 0;
        _this.fallKnifesCount = 0;
        _this.stage = 1;
        _this.stageboss = 1;
        _this.isBossStage = false;
        _this.hasThrownKnifes = false;
        _this.hasRewardKnife = false;
        _this.isMaskShow = false;
        _this.onTouchCallback = function (event) {
            _this.backgroundNode.off(cc.Node.EventType.TOUCH_START);
            var currentKnifeNodeTemp = _this.knifes.getCurrentKnifeNode();
            if (!currentKnifeNodeTemp) {
                _this.backgroundNode.on(cc.Node.EventType.TOUCH_START, _this.onTouchCallback);
                return;
            }
            if (currentKnifeNodeTemp.getComponent(KnifeControlComponent_1.default).throw(_this.boardContainerNode.position.y
                - _this.boardNode.getContentSize().height / 2
                - currentKnifeNodeTemp.getComponent(KnifeControlComponent_1.default).knifeRealLength)) {
                _this.currentKnifeNode = currentKnifeNodeTemp;
                _this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent_1.default).throwOneKnife();
                if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(_this.knifeThrowAudio, false);
                }
                _this.hasThrownKnifes = true;
                _this.nextKnifeNode = _this.knifes.getNextKnifeNode();
                if (!_this.nextKnifeNode) {
                    _this.backgroundNode.off(cc.Node.EventType.TOUCH_START);
                    _this.currentKnifeNode.getComponent(KnifeControlComponent_1.default).setLastKnife(true);
                }
                _this.knifes.moveToNextKnife();
            }
            else {
                _this.backgroundNode.on(cc.Node.EventType.TOUCH_START, _this.onTouchCallback);
            }
        };
        return _this;
    }
    PlayStageControlComponent.prototype.onLoad = function () {
        this.boardNodePool = new cc.NodePool();
        this.applePartsNodePool = new cc.NodePool();
        this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent_1.default).loadRes();
    };
    PlayStageControlComponent.prototype.start = function () {
    };
    // update (dt) {}
    // 为了更方便检查错误以及更方便修改json文件，在这里把json文件转换成能用语法检查出错误的结构，如果修改了json文件格式，只需要在这里修改即可
    PlayStageControlComponent.prototype.init = function (appNode, stage, stageboss, score, hasRewardKnife) {
        this.stage = stage;
        this.stageboss = stageboss;
        var stageId = ConfigUtil_1.default.shared.getStageIdByIndex(stage, stageboss);
        this.isBossStage = stage % Constants_1.Constants.INTERVAL_BOSS_STAGE == 0;
        this.hasRewardKnife = hasRewardKnife;
        if (this.isBossStage) {
            this.boss = ConfigUtil_1.default.shared.getBossName(stageboss);
            this.rewardKnifeId = ConfigUtil_1.default.shared.getBossRewardKnife(stageboss);
            this.bossHitAudioResource = ConfigUtil_1.default.shared.getBossHitAudioResourceUrl(stageboss);
        }
        this.stageTitle = (this.isBossStage ? "BOSS: " + this.boss : Constants_1.Constants.PREFIX_STAGE_TITLE + stage);
        this.appNode = appNode;
        this.score = score;
        this.scoreLabel.string = String(this.score);
        if (!this.knifes) {
            this.knifes = new Knifes();
        }
        this.knifes.count = ConfigUtil_1.default.shared.getPlayStageUserKnifesCount(stageId);
        var userKnifeId = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_KNIFE, Constants_1.Constants.DEFAULT_USER_KNIFE_ID);
        this.knifes.setUserKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeResourceUrl(userKnifeId));
        this.knifes.setUserKnifeInsertedLength(ConfigUtil_1.default.shared.getKnifeInsertLength(userKnifeId));
        this.knifes.setUserKnifeRealLength(ConfigUtil_1.default.shared.getKnifeLength(userKnifeId));
        this.knifes.presetKnifes = [];
        for (var i = 0; i < ConfigUtil_1.default.shared.getPresetKnifesArray(stageId).length; i++) {
            var presetKnifeId = ConfigUtil_1.default.shared.getPresetKnifeId(stageId, i);
            this.knifes.presetKnifes.push({
                resourceUrl: ConfigUtil_1.default.shared.getKnifeResourceUrl(presetKnifeId),
                position: ConfigUtil_1.default.shared.getPresetKnifePositionAngle(stageId, i),
                length: ConfigUtil_1.default.shared.getKnifeLength(presetKnifeId),
                insertLength: ConfigUtil_1.default.shared.getKnifeInsertLength(presetKnifeId)
            });
        }
        if (!this.apples) {
            this.apples = new Apples();
        }
        this.apples.items = [];
        for (var i = 0; i < ConfigUtil_1.default.shared.getPresetApplesArray(stageId).length; i++) {
            var appleId = ConfigUtil_1.default.shared.getPresetAppleId(stageId, i);
            this.apples.items.push({
                resourceUrl: ConfigUtil_1.default.shared.getAppleResourceUrl(appleId),
                position: ConfigUtil_1.default.shared.getPresetApplePositionAngle(stageId, i)
            });
        }
        if (this.boardNodePool && this.boardNodePool.size() > 0) {
            this.boardNode = this.boardNodePool.get();
            this.boardContainerNode.addChild(this.boardNode);
        }
        this.board = new Board();
        var boardId = ConfigUtil_1.default.shared.getBoardId(stageId);
        this.board.resourceUrl = ConfigUtil_1.default.shared.getBoardResourceUrl(boardId);
        this.board.rotation = ConfigUtil_1.default.shared.getBoardRotation(stageId);
        this.board.init(this.boardContainerNode, this.boardNode, this.isBossStage);
        this.setUpPlayStage();
    };
    PlayStageControlComponent.prototype.onKnifeFall = function () {
        var _this = this;
        this.fallKnifesCount++;
        if (this.fallKnifesCount >= this.knifes.count + this.knifes.presetKnifes.length) {
            if (this.isBossStage && !this.hasRewardKnife) {
                var gainedKnifes = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, "").split(",");
                if (gainedKnifes.indexOf(this.rewardKnifeId) == -1) {
                    this.equipButton.getComponent(cc.Button).enabled = true;
                    gainedKnifes.push(this.rewardKnifeId);
                    StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));
                    if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                        cc.audioEngine.playEffect(this.getKnifeAudio, false);
                    }
                    ResourceUtil_1.default.loadSpriteRes(ConfigUtil_1.default.shared.getKnifeResourceUrl(this.rewardKnifeId), function (error, resource) {
                        _this.rewardKnifeNode.getComponent(cc.Sprite).spriteFrame = resource;
                        _this.bossNameLabel.getComponent(cc.Label).string = _this.boss;
                        _this.rewardDialogNode.opacity = 255;
                        _this.rewardDialogNode.getComponent(cc.BlockInputEvents).enabled = true;
                        _this.rewardDialogCloseButton.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END, function () {
                            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                                cc.audioEngine.playEffect(_this.rewardDialogCloseButton.getComponent(cc.AudioSource).clip, false);
                            }
                            _this.jumpToNextStage(_this.score, _this.stageboss, true);
                            _this.equipButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            _this.rewardDialogCloseButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            _this.rewardDialogNode.getComponent(cc.BlockInputEvents).enabled = false;
                            _this.rewardDialogNode.opacity = 0;
                            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Reward_Card_Clicked", "operation", "cancel");
                        }, _this);
                        _this.equipButton.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END, function () {
                            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                                cc.audioEngine.playEffect(_this.equipButton.getComponent(cc.AudioSource).clip, false);
                            }
                            for (var i = 0; i < _this.knifes.getUserKnifes().length; i++) {
                                _this.knifes.getUserKnifes()[i].getComponent(cc.Sprite).spriteFrame = resource;
                            }
                            StorageUtils_1.default.shared.putString(Constants_1.Constants.KEY_USER_KNIFE, _this.rewardKnifeId);
                            _this.jumpToNextStage(_this.score, _this.stageboss, true);
                            _this.equipButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            _this.rewardDialogCloseButton.getComponent(cc.Button).node.off(cc.Node.EventType.TOUCH_END);
                            _this.rewardDialogNode.getComponent(cc.BlockInputEvents).enabled = false;
                            _this.rewardDialogNode.opacity = 0;
                            JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Reward_Card_Clicked", "operation", "equip");
                        }, _this);
                        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Reward_Card_Viewed");
                        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "boss", "which_knives", _this.rewardKnifeId);
                    });
                }
                else {
                    this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);
                    ;
                }
            }
            else {
                this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);
            }
        }
    };
    PlayStageControlComponent.prototype.onStageFailed = function () {
        this.fallKnifesCount = 0;
        this.appNode.getComponent(AppComponent_1.default).jumpToContinuePage(this.stage, this.score);
    };
    PlayStageControlComponent.prototype.onStageFinished = function () {
        this.boardContainerNode.getComponent(BoardControlComponent_1.default).stopRotation();
        this.boardContainerNode.rotation = 0;
        if (!this.isBossStage) {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.boardBreakAudio, false);
            }
            var boardPos = this.boardContainerNode.getPosition();
            if (!this.boardPartsNode) {
                this.boardPartsNode = cc.instantiate(this.boardPartsPrefab);
                this.node.addChild(this.boardPartsNode);
            }
            this.boardPartsNode.opacity = 255;
            this.boardPartsNode.setPosition(boardPos);
            this.boardPartsNode.getComponent(BoardPartsControlComponent_1.default).split();
        }
        else {
            this.stageboss++;
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.bossDefeatedAudio, false);
            }
            if (this.hasRewardKnife || StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, "").split(",").indexOf(this.rewardKnifeId) != -1) {
                var rewardCoinsAnims = this.rewardCoinShowAnimNode.children;
                var rewardCoins = Math.floor(Math.random() * 10 + 50);
                this.rewardCoinLabel.getComponent(cc.Label).string = "+" + rewardCoins;
                StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0) + rewardCoins);
                this.rewardCoinShowAnimNode.opacity = 255;
                for (var i = 0; i < rewardCoinsAnims.length; i++) {
                    rewardCoinsAnims[i].getComponent(cc.Animation).play();
                }
            }
        }
        this.boardNode.removeAllChildren();
        this.boardNode.removeFromParent();
        this.boardNodePool.put(this.boardNode);
        this.fallAllKnifes();
    };
    PlayStageControlComponent.prototype.onAppleHit = function (appleNode, posX, posY) {
        this.apples.rollback(appleNode);
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0) + 2);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.hitAppleAudio, false);
        }
        var applePartsNode = null;
        if (this.applePartsNodePool.size() == 0) {
            applePartsNode = cc.instantiate(this.applePartsPrefab);
        }
        else {
            applePartsNode = this.applePartsNodePool.get();
        }
        this.node.addChild(applePartsNode);
        applePartsNode.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(posX, posY)));
        applePartsNode.getComponent(ApplePartsControlComponent_1.default).split();
        this.applePartsNodes.push(applePartsNode);
    };
    PlayStageControlComponent.prototype.onKnifeInserted = function () {
        this.score++;
        this.scoreLabel.string = String(this.score);
        this.sparkNode.rotation = -this.node.rotation;
        this.sparkNode.getComponent(cc.ParticleSystem).resetSystem();
        if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
            if (!this.isBossStage) {
                cc.audioEngine.playEffect(this.hitNormalBoardAudio, false);
            }
            else {
                ResourceUtil_1.default.loadAudioClip(this.bossHitAudioResource, function (err, audioClip) {
                    cc.audioEngine.playEffect(audioClip, false);
                });
            }
        }
        if (this.nextKnifeNode) {
            this.nextKnifeNode.removeFromParent();
            this.backgroundNode.addChild(this.nextKnifeNode, 1);
            this.nextKnifeNode.getComponent(KnifeControlComponent_1.default).ready();
            this.backgroundNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback);
        }
    };
    PlayStageControlComponent.prototype.getCurrentStage = function () {
        return this.stage;
    };
    PlayStageControlComponent.prototype.continuePlay = function () {
        this.rewardDialogNode.opacity = 0;
        if (this.currentKnifeNode) {
            this.currentKnifeNode.getComponent(KnifeControlComponent_1.default).reset();
            for (var i = 0; i < this.applePartsNodes.length; i++) {
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
            this.currentKnifeNode.getComponent(KnifeControlComponent_1.default).ready();
            this.boardContainerNode.getComponent(BoardControlComponent_1.default).startRotation();
            if (this.hasThrownKnifes) {
                this.knifes.rollbackKnife();
                this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent_1.default).rollbackOneKnife();
            }
        }
        else {
            this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);
        }
    };
    PlayStageControlComponent.prototype.setUpPlayStage = function () {
        var _this = this;
        this.stageLabel.getComponent(cc.Label).string = this.stageTitle;
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        this.stageProgressBarLayoutNode.getComponent(StageProgressBarComponent_1.default).init(this.stage);
        if (this.isBossStage) {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.bossAppearAudio, false);
            }
            var anims_1 = this.knifeShowAnimNode.children;
            for (var i = 0; i < anims_1.length; i++) {
                anims_1[i].getComponent(cc.Animation).play();
            }
            anims_1[0].getComponent(cc.Animation).on(Constants_1.Constants.EVENT_ANIMATION_FINISH, function () {
                anims_1[0].getComponent(cc.Animation).off(Constants_1.Constants.EVENT_ANIMATION_FINISH);
                _this.boardContainerNode.opacity = 255;
                _this.initPlayView();
            }, this);
        }
        else {
            this.initPlayView();
        }
        if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_LEFT_HAND_SWITCH, false)) {
            this.remainedKnifesLayoutNode.getComponent(cc.Widget).isAlignLeft = false;
            this.remainedKnifesLayoutNode.getComponent(cc.Widget).isAlignRight = true;
            this.remainedKnifesLayoutNode.getComponent(cc.Widget).right = 48;
        }
        JSInterfaceUtils_1.default.logAnalyticsEvent("ThrowingMaster_Game_Stage_Page_Viewed");
    };
    PlayStageControlComponent.prototype.initPlayView = function () {
        this.knifes.pushPresetKnifeNodes(this.knifePrefab, this.boardContainerNode, this.node);
        this.knifes.pushKnifeNodes(this.knifePrefab, this.boardContainerNode, this.backgroundNode, this.node);
        this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent_1.default).addKnifes(this.knifes.count);
        this.apples.pushAppleNodes(this.applePrefab, this.boardContainerNode, this.boardNode, this.node);
        this.currentKnifeNode = this.knifes.getCurrentKnifeNode();
        if (this.currentKnifeNode) {
            this.currentKnifeNode.getComponent(KnifeControlComponent_1.default).stageNode = this.node;
            this.backgroundNode.off(cc.Node.EventType.TOUCH_START);
            this.backgroundNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback);
            //之前是-1不显示
            this.currentKnifeNode.removeFromParent();
            this.backgroundNode.addChild(this.currentKnifeNode, 1);
            this.currentKnifeNode.getComponent(KnifeControlComponent_1.default).ready();
            this.boardContainerNode.getComponent(BoardControlComponent_1.default).startRotation();
        }
        else {
            this.jumpToNextStage(this.score, this.stageboss, this.hasRewardKnife);
        }
        this.equipButton.getComponent(cc.Button).enabled = false;
    };
    PlayStageControlComponent.prototype.onAllStagesWin = function () {
        var _this = this;
        if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.getKnifeAudio, false);
        }
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0) + COINS_REWARD_ALL_STAGES_WIN);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_CURRENCY, "0");
        this.isMaskShow = true;
        this.giftMask.opacity = 200;
        this.giftMask.getChildByName(NODE_NAME_GIFT_COIN_COUNT_CONTAINER).getChildByName(NODE_NAME_GIFT_COIN_COUNT).getComponent(cc.Label).string = "+" + String(COINS_REWARD_ALL_STAGES_WIN);
        for (var i = 0; i < Constants_1.Constants.COUNT_GIFT_APPLES; i++) {
            var applePartsNode = cc.instantiate(this.applePartsPrefab);
            applePartsNode.setPosition(new cc.Vec2(Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1) + 100, Math.random() * 400 - 100));
            this.giftMask.addChild(applePartsNode);
            applePartsNode.getComponent(ApplePartsControlComponent_1.default).split();
            this.giftApples.push(applePartsNode);
        }
        this.giftMask.on(cc.Node.EventType.TOUCH_END, function () {
            _this.closeGiftMask();
        }, this);
        this.scheduleOnce(function () {
            _this.closeGiftMask();
        }, 2);
    };
    PlayStageControlComponent.prototype.closeGiftMask = function () {
        if (this.isMaskShow) {
            for (var i = 0; i < this.giftApples.length; i++) {
                this.node.removeChild(this.giftApples[i]);
            }
            this.giftMask.opacity = 0;
            this.isMaskShow = false;
            this.giftMask.off(cc.Node.EventType.TOUCH_END);
            this.appNode.getComponent(AppComponent_1.default).jumpToMainPage();
        }
    };
    PlayStageControlComponent.prototype.fallAllKnifes = function () {
        for (var i = 0; i < this.knifes.getUserKnifes().length; i++) {
            this.knifes.getUserKnifes()[i].group = GROUP_NAME_DEFAULT;
        }
        for (var i = 0; i < this.knifes.getPresetKnifes().length; i++) {
            this.knifes.getPresetKnifes()[i].group = GROUP_NAME_DEFAULT;
        }
        for (var i = 0; i < this.knifes.getUserKnifes().length; i++) {
            this.knifes.getUserKnifes()[i].getComponent(KnifeControlComponent_1.default).startFalling();
        }
        for (var i = 0; i < this.knifes.getPresetKnifes().length; i++) {
            this.knifes.getPresetKnifes()[i].getComponent(KnifeControlComponent_1.default).stageNode = this.node;
            this.knifes.getPresetKnifes()[i].getComponent(KnifeControlComponent_1.default).startFalling();
        }
    };
    PlayStageControlComponent.prototype.jumpToNextStage = function (score, stageboss, hasRewardKnife) {
        for (var i = 0; i < this.applePartsNodes.length; i++) {
            this.applePartsNodes[i].removeFromParent();
            this.applePartsNodePool.put(this.applePartsNodes[i]);
        }
        this.remainedKnifesLayoutNode.getComponent(RemainedKnifesComponent_1.default).reset();
        this.knifes.reset();
        this.apples.reset();
        this.boardContainerNode.opacity = 0;
        this.boardPartsNode.opacity = 0;
        this.rewardCoinShowAnimNode.opacity = 0;
        this.fallKnifesCount = 0;
        this.appNode.getComponent(AppComponent_1.default).jumpToNextStage(score, stageboss, hasRewardKnife);
    };
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "boardContainerNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "boardNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "backgroundNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "remainedKnifesLayoutNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "stageProgressBarLayoutNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "knifeShowAnimNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "rewardCoinShowAnimNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "rewardCoinLabel", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "rewardDialogNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "rewardDialogBackgroundNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "sparkNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "rewardKnifeNode", void 0);
    __decorate([
        property(cc.Node)
    ], PlayStageControlComponent.prototype, "giftMask", void 0);
    __decorate([
        property(cc.Prefab)
    ], PlayStageControlComponent.prototype, "boardPartsPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], PlayStageControlComponent.prototype, "knifePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], PlayStageControlComponent.prototype, "applePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], PlayStageControlComponent.prototype, "applePartsPrefab", void 0);
    __decorate([
        property(cc.Label)
    ], PlayStageControlComponent.prototype, "currencyLabel", void 0);
    __decorate([
        property(cc.Label)
    ], PlayStageControlComponent.prototype, "scoreLabel", void 0);
    __decorate([
        property(cc.Label)
    ], PlayStageControlComponent.prototype, "stageLabel", void 0);
    __decorate([
        property(cc.Label)
    ], PlayStageControlComponent.prototype, "bossNameLabel", void 0);
    __decorate([
        property(cc.Button)
    ], PlayStageControlComponent.prototype, "equipButton", void 0);
    __decorate([
        property(cc.Button)
    ], PlayStageControlComponent.prototype, "rewardDialogCloseButton", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "knifeThrowAudio", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "hitNormalBoardAudio", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "hitAppleAudio", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "boardBreakAudio", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "bossBoardBreakAudio", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "bossAppearAudio", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "bossDefeatedAudio", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayStageControlComponent.prototype, "getKnifeAudio", void 0);
    PlayStageControlComponent = __decorate([
        ccclass
    ], PlayStageControlComponent);
    return PlayStageControlComponent;
}(cc.Component));
exports.default = PlayStageControlComponent;

cc._RF.pop();