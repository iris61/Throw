import { Constants } from "../Constants";
import StorageUtils from "./StorageUtils";

const CONFIG_FILE_NAME = "config";
const PREFIX_KNIFE_ID = "knife";
const PREFIX_STAGE_ID = "stage";
const PREFIX_BOSS_STAGE_ID = "stageboss";

export const enum KnifeObtainMethod{
    BUY = 1,
    REWARD_ADS = 2,
    DEFEAT_BOSS = 3
}

interface Position {
    reference: string,
    position: number
}

interface Rotation {
    targetSpeed: number,
    interpolator: string,
    interval: number
}

export default class ConfigUtil {
    private static sharedInstance: ConfigUtil;

    private configJson: any = null;

    public static get shared(): ConfigUtil {
        if (!this.sharedInstance) {
            this.sharedInstance = new ConfigUtil();
        }
        return this.sharedInstance;
    }

    private constructor() {
        // @ts-ignore
        window.ConfigUtil = ConfigUtil;
    }

    public init(callback): void {
        cc.loader.loadRes(CONFIG_FILE_NAME, cc.JsonAsset, (error: Error, resource: cc.JsonAsset) => {
            if (error) {
                cc.log(error);
            } else {
                this.configJson = resource;
                callback();
            }
        });
    }

    public getBossName(stageBoss: number): string {
        return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + stageBoss].boss;
    }

    public getBossRewardKnife(stageBoss: number): string {
        return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + stageBoss].reward;
    }

    public getBossHitAudioResourceUrl(stageBoss: number): string {
        return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + stageBoss].knifeInsertedAudio;
    }

    public getPlayStageUserKnifesCount(stageId: string): number {
        return this.configJson.json.stages[stageId].knifes.count;
    }

    public getStageIdByIndex(stage: number, stageboss: number): string {
        return  stage % Constants.INTERVAL_BOSS_STAGE == 0 ? PREFIX_BOSS_STAGE_ID + stageboss : PREFIX_STAGE_ID + stage;
    }

    public getKnifeId(index: number): string {
        return PREFIX_KNIFE_ID + index;
    }

    public getIndexFromKnifeId(knifeId: string): number {
        return Number(knifeId.substr(PREFIX_KNIFE_ID.length));
    }

    public getIndexFromAdResult(result: string): number {
        return Number(result.substr(Constants.WATCH_AD_FOR_KNIFE.length));
    }

    public getKnifeResourceUrl(knifeId: string): string {
        return this.configJson.json.knifes[knifeId].resource;
    }

    public getKnifeInsertLength(knifeId: string): number {
        return this.configJson.json.knifes[knifeId].insertLength;
    }

    public getKnifeLength(knifeId: string): number {
        return this.configJson.json.knifes[knifeId].length;
    }

    public getKnifeObtainMethod(knifeId: string): KnifeObtainMethod {
        return this.configJson.json.knifes[knifeId].obtaining;
    }

    public getKnifePrice(knifeId: string): number {
        return this.configJson.json.knifes[knifeId].price;
    }

    public getPresetKnifesArray(stageId: string): Position[]{
        return this.configJson.json.stages[stageId].knifes.origin.items;
    }

    public getPresetKnifePositionAngle(stageId: string, presetKnifeIndex: number): number{
        return this.configJson.json.stages[stageId].knifes.origin.items[presetKnifeIndex].position;
    }

    public getPresetKnifeId(stageId: string, presetKnifeIndex: number): string{
        return this.configJson.json.stages[stageId].knifes.origin.items[presetKnifeIndex].reference;
    }

    public getPresetApplesArray(stageId: string): Position[]{
        return this.configJson.json.stages[stageId].apples.items;
    }

    public getPresetAppleId(stageId: string, presetAppleIndex: number): string{
        return this.configJson.json.stages[stageId].apples.items[presetAppleIndex].reference;
    }

    public getAppleResourceUrl(appleId: string): string {
        return this.configJson.json.apples[appleId].resource;
    }

    public getPresetApplePositionAngle(stageId: string, presetAppleIndex: number): number{
        return this.configJson.json.stages[stageId].apples.items[presetAppleIndex].position;
    }

    public getBoardId(stageId: string): string {
        return this.configJson.json.stages[stageId].board.reference;
    }

    public getBoardResourceUrl(boardId: string): string {
        return this.configJson.json.boards[boardId].resource;
    }

    public getBoardRotation(stageId: string): Rotation[] {
        return this.configJson.json.stages[stageId].board.rotation;
    }

    public getAllKnifesCount(): number {
        let count = 0;
        for (let knifeId in this.configJson.json.knifes) {
            count++;
        }
        return count;
    }

    public getBossNameForKnife(knifeId: string): string {
        for (let i = 1; i <= Constants.COUNT_TOTAL_BOSS_STAGE; i++) {
            if (this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + i].reward == knifeId) {
                return this.configJson.json.stages[PREFIX_BOSS_STAGE_ID + i].boss;
            }
        }

        return "";
    }

    public hasKnife(knifeId: string): boolean {
        return this.configJson.json.knifes[knifeId] != null;
    }

    public hasLotteryKnife(): boolean {
        let gainedKnifes: Array<string> = StorageUtils.shared.getString(Constants.KEY_USER_GAINED_KNIFES, Constants.DEFAULT_USER_KNIFE_ID).split(",");

        for (let index = 1; this.hasKnife(ConfigUtil.shared.getKnifeId(index)); index++) {
            if (ConfigUtil.shared.getKnifeObtainMethod(ConfigUtil.shared.getKnifeId(index)) != KnifeObtainMethod.DEFEAT_BOSS
                    && -1 == gainedKnifes.indexOf(ConfigUtil.shared.getKnifeId(index))) {
                return true;
            }            
        }

        return false;
    }
}