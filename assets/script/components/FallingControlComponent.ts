const { ccclass, property } = cc._decorator;

export const enum Direction {
    LEFT = 1,
    RIGHT = 0,
}

@ccclass
export default class FallingControlComponent extends cc.Component {

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(Number)
    verticalAccelerate: Number = 3000;

    @property(Number)
    horizentalAccelerate: Number = 0;

    private lastPos: cc.Vec2 = new cc.Vec2(0, 0);

    private speed: number = 800;
    private speedAngle: number = 0;
    private direction: number = Direction.RIGHT;

    onLoad() {
        cc.log("FallingControlComponent onLoad");
    }

    start() {
    }

    update(dt) {

        if (!this.node) {
            return;
        }

        let newPos: cc.Vec2 = new cc.Vec2(0, 0);

        newPos.x = this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) * dt + this.lastPos.x;
        newPos.y = this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) * dt + this.lastPos.y;

        this.node.setPosition(newPos);

        this.lastPos = newPos;

        this.speedAngle = Math.atan((this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) - Number(this.verticalAccelerate) * dt)
            / (this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) + Number(this.horizentalAccelerate) * dt)) / 2 / Math.PI * 360 + this.direction * 180;

        this.speed = Math.sqrt((this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) + Number(this.horizentalAccelerate) * dt) *
            (this.speed * Math.cos(this.speedAngle / 360 * 2 * Math.PI) + Number(this.horizentalAccelerate) * dt) +
            (this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) - Number(this.verticalAccelerate) * dt) *
            (this.speed * Math.sin(this.speedAngle / 360 * 2 * Math.PI) - Number(this.verticalAccelerate) * dt));
    }

    public split(speedAngle: number, direction: number): void {
        this.speedAngle = speedAngle;
        this.direction = direction;
        this.speed = 800;
        this.lastPos = new cc.Vec2(0, 0);

        if (this.node.childrenCount == 0) {
            let partNode: cc.Node = cc.instantiate(this.prefab);
            this.node.addChild(partNode);
        }
    }
}
