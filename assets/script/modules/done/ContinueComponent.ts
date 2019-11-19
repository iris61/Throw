import StageProgressBarComponent from "../../components/StageProgressBarComponent";
import AppComponent from "../../AppComponent";
import StorageUtils from "../../utils/StorageUtils";
import { Constants } from "../../Constants";
import JSInterfaceUtils from "../bridge/JSInterfaceUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ContinueComponent extends cc.Component {

    @property(cc.Node)
    stageProgressBarLayoutNode: cc.Node = null;

    @property(cc.Node)
    circleAnimationNode: cc.Node = null;

    @property(cc.Label)
    stageLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    topScoreLabel: cc.Label = null;

    @property(cc.Label)
    currencyLabel: cc.Label = null;

    @property(cc.Button)
    quitButton: cc.Button = null;

    @property(cc.Button)
    continueButton: cc.Button = null;

    @property(cc.AudioClip)
    countdownAudio: cc.AudioClip = null;

    private static instance: ContinueComponent = null;

    private appNode: cc.Node = null;

    private stageTitle: string;

    private stage: number = 1;
    private score: number = 0;

    private watchingAd: boolean = false;
    private continueGame: boolean = false;

    onLoad() {
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");
        this.stageProgressBarLayoutNode.getComponent(StageProgressBarComponent).init(this.stage);

        this.stageTitle = Constants.PREFIX_STAGE_TITLE + this.stage;
        this.stageLabel.string = this.stageTitle;

        this.scoreLabel.string = String(this.score);
        this.topScoreLabel.string = String(this.score);

        this.scheduleOnce(function () {
            this.quitButton.node.on(cc.Node.EventType.TOUCH_END, () => {
                cc.audioEngine.stopAllEffects();
                if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(this.quitButton.getComponent(cc.AudioSource).clip, false);
                }

                this.appNode.getComponent(AppComponent).jumpToDonePage(this.stage, this.score);

                JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Continue_Page_Clicked", "operation", "no_thanks");
            }, this);

            this.quitButton.node.opacity = 110;
        }, 2);

        this.continueButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.audioEngine.stopAllEffects();
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.continueButton.getComponent(cc.AudioSource).clip, false);
            }

            JSInterfaceUtils.watchRewardAd(Constants.POSTION_CONTINUE, Constants.WATCH_AD_FOR_CONTINUE_GAME);
            this.watchingAd = true;

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Continue_Page_Clicked", "operation", "continue");
            JSInterfaceUtils.logAutopilotEvent("continue_button_click");
        }, this);

        this.circleAnimationNode.getComponent(cc.Animation).on(Constants.EVENT_ANIMATION_STOP, () => {
            this.appNode.getComponent(AppComponent).jumpToDonePage(this.stage, this.score);
            cc.audioEngine.stopAllEffects();
        });

        this.circleAnimationNode.getComponent(cc.Animation).play();
        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.countdownAudio, false);
        }

        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Continue_Page_Viewed");
    }

    public init(stage: number, score: number, appNode: cc.Node): void {
        ContinueComponent.instance = this;

        this.stage = stage;
        this.stageTitle = Constants.PREFIX_STAGE_TITLE + stage;

        this.score = score;
        this.appNode = appNode;
    }

    public static watchAdForContinueGame(): void {
        ContinueComponent.instance.appNode.getComponent(AppComponent).continuePlay();
        ContinueComponent.instance.continueGame = true;
    }

    public static isWatchingAd(): boolean {
        return ContinueComponent.instance && ContinueComponent.instance.watchingAd;
    }

    public static closeAd(): void {
        ContinueComponent.instance.watchingAd = false;
    }

    public static getContinueGame(): boolean {
        return ContinueComponent.instance.continueGame;
    }
}
