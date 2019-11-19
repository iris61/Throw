(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/modules/warehouse/KnifeWarehousePageViewComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f3c19j+oGtBV4HOC1+NNCeN', 'KnifeWarehousePageViewComponent', __filename);
// script/modules/warehouse/KnifeWarehousePageViewComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var StorageUtils_1 = require("../../utils/StorageUtils");
var Constants_1 = require("../../Constants");
var ConfigUtil_1 = require("../../utils/ConfigUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
exports.COUNT_KNIFES_ONE_PAGE = 7;
var KnifeWarehousePageViewComponent = /** @class */ (function (_super) {
    __extends(KnifeWarehousePageViewComponent, _super);
    function KnifeWarehousePageViewComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pageView = null;
        _this.defeatBossLayout = null;
        _this.preview = null;
        _this.equipButton = null;
        _this.chooseKnifeAudio = null;
        _this.pageIndex = 0;
        _this.offsetXToCenter = 0;
        _this.touchStartPositionX = 0;
        _this.hasScrolledToUserKnife = false;
        _this.onScroll = function (event) {
            var scrollOffset = _this.pageView.getScrollOffset().x;
            var halfSelectionWidth = (_this.pageView.node.getChildByName("view").getChildByName("content")
                .getComponent(cc.Layout).spacingX + _this.pageView.getPages()[0].width) / 2;
            for (var index = 0; index < _this.pageView.getPages().length; index++) {
                var page = _this.pageView.getPages()[index];
                if (Math.abs(page.x + scrollOffset - _this.offsetXToCenter) < halfSelectionWidth && _this.pageIndex != index) {
                    _this.changePageIndex(index);
                    _this.updateEquipButtonStatus(index);
                }
            }
            ResourceUtil_1.default.loadSpriteRes(ConfigUtil_1.default.shared.getKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeId(_this.pageIndex)), function (error, resource) {
                _this.previewSprite.spriteFrame = resource;
            });
        };
        _this.onTouchStart = function (event) {
            if (StorageUtils_1.default.shared.getBoolean(Constants_1.Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(_this.chooseKnifeAudio, false);
            }
            _this.touchStartPositionX = event.touch.getLocationX();
        };
        _this.onTouchEnd = function (event) {
            if (Math.abs(event.touch.getLocationX() - _this.touchStartPositionX) > 0.0001) {
                _this.scrollToKnife(_this.pageIndex);
                return;
            }
            var windowSize = cc.view.getVisibleSize();
            var halfSelectionWidth = (_this.pageView.node.getChildByName("view").getChildByName("content")
                .getComponent(cc.Layout).spacingX + _this.pageView.getPages()[0].width) / 2;
            if (event.touch.getLocationX() > (windowSize.width / 2 + halfSelectionWidth)) {
                _this.scrollToKnife(_this.pageIndex + 1, 0.1);
                return;
            }
            if (event.touch.getLocationX() < (windowSize.width / 2 - halfSelectionWidth)) {
                _this.scrollToKnife(_this.pageIndex - 1, 0.1);
                return;
            }
            _this.scrollToKnife(_this.pageIndex, 0);
        };
        _this.scrollToKnife = function (index, time) {
            if (index != null) {
                _this.changePageIndex(index);
            }
            var offset = new cc.Vec2(0, 0);
            offset.x = _this.pageView.getPages()[_this.pageIndex].getPositionX() - _this.offsetXToCenter;
            _this.pageView.scrollToOffset(offset, time == null ? 0.3 : time);
        };
        return _this;
    }
    KnifeWarehousePageViewComponent.prototype.onLoad = function () {
        var _this = this;
        var _loop_1 = function (index) {
            var node = cc.instantiate(this_1.pageView.getPages()[0]);
            var knifeSprite = node.getComponent(cc.Sprite);
            ResourceUtil_1.default.loadSpriteRes(ConfigUtil_1.default.shared.getKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeId(index)), function (error, resource) {
                knifeSprite.spriteFrame = resource;
            });
            this_1.pageView.addPage(node);
        };
        var this_1 = this;
        for (var index = 1; ConfigUtil_1.default.shared.hasKnife(ConfigUtil_1.default.shared.getKnifeId(index)); index++) {
            _loop_1(index);
        }
        this.pageView.node.on(Constants_1.Constants.EVENT_PAGE_VIEW_SCROLL, this.onScroll);
        this.pageView.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart);
        this.pageView.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd);
        this.pageView.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd);
        this.previewSprite = this.preview.getComponent(cc.Sprite);
        var userKnifeId = StorageUtils_1.default.shared.getString(Constants_1.Constants.KEY_USER_KNIFE, Constants_1.Constants.DEFAULT_USER_KNIFE_ID);
        this.pageIndex = ConfigUtil_1.default.shared.getIndexFromKnifeId(userKnifeId);
        ResourceUtil_1.default.loadSpriteRes(ConfigUtil_1.default.shared.getKnifeResourceUrl(ConfigUtil_1.default.shared.getKnifeId(this.pageIndex)), function (error, resource) {
            _this.pageView.getPages()[_this.pageIndex].setScale(2);
            _this.previewSprite.spriteFrame = resource;
        });
    };
    KnifeWarehousePageViewComponent.prototype.start = function () {
    };
    KnifeWarehousePageViewComponent.prototype.update = function (dt) {
        if (!this.hasScrolledToUserKnife) {
            var offset = new cc.Vec2(0, 0);
            this.offsetXToCenter = (this.pageView.node.getChildByName("view").getChildByName("content")
                .getComponent(cc.Layout).spacingX + this.pageView.getPages()[0].width) * (1 + exports.COUNT_KNIFES_ONE_PAGE) / 2;
            offset.x = this.pageView.getPages()[this.pageIndex].getPositionX() - this.offsetXToCenter;
            offset.y = 0;
            this.pageView.scrollToOffset(offset, 0.3);
            this.hasScrolledToUserKnife = true;
        }
    };
    KnifeWarehousePageViewComponent.prototype.getCurrentKnifeId = function () {
        return ConfigUtil_1.default.shared.getKnifeId(this.pageIndex);
    };
    KnifeWarehousePageViewComponent.prototype.changePageIndex = function (index) {
        this.pageView.getPages()[this.pageIndex].setScale(1);
        this.pageIndex = index;
        this.pageView.getPages()[this.pageIndex].setScale(2);
    };
    KnifeWarehousePageViewComponent.prototype.init = function (updateEquipButtonStatus) {
        this.updateEquipButtonStatus = updateEquipButtonStatus;
    };
    __decorate([
        property(cc.PageView)
    ], KnifeWarehousePageViewComponent.prototype, "pageView", void 0);
    __decorate([
        property(cc.Layout)
    ], KnifeWarehousePageViewComponent.prototype, "defeatBossLayout", void 0);
    __decorate([
        property(cc.Sprite)
    ], KnifeWarehousePageViewComponent.prototype, "preview", void 0);
    __decorate([
        property(cc.Button)
    ], KnifeWarehousePageViewComponent.prototype, "equipButton", void 0);
    __decorate([
        property(cc.AudioClip)
    ], KnifeWarehousePageViewComponent.prototype, "chooseKnifeAudio", void 0);
    KnifeWarehousePageViewComponent = __decorate([
        ccclass
    ], KnifeWarehousePageViewComponent);
    return KnifeWarehousePageViewComponent;
}(cc.Component));
exports.default = KnifeWarehousePageViewComponent;

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
        //# sourceMappingURL=KnifeWarehousePageViewComponent.js.map
        