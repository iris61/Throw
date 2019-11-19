"use strict";
cc._RF.push(module, '6f506fYV3BAK5i5kNUypvLY', 'StorageUtils');
// script/Utils/StorageUtils.ts

Object.defineProperty(exports, "__esModule", { value: true });
var localForage = require("./localforage");
var BOOL_VALUE_TRUE = "true";
var BOOL_VALUE_FALSE = "false";
var StorageUtils = /** @class */ (function () {
    function StorageUtils() {
        this.cache = {};
        this.hasInited = false;
        // @ts-ignore
        window.LocalForage = localForage;
        // @ts-ignore
        window.StorageUtils = StorageUtils;
    }
    Object.defineProperty(StorageUtils, "shared", {
        get: function () {
            if (!this.sharedInstance) {
                this.sharedInstance = new StorageUtils();
            }
            return this.sharedInstance;
        },
        enumerable: true,
        configurable: true
    });
    StorageUtils.prototype.init = function (callback) {
        var _this = this;
        localForage.iterate(function (value, key, iterationNumber) {
            _this.cache[key] = value;
        }, function () {
            _this.hasInited = true;
            callback();
        });
    };
    StorageUtils.prototype.getBoolean = function (key, defaultValue) {
        var item = this.getItem(key);
        if (item == null) {
            return this.valueOrDefault(defaultValue, false);
        }
        return this.getItem(key) === BOOL_VALUE_TRUE;
    };
    StorageUtils.prototype.putBoolean = function (key, value) {
        this.putItem(key, value ? BOOL_VALUE_TRUE : BOOL_VALUE_FALSE);
    };
    StorageUtils.prototype.getInt = function (key, defaultValue) {
        var item = this.getItem(key);
        if (item == null) {
            return this.valueOrDefault(defaultValue, 0);
        }
        var value = parseInt(item);
        return isNaN(value) ? this.valueOrDefault(defaultValue, 0) : value;
    };
    StorageUtils.prototype.putInt = function (key, value) {
        this.putItem(key, String(value));
    };
    StorageUtils.prototype.getString = function (key, defaultValue) {
        var item = this.getItem(key);
        if (item == null) {
            return this.valueOrDefault(defaultValue, "");
        }
        return item;
    };
    StorageUtils.prototype.putString = function (key, value) {
        this.putItem(key, value);
    };
    StorageUtils.prototype.getJSON = function (key) {
        return JSON.parse(this.getItem(key));
    };
    StorageUtils.prototype.putJSON = function (key, jsonObj) {
        this.putItem(key, JSON.stringify(jsonObj));
    };
    StorageUtils.prototype.removeItem = function (key) {
        this.checkInited();
        delete this.cache[key];
        localForage.removeItem(key);
    };
    StorageUtils.prototype.clearCache = function () {
        this.checkInited();
        this.cache = {};
    };
    StorageUtils.prototype.valueOrDefault = function (value, defaultValue) {
        if (value == null) {
            return defaultValue;
        }
        return value;
    };
    StorageUtils.prototype.putItem = function (key, value) {
        this.checkInited();
        this.cache[key] = value;
        localForage.setItem(key, value);
    };
    StorageUtils.prototype.getItem = function (key) {
        this.checkInited();
        if (key in this.cache) {
            return this.cache[key];
        }
        else {
            return null;
        }
    };
    StorageUtils.prototype.checkInited = function () {
        if (!this.hasInited) {
            cc.error("do not user StorageUtils before init completed!!!!");
        }
    };
    return StorageUtils;
}());
exports.default = StorageUtils;
StorageUtils.shared;

cc._RF.pop();