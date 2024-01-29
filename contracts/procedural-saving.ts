import { ByteString, PubKey, Ripemd160, Sig, SmartContract, assert, hash256, method, prop, SigHash } from 'scrypt-ts';

export class ProceduralSaving extends SmartContract {
    //@ts-ignore
    @prop(true)
    manifest: ByteString;

    //@ts-ignore
    @prop()
    readonly address: Ripemd160;

    constructor(initialManifest: ByteString, address: Ripemd160) {
        super(...arguments);
        this.manifest = initialManifest;
        this.address = address;
    }

    //@ts-ignore
    @method()
    public unlock(sig: Sig, pubkey: PubKey) {
        assert(Ripemd160(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');
    }

    //@ts-ignore
    @method(SigHash.ANYONECANPAY_SINGLE)
    public changeManifest(sig: Sig, pubkey: PubKey, newManifest: ByteString) {
        this.updateManifest(newManifest);

        assert(Ripemd160(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');

        const amount: bigint = this.ctx.utxo.value;
        const output: ByteString = this.buildStateOutput(amount);

        assert(this.ctx.hashOutputs == hash256(output), 'hashOutputs mismatch');
    }

    //@ts-ignore
    @method()
    updateManifest(newManifest: ByteString): void {
        this.manifest = newManifest;
    }
}