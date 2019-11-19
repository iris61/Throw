import AppComponent from "../../AppComponent";
import StorageUtils from "../../utils/StorageUtils";
import ResourceUtil from "../../utils/ResourceUtil";
import { Constants } from "../../Constants";
import JSInterfaceUtils from "../bridge/JSInterfaceUtils";
import GiftComponent from "../../components/GiftComponent";
import ConfigUtil from "../../utils/ConfigUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainControlComponent extends cc.Component {

    @property(cc.Node)
    knifeNode: cc.Node = null;

    @property(cc.Label)
    currencyLabel: cc.Label = null;

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    shopButton: cc.Button = null;

    @property(cc.Button)
    settingButton: cc.Button = null;

    @property(cc.Button)
    giftButton: cc.Button = null;

    onLoad() {
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");
    }

    start() {
        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Home_Page_Viewed", "gift_status",
            this.giftButton.getComponent(GiftComponent).isReady() ? "ready" : "not_ready");
    }

    public setClickEvents(appNode: cc.Node): void {
        this.playButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.playButton.getComponent(cc.AudioSource).clip, false);
            }

            appNode.getComponent(AppComponent).jumpToPlayStage();

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Home_Play_Game_Clicked");
            JSInterfaceUtils.logAutopilotEvent("play_game_click");
        }, this);

        this.shopButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.shopButton.getComponent(cc.AudioSource).clip, false);
            }

            appNode.getComponent(AppComponent).jumpToWarehousePage();
            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Home_Icon_Clicked", "which_icon", "store");
        }, this);

        this.settingButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.settingButton.getComponent(cc.AudioSource).clip, false);
            }

            appNode.getComponent(AppComponent).jumpToSettingPage();
            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Home_Icon_Clicked", "which_icon", "setting");
        }, this);

        this.giftButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Home_Icon_Clicked", "which_icon", "gift");
        }, this);
    }

    public updateUserKnife(): void {
        ResourceUtil.loadSpriteRes(ConfigUtil.shared.getKnifeResourceUrl(
            StorageUtils.shared.getString(Constants.KEY_USER_KNIFE, Constants.DEFAULT_USER_KNIFE_ID)), (error: Error, resource: cc.SpriteFrame) => {
                this.knifeNode.getComponent(cc.Sprite).spriteFrame = resource;
                this.knifeNode.opacity = 255;
            });
    }
}
