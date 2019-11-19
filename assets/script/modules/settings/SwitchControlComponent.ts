import ResourceUtil from "../../utils/ResourceUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SwitchControlComponent extends cc.Component {

    private checked: boolean = false;

    private switchStateChangeCallback: (checked: boolean) => void;

    onLoad() {
        this.updateSwitchState(this.node, this.checked);

        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event) => {
            this.checked = !this.checked;

            this.switchStateChangeCallback(this.checked);
            this.updateSwitchState(this.node, this.checked);
        });
    }

    public init(checked: boolean): void {
        this.checked = checked;
    }

    public setSwitchStateChangeCallback(switchStateChangeCallback: (checked: boolean) => void): void {
        this.switchStateChangeCallback = switchStateChangeCallback;
    }

    private updateSwitchState(node: cc.Node, state: boolean): void {
        if (state) {
            ResourceUtil.loadSpriteRes("./settings/setting_switch_on", (error: Error, resource: cc.SpriteFrame) => {
                node.getComponent(cc.Sprite).spriteFrame = resource;
            });
        } else {
            ResourceUtil.loadSpriteRes("./settings/setting_switch_off", (error: Error, resource: cc.SpriteFrame) => {
                node.getComponent(cc.Sprite).spriteFrame = resource;
            });
        }
    }
}
