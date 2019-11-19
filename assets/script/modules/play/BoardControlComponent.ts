export const NODE_NAME_BOARD = "board";

const NODE_NAME_WHITE_BOARD = "white_board";

const DURATION_SHAKE = 0.1;
const STRENGTH_SHAKE = 15;

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardControlComponent extends cc.Component {
    private rotation: {
        targetSpeed: number,
        interpolator: string,
        interval: number
    }[] = [];

    private posX: number = 0;
    private posY: number = 0;

    private rotationInterval: number = 0;
    private rotationSpeed: number = 0;
    private totalRotationTime: number = 0;

    private shakeDuration: number = 0;
    private totalTwinkleTime: number = 0;

    private rotationEnable: boolean = false;
    private twinkleEnable: boolean = false;

    onLoad() {
        this.posX = this.node.getPositionX();
        this.posY = this.node.getPositionY();
    }

    start() {
    }

    update(dt) {
        if (this.rotationEnable) {
            this.totalRotationTime += dt;

            let currentIntervalSum: number = 0;
            let currentIntervalIndex = 0;
            for (; currentIntervalIndex < this.rotation.length; currentIntervalIndex++) {
                currentIntervalSum += this.rotation[currentIntervalIndex].interval;
                if (this.totalRotationTime % this.rotationInterval < currentIntervalSum) {
                    break;
                }
            }

            if (this.rotation[currentIntervalIndex].interpolator == "linear" &&
                this.rotation[currentIntervalIndex].interval != 0) {
                this.rotationSpeed =
                    this.rotation[currentIntervalIndex].targetSpeed - (currentIntervalIndex == 0 ? 0 : this.rotation[currentIntervalIndex - 1].targetSpeed) *
                    (this.totalRotationTime % this.rotationInterval + this.rotation[currentIntervalIndex].interval - currentIntervalSum) /
                    this.rotation[currentIntervalIndex].interval;
            } else {
                //fixed
                this.rotationSpeed = this.rotation[currentIntervalIndex].targetSpeed;
            }

            this.node.rotation += this.rotationSpeed * dt;
        }

        // if (this.twinkleEnable) {
        //     if (this.totalTwinkleTime > this.shakeDuration) {
        //         this.twinkleEnable = false;
        //         this.node.getChildByName(NODE_NAME_WHITE_BOARD).opacity = 0;
        //         return;
        //     }

        //     this.node.getChildByName(NODE_NAME_WHITE_BOARD).opacity = 255 * this.totalTwinkleTime * 3;
        //     this.totalTwinkleTime += dt;
        // }
    }

    public startRotation(): void {
        this.rotationEnable = true;
    }

    public stopRotation(): void {
        this.rotationEnable = false;
    }

    public onKnifeInserted(): void {
        this.shakeDuration = DURATION_SHAKE;
        this.startShake(STRENGTH_SHAKE);

        this.totalTwinkleTime = 0;
        this.twinkleEnable = true;
    }

    public setRotationSpeed(rotation: { targetSpeed: number, interpolator: string, interval: number }[]): void {
        this.rotation = rotation;
        this.totalRotationTime = 0;
        this.rotationInterval = 0;
        for (let i = 0; i < this.rotation.length; i++) {
            this.rotationInterval += this.rotation[i].interval;
        }
    }

    private startShake(strength: number): void {
        // let shake: cc.ActionInterval = cc.sequence(
        //     cc.moveTo(this.shakeDuration, this.posX, this.posY + strength).easing(cc.easeBounceOut()),
        //     cc.moveTo(this.shakeDuration, this.posX, this.posY));

        // this.node.runAction(shake);
    }
}
