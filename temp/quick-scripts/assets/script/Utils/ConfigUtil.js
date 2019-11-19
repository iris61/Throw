(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Utils/ConfigUtil.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '49248i3xrBDV6WweLuVU40B', 'ConfigUtil', __filename);
// script/Utils/ConfigUtil.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("../Constants");
var StorageUtils_1 = require("./StorageUtils");
var CONFIG_FILE_NAME = "config";
var PREFIX_KNIFE_ID = "knife";
var PREFIX_STAGE_ID = "stage";
var PREFIX_BOSS_STAGE_ID = "stageboss";
var KnifeObtainMethod;
(function (KnifeObtainMethod) {
    KnifeObtainMethod[KnifeObtainMethod["BUY"] = 1] = "BUY";
    KnifeObtainMethod[KnifeObtainMethod["REWARD_ADS"] = 2] = "REWARD_ADS";
    KnifeObtainMethod[KnifeObtainMethod["DEFEAT_BOSS"] = 3] = "DEFEAT_BOSS";
})(KnifeObtainMethod = exports.KnifeObtainMethod || (exports.KnifeObtainMethod = {}));
var ConfigUtil = /** @class */ (function () {
    function ConfigUtil() {
        this.configJson = null;
        // @ts-ignore
        window.ConfigUtil = ConfigUtil;
    }
    Object.defineProperty(ConfigUtil, "shared", {
        get: function () {
            if (!this.sharedInstance) {
                this.sharedInstance = new ConfigUtil();
            }
            return this.sharedInstance;
        },
        enumerable: true,
        configurable: true
    });
    ConfigUtil.prototype.init = function (callback) {
        var _this = this;
        cc.loader.loadRes(CONFIG_FILE_NAME, cc.JsonAsset, function (error, resource) {
            if (error) {
                cc.log(error);
            }
            else {
                _this.configJson = resource;
                callback();
            }
        });
    };
    ConfigUtil.prototype.getBossName = function (stageBoss) {
        return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + stageBoss].boss;
    };
    ConfigUtil.prototype.getBossRewardKnife = function (stageBoss) {
        return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + stageBoss].reward;
    };
    ConfigUtil.prototype.getBossHitAudioResourceUrl = function (stageBoss) {
        return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + stageBoss].knifeInsertedAudio;
    };
    ConfigUtil.prototype.getPlayStageUserKnifesCount = function (stageId) {
        return this.configJson.json.stages[stageId].knifes.count;
    };
    ConfigUtil.prototype.getStageIdByIndex = function (stage, stageboss) {
        return stage % Constants_1.Constants.INTERVAL_BOSS_STAGE == 0 ? PREFIX_BOSS_STAGE_ID + stageboss : PREFIX_STAGE_ID + stage;
    };
    ConfigUtil.prototype.getKnifeId = function (index) {
        return PREFIX_KNIFE_ID + index;
    };
    ConfigUtil.prototype.getIndexFromKnifeId = function (knifeId) {
        return Number(knifeId.substr(PREFIX_KNIFE_ID.length));
    };
    ConfigUtil.prototype.getIndexFromAdResult = function (result) {
        return Number(result.substr(Constants_1.Constants.WATCH_AD_FOR_KNIFE.length));
    };
    ConfigUtil.prototype.getKnifeResourceUrl = function (knifeId) {
        return this.configJson.json.knifes[knifeId].resource;
    };
    ConfigUtil.prototype.getKnifeInsertLength = function (knifeId) {
        return this.configJson.json.knifes[knifeId].insertLength;
    };
    ConfigUtil.prototype.getKnifeLength = function (knifeId) {
        return this.configJson.json.knifes[knifeId].length;
    };
    ConfigUtil.prototype.getKnifeObtainMethod = function (knifeId) {
        return this.configJson.json.knifes[knifeId].obtaining;
    };
    ConfigUtil.prototype.getKnifePrice = function (knifeId) {
        return this.configJson.json.knifes[knifeId].price;
    };
    ConfigUtil.prototype.getPresetKnifesArray = function (stageId) {
        return this.configJson.json.stages[stageId].knifes.origin.items;
    };
    ConfigUtil.prototype.getPresetKnifePositionAngle = function (stageId, presetKnifeIndex) {
        return this.configJson.json.stages[stageId].knifes.origin.items[presetKnifeIndex].position;
    };
    ConfigUtil.prototype.getPresetKnifeId = function (stageId, presetKnifeIndex) {
        return this.configJson.json.stages[stageId].knifes.origin.items[presetKnifeIndex].reference;
    };
    ConfigUtil.prototype.getPresetApplesArray = function (stageId) {
        return this.configJson.json.stages[stageId].apples.items;
    };
    ConfigUtil.prototype.getPresetAppleId = function (stageId, presetAppleIndex) {
        return this.configJson.json.stages[stageId].apples.items[presetAppleIndex].reference;
    };
    ConfigUtil.prototype.getAppleResourceUrl = function (appleId) {
        return this.configJson.json.apples[appleId].resource;
    };
    ConfigUtil.prototype.getPresetApplePositionAngle = function (stageId, presetAppleIndex) {
        return this.configJson.json.stages[stageId].apples.items[presetAppleIndex].position;
    };
    ConfigUtil.prototype.getBoardId = function (stageId) {
        return this.configJson.json.stages[stageId].board.reference;
    };
    ConfigUtil.prototype.getBoardResourceUrl = function (boardId) {
        return this.configJson.json.boards[boardId].resource;
    };
    ConfigUtil.prototype.getBoardRotation = function (stageId) {
        return this.configJson.json.stages[stageId].board.rotation;
    };
    ConfigUtil.prototype.getAllKnifesCount = function () {
        var count = 0;
        for (var knifeId in this.configJson.json.knifes) {
            count++;
        }
        return count;
    };
    ConfigUtil.prototype.getBossNameForKnife = function (knifeId) {
        for (var i = 1; i <= Constants_1.Constants.COUNT_TOTAL_BOSS_STAGE; i++) {
            if (this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + i].reward == knifeId) {
                return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + i].boss;
            }
        }
        return "";
    };
    ConfigUtil.prototype.hasKnife = function (knifeId) {
        return this.configJson.json.knifes[knifeId] != null;
    };
    ConfigUtil.prototype.hasLotteryKnife = function () {
        var gainedKnifes = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",");
        for (var index = 1; this.hasKnife(ConfigUtil.shared.getKnifeId(index)); index++) {
            if (ConfigUtil.shared.getKnifeObtainMethod(ConfigUtil.shared.getKnifeId(index)) != KnifeObtainMethod.DEFEAT_BOSS
                && -1 == gainedKnifes.indexOf(ConfigUtil.shared.getKnifeId(index))) {
                return true;
            }
        }
        return false;
    };
    return ConfigUtil;
}());
exports.default = ConfigUtil;

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
        //# sourceMappingURL=ConfigUtil.js.map
        