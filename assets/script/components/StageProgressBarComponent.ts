import ResourceUtil from "../utils/ResourceUtil";
import { Constants } from "../Constants";

const PREFIX_STAGE_ICON_NODE = "StageProgressIcon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageProgressBarComponent extends cc.Component {
    public init(stage: number) {
        this.node.removeAllChildren();
        for (let i = 1; i <= Constants.INTERVAL_BOSS_STAGE; i++) {
            let node = new cc.Node(PREFIX_STAGE_ICON_NODE + i);
            let spriteComponent: cc.Sprite = node.addComponent(cc.Sprite);

            if (i < Constants.INTERVAL_BOSS_STAGE) {
                ResourceUtil.loadSpriteRes((stage % Constants.INTERVAL_BOSS_STAGE >= i
                    || stage % Constants.INTERVAL_BOSS_STAGE == 0) ?
                    "./common/stage_progress_bar_circle_orange" :
                    "./common/stage_progress_bar_circle_gray", (error: Error, resource: cc.SpriteFrame) => {
                        spriteComponent.spriteFrame = resource;
                    });
            } else {
                ResourceUtil.loadSpriteRes(stage % Constants.INTERVAL_BOSS_STAGE == 0 ?
                    "./common/stage_progress_bar_knife_orange" :
                    "./common/stage_progress_bar_knife", (error: Error, resource: cc.SpriteFrame) => {
                        spriteComponent.spriteFrame = resource;
                    });
            }
            this.node.addChild(node);
        }
    }
}
