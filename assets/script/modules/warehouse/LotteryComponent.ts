import ResourceUtil from "../../utils/ResourceUtil";
import StorageUtils from "../../utils/StorageUtils";
import { Constants } from "../../Constants";
import { COUNT_KNIFES_ONE_PAGE } from "./KnifeWarehousePageViewComponent";
import ConfigUtil, { KnifeObtainMethod } from "../../utils/ConfigUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryComponent extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;

    @property(cc.Prefab)
    page: cc.Prefab = null;

    private notGainedKnifes: Array<number> = new Array<number>();
    private pageViewIndexs: Array<number> = new Array<number>();

    private selectPage: cc.Node = null;

    private hasStartedScroll: boolean = false;
    private randomNumber: number = 0;

    private lotteryCallback: () => void = null;

    onLoad() {
        let gainedKnifes: Array<string> = StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",");

        let createPage = (index: number): void => {
            let node = cc.instantiate(this.page);

            let spriteComponent: cc.Sprite = node.getComponent(cc.Sprite);
            ResourceUtil.loadSpriteRes(ConfigUtil.shared.getKnifeResourceUrl(ConfigUtil.shared.getKnifeId(index)), (error: Error, resource: cc.SpriteFrame) => {
                spriteComponent.spriteFrame = resource;
            });

            this.pageView.addPage(node);
        };

        for (let index = 1, count = 1; ConfigUtil.shared.hasKnife(ConfigUtil.shared.getKnifeId(index)) && count <= ((COUNT_KNIFES_ONE_PAGE - 1) / 2); index++) {
            if (ConfigUtil.shared.getKnifeObtainMethod(ConfigUtil.shared.getKnifeId(index)) == KnifeObtainMethod.DEFEAT_BOSS) {
                continue;
            }

            createPage(index);
            count++;
        }

        for (let index = 1, pageViewIndex = 0; ConfigUtil.shared.hasKnife(ConfigUtil.shared.getKnifeId(index)); index++) {
            if (ConfigUtil.shared.getKnifeObtainMethod(ConfigUtil.shared.getKnifeId(index)) == KnifeObtainMethod.DEFEAT_BOSS) {
                continue;
            }

            if (gainedKnifes.indexOf(ConfigUtil.shared.getKnifeId(index)) == -1) {
                this.notGainedKnifes.push(index);
                this.pageViewIndexs.push(pageViewIndex);
            }

            pageViewIndex++;
            createPage(index);
        }

        for (let index = 1, count = 1; ConfigUtil.shared.hasKnife(ConfigUtil.shared.getKnifeId(index)) && count < ((COUNT_KNIFES_ONE_PAGE + 1) / 2); index++) {
            if (ConfigUtil.shared.getKnifeObtainMethod(ConfigUtil.shared.getKnifeId(index)) == KnifeObtainMethod.DEFEAT_BOSS) {
                continue;
            }

            createPage(index);
            count++;
        }

        this.randomNumber = Math.floor(Math.random() * this.notGainedKnifes.length);

        this.selectPage = this.pageView.getPages()[(COUNT_KNIFES_ONE_PAGE - 1) / 2];
    }

    start() {
    }

    update(dt) {
        if (!this.hasStartedScroll) {
            let resetToFirstKnife = cc.callFunc(function () {
                this.pageView.scrollToLeft(0);
            }, this);

            let callBack = cc.callFunc(function () {
                this.lotteryCallback();
            }, this);

            let seq = cc.sequence(
                cc.repeat(
                    cc.sequence(
                        cc.moveBy(((this.pageView.getPages().length - COUNT_KNIFES_ONE_PAGE) * 0.1), this.pageView.getPages()[0].position.x - this.pageView.getPages()[this.pageView.getPages().length - COUNT_KNIFES_ONE_PAGE].position.x, 0),
                        resetToFirstKnife
                    ), 1),

                cc.moveBy(this.pageViewIndexs[this.randomNumber] * 0.1, this.pageView.getPages()[0].position.x
                    - this.pageView.getPages()[this.pageViewIndexs[this.randomNumber]].position.x, 0),
                callBack
            );
            this.pageView.content.runAction(seq);

            this.hasStartedScroll = true;
        }

        let halfSelectionWidth = (this.pageView.node.getChildByName("view").getChildByName("content")
            .getComponent(cc.Layout).spacingX + this.pageView.getPages()[0].width) / 2;

        this.pageView.getPages().forEach(page => {
            if (Math.abs(page.position.x + this.pageView.content.position.x) < halfSelectionWidth) {
                this.selectPage.setScale(1);
                this.selectPage = page;
                this.selectPage.setScale(2);
                return;
            }
        });
    }

    public getKnifeIndex(): number {
        return this.notGainedKnifes[this.randomNumber];
    }

    public init(lotteryCallback: () => void): void {
        this.lotteryCallback = lotteryCallback;
    }
}
