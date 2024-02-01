import { ByteString, MethodCallOptions, PubKey, Ripemd160, Sig, SigHash, SmartContract, assert, bsv, hash256, method, prop } from 'scrypt-ts';

export class ProceduralSaving extends SmartContract {
    @prop(true)
    manifest: ByteString;

    @prop()
    readonly address: Ripemd160;

    constructor(initialManifest: ByteString, address: Ripemd160) {
        super(...arguments);
        this.manifest = initialManifest;
        this.address = address;
    }

    @method()
    public unlock(sig: Sig, pubkey: PubKey) {
        assert(Ripemd160(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public changeManifest(sig: Sig, pubkey: PubKey, newManifest: ByteString) {
        this.manifest = newManifest;

        assert(Ripemd160(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');

        const amount: bigint = this.ctx.utxo.value;
        const output: ByteString = this.buildStateOutput(amount);

        assert(this.ctx.hashOutputs == hash256(output), 'hashOutputs mismatch');
    }
}