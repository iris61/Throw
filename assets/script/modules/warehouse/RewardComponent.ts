import ResourceUtil from "../../utils/ResourceUtil";
import StorageUtils from "../../utils/StorageUtils";
import { Constants } from "../../Constants";
import ConfigUtil from "../../utils/ConfigUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RewardComponent extends cc.Component {

    @property(cc.Sprite)
    rewardKnifeSprite: cc.Sprite = null;

    @property(cc.Button)
    equipButton: cc.Button = null;

    @property(cc.Button)
    closeButton: cc.Button = null;

    private knifeIndex: number = 1;

    private equipCallback: () => void = null;

    onLoad() {
        ResourceUtil.loadSpriteRes(ConfigUtil.shared.getKnifeResourceUrl(ConfigUtil.shared.getKnifeId(this.knifeIndex)), (error: Error, resource: cc.SpriteFrame) => {
            this.rewardKnifeSprite.spriteFrame = resource;
        });

        this.equipButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.equipButton.getComponent(cc.AudioSource).clip, false);
            }

            StorageUtils.shared.putString(Constants.KEY_USER_KNIFE, ConfigUtil.shared.getKnifeId(this.knifeIndex));
            this.equipCallback();
            this.node.removeFromParent();
        }, this);

        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.closeButton.getComponent(cc.AudioSource).clip, false);
            }

            this.node.removeFromParent();
        }, this);
    }

    start() {

    }

    // update (dt) {}

    public init(knifeIndex: number, equipCallback: () => void): void {
        this.knifeIndex = knifeIndex;
        this.equipCallback = equipCallback;
    }
}
