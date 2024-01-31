import { ByteString, PubKey, Ripemd160, Sig, SmartContract, bsv } from 'scrypt-ts';
export declare class ProceduralSaving extends SmartContract {
    manifest: ByteString;
    readonly address: Ripemd160;
    constructor(initialManifest: ByteString, address: Ripemd160);
    unlock(sig: Sig, pubkey: PubKey): void;
    changeManifest(sig: Sig, pubkey: PubKey, newManifest: ByteString): void;
    static buildTxForChangeManifest(current: ProceduralSaving, newManifest: ByteString): Promise<{
        tx: bsv.Transaction;
        atInputIndex: number;
        nexts: {
            instance: ProceduralSaving;
            atOutputIndex: number;
            balance: number;
        }[];
    }>;
}
