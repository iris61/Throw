import SwitchControlComponent from "./SwitchControlComponent";
import { Constants } from "../../Constants";
import StorageUtils from "../../utils/StorageUtils";
import JSInterfaceUtils from "../bridge/JSInterfaceUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingComponent extends cc.Component {

    @property(cc.Label)
    currencyLabel: cc.Label = null;

    @property(cc.Button)
    backButton: cc.Button = null;

    @property(cc.AudioClip)
    buttonClickAudio: cc.AudioClip = null;

    @property(SwitchControlComponent)
    soundsSwitchComponent: SwitchControlComponent = null;

    @property(SwitchControlComponent)
    vibrationSwitchComponent: SwitchControlComponent = null;

    @property(SwitchControlComponent)
    leftHandSwitchComponent: SwitchControlComponent = null;

    onLoad() {
        cc.log("SettingComponent onLoad()")

        this.currencyLabel.getComponent(cc.Label).string = StorageUtils.shared.getString(Constants.KEY_CURRENCY, "0");

        this.initSwitchComponent(Constants.KEY_SOUND_SWITCH, this.soundsSwitchComponent);
        this.initSwitchComponent(Constants.KEY_VIBRATION_SWITCH, this.vibrationSwitchComponent);
        this.initSwitchComponent(Constants.KEY_LEFT_HAND_SWITCH, this.leftHandSwitchComponent);

        this.backButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.backButton.getComponent(cc.AudioSource).clip, false);
            }

            this.node.removeFromParent();
        }, this);

        JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Settings_Page_Viewed");
    }

    start() {
    }

    update(dt) {
    }

    private initSwitchComponent(settingItemKey: string, switchComponent: SwitchControlComponent): void {
        if (!StorageUtils.shared.getString(settingItemKey)) {
            StorageUtils.shared.putBoolean(settingItemKey, settingItemKey != Constants.KEY_LEFT_HAND_SWITCH);
        }

        switchComponent.init(StorageUtils.shared.getBoolean(settingItemKey));
        switchComponent.setSwitchStateChangeCallback((checked) => {
            if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
                cc.audioEngine.playEffect(this.buttonClickAudio, false);
            }

            StorageUtils.shared.putBoolean(settingItemKey, checked);

            switch (settingItemKey) {
                case Constants.KEY_VIBRATION_SWITCH:
                    JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Settings_Vibration_Switch", "operation", checked ? "turn_on" : "turn_off");
                    break;

                case Constants.KEY_SOUND_SWITCH:
                    JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Settings_Sounds_Switch", "operation", checked ? "turn_on" : "turn_off");
                    break;

                case Constants.KEY_LEFT_HAND_SWITCH:
                    JSInterfaceUtils.logAnalyticsEvent("ThrowingMaster_Settings_LeftHand_Switch", "operation", checked ? "turn_on" : "turn_off");
                    break;
            }
        });
    }
}
