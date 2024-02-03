import { Addr, ByteString, PubKey, Sig, SmartContract, assert, hash256, method, prop, pubKey2Addr } from 'scrypt-ts';

export class ProceduralSaving extends SmartContract {
    //@ts-ignore
    @prop(true)
    manifest: ByteString;

    //@ts-ignore
    @prop()
    readonly address: Addr;

    constructor(initialManifest: ByteString, address: Addr) {
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
        assert(pubKey2Addr(pubkey) == this.address, 'address check failed');
        assert(this.checkSig(sig, pubkey), 'signature check failed');

        this.updateManifest(newManifest);

        const amount: bigint = this.ctx.utxo.value;
        const output: ByteString = this.buildStateOutput(amount) + this.buildChangeOutput();

        assert(this.ctx.hashOutputs == hash256(output), 'hashOutputs mismatch');
    }

    //@ts-ignore
    @method()
    updateManifest(newManifest: ByteString): void {
        this.manifest = newManifest;
    }
}