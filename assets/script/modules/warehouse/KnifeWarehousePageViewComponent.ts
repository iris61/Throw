import ResourceUtil from "../../utils/ResourceUtil";
import StorageUtils from "../../utils/StorageUtils"
import { Constants } from "../../Constants";
import ConfigUtil from "../../utils/ConfigUtil";

const { ccclass, property } = cc._decorator;

export const COUNT_KNIFES_ONE_PAGE = 7;

@ccclass
export default class KnifeWarehousePageViewComponent extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;

    @property(cc.Layout)
    defeatBossLayout: cc.Layout = null;

    @property(cc.Sprite)
    preview: cc.Sprite = null;

    @property(cc.Button)
    equipButton: cc.Button = null;

    @property(cc.AudioClip)
    chooseKnifeAudio: cc.AudioClip = null;

    private updateEquipButtonStatus: (index: number) => void;

    private previewSprite: cc.Sprite;

    private pageIndex: number = 0;
    private offsetXToCenter: number = 0;

    private touchStartPositionX: number = 0;
    private hasScrolledToUserKnife: boolean = false;

    onLoad() {
        for (let index = 1; ConfigUtil.shared.hasKnife(ConfigUtil.shared.getKnifeId(index)); index++) {
            let node = cc.instantiate(this.pageView.getPages()[0]);
            let knifeSprite: cc.Sprite = node.getComponent(cc.Sprite);

            ResourceUtil.loadSpriteRes(ConfigUtil.shared.getKnifeResourceUrl(ConfigUtil.shared.getKnifeId(index)), (error: Error, resource: cc.SpriteFrame) => {
                knifeSprite.spriteFrame = resource;
            });
            this.pageView.addPage(node);
        }

        this.pageView.node.on(Constants.EVENT_PAGE_VIEW_SCROLL, this.onScroll);

        this.pageView.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart);
        this.pageView.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd);

        this.pageView.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd);

        this.previewSprite = this.preview.getComponent(cc.Sprite);

        let userKnifeId: string = StorageUtils.shared.getString(Constants.KEY_USER_KNIFE, Constants.DEFAULT_USER_KNIFE_ID);
        this.pageIndex = ConfigUtil.shared.getIndexFromKnifeId(userKnifeId);

        ResourceUtil.loadSpriteRes(ConfigUtil.shared.getKnifeResourceUrl(ConfigUtil.shared.getKnifeId(this.pageIndex)), (error: Error, resource: cc.SpriteFrame) => {
            this.pageView.getPages()[this.pageIndex].setScale(2);

            this.previewSprite.spriteFrame = resource;
        });
    }

    start() {
    }

    update(dt) {
        if (!this.hasScrolledToUserKnife) {
            let offset = new cc.Vec2(0, 0);
            this.offsetXToCenter = (this.pageView.node.getChildByName("view").getChildByName("content")
                .getComponent(cc.Layout).spacingX + this.pageView.getPages()[0].width) * (1 + COUNT_KNIFES_ONE_PAGE) / 2;

            offset.x = this.pageView.getPages()[this.pageIndex].getPositionX() - this.offsetXToCenter;
            offset.y = 0;
            this.pageView.scrollToOffset(offset, 0.3);
            this.hasScrolledToUserKnife = true;
        }
    }

    public getCurrentKnifeId(): string {
        return ConfigUtil.shared.getKnifeId(this.pageIndex);
    }

    private onScroll = (event: cc.Event): void => {
        let scrollOffset = this.pageView.getScrollOffset().x;

        let halfSelectionWidth = (this.pageView.node.getChildByName("view").getChildByName("content")
            .getComponent(cc.Layout).spacingX + this.pageView.getPages()[0].width) / 2;

        for (let index = 0; index < this.pageView.getPages().length; index++) {
            let page = this.pageView.getPages()[index];

            if (Math.abs(page.x + scrollOffset - this.offsetXToCenter) < halfSelectionWidth && this.pageIndex != index) {
                this.changePageIndex(index);
                this.updateEquipButtonStatus(index);
            }
        }

        ResourceUtil.loadSpriteRes(ConfigUtil.shared.getKnifeResourceUrl(ConfigUtil.shared.getKnifeId(this.pageIndex)), (error: Error, resource: cc.SpriteFrame) => {
            this.previewSprite.spriteFrame = resource;
        });
    }

    private onTouchStart = (event: cc.Event.EventTouch): void => {
        if (StorageUtils.shared.getBoolean(Constants.KEY_SOUND_SWITCH, true)) {
            cc.audioEngine.playEffect(this.chooseKnifeAudio, false);
        }

        this.touchStartPositionX = event.touch.getLocationX();
    }

    private onTouchEnd = (event: cc.Event.EventTouch): void => {
        if (Math.abs(event.touch.getLocationX() - this.touchStartPositionX) > 0.0001) {
            this.scrollToKnife(this.pageIndex);
            return;
        }

        let windowSize = cc.view.getVisibleSize();
        let halfSelectionWidth = (this.pageView.node.getChildByName("view").getChildByName("content")
            .getComponent(cc.Layout).spacingX + this.pageView.getPages()[0].width) / 2;
        if (event.touch.getLocationX() > (windowSize.width / 2 + halfSelectionWidth)) {
            this.scrollToKnife(this.pageIndex + 1, 0.1);
            return;
        }

        if (event.touch.getLocationX() < (windowSize.width / 2 - halfSelectionWidth)) {
            this.scrollToKnife(this.pageIndex - 1, 0.1);
            return;
        }

        this.scrollToKnife(this.pageIndex, 0)
    }

    public scrollToKnife = (index: number, time?: number): void => {
        if (index != null) {
            this.changePageIndex(index);
        }

        let offset = new cc.Vec2(0, 0);
        offset.x = this.pageView.getPages()[this.pageIndex].getPositionX() - this.offsetXToCenter;
        this.pageView.scrollToOffset(offset, time == null? 0.3: time);
    }

    private changePageIndex(index) {
        this.pageView.getPages()[this.pageIndex].setScale(1);
        this.pageIndex = index;
        this.pageView.getPages()[this.pageIndex].setScale(2);
    }

    public init(updateEquipButtonStatus: (index: number) => void): void {
        this.updateEquipButtonStatus = updateEquipButtonStatus;
    }

}
