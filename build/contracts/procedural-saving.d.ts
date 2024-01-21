import { Addr, ByteString, PubKey, Sig, SmartContract } from 'scrypt-ts';
export declare class ProceduralSaving extends SmartContract {
    manifest: ByteString;
    readonly address: Addr;
    constructor(initialManifest: ByteString, address: Addr);
    unlock(sig: Sig, pubkey: PubKey): void;
    changeManifest(sig: Sig, pubkey: PubKey, newManifest: ByteString): void;
}
