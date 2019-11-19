import ContinueComponent from "../done/ContinueComponent";

declare interface Android {
    logAnalyticsEvent(eventID: string, params: string[]);
    logAutopilotEvent(event: String);
    optIntegerConfig(defaultValue: number, path: string[]);
    optBooleanConfig(defaultValue: boolean, path: string[]);
    optFloatConfig(defaultValue: number, path: string[]);
    vibrate(duration: number);
    addShortcut();
    hasRewardAd();
    watchRewardAd(postion: string, message: string);
    watchInterstitialAd(postion: string, message: string);
    showToast(content: string);
}

declare var window: Window & {
    android: Android;
}

export default class JSInterfaceUtils {

    static logAnalyticsEvent(eventID: string, ...params: string[]): void {

        if (window.android && window.android.logAnalyticsEvent) {
            try {
                window.android.logAnalyticsEvent(eventID, params);

                cc.log("logAnalyticsEvent");

                return;
            } catch (error) {
                cc.error("logAnalyticsEvent error = " + error.name, error.message);
            }
        } else {
            cc.warn("windoe.android.logAnalyticsEvent method not found");
        }

        return;
    }

    static logAutopilotEvent(event: String): void {

        if (window.android && window.android.logAutopilotEvent) {
            try {
                window.android.logAutopilotEvent(event);

                cc.log("logAutopilotEvent");

                return;
            } catch (error) {
                cc.error("logAutopilotEvent error = " + error.name, error.message);
            }
        } else {
            cc.warn("windoe.android.logAutopilotEvent method not found");
        }

        return;
    }

    static optIntegerConfig(defaultValue: number, ...path: string[]): number {
        if (window.android && window.android.optIntegerConfig) {
            try {
                let ret = window.android.optIntegerConfig(defaultValue, path);

                cc.log("optIntegerConfig, result = " + ret);

                return ret;
            } catch (error) {
                cc.error("optIntegerConfig error = " + error.name, error.message);
            }
        } else {
            cc.warn("windoe.android.optIntegerConfig method not found");
        }

        return defaultValue;
    }

    static optBooleanConfig(defaultValue: boolean, ...path: string[]): boolean {
        if (window.android && window.android.optBooleanConfig) {
            try {
                let ret = window.android.optBooleanConfig(defaultValue, path);

                cc.log("optBooleanConfig, result = " + ret);

                return ret;
            } catch (error) {
                cc.error("optBooleanConfig error = " + error.name, error.message);
            }
        } else {
            cc.warn("windoe.android.optBooleanConfig method not found");
        }

        return defaultValue;
    }

    static optFloatConfig(defaultValue: number, ...path: string[]): number {
        if (window.android && window.android.optFloatConfig) {
            try {
                let ret = window.android.optFloatConfig(defaultValue, path);

                cc.log("optFloatConfig, result = " + ret);

                return ret;
            } catch (error) {
                cc.error("optFloatConfig error = " + error);
            }
        } else {
            cc.warn("windoe.android.optFloatConfig method not found");
        }

        return defaultValue;
    }

    static vibrate(duration: number): boolean {
        if (window.android && window.android.vibrate) {
            try {
                let ret = window.android.vibrate(duration);

                cc.log("vibrate, result = " + ret + ": " + typeof (ret));

                return ret;
            } catch (error) {
                cc.error("vibrate error = " + error);
            }
        } else {
            cc.warn("windoe.android.vibrate method not found");
        }

        return false;
    }

    static addShortcut(): void {
        if (window.android && window.android.addShortcut) {
            try {
                window.android.addShortcut();
                return;
            } catch (error) {
                cc.error("addShortcut error = " + error);
            }
        } else {
            cc.warn("windoe.android.addShortcut method not found");
        }

        return;
    }

    static hasRewardAd(): boolean {
        if (window.android && window.android.hasRewardAd) {
            try {
                let ret = window.android.hasRewardAd();

                cc.log("hasRewardAd, result = " + ret);

                return ret;
            } catch (error) {
                cc.error("hasRewardAd error = " + error);
            }
        } else {
            cc.warn("windoe.android.hasRewardAd method not found");
        }

        return false;
    }

    static watchRewardAd(position: string, message: string): boolean {
        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_RewardVideo_Ads_Should_Show", "position", position);

        if (window.android && window.android.watchRewardAd) {
            try {
                let ret = window.android.watchRewardAd(position, message);

                cc.log("watchRewardAd, result = " + ret + ": " + typeof (ret));

                return ret;
            } catch (error) {
                cc.error("watchRewardAd error = " + error);
            }
        } else {
            cc.warn("window.android.watchRewardAd method not found");
        }

        return false;
    }

    static watchInterstitialAd(position: string, message: string): boolean {
        if (ContinueComponent.isWatchingAd()) {
            return false;
        }
        
        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Interstitial_Ads_Should_Show", "position", position);

        if (window.android && window.android.watchInterstitialAd) {
            try {
                let ret = window.android.watchInterstitialAd(position, message);

                cc.log("watchInterstitialAd, result = " + ret + ": " + typeof (ret));

                return ret;
            } catch (error) {
                cc.error("watchInterstitialAd error = " + error);
            }
        } else {
            cc.warn("window.android.watchInterstitialAd method not found");
        }
        return false
    }

    static showToast(content: string): boolean {
        if (window.android && window.android.showToast) {
            try {
                let ret = window.android.showToast(content);

                cc.log("showToast, result = " + ret);

                return ret;
            } catch (error) {
                cc.error("showToast error = " + error);
            }
        } else {
            cc.warn("windoe.android.showToast method not found");
        }

        return false
    }
}

cc.log(window.android);