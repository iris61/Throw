import StorageUtils from "../utils/StorageUtils";
import { Constants } from "../Constants";
import ApplePartsControlComponent from "../components/ApplePartsControlComponent";

const NODE_NAME_GIFT_COIN_COUNT = "gift_coin_count";
const NODE_NAME_GIFT_COIN_COUNT_CONTAINER = "gift_coin_count_container";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GiftComponent extends cc.Component {

    @property(cc.Node)
    giftMask: cc.Node = null;

    @property(cc.Prefab)
    applePartsPrefab: cc.Prefab = null;

    @property(cc.Label)
    timerLabel: cc.Label = null;

    @property(cc.Label)
    currencyLabel: cc.Label = null;

    @property(cc.AudioClip)
    giftOpenAudio: cc.AudioClip = null;

    private giftApples: cc.Node[] = [];
    private giftCountDown: number = Constants.GIFT_COUNTDOWN_TIME;
    private isMaskShow: boolean = false;

    onLoad() {
        cc.log("GiftComponent onLoad");

        this.updateGiftCountdown();

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.giftCountDown <= 0) {
                this.openGift(50 + Math.floor(Math.random() * 10));
            }
        }, this);
    }

    start() {
    }

    update(dt) {
        this.updateGiftCountdown();
    }

    private transNumberToString(num: number): string {
        return num < 10 ? "0" + num : String(num);
    }

    private openGift(coins: number) {
        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.giftOpenAudio, false);
        }

        StorageUtils.shared.putInt(Constants.KEY_NEXT_GIFT_TIME, new Date().getTime() + Constants.GIFT_COUNTDOWN_TIME);
        StorageUtils.shared.putInt(Constants.KEY_CURRENCY, StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0) + coins);
        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");

        this.isMaskShow = true;
        this.giftMask.opacity = 200;
        this.giftMask.getChildByName(NODE_NAME_GIFT_COIN_COUNT_CONTAINER).getChildByName(NODE_NAME_GIFT_COIN_COUNT).getComponent(cc.Label).string = "+" + String(coins);
        for (let i = 0; i < Constants.COUNT_GIFT_APPLES; i++) {
            let applePartsNode = cc.instantiate(this.applePartsPrefab);

            applePartsNode.setPosition(new cc.Vec2(Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1) + 100,
                Math.random() * 400 - 100));
            this.giftMask.addChild(applePartsNode);
            applePartsNode.getComponent(ApplePartsControlComponent).split();

            this.giftApples.push(applePartsNode);
            this.giftCountDown = Constants.GIFT_COUNTDOWN_TIME;
        }

        this.giftMask.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeGiftMask();
        }, this);

        this.scheduleOnce(() => {
            this.closeGiftMask();
        }, 2);
    }

    private updateGiftCountdown(): void {
        let giftNextTime = StorageUtils.shared.getInt(Constants.KEY_NEXT_GIFT_TIME, 0);

        this.giftCountDown = giftNextTime - new Date().getTime();
        this.giftCountDown = Math.max(this.giftCountDown, 0);
        this.giftCountDown = Math.min(this.giftCountDown, Constants.GIFT_COUNTDOWN_TIME);

        if (giftNextTime == 0) {
            StorageUtils.shared.putInt(Constants.KEY_NEXT_GIFT_TIME, new Date().getTime());
            this.giftCountDown = 0;
        }

        if (this.giftCountDown <= 0) {
            this.timerLabel.string = "FREE GIFT";
            return;
        }

        this.timerLabel.getComponent(cc.Label).string = this.transNumberToString(Math.floor(this.giftCountDown / 60 / 1000 / 60)) + ":" +
            this.transNumberToString(Math.floor((this.giftCountDown % (60 * 1000 * 60) / 60 / 1000))) + ":" +
            this.transNumberToString(Math.floor((this.giftCountDown % (60 * 1000)) / 1000));
    }

    public isReady(): boolean {
        return this.giftCountDown <= 0;
    }

    private closeGiftMask(): void {
        if (this.isMaskShow) {
            for (let i = 0; i < this.giftApples.length; i++) {
                this.node.removeChild(this.giftApples[i]);
            }

            this.giftMask.opacity = 0;
            this.isMaskShow = false;
            this.giftMask.off(cc.Node.EventType.TOUCH_END);
        }
    }
}
