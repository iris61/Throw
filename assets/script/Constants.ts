interface AJSONConstantInterface {
    readonly key1: string;
    readonly key2: string;
}

interface CommonConstantInterface {
    readonly A_JSON: AJSONConstantInterface;

    readonly LOTTERY_PRICE: number;
    readonly AD_PRICE: number;

    readonly POSTION_GAME_END: string;
    readonly POSTION_CONTINUE: string;
    readonly POSTION_DONE_GET_COINS: string;
    readonly POSTION_STORE_GET_COINS: string;
    readonly POSTION_STORE_GET_KNIFE: string;

    readonly WATCH_AD_FOR_CONTINUE_GAME: string;
    readonly WATCH_AD_FOR_CURRENCY: string;
    readonly WATCH_AD_FOR_KNIFE: string;

    readonly REWARD_AD_REWARDED: string;
    readonly REWARD_AD_CLOSED: string;

    readonly DEFAULT_USER_KNIFE_ID: string;

    readonly EVENT_ANIMATION_STOP: string;
    readonly EVENT_ANIMATION_FINISH: string;
    readonly EVENT_PAGE_VIEW_SCROLL: string;

    readonly PREFIX_STAGE_TITLE: string;

    readonly KEY_CURRENCY: string;
    readonly KEY_BOSS: string;
    readonly KEY_ENTER_PLAY_TIME: string;
    readonly KEY_STAGE: string;
    readonly KEY_NEXT_GIFT_TIME: string;
    readonly KEY_BEST_SCORE: string;
    readonly KEY_USER_KNIFE: string;
    readonly KEY_USER_GAINED_KNIFES: string;
    readonly KEY_SOUND_SWITCH: string;
    readonly KEY_VIBRATION_SWITCH: string;
    readonly KEY_LEFT_HAND_SWITCH: string;
    readonly KEY_DONE_PAGE_SHOWN: string;

    readonly TOAST_NEED_MORE_COINS: string;

    readonly COUNT_TOTAL_STAGE: number;
    readonly COUNT_TOTAL_BOSS_STAGE: number;
    readonly COUNT_GIFT_APPLES: number;
    readonly INTERVAL_BOSS_STAGE: number;
    readonly GIFT_COUNTDOWN_TIME: number;
}

export const Constants: CommonConstantInterface = {
    LOTTERY_PRICE: 500,
    AD_PRICE: 50,

    POSTION_GAME_END: "game_end",
    POSTION_DONE_GET_COINS: "done_get_coins",
    POSTION_CONTINUE: "continue",
    POSTION_STORE_GET_COINS: "store_get_coins",
    POSTION_STORE_GET_KNIFE: "store_get_knife",

    WATCH_AD_FOR_CONTINUE_GAME: "watch_ad_for_continue_game",
    WATCH_AD_FOR_CURRENCY: "watch_ad_for_currency",
    WATCH_AD_FOR_KNIFE: "watch_ad_for_knife",

    REWARD_AD_REWARDED: "rewarded",
    REWARD_AD_CLOSED: "closed",

    DEFAULT_USER_KNIFE_ID: "knife1",

    EVENT_ANIMATION_STOP: "stop",
    EVENT_ANIMATION_FINISH: "finished",
    EVENT_PAGE_VIEW_SCROLL: "scrolling",

    PREFIX_STAGE_TITLE: "STAGE ",

    KEY_CURRENCY: "currency",
    KEY_BOSS: "boss",
    KEY_STAGE: "stage",
    KEY_ENTER_PLAY_TIME: "enterPlayTime",
    KEY_NEXT_GIFT_TIME: "giftNextTime",
    KEY_BEST_SCORE: "bestScore",
    KEY_USER_KNIFE: "sknife",
    KEY_USER_GAINED_KNIFES: "gainedKnifes",
    KEY_SOUND_SWITCH: "SoundsSwitch",
    KEY_VIBRATION_SWITCH: "VibrationSwitch",
    KEY_LEFT_HAND_SWITCH: "LeftHandSwitch",
    KEY_DONE_PAGE_SHOWN: "donepageShown",

    TOAST_NEED_MORE_COINS: "Need More Coins",

    COUNT_TOTAL_BOSS_STAGE: 10,
    COUNT_TOTAL_STAGE: 50,
    COUNT_GIFT_APPLES: 20,
    INTERVAL_BOSS_STAGE: 5,
    GIFT_COUNTDOWN_TIME: 120 * 1000,

    A_JSON: { key1: "value1", key2: "value2" },
}
