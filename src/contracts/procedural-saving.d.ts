import { ByteString, PubKey, Ripemd160, Sig, SmartContract, assert, hash256, method, prop, pubKey2Addr } from 'scrypt-ts';

declare class ProceduralSaving extends SmartContract {
    manifest: ByteString;
    readonly address: Ripemd160;

    constructor(initialManifest: ByteString, address: Ripemd160);

    public unlock(sig: Sig, pubkey: PubKey);
    public changeManifest(sig: Sig, pubkey: PubKey, newManifest: ByteString);
}