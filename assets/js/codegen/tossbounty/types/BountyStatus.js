"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layout = exports.fromJSON = exports.fromDecoded = exports.Canceled = exports.Claimed = exports.Unclaimed = void 0;
var borsh = require("@coral-xyz/borsh");
var Unclaimed = /** @class */ (function () {
    function Unclaimed() {
        this.discriminator = 0;
        this.kind = "Unclaimed";
    }
    Unclaimed.prototype.toJSON = function () {
        return {
            kind: "Unclaimed",
        };
    };
    Unclaimed.prototype.toEncodable = function () {
        return {
            Unclaimed: {},
        };
    };
    Unclaimed.discriminator = 0;
    Unclaimed.kind = "Unclaimed";
    return Unclaimed;
}());
exports.Unclaimed = Unclaimed;
var Claimed = /** @class */ (function () {
    function Claimed() {
        this.discriminator = 1;
        this.kind = "Claimed";
    }
    Claimed.prototype.toJSON = function () {
        return {
            kind: "Claimed",
        };
    };
    Claimed.prototype.toEncodable = function () {
        return {
            Claimed: {},
        };
    };
    Claimed.discriminator = 1;
    Claimed.kind = "Claimed";
    return Claimed;
}());
exports.Claimed = Claimed;
var Canceled = /** @class */ (function () {
    function Canceled() {
        this.discriminator = 2;
        this.kind = "Canceled";
    }
    Canceled.prototype.toJSON = function () {
        return {
            kind: "Canceled",
        };
    };
    Canceled.prototype.toEncodable = function () {
        return {
            Canceled: {},
        };
    };
    Canceled.discriminator = 2;
    Canceled.kind = "Canceled";
    return Canceled;
}());
exports.Canceled = Canceled;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDecoded(obj) {
    if (typeof obj !== "object") {
        throw new Error("Invalid enum object");
    }
    if ("Unclaimed" in obj) {
        return new Unclaimed();
    }
    if ("Claimed" in obj) {
        return new Claimed();
    }
    if ("Canceled" in obj) {
        return new Canceled();
    }
    throw new Error("Invalid enum object");
}
exports.fromDecoded = fromDecoded;
function fromJSON(obj) {
    switch (obj.kind) {
        case "Unclaimed": {
            return new Unclaimed();
        }
        case "Claimed": {
            return new Claimed();
        }
        case "Canceled": {
            return new Canceled();
        }
    }
}
exports.fromJSON = fromJSON;
function layout(property) {
    var ret = borsh.rustEnum([
        borsh.struct([], "Unclaimed"),
        borsh.struct([], "Claimed"),
        borsh.struct([], "Canceled"),
    ]);
    if (property !== undefined) {
        return ret.replicate(property);
    }
    return ret;
}
exports.layout = layout;
