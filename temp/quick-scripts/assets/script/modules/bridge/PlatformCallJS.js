(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/modules/bridge/PlatformCallJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fc22euJrLFLDbTSSnthU8t1', 'PlatformCallJS', __filename);
// script/modules/bridge/PlatformCallJS.ts

Object.defineProperty(exports, "__esModule", { value: true });
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var KnifeWarehouseComponent_1 = require("../warehouse/KnifeWarehouseComponent");
var ContinueComponent_1 = require("../done/ContinueComponent");
var DoneComponent_1 = require("../done/DoneComponent");
var AppComponent_1 = require("../../AppComponent");
var PlatformCallJS = /** @class */ (function () {
    function PlatformCallJS() {
    }
    PlatformCallJS.init = function () {
        window.PlatformAPI = this;
        cc.log("PlatformCallJS init");
    };
    PlatformCallJS.addGold = function (count) {
        var current = StorageUtils_1.default.shared.getInt(Constants_1.Constants.KEY_CURRENCY, 0);
        StorageUtils_1.default.shared.putInt(Constants_1.Constants.KEY_CURRENCY, current + count);
        if (this.currencyLabel) {
            this.currencyLabel.string = String(current + count);
        }
    };
    PlatformCallJS.watchRewardAdCall = function (message, result) {
        if (result == Constants_1.Constants.REWARD_AD_REWARDED) {
            switch (message) {
                case Constants_1.Constants.WATCH_AD_FOR_CURRENCY: {
                    KnifeWarehouseComponent_1.default.watchAdForCurrency();
                    DoneComponent_1.default.watchAdForCurrency();
                    break;
                }
                case Constants_1.Constants.WATCH_AD_FOR_CONTINUE_GAME: {
                    ContinueComponent_1.default.watchAdForContinueGame();
                    break;
                }
                default: {
                    if (message.indexOf(Constants_1.Constants.WATCH_AD_FOR_KNIFE) != -1) {
                        KnifeWarehouseComponent_1.default.watchAdForKnife(message);
                    }
                }
            }
        }
        if (result == Constants_1.Constants.REWARD_AD_CLOSED && message == Constants_1.Constants.WATCH_AD_FOR_CONTINUE_GAME) {
            ContinueComponent_1.default.closeAd();
            if (!ContinueComponent_1.default.getContinueGame()) {
                DoneComponent_1.default.logFlurryDonePageViewed();
            }
        }
    };
    PlatformCallJS.watchInterstitialAdCall = function (message, result) {
    };
    PlatformCallJS.endGame = function () {
        AppComponent_1.default.endGame();
    };
    return PlatformCallJS;
}());
exports.default = PlatformCallJS;
PlatformCallJS.init();

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PlatformCallJS.js.map
        