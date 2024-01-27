import { Ripemd160, SmartContract, assert, hash256, ripemd160 } from 'scrypt-ts';

export class ProceduralSaving extends SmartContract {
    manifest;

    address;

    constructor(initialManifest, address) {
        super(...arguments);
        this.manifest = initialManifest;
        this.address = address;
    }

    unlock(sig, pubkey) {
        assert(Ripemd160(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');
    }

    changeManifest(sig, pubkey, newManifest) {
        this.manifest = newManifest;

        const amount = this.ctx.utxo.value;
        const outputs = this.buildStateOutput(amount) + this.buildChangeOutput();

        assert(Ripemd160(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch');
    }
}