(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/components/StageProgressBarComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '374a9r2QzlDgpgamW2Qqx5Z', 'StageProgressBarComponent', __filename);
// script/components/StageProgressBarComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ResourceUtil_1 = require("../utils/ResourceUtil");
var Constants_1 = require("../Constants");
var PREFIX_STAGE_ICON_NODE = "StageProgressIcon";
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var StageProgressBarComponent = /** @class */ (function (_super) {
    __extends(StageProgressBarComponent, _super);
    function StageProgressBarComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StageProgressBarComponent.prototype.init = function (stage) {
        this.node.removeAllChildren();
        var _loop_1 = function (i) {
            var node = new cc.Node(PREFIX_STAGE_ICON_NODE + i);
            var spriteComponent = node.addComponent(cc.Sprite);
            if (i < Constants_1.Constants.INTERVAL_BOSS_STAGE) {
                ResourceUtil_1.default.loadSpriteRes((stage % Constants_1.Constants.INTERVAL_BOSS_STAGE >= i
                    || stage % Constants_1.Constants.INTERVAL_BOSS_STAGE == 0) ?
                    "./common/stage_progress_bar_circle_orange" :
                    "./common/stage_progress_bar_circle_gray", function (error, resource) {
                    spriteComponent.spriteFrame = resource;
                });
            }
            else {
                ResourceUtil_1.default.loadSpriteRes(stage % Constants_1.Constants.INTERVAL_BOSS_STAGE == 0 ?
                    "./common/stage_progress_bar_knife_orange" :
                    "./common/stage_progress_bar_knife", function (error, resource) {
                    spriteComponent.spriteFrame = resource;
                });
            }
            this_1.node.addChild(node);
        };
        var this_1 = this;
        for (var i = 1; i <= Constants_1.Constants.INTERVAL_BOSS_STAGE; i++) {
            _loop_1(i);
        }
    };
    StageProgressBarComponent = __decorate([
        ccclass
    ], StageProgressBarComponent);
    return StageProgressBarComponent;
}(cc.Component));
exports.default = StageProgressBarComponent;

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
        //# sourceMappingURL=StageProgressBarComponent.js.map
        