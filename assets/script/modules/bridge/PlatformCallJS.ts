import StorageUtils from "../../utils/StorageUtils";
import { Constants } from "../../Constants";
import KnifeWarehouseComponent from "../warehouse/KnifeWarehouseComponent";
import ContinueComponent from "../done/ContinueComponent";
import DoneComponent from "../done/DoneComponent";
import AppComponent from "../../AppComponent";

declare var window: Window & {
    PlatformAPI: typeof PlatformCallJS;
}

export default class PlatformCallJS {

    public static currencyLabel: cc.Label;

    public static init() {
        window.PlatformAPI = this;

        cc.log("PlatformCallJS init");
    }

    public static addGold(count: number): void {
        let current: number = StorageUtils.shared.getInt(Constants.KEY_CURRENCY, 0);
        StorageUtils.shared.putInt(Constants.KEY_CURRENCY, current + count);

        if (this.currencyLabel) {
            this.currencyLabel.string = String(current + count);
        }
    }

    public static watchRewardAdCall(message: string, result: string): void {

        if (result == Constants.REWARD_AD_REWARDED) {
            switch (message) {
                case Constants.WATCH_AD_FOR_CURRENCY: {
                    KnifeWarehouseComponent.watchAdForCurrency();
                    DoneComponent.watchAdForCurrency();
                    break;
                }

                case Constants.WATCH_AD_FOR_CONTINUE_GAME: {
                    ContinueComponent.watchAdForContinueGame();
                    break;
                }

                default: {
                    if (message.indexOf(Constants.WATCH_AD_FOR_KNIFE) != -1) {
                        KnifeWarehouseComponent.watchAdForKnife(message);
                    }
                }

            }
        }

        if (result == Constants.REWARD_AD_CLOSED && message == Constants.WATCH_AD_FOR_CONTINUE_GAME) {
            ContinueComponent.closeAd();
            if (!ContinueComponent.getContinueGame()) {
                DoneComponent.logFlurryDonePageViewed();
            }
        }
    }

    public static watchInterstitialAdCall(message: string, result: string): void {

    }

    public static endGame(): any {
        AppComponent.endGame();
    }
}

PlatformCallJS.init();
