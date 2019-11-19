import PlayStageControlComponent from "./modules/play/PlayStageControlComponent";
import MainControlComponent from "./modules/main/MainControlComponent";
import KnifeWarehouseComponent from "./modules/warehouse/KnifeWarehouseComponent";
import ContinueComponent from "./modules/done/ContinueComponent";
import DoneComponent from "./modules/done/DoneComponent";
import StorageUtils from "./utils/StorageUtils";
import { Constants } from "./Constants";
import SettingComponent from "./modules/settings/SettingComponent";
import ConfigUtil from "./utils/ConfigUtil";
import JSInterfaceUtils from "./modules/bridge/JSInterfaceUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AppComponent extends cc.Component {

    @property(cc.Prefab)
    mainPagePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    playStagePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    warehousePagePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    continuePagePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    donePagePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    settingPagePrefabe: cc.Prefab = null;

    @property(cc.Node)
    canvasNode: cc.Node = null;

    private static instance: AppComponent = null;

    private mainPageNode: cc.Node = null;
    private playStageNode: cc.Node = null;
    private warehousePageNode: cc.Node = null;
    private continuePageNode: cc.Node = null;
    private donePageNode: cc.Node = null;
    private settingPageNode: cc.Node = null;

    private stage: number = 1;
    private bestStage: number = 0;
    private bestScore: number = 0;
    private stageboss: number = 1;
    private totalStage: number = 0;
    private roundCount: number = 0;
    private enterGameTime: number = new Date().getTime();

    onLoad() {
        if (!AppComponent.instance) {
            AppComponent.instance = this;
        }
        StorageUtils.shared.init(() => {
            ConfigUtil.shared.init(() => {
                this.jumpToMainPage();
                this.preloadKnifesResource();
            });
        });
    }

    start() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDrawBoundingBox = true;
        // manager.enabledDebugDraw = true;
    }

    // update (dt) {}

    public jumpToMainPage(): void {
        this.mainPageNode = cc.instantiate(this.mainPagePrefab);
        this.mainPageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.mainPageNode.getComponent(MainControlComponent).setClickEvents(this.node);
        this.mainPageNode.getComponent(MainControlComponent).updateUserKnife();

        this.canvasNode.removeAllChildren();
        this.canvasNode.addChild(this.mainPageNode);
    }

    public jumpToPlayStage(): void {
        this.roundCount++;
        this.totalStage++;
        this.bestStage = (this.bestStage == 0 ? 1 : this.bestStage);

        this.stage = 1;
        this.stageboss = StorageUtils.shared.getInt(Constants.KEY_BOSS, 1);
        this.stageboss = this.stageboss - 2 > 1 ? this.stageboss - 2 : 1;

        this.stageboss = this.stageboss > Constants.COUNT_TOTAL_BOSS_STAGE ? 1 : this.stageboss;

        StorageUtils.shared.putInt(Constants.KEY_ENTER_PLAY_TIME, new Date().getTime());

        this.playStageNode = cc.instantiate(this.playStagePrefab);
        this.playStageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.playStageNode.getComponent(PlayStageControlComponent).init(this.node, this.stage, this.stageboss, 0, false);

        this.canvasNode.removeAllChildren();
        this.canvasNode.addChild(this.playStageNode);

        JSInterfaceUtils.addShortcut();
    }

    public continuePlay(): void {
        this.canvasNode.removeAllChildren();

        if (!this.playStageNode) {
            this.playStageNode = cc.instantiate(this.playStagePrefab);
        }

        this.canvasNode.addChild(this.playStageNode);
        this.playStageNode.getComponent(PlayStageControlComponent).continuePlay();
    }

    public jumpToNextStage(score: number, stageboss: number, hasRewardKnife: boolean): void {
        this.stage++;

        this.totalStage++;
        this.bestStage = (this.bestStage > this.stage ? this.bestStage : this.stage);
        this.bestScore = (this.bestScore > score ? this.bestScore : score);

        this.stageboss = stageboss;
        this.stageboss = this.stageboss > Constants.COUNT_TOTAL_BOSS_STAGE ? 1 : this.stageboss;
        if (this.stageboss > StorageUtils.shared.getInt(Constants.KEY_BOSS, 1)) {
            StorageUtils.shared.putInt(Constants.KEY_BOSS, this.stageboss);
        }

        if (this.stage > Constants.COUNT_TOTAL_STAGE) {
            this.playStageNode.getComponent(PlayStageControlComponent).onAllStagesWin();
        } else {
            StorageUtils.shared.putInt(Constants.KEY_STAGE, this.stage);

            if (!this.playStageNode) {
                this.playStageNode = cc.instantiate(this.playStagePrefab);
                this.playStageNode.getComponent(cc.Widget).target = this.canvasNode;
            }
            this.playStageNode.getComponent(PlayStageControlComponent).init(this.node, this.stage, this.stageboss, score, hasRewardKnife);
        }
    }

    public jumpToWarehousePage(): void {
        this.warehousePageNode = cc.instantiate(this.warehousePagePrefab);
        this.warehousePageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.warehousePageNode.getComponent(KnifeWarehouseComponent).init(this.node);

        this.canvasNode.addChild(this.warehousePageNode);
    }

    public jumpToContinuePage(stage: number, score: number): void {
        this.bestScore = (this.bestScore > score ? this.bestScore : score);

        if (!JSInterfaceUtils.hasRewardAd()) {
            this.jumpToDonePage(stage, score);
            return;
        }

        this.continuePageNode = cc.instantiate(this.continuePagePrefab);
        this.continuePageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.continuePageNode.getComponent(ContinueComponent).init(stage, score, this.node);

        this.canvasNode.addChild(this.continuePageNode);
    }

    public jumpToDonePage(stage: number, score: number): void {
        this.bestScore = (this.bestScore > score ? this.bestScore : score);

        this.canvasNode.removeChild(this.continuePageNode);

        this.donePageNode = cc.instantiate(this.donePagePrefab);
        this.donePageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.donePageNode.getComponent(DoneComponent).init(stage, score, this.node);

        this.canvasNode.addChild(this.donePageNode);
        
        JSInterfaceUtils.watchInterstitialAd(Constants.POSTION_GAME_END, "");
    }

    public getCurrentStage(): number {
        if (this.playStageNode) {
            return this.playStageNode.getComponent(PlayStageControlComponent).getCurrentStage();
        } else {
            return 1;
        }
    }

    public jumpToSettingPage(): void {
        this.settingPageNode = cc.instantiate(this.settingPagePrefabe);
        this.settingPageNode.getComponent(cc.Widget).target = this.canvasNode;
        this.canvasNode.addChild(this.settingPageNode);
    }

    public updateMainPageKnife(): void {
        if (this.mainPageNode) {
            this.mainPageNode.getComponent(MainControlComponent).updateUserKnife();
        }
    }

    public static endGame(): void {
        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Life_Time", 
            "game_time", String(Math.floor((new Date().getTime() - AppComponent.instance.enterGameTime) / 1000)), 
            "game_round", String(AppComponent.instance.roundCount),
            "game_stage", String(AppComponent.instance.totalStage),
            "game_best_stage", String(AppComponent.instance.bestStage),
            "game_best_score", String(AppComponent.instance.bestScore),
            "coin_number", StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0"),
            "knife_unlock_number", String(StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",").length));
    }

    private preloadKnifesResource(): void {
        let userKnifeId: string = StorageUtils.shared.getString(Constants.KEY_USER_KNIFE, Constants.DEFAULT_USER_KNIFE_ID);
        let userKnifeIndex: number = ConfigUtil.shared.getIndexFromKnifeId(userKnifeId);
        for (let index = userKnifeIndex - 3; index < userKnifeIndex; index++) {
            if (ConfigUtil.shared.hasKnife(ConfigUtil.shared.getKnifeId(index))) {
                ConfigUtil.shared.getKnifeResourceUrl(ConfigUtil.shared.getKnifeId(index))
            }
        }
        for (let index = userKnifeIndex + 1; index < userKnifeIndex + 4; index++) {
            if (ConfigUtil.shared.hasKnife(ConfigUtil.shared.getKnifeId(index))) {
                ConfigUtil.shared.getKnifeResourceUrl(ConfigUtil.shared.getKnifeId(index))
            }
        }
    }
}
