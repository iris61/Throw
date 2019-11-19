import FallingControlComponent, { Direction } from "../../components/FallingControlComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardPartsControlComponent extends cc.Component {

    @property(cc.Node)
    private firstBoardNode: cc.Node = null;

    @property(cc.Node)
    private secondBoardNode: cc.Node = null;

    @property(cc.Node)
    private thirdBoardNode: cc.Node = null;

    @property(cc.Node)
    private fourthBoardNode: cc.Node = null;

    onLoad() {
        cc.log("BoardPartsControlComponent onLoad");
    }

    start() {
    }

    public split(): void {
        this.firstBoardNode.getComponent(FallingControlComponent).split(Math.random() * 60, Direction.RIGHT);
        this.secondBoardNode.getComponent(FallingControlComponent).split(Math.random() * 60 + 60, Direction.LEFT);
        this.thirdBoardNode.getComponent(FallingControlComponent).split(Math.random() * 60 + 150, Direction.LEFT);
        this.fourthBoardNode.getComponent(FallingControlComponent).split(Math.random() * 60 + 210, Direction.LEFT);
    }
}
