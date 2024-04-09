"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bounty = void 0;
var web3_js_1 = require("@solana/web3.js");
var bn_js_1 = require("bn.js"); // eslint-disable-line @typescript-eslint/no-unused-vars
var borsh = require("@coral-xyz/borsh"); // eslint-disable-line @typescript-eslint/no-unused-vars
var types = require("../types"); // eslint-disable-line @typescript-eslint/no-unused-vars
var programId_1 = require("../programId");
var Bounty = /** @class */ (function () {
    function Bounty(fields) {
        this.description = fields.description;
        this.org = fields.org;
        this.amount = fields.amount;
        this.status = fields.status;
        this.fundingAccount = fields.fundingAccount;
        this.bump = fields.bump;
        this.programId = fields.programId;
    }
    Bounty.fetch = function (c_1, address_1) {
        return __awaiter(this, arguments, void 0, function (c, address, programId) {
            var info;
            if (programId === void 0) { programId = programId_1.PROGRAM_ID; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, c.getAccountInfo(address)];
                    case 1:
                        info = _a.sent();
                        if (info === null) {
                            return [2 /*return*/, null];
                        }
                        if (!info.owner.equals(programId)) {
                            throw new Error("account doesn't belong to this program");
                        }
                        return [2 /*return*/, this.decode(info.data)];
                }
            });
        });
    };
    Bounty.fetchMultiple = function (c_1, addresses_1) {
        return __awaiter(this, arguments, void 0, function (c, addresses, programId) {
            var infos;
            var _this = this;
            if (programId === void 0) { programId = programId_1.PROGRAM_ID; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, c.getMultipleAccountsInfo(addresses)];
                    case 1:
                        infos = _a.sent();
                        return [2 /*return*/, infos.map(function (info) {
                                if (info === null) {
                                    return null;
                                }
                                if (!info.owner.equals(programId)) {
                                    throw new Error("account doesn't belong to this program");
                                }
                                return _this.decode(info.data);
                            })];
                }
            });
        });
    };
    Bounty.decode = function (data) {
        if (!data.slice(0, 8).equals(Bounty.discriminator)) {
            throw new Error("invalid account discriminator");
        }
        var dec = Bounty.layout.decode(data.slice(8));
        return new Bounty({
            description: dec.description,
            org: dec.org,
            amount: dec.amount,
            status: types.BountyStatus.fromDecoded(dec.status),
            fundingAccount: dec.fundingAccount,
            bump: dec.bump,
            programId: dec.programId,
        });
    };
    Bounty.prototype.toJSON = function () {
        return {
            description: this.description,
            org: this.org,
            amount: this.amount.toString(),
            status: this.status.toJSON(),
            fundingAccount: this.fundingAccount.toString(),
            bump: this.bump,
            programId: this.programId.toString(),
        };
    };
    Bounty.fromJSON = function (obj) {
        return new Bounty({
            description: obj.description,
            org: obj.org,
            amount: new bn_js_1.default(obj.amount),
            status: types.BountyStatus.fromJSON(obj.status),
            fundingAccount: new web3_js_1.PublicKey(obj.fundingAccount),
            bump: obj.bump,
            programId: new web3_js_1.PublicKey(obj.programId),
        });
    };
    Bounty.discriminator = Buffer.from([
        237, 16, 105, 198, 19, 69, 242, 234,
    ]);
    Bounty.layout = borsh.struct([
        borsh.str("description"),
        borsh.str("org"),
        borsh.u64("amount"),
        types.BountyStatus.layout("status"),
        borsh.publicKey("fundingAccount"),
        borsh.u8("bump"),
        borsh.publicKey("programId"),
    ]);
    return Bounty;
}());
exports.Bounty = Bounty;
