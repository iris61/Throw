import * as localForage from "./localforage";

const BOOL_VALUE_TRUE = "true";
const BOOL_VALUE_FALSE = "false";

export default class StorageUtils {

    private static sharedInstance: StorageUtils;

    private cache = {};

    private hasInited: boolean = false;

    public static get shared(): StorageUtils {
        if (!this.sharedInstance) {
            this.sharedInstance = new StorageUtils();
        }
        return this.sharedInstance;
    }

    private constructor() {
        // @ts-ignore
        window.LocalForage = localForage;
        // @ts-ignore
        window.StorageUtils = StorageUtils;
    }

    public init(callback): void {
        localForage.iterate((value: string, key: string, iterationNumber: number) => {
            this.cache[key] = value;
        }, () => {
            this.hasInited = true;
            callback();
        });
    }

    public getBoolean(key: string, defaultValue?: boolean): boolean {
        let item: string = this.getItem(key);

        if (item == null) {
            return this.valueOrDefault(defaultValue, false);
        }

        return this.getItem(key) === BOOL_VALUE_TRUE;
    }

    public putBoolean(key: string, value: boolean): void {
        this.putItem(key, value ? BOOL_VALUE_TRUE : BOOL_VALUE_FALSE);
    }

    public getInt(key: string, defaultValue?: number): number {
        let item: string = this.getItem(key);

        if (item == null) {
            return this.valueOrDefault(defaultValue, 0);
        }

        let value = parseInt(item);
        return isNaN(value) ? this.valueOrDefault(defaultValue, 0) : value;
    }

    public putInt(key: string, value: number): void {
        this.putItem(key, String(value));
    }

    public getString(key: string, defaultValue?: string): string {
        let item: string = this.getItem(key);

        if (item == null) {
            return this.valueOrDefault(defaultValue, "");
        }

        return item;
    }

    public putString(key: string, value: string): void {
        this.putItem(key, value);
    }

    public getJSON(key: string): any {
        return JSON.parse(this.getItem(key));
    }

    public putJSON(key: string, jsonObj: any): void {
        this.putItem(key, JSON.stringify(jsonObj));
    }

    public removeItem(key): void {
        this.checkInited();

        delete this.cache[key];
        localForage.removeItem(key);
    }

    public clearCache() {
        this.checkInited();

        this.cache = {};
    }

    private valueOrDefault(value: any, defaultValue: any): any {
        if (value == null) {
            return defaultValue;
        }
        return value;
    }

    private putItem(key: string, value: string): void {
        this.checkInited();

        this.cache[key] = value;
        localForage.setItem(key, value);
    }

    private getItem(key): string | null {
        this.checkInited();

        if (key in this.cache) {
            return this.cache[key];
        } else {
            return null;
        }
    }

    private checkInited(): void {
        if (!this.hasInited) {
            cc.error("do not user StorageUtils before init completed!!!!");
        }
    }

}

StorageUtils.shared;
