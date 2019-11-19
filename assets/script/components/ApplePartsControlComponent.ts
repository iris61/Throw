import FallingControlComponent, { Direction } from "./FallingControlComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ApplePartsControlComponent extends cc.Component {

    @property(cc.Node)
    private leftAppleNode: cc.Node = null;

    @property(cc.Node)
    private rightAppleNode: cc.Node = null;

    onLoad() {
        cc.log("ApplePartsControlComponent onLoad");
    }

    public split(): void {
        this.leftAppleNode.getComponent(FallingControlComponent).split(90 + Math.random() * 90, Direction.LEFT);
        this.rightAppleNode.getComponent(FallingControlComponent).split(Math.random() * 90, Direction.RIGHT);
    }

}
