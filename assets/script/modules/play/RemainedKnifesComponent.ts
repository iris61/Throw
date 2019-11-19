import ResourceUtil from "../../utils/ResourceUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RemainedKnifesComponent extends cc.Component {

    private knifeNodePool: cc.NodePool = null;
    private knifeNodes: cc.Node[] = [];

    private usedKnifeSprite: cc.SpriteFrame;
    private unusedKnifeSprite: cc.SpriteFrame;

    private knifesCount: number = 0;
    private thrownKnifesCount: number = 0;

    onLoad() {
        this.knifeNodePool = new cc.NodePool();

        this.loadRes();
    }

    public loadRes(): void {
        ResourceUtil.loadSpriteRes("./play/knife_icon_used", (error: Error, resource: cc.SpriteFrame) => {
            this.usedKnifeSprite = resource;
            this.updateRemainedKnifesState();
        });

        ResourceUtil.loadSpriteRes("./play/knife_icon", (error: Error, resource: cc.SpriteFrame) => {
            this.unusedKnifeSprite = resource;
            this.updateRemainedKnifesState();
        });
    }

    public addKnifes(count: number): void {
        this.node.removeAllChildren();
        for (let i = 0; i < count; i++) {
            let node = (!this.knifeNodePool || this.knifeNodePool.size() == 0) ? 
                new cc.Node("KnifeIcon" + i) : 
                this.knifeNodePool.get();
            let spriteComponent: cc.Sprite = node.getComponent(cc.Sprite) ?
                node.getComponent(cc.Sprite) :
                node.addComponent(cc.Sprite);

            spriteComponent.spriteFrame = i < this.thrownKnifesCount ? this.usedKnifeSprite : this.unusedKnifeSprite;

            this.knifeNodes.push(node);
            this.node.addChild(node);
        }
        this.knifesCount += count;
        this.updateRemainedKnifesState();
    }

    public throwOneKnife(): void {
        if (this.thrownKnifesCount < this.knifesCount) {
            this.node.children[this.thrownKnifesCount].getComponent(cc.Sprite).spriteFrame = this.usedKnifeSprite;
            this.thrownKnifesCount++;
        }
    }

    public rollbackOneKnife(): void {
        this.thrownKnifesCount--;
        this.node.children[this.thrownKnifesCount].getComponent(cc.Sprite).spriteFrame = this.unusedKnifeSprite;
    }

    public reset(): void {
        for (let i = 0; i < this.knifeNodes.length; i++) {
            this.knifeNodes[i].removeFromParent();
            this.knifeNodePool.put(this.knifeNodes[i]);
        }
        this.knifeNodes = [];
        this.thrownKnifesCount = 0;
        this.knifesCount = 0;
    }

    public updateRemainedKnifesState(): void {
        for (let i = 0; i < this.knifeNodes.length; i++) {
            this.knifeNodes[i].getComponent(cc.Sprite).spriteFrame = i < this.thrownKnifesCount ? this.usedKnifeSprite : this.unusedKnifeSprite;
        }
    }
}
