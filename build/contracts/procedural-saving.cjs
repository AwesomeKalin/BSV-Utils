"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProceduralSaving = void 0;
const scrypt_ts_1 = require("scrypt-ts");
class ProceduralSaving extends scrypt_ts_1.SmartContract {
    manifest;
    address;
    constructor(initialManifest, address) {
        super(...arguments);
        this.manifest = initialManifest;
        this.address = address;
    }
    unlock(sig, pubkey) {
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.Ripemd160)(pubkey) == this.address, 'address check failed');
        (0, scrypt_ts_1.assert)(this.checkSig(sig, pubkey), 'signature check failed');
    }
    changeManifest(sig, pubkey, newManifest) {
        this.manifest = newManifest;
        const amount = this.ctx.utxo.value;
        const outputs = this.buildStateOutput(amount) + this.buildChangeOutput();
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.Ripemd160)(pubkey) == this.address, 'address check failed');
        (0, scrypt_ts_1.assert)(this.checkSig(sig, pubkey), 'signature check failed');
        (0, scrypt_ts_1.assert)(this.ctx.hashOutputs == (0, scrypt_ts_1.hash256)(outputs), 'hashOutputs mismatch');
    }
}
exports.ProceduralSaving = ProceduralSaving;
__decorate([
    (0, scrypt_ts_1.prop)(true)
], ProceduralSaving.prototype, "manifest", void 0);
__decorate([
    (0, scrypt_ts_1.prop)()
], ProceduralSaving.prototype, "address", void 0);
__decorate([
    (0, scrypt_ts_1.method)()
], ProceduralSaving.prototype, "unlock", null);
__decorate([
    (0, scrypt_ts_1.method)()
], ProceduralSaving.prototype, "changeManifest", null);
