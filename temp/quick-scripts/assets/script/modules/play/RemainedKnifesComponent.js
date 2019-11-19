(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/modules/play/RemainedKnifesComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '65fedKGy6pD35dLayapixjo', 'RemainedKnifesComponent', __filename);
// script/modules/play/RemainedKnifesComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ResourceUtil_1 = require("../../utils/ResourceUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var RemainedKnifesComponent = /** @class */ (function (_super) {
    __extends(RemainedKnifesComponent, _super);
    function RemainedKnifesComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.knifeNodePool = null;
        _this.knifeNodes = [];
        _this.knifesCount = 0;
        _this.thrownKnifesCount = 0;
        return _this;
    }
    RemainedKnifesComponent.prototype.onLoad = function () {
        this.knifeNodePool = new cc.NodePool();
        this.loadRes();
    };
    RemainedKnifesComponent.prototype.loadRes = function () {
        var _this = this;
        ResourceUtil_1.default.loadSpriteRes("./play/knife_icon_used", function (error, resource) {
            _this.usedKnifeSprite = resource;
            _this.updateRemainedKnifesState();
        });
        ResourceUtil_1.default.loadSpriteRes("./play/knife_icon", function (error, resource) {
            _this.unusedKnifeSprite = resource;
            _this.updateRemainedKnifesState();
        });
    };
    RemainedKnifesComponent.prototype.addKnifes = function (count) {
        this.node.removeAllChildren();
        for (var i = 0; i < count; i++) {
            var node = (!this.knifeNodePool || this.knifeNodePool.size() == 0) ?
                new cc.Node("KnifeIcon" + i) :
                this.knifeNodePool.get();
            var spriteComponent = node.getComponent(cc.Sprite) ?
                node.getComponent(cc.Sprite) :
                node.addComponent(cc.Sprite);
            spriteComponent.spriteFrame = i < this.thrownKnifesCount ? this.usedKnifeSprite : this.unusedKnifeSprite;
            this.knifeNodes.push(node);
            this.node.addChild(node);
        }
        this.knifesCount += count;
        this.updateRemainedKnifesState();
    };
    RemainedKnifesComponent.prototype.throwOneKnife = function () {
        if (this.thrownKnifesCount < this.knifesCount) {
            this.node.children[this.thrownKnifesCount].getComponent(cc.Sprite).spriteFrame = this.usedKnifeSprite;
            this.thrownKnifesCount++;
        }
    };
    RemainedKnifesComponent.prototype.rollbackOneKnife = function () {
        this.thrownKnifesCount--;
        this.node.children[this.thrownKnifesCount].getComponent(cc.Sprite).spriteFrame = this.unusedKnifeSprite;
    };
    RemainedKnifesComponent.prototype.reset = function () {
        for (var i = 0; i < this.knifeNodes.length; i++) {
            this.knifeNodes[i].removeFromParent();
            this.knifeNodePool.put(this.knifeNodes[i]);
        }
        this.knifeNodes = [];
        this.thrownKnifesCount = 0;
        this.knifesCount = 0;
    };
    RemainedKnifesComponent.prototype.updateRemainedKnifesState = function () {
        for (var i = 0; i < this.knifeNodes.length; i++) {
            this.knifeNodes[i].getComponent(cc.Sprite).spriteFrame = i < this.thrownKnifesCount ? this.usedKnifeSprite : this.unusedKnifeSprite;
        }
    };
    RemainedKnifesComponent = __decorate([
        ccclass
    ], RemainedKnifesComponent);
    return RemainedKnifesComponent;
}(cc.Component));
exports.default = RemainedKnifesComponent;

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
        //# sourceMappingURL=RemainedKnifesComponent.js.map
        