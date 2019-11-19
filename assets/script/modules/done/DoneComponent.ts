import AppComponent from "../../AppComponent";
import StorageUtils from "../../utils/StorageUtils";
import ResourceUtil from "../../utils/ResourceUtil";
import { Constants } from "../../Constants";
import JSInterfaceUtils from "../bridge/JSInterfaceUtils";
import GiftComponent from "../../components/GiftComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DoneComponent extends cc.Component {

    @property(cc.Sprite)
    bestRecordBackground: cc.Sprite = null;

    @property(cc.Sprite)
    coinIcon: cc.Sprite = null;

    @property(cc.Sprite)
    adsOrWarehouseIcon: cc.Sprite = null;

    @property(cc.Label)
    currencyLabel: cc.Label = null;

    @property(cc.Label)
    stageLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    adsOrWarehouseLabel: cc.Label = null;

    @property(cc.Button)
    adsOrWarehouseButton: cc.Button = null;

    @property(cc.Button)
    restartButton: cc.Button = null;

    @property(cc.Button)
    settingButton: cc.Button = null;

    @property(cc.Button)
    homeButton: cc.Button = null;

    @property(cc.Button)
    shopButton: cc.Button = null;

    @property(cc.Button)
    giftButton: cc.Button = null;

    @property(cc.Sprite)
    adSprite: cc.Sprite = null;

    private static instance: DoneComponent = null;

    private appNode: cc.Node = null;

    private stageTitle: string = "STAGE 1";

    private score: number = 0;

    onLoad() {
        this.stageLabel.string = this.stageTitle;
        this.scoreLabel.string = String(this.score);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");

        this.homeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.homeButton.getComponent(cc.AudioSource).clip, false);
            }

            this.appNode.getComponent(AppComponent).jumpToMainPage();

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "home");
        }, this);

        this.shopButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.shopButton.getComponent(cc.AudioSource).clip, false);
            }

            this.appNode.getComponent(AppComponent).jumpToWarehousePage();

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "store");
        }, this);

        this.settingButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.settingButton.getComponent(cc.AudioSource).clip, false);
            }

            this.appNode.getComponent(AppComponent).jumpToSettingPage();

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "setting");
        }, this);

        this.restartButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.restartButton.getComponent(cc.AudioSource).clip, false);
            }

            this.appNode.getComponent(AppComponent).jumpToPlayStage();

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_Restart_Clicked", "first_button",
                this.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins");
            
            JSInterfaceUtils.logAutopilotEvent("play_game_click");
        }, this);

        let bestScore: number = StorageUtils.shared.getInt(Constants.KEY_BEST_SCORE, 0);
        if (bestScore < this.score) {
            bestScore = this.score;
            StorageUtils.shared.putInt(Constants.KEY_BEST_SCORE, this.score);

            this.bestRecordBackground.node.opacity = 255;
        } else {
            this.bestRecordBackground.node.opacity = 0;
        }

        if (StorageUtils.shared.getBoolean(Constants.KEY_DONE_PAGE_SHOWN, false)) {
            this.coinIcon.node.opacity = 255;
            this.adSprite.node.opacity = 255;
            this.adsOrWarehouseLabel.string = "FREE COINS";

            ResourceUtil.loadSpriteRes("done/video", (error: Error, resource: cc.SpriteFrame) => {
                this.adsOrWarehouseIcon.spriteFrame = resource;
            });

            this.adsOrWarehouseButton.node.on(cc.Node.EventType.TOUCH_END, () => {
                if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(this.adsOrWarehouseButton.getComponent(cc.AudioSource).clip, false);
                }

                JSInterfaceUtils.watchRewardAd(Constants.POSTION_DONE_GET_COINS, Constants.WATCH_AD_FOR_CURRENCY);

                JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_First_Button_Clicked", "first_button",
                    this.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins");
            }, this);
        } else {
            this.coinIcon.node.opacity = 0;
            this.adSprite.node.opacity = 0;
            this.adsOrWarehouseLabel.string = "MORE KINIVES";

            ResourceUtil.loadSpriteRes("done/knives", (error: Error, resource: cc.SpriteFrame) => {
                this.adsOrWarehouseIcon.spriteFrame = resource;
            });

            this.adsOrWarehouseButton.node.on(cc.Node.EventType.TOUCH_END, () => {
                if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(this.adsOrWarehouseButton.getComponent(cc.AudioSource).clip, false);
                }

                this.appNode.getComponent(AppComponent).jumpToWarehousePage();

                JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_First_Button_Clicked", "first_button",
                    this.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins");
            }, this);

            StorageUtils.shared.putBoolean(Constants.KEY_DONE_PAGE_SHOWN, true);
        }

        this.giftButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_Icon_Clicked", "which_icon", "gift");
        }, this);

    }

    start() {
        DoneComponent.logFlurryDonePageViewed();
    }

    public init(stage: number, score: number, appNode: cc.Node): void {
        this.stageTitle = Constants.PREFIX_STAGE_TITLE + stage;
        this.score = score;
        this.appNode = appNode;

        DoneComponent.instance = this;
    }

    public static watchAdForCurrency(): void {
        if (!DoneComponent.instance) {
            return;
        }

        let currency = StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0);
        currency = currency + Constants.AD_PRICE;
        DoneComponent.instance.currencyLabel.getComponent(cc.Label).string = String(currency);
        StorageUtils.shared.putInt(Constants.KEY_CURRENCY, currency);
    }

    public static logFlurryDonePageViewed(): void {
        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Done_Page_Viewed", "first_button",
            DoneComponent.instance.adsOrWarehouseLabel.string == "MORE KINIVES" ? "more_knives" : "free_coins",
            "gift_status", DoneComponent.instance.giftButton.getComponent(GiftComponent).isReady() ? "ready" : "not_ready");

        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Life_Time_per_Play_Game", "game_time",
            String(Math.ceil((new Date().getTime() - StorageUtils.shared.getInt(Constants.KEY_ENTER_PLAY_TIME)) / 1000)),
            "game_over_stage", String(DoneComponent.instance.appNode.getComponent(AppComponent).getCurrentStage()));
    }

}
