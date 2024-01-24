import { ByteString, PubKey, Ripemd160, Sig, SmartContract, assert, hash256, method, prop, pubKey2Addr } from 'scrypt-ts';

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
        assert(pubKey2Addr(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');
    }

    //@ts-ignore
    @method()
    public changeManifest(sig: Sig, pubkey: PubKey, newManifest: ByteString) {
        this.manifest = newManifest;

        const amount: bigint = this.ctx.utxo.value;
        const outputs: ByteString = this.buildStateOutput(amount) + this.buildChangeOutput();

        assert(pubKey2Addr(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch');
    }
}