"use strict";
cc._RF.push(module, '39252I89HRCXLXa6daFoXk4', 'JSInterfaceUtils');
// script/modules/bridge/JSInterfaceUtils.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ContinueComponent_1 = require("../done/ContinueComponent");
var JSInterfaceUtils = /** @class */ (function () {
    function JSInterfaceUtils() {
    }
    JSInterfaceUtils.logAnalyticsEvent = function (eventID) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (window.android && window.android.logAnalyticsEvent) {
            try {
                window.android.logAnalyticsEvent(eventID, params);
                cc.log("logAnalyticsEvent");
                return;
            }
            catch (error) {
                cc.error("logAnalyticsEvent error = " + error.name, error.message);
            }
        }
        else {
            cc.warn("windoe.android.logAnalyticsEvent method not found");
        }
        return;
    };
    JSInterfaceUtils.logAutopilotEvent = function (event) {
        if (window.android && window.android.logAutopilotEvent) {
            try {
                window.android.logAutopilotEvent(event);
                cc.log("logAutopilotEvent");
                return;
            }
            catch (error) {
                cc.error("logAutopilotEvent error = " + error.name, error.message);
            }
        }
        else {
            cc.warn("windoe.android.logAutopilotEvent method not found");
        }
        return;
    };
    JSInterfaceUtils.optIntegerConfig = function (defaultValue) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        if (window.android && window.android.optIntegerConfig) {
            try {
                var ret = window.android.optIntegerConfig(defaultValue, path);
                cc.log("optIntegerConfig, result = " + ret);
                return ret;
            }
            catch (error) {
                cc.error("optIntegerConfig error = " + error.name, error.message);
            }
        }
        else {
            cc.warn("windoe.android.optIntegerConfig method not found");
        }
        return defaultValue;
    };
    JSInterfaceUtils.optBooleanConfig = function (defaultValue) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        if (window.android && window.android.optBooleanConfig) {
            try {
                var ret = window.android.optBooleanConfig(defaultValue, path);
                cc.log("optBooleanConfig, result = " + ret);
                return ret;
            }
            catch (error) {
                cc.error("optBooleanConfig error = " + error.name, error.message);
            }
        }
        else {
            cc.warn("windoe.android.optBooleanConfig method not found");
        }
        return defaultValue;
    };
    JSInterfaceUtils.optFloatConfig = function (defaultValue) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        if (window.android && window.android.optFloatConfig) {
            try {
                var ret = window.android.optFloatConfig(defaultValue, path);
                cc.log("optFloatConfig, result = " + ret);
                return ret;
            }
            catch (error) {
                cc.error("optFloatConfig error = " + error);
            }
        }
        else {
            cc.warn("windoe.android.optFloatConfig method not found");
        }
        return defaultValue;
    };
    JSInterfaceUtils.vibrate = function (duration) {
        if (window.android && window.android.vibrate) {
            try {
                var ret = window.android.vibrate(duration);
                cc.log("vibrate, result = " + ret + ": " + typeof (ret));
                return ret;
            }
            catch (error) {
                cc.error("vibrate error = " + error);
            }
        }
        else {
            cc.warn("windoe.android.vibrate method not found");
        }
        return false;
    };
    JSInterfaceUtils.addShortcut = function () {
        if (window.android && window.android.addShortcut) {
            try {
                window.android.addShortcut();
                return;
            }
            catch (error) {
                cc.error("addShortcut error = " + error);
            }
        }
        else {
            cc.warn("windoe.android.addShortcut method not found");
        }
        return;
    };
    JSInterfaceUtils.hasRewardAd = function () {
        if (window.android && window.android.hasRewardAd) {
            try {
                var ret = window.android.hasRewardAd();
                cc.log("hasRewardAd, result = " + ret);
                return ret;
            }
            catch (error) {
                cc.error("hasRewardAd error = " + error);
            }
        }
        else {
            cc.warn("windoe.android.hasRewardAd method not found");
        }
        return false;
    };
    JSInterfaceUtils.watchRewardAd = function (position, message) {
        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_RewardVideo_Ads_Should_Show", "position", position);
        if (window.android && window.android.watchRewardAd) {
            try {
                var ret = window.android.watchRewardAd(position, message);
                cc.log("watchRewardAd, result = " + ret + ": " + typeof (ret));
                return ret;
            }
            catch (error) {
                cc.error("watchRewardAd error = " + error);
            }
        }
        else {
            cc.warn("window.android.watchRewardAd method not found");
        }
        return false;
    };
    JSInterfaceUtils.watchInterstitialAd = function (position, message) {
        if (ContinueComponent_1.default.isWatchingAd()) {
            return false;
        }
        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Interstitial_Ads_Should_Show", "position", position);
        if (window.android && window.android.watchInterstitialAd) {
            try {
                var ret = window.android.watchInterstitialAd(position, message);
                cc.log("watchInterstitialAd, result = " + ret + ": " + typeof (ret));
                return ret;
            }
            catch (error) {
                cc.error("watchInterstitialAd error = " + error);
            }
        }
        else {
            cc.warn("window.android.watchInterstitialAd method not found");
        }
        return false;
    };
    JSInterfaceUtils.showToast = function (content) {
        if (window.android && window.android.showToast) {
            try {
                var ret = window.android.showToast(content);
                cc.log("showToast, result = " + ret);
                return ret;
            }
            catch (error) {
                cc.error("showToast error = " + error);
            }
        }
        else {
            cc.warn("windoe.android.showToast method not found");
        }
        return false;
    };
    return JSInterfaceUtils;
}());
exports.default = JSInterfaceUtils;
cc.log(window.android);

cc._RF.pop();