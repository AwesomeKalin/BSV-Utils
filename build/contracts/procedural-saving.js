import { SmartContract, assert, hash256, method, prop, pubKey2Addr } from 'scrypt-ts';
export class ProceduralSaving extends SmartContract {
    //@ts-ignore
    @prop(true)
    manifest;
    //@ts-ignore
    @prop()
    address;
    constructor(initialManifest, address) {
        super(...arguments);
        this.manifest = initialManifest;
        this.address = address;
    }
    //@ts-ignore
    @method()
    unlock(sig, pubkey) {
        assert(pubKey2Addr(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');
    }
    //@ts-ignore
    @method()
    changeManifest(sig, pubkey, newManifest) {
        this.manifest = newManifest;
        const amount = this.ctx.utxo.value;
        const outputs = this.buildStateOutput(amount) + this.buildChangeOutput();
        assert(pubKey2Addr(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');
        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch');
    }
}
