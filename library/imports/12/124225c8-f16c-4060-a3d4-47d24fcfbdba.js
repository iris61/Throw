"use strict";
cc._RF.push(module, '12422XI8WxAYKPUR9JPz726', 'LotteryComponent');
// script/modules/warehouse/LotteryComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var KnifeWarehousePageViewComponent_1 = require("./KnifeWarehousePageViewComponent");
var ConfigUtil_1 = require("../../utils/ConfigUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LotteryComponent = /** @class */ (function (_super) {
    __extends(LotteryComponent, _super);
    function LotteryComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pageView = null;
        _this.page = null;
        _this.notGainedKnifes = new Array();
        _this.pageViewIndexs = new Array();
        _this.selectPage = null;
        _this.hasStartedScroll = false;
        _this.randomNumber = 0;
        _this.lotteryCallback = null;
        return _this;
    }
    LotteryComponent.prototype.onLoad = function () {
        var _this = this;
        var gainedKnifes = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_GAINED_KNIFES, Constants_1.Constants.DEFAULT_USER_KNIFE_ID).split(",");
        var createPage = function (index) {
            var node = cc.instantiate(_this.page);
            var spriteComponent = node.getComponent(cc.Sprite);
            ResourceUtil_1.default.loadSpriteRes(ConfigUtil_1.default.shared.getKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeId(index)), function (error, resource) {
                spriteComponent.spriteFrame = resource;
            });
            _this.pageView.addPage(node);
        };
        for (var index = 1, count = 1; ConfigUtil_1.default.shared.hasKnife(ConfigUtil_1.default.shared.getKnifeId(index)) && count <= ((KnifeWarehousePageViewComponent_1.COUNT_KNIFES_ONE_PAGE - 1) / 2); index++) {
            if (ConfigUtil_1.default.shared.getKnifeObtainMethod(ConfigUtil_1.default.shared.getKnifeId(index)) == ConfigUtil_1.KnifeObtainMethod.DEFEAT_BOSS) {
                continue;
            }
            createPage(index);
            count++;
        }
        for (var index = 1, pageViewIndex = 0; ConfigUtil_1.default.shared.hasKnife(ConfigUtil_1.default.shared.getKnifeId(index)); index++) {
            if (ConfigUtil_1.default.shared.getKnifeObtainMethod(ConfigUtil_1.default.shared.getKnifeId(index)) == ConfigUtil_1.KnifeObtainMethod.DEFEAT_BOSS) {
                continue;
            }
            if (gainedKnifes.indexOf(ConfigUtil_1.default.shared.getKnifeId(index)) == -1) {
                this.notGainedKnifes.push(index);
                this.pageViewIndexs.push(pageViewIndex);
            }
            pageViewIndex++;
            createPage(index);
        }
        for (var index = 1, count = 1; ConfigUtil_1.default.shared.hasKnife(ConfigUtil_1.default.shared.getKnifeId(index)) && count < ((KnifeWarehousePageViewComponent_1.COUNT_KNIFES_ONE_PAGE + 1) / 2); index++) {
            if (ConfigUtil_1.default.shared.getKnifeObtainMethod(ConfigUtil_1.default.shared.getKnifeId(index)) == ConfigUtil_1.KnifeObtainMethod.DEFEAT_BOSS) {
                continue;
            }
            createPage(index);
            count++;
        }
        this.randomNumber = Math.floor(Math.random() * this.notGainedKnifes.length);
        this.selectPage = this.pageView.getPages()[(KnifeWarehousePageViewComponent_1.COUNT_KNIFES_ONE_PAGE - 1) / 2];
    };
    LotteryComponent.prototype.start = function () {
    };
    LotteryComponent.prototype.update = function (dt) {
        var _this = this;
        if (!this.hasStartedScroll) {
            var resetToFirstKnife = cc.callFunc(function () {
                this.pageView.scrollToLeft(0);
            }, this);
            var callBack = cc.callFunc(function () {
                this.lotteryCallback();
            }, this);
            var seq = cc.sequence(cc.repeat(cc.sequence(cc.moveBy(((this.pageView.getPages().length - KnifeWarehousePageViewComponent_1.COUNT_KNIFES_ONE_PAGE) * 0.1), this.pageView.getPages()[0].position.x - this.pageView.getPages()[this.pageView.getPages().length - KnifeWarehousePageViewComponent_1.COUNT_KNIFES_ONE_PAGE].position.x, 0), resetToFirstKnife), 1), cc.moveBy(this.pageViewIndexs[this.randomNumber] * 0.1, this.pageView.getPages()[0].position.x
                - this.pageView.getPages()[this.pageViewIndexs[this.randomNumber]].position.x, 0), callBack);
            this.pageView.content.runAction(seq);
            this.hasStartedScroll = true;
        }
        var halfSelectionWidth = (this.pageView.node.getChildByName("view").getChildByName("content")
            .getComponent(cc.Layout).spacingX + this.pageView.getPages()[0].width) / 2;
        this.pageView.getPages().forEach(function (page) {
            if (Math.abs(page.position.x + _this.pageView.content.position.x) < halfSelectionWidth) {
                _this.selectPage.setScale(1);
                _this.selectPage = page;
                _this.selectPage.setScale(2);
                return;
            }
        });
    };
    LotteryComponent.prototype.getKnifeIndex = function () {
        return this.notGainedKnifes[this.randomNumber];
    };
    LotteryComponent.prototype.init = function (lotteryCallback) {
        this.lotteryCallback = lotteryCallback;
    };
    __decorate([
        property(cc.PageView)
    ], LotteryComponent.prototype, "pageView", void 0);
    __decorate([
        property(cc.Prefab)
    ], LotteryComponent.prototype, "page", void 0);
    LotteryComponent = __decorate([
        ccclass
    ], LotteryComponent);
    return LotteryComponent;
}(cc.Component));
exports.default = LotteryComponent;

cc._RF.pop();