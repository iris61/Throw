import PlayStageControlComponent from "./PlayStageControlComponent";

const TAG_APPLE = 3;
const TAG_KNIFE_HEAD = 1;

const { ccclass, property } = cc._decorator;

@ccclass
export default class AppleControlComponent extends cc.Component {

    private stageNode: cc.Node = null;

    onLoad() {
        cc.log("AppleControlComponent onLoad");
    }

    start() {
    }

    // update (dt) {}

    onCollisionEnter(other, self) {
        if (other.tag == TAG_KNIFE_HEAD && self.tag == TAG_APPLE) {
            this.stageNode.getComponent(PlayStageControlComponent).onAppleHit(
                this.node,
                this.node.convertToWorldSpace(this.node.getAnchorPoint()).x,
                this.node.convertToWorldSpace(this.node.getAnchorPoint()).y);
        }
    }

    public setPlayStageNode(stageNode: cc.Node): void {
        this.stageNode = stageNode;
    }
}
