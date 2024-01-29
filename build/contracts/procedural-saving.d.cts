import { ByteString, PubKey, Ripemd160, Sig, SmartContract } from 'scrypt-ts';
export declare class ProceduralSaving extends SmartContract {
    manifest: ByteString;
    readonly address: Ripemd160;
    constructor(initialManifest: ByteString, address: Ripemd160);
    unlock(sig: Sig, pubkey: PubKey): void;
    changeManifest(sig: Sig, pubkey: PubKey, newManifest: ByteString): void;
    updateManifest(newManifest: ByteString): void;
}
