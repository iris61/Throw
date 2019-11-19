import KnifeWarehousePageViewComponent from "./KnifeWarehousePageViewComponent";
import LotteryComponent from "./LotteryComponent";
import AppComponent from "../../AppComponent";
import RewardComponent from "./RewardComponent";
import StorageUtils from "../../utils/StorageUtils";
import { Constants } from "../../Constants";
import JSInterfaceUtils from "../bridge/JSInterfaceUtils";
import ConfigUtil, { KnifeObtainMethod } from "../../utils/ConfigUtil";

const { ccclass, property } = cc._decorator;

const NODE_NAME_EQUIP_LABEL = "equip_label";
const NODE_NAME_UNLOCK_LABEL = "unlock_label";
const NODE_NAME_EQUIP_VIDEO_ICON = "equip_video_icon";
const NODE_NAME_COINS = "coins";
const NODE_NAME_MORE_LABEL = "more_label";
const NODE_NAME_LINE = "line";
const NODE_NAME_AD = "ad_image";

@ccclass
export default class KnifeWarehouseComponent extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;

    @property(cc.Layout)
    defeatBossLayout: cc.Layout = null;

    @property(cc.Prefab)
    lotteyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    rewardPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    previewSprite: cc.Sprite = null;

    @property(cc.Sprite)
    background: cc.Sprite = null;

    @property(cc.Label)
    knifeCntLabel: cc.Label = null;

    @property(cc.Label)
    currencyLabel: cc.Label = null;

    @property(cc.Button)
    lotteryButton: cc.Button = null;

    @property(cc.Button)
    equipButton: cc.Button = null;

    @property(cc.Button)
    backButton: cc.Button = null;

    @property(cc.Button)
    watchAdForCurrencyButton: cc.Button = null;

    @property(cc.Button)
    watchAdForCurrencyNoLotteryButton: cc.Button = null;

    @property(cc.AudioClip)
    getKnifeAudio: cc.AudioClip = null;

    private lotteryComponent: LotteryComponent = null;
    private knifeWarehousePageViewComponent: KnifeWarehousePageViewComponent = null;

    private appNode: cc.Node = null;
    private lotteryNode: cc.Node = null;

    private static instance: KnifeWarehouseComponent = null;

    onLoad() {
        this.equipButton.node.on(cc.Node.EventType.TOUCH_END, this.chooseKnife);

        this.backButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.backButton.getComponent(cc.AudioSource).clip, false);
            }

            this.node.removeFromParent();
            this.appNode.getComponent(AppComponent).updateMainPageKnife();
        }, this);

        this.knifeWarehousePageViewComponent = this.pageView.getComponent(KnifeWarehousePageViewComponent);

        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");
        let gainedKnifes: Array<string> = StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",");
        this.knifeCntLabel.getComponent(cc.Label).string = gainedKnifes.length + "/" + ConfigUtil.shared.getAllKnifesCount();

        this.updateLottryButtonState();

        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Store_Page_Viewed");

        this.pageView.node.getComponent(KnifeWarehousePageViewComponent).init(this.updateEquipButtonStatus);
    }

    private chooseKnife = (event: cc.Event) => {
        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.equipButton.getComponent(cc.AudioSource).clip, false);
        }

        let knifeId: string = this.knifeWarehousePageViewComponent.getCurrentKnifeId();
        let gainedKnifes: Array<string> = StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",");

        if (knifeId == Constants.DEFAULT_USER_KNIFE_ID || gainedKnifes.indexOf(knifeId) != -1) {
            StorageUtils.shared.putString(Constants.KEY_USER_KNIFE, knifeId);
            this.appNode.getComponent(AppComponent).jumpToPlayStage();

            JSInterfaceUtils.logAutopilotEvent("play_game_click");
            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Store_Play_Game_Clicked");
        } else if (ConfigUtil.shared.getKnifeObtainMethod(knifeId) == KnifeObtainMethod.BUY) {
            let currency = StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0);

            if (currency >= ConfigUtil.shared.getKnifePrice(knifeId)) {
                currency = currency - ConfigUtil.shared.getKnifePrice(knifeId);
                this.currencyLabel.getComponent(cc.Label).string = String(currency);
                StorageUtils.shared.putInt(Constants.KEY_CURRENCY, currency);

                StorageUtils.shared.putString(Constants.KEY_USER_KNIFE, knifeId);
                gainedKnifes.push(knifeId);
                StorageUtils.shared.putString(Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));
                this.knifeCntLabel.getComponent(cc.Label).string = gainedKnifes.length + "/" + ConfigUtil.shared.getAllKnifesCount();

                this.updateEquipButtonStatus(ConfigUtil.shared.getIndexFromKnifeId(knifeId));

                if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(this.getKnifeAudio, false);
                }

                this.updateLottryButtonState();
                
                JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "coins", "which_knives", knifeId);
            } else {
                JSInterfaceUtils.showToast(Constants.TOAST_NEED_MORE_COINS);
            }
        } else if (ConfigUtil.shared.getKnifeObtainMethod(knifeId) == KnifeObtainMethod.REWARD_ADS) {
            JSInterfaceUtils.watchRewardAd(Constants.POSTION_STORE_GET_KNIFE, Constants.WATCH_AD_FOR_KNIFE + ConfigUtil.shared.getIndexFromKnifeId(knifeId));
            this.updateLottryButtonState();
        }
    }

    private showLottery = (event: cc.Event.EventTouch) => {
        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.lotteryButton.getComponent(cc.AudioSource).clip, false);
        }

        let currency = StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0);
        if (currency < Constants.LOTTERY_PRICE) {
            JSInterfaceUtils.showToast(Constants.TOAST_NEED_MORE_COINS);
            return;
        }

        currency = currency - Constants.LOTTERY_PRICE;
        this.currencyLabel.getComponent(cc.Label).string = String(currency);
        StorageUtils.shared.putInt(Constants.KEY_CURRENCY, currency);

        this.lotteryNode = cc.instantiate(this.lotteyPrefab);
        this.lotteryComponent = this.lotteryNode.getComponentInChildren(LotteryComponent);
        this.lotteryComponent.init(this.lotteryCallback)

        this.background.node.addChild(this.lotteryNode);
    }

    private lotteryCallback = (): void => {
        this.scheduleOnce(function () {
            let knifeIndex: number = this.lotteryComponent.getKnifeIndex();
            let gainedKnifes: Array<string> = StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",");
            if (gainedKnifes.indexOf(ConfigUtil.shared.getKnifeId(knifeIndex)) == -1) {
                gainedKnifes.push(ConfigUtil.shared.getKnifeId(knifeIndex));
                StorageUtils.shared.putString(Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));
            }

            let rewardNode = cc.instantiate(this.rewardPrefab);
            rewardNode.getComponent(RewardComponent).init(knifeIndex, () => {
                this.updateEquipButtonStatus(knifeIndex);
            });

            this.lotteryNode.removeFromParent();
            this.background.node.addChild(rewardNode);
            this.knifeWarehousePageViewComponent.scrollToKnife(knifeIndex);

            this.updateEquipButtonStatus(knifeIndex);

            this.knifeCntLabel.getComponent(cc.Label).string = gainedKnifes.length + "/" + ConfigUtil.shared.getAllKnifesCount();

            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.getKnifeAudio, false);
            }

            this.appNode.getComponent(AppComponent).addUnlockKnifeCount();
            
            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "random", "which_knives", ConfigUtil.shared.getKnifeId(knifeIndex));
        }, 1);

        this.updateLottryButtonState();
    }

    public init(appNode: cc.Node): void {
        KnifeWarehouseComponent.instance = this;

        this.appNode = appNode;
    }

    private updateEquipButtonStatus = (index: number): void => {
        let showButton = (): void => {
            this.equipButton.node.opacity = 255;
            this.defeatBossLayout.node.opacity = 0;
        };

        let showObtainMethod = (): void => {
            this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).opacity = 255;
            this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).opacity = 255;
            this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 255;
            this.equipButton.node.getChildByName(NODE_NAME_EQUIP_LABEL).opacity = 0;
        };

        let hasGained = index == ConfigUtil.shared.getIndexFromKnifeId(Constants.DEFAULT_USER_KNIFE_ID)
            || StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",").indexOf(ConfigUtil.shared.getKnifeId(index)) != -1;
        let obtainMethod = ConfigUtil.shared.getKnifeObtainMethod(ConfigUtil.shared.getKnifeId(index));
        let userKnifeIndex = ConfigUtil.shared.getIndexFromKnifeId(StorageUtils.shared.getString(Constants.KEY_USER_KNIFE, Constants.DEFAULT_USER_KNIFE_ID));

        if (hasGained) {
            showButton();
            this.equipButton.node.getChildByName(NODE_NAME_EQUIP_LABEL).opacity = 255;
            this.equipButton.node.getChildByName(NODE_NAME_EQUIP_LABEL).getComponent(cc.Label).string = userKnifeIndex == index ? "CURRENT" : "EQUIP";
            this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).opacity = 0;
            this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).opacity = 0;
            this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 0;
            this.equipButton.node.getChildByName(NODE_NAME_COINS).opacity = 0;
            this.equipButton.node.getChildByName(NODE_NAME_EQUIP_VIDEO_ICON).opacity = 0;
            this.equipButton.node.getChildByName(NODE_NAME_AD).opacity = 0;
            return;
        }

        switch (obtainMethod) {
            case KnifeObtainMethod.BUY: {
                showButton();
                showObtainMethod();
                this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).color = new cc.Color(0xff, 0xee, 0x64, 0xff);
                this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).getComponent(cc.Label).string = String(ConfigUtil.shared.getKnifePrice(ConfigUtil.shared.getKnifeId(index)));
                this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).getComponent(cc.Label).string = "UNLOCK";
                this.equipButton.node.getChildByName(NODE_NAME_EQUIP_VIDEO_ICON).opacity = 0;
                this.equipButton.node.getChildByName(NODE_NAME_AD).opacity = 0;
                this.equipButton.node.getChildByName(NODE_NAME_COINS).opacity = 255;
                this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 100;
                break;
            }

            case KnifeObtainMethod.REWARD_ADS: {
                showButton();
                showObtainMethod();
                this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).color = new cc.Color(0x1e, 0x5d, 0x11, 0xff);
                let adCount = StorageUtils.shared.getInt(Constants.WATCH_AD_FOR_KNIFE + index, 0);
                this.equipButton.node.getChildByName(NODE_NAME_MORE_LABEL).getComponent(cc.Label).string = adCount + "/" + ConfigUtil.shared.getKnifePrice(ConfigUtil.shared.getKnifeId(index));
                this.equipButton.node.getChildByName(NODE_NAME_UNLOCK_LABEL).getComponent(cc.Label).string = "WATCH\nVIDEO";
                this.equipButton.node.getChildByName(NODE_NAME_EQUIP_VIDEO_ICON).opacity = 255;
                this.equipButton.node.getChildByName(NODE_NAME_AD).opacity = 255;
                this.equipButton.node.getChildByName(NODE_NAME_COINS).opacity = 0;
                this.equipButton.node.getChildByName(NODE_NAME_LINE).opacity = 100;
                break;
            }

            case KnifeObtainMethod.DEFEAT_BOSS: {
                this.equipButton.node.opacity = 0;
                this.defeatBossLayout.node.opacity = 255;
                this.defeatBossLayout.node.getChildByName("boss_label").getComponent(cc.Label).string = "BOSS " + ConfigUtil.shared.getBossNameForKnife(ConfigUtil.shared.getKnifeId(index));
                break;
            }
        }
    }

    public static watchAdForCurrency(): void {
        if (KnifeWarehouseComponent.instance == null) {
            return;
        }

        let currency = StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0);
        currency = currency + Constants.AD_PRICE;
        KnifeWarehouseComponent.instance.currencyLabel.getComponent(cc.Label).string = String(currency);
        StorageUtils.shared.putInt(Constants.KEY_CURRENCY, currency);
    }

    public static watchAdForKnife(watchAdRuselt: string): void {
        if (KnifeWarehouseComponent.instance == null) {
            return;
        }

        let adCount = StorageUtils.shared.getInt(watchAdRuselt, 0);
        adCount++;
        StorageUtils.shared.putInt(watchAdRuselt, adCount);

        let index = ConfigUtil.shared.getIndexFromAdResult(watchAdRuselt);
        let knifeId = ConfigUtil.shared.getKnifeId(index);
        let knifeUnlockAdCount = ConfigUtil.shared.getKnifePrice(knifeId);

        if (adCount >= knifeUnlockAdCount) {
            let gainedKnifes: Array<string> = StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",");
            gainedKnifes.push(knifeId)

            StorageUtils.shared.putString(Constants.KEY_USER_KNIFE, knifeId);
            StorageUtils.shared.putString(Constants.KEY_USER_GAINED_KNIFES, String(gainedKnifes));

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Knives_Unlock", "method", "videos", "which_knives", knifeId);
        }

        KnifeWarehouseComponent.instance.knifeWarehousePageViewComponent.scrollToKnife(index);
        KnifeWarehouseComponent.instance.updateEquipButtonStatus(index);
    }

    private updateLottryButtonState(): void {
        if (ConfigUtil.shared.hasLotteryKnife()) {
            this.watchAdForCurrencyButton.node.on(cc.Node.EventType.TOUCH_END, () => {
                if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                    cc.audioEngine.playEffect(this.watchAdForCurrencyButton.getComponent(cc.AudioSource).clip, false);
                }

                JSInterfaceUtils.watchRewardAd(Constants.POSTION_STORE_GET_COINS, Constants.WATCH_AD_FOR_CURRENCY);

                JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Store_Get_Coins_Clicked");
            }, this);

            this.lotteryButton.node.on(cc.Node.EventType.TOUCH_END, this.showLottery);
            this.watchAdForCurrencyNoLotteryButton.node.opacity = 0;

            return;
        }

        this.watchAdForCurrencyButton.node.removeFromParent();
        this.lotteryButton.node.removeFromParent();

        this.watchAdForCurrencyNoLotteryButton.node.opacity = 255;
        this.watchAdForCurrencyNoLotteryButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.watchAdForCurrencyButton.getComponent(cc.AudioSource).clip, false);
            }

            JSInterfaceUtils.watchRewardAd(Constants.POSTION_STORE_GET_COINS, Constants.WATCH_AD_FOR_CURRENCY);

            JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Store_Get_Coins_Clicked");
        }, this);
    }
}
