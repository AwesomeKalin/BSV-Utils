export interface WOCDecode {
    txid: string;
    hash: string;
    version: number;
    size: number;
    locktime: number;
    vin: Vin[];
    vout: Vout[];
    hex: string;
}
interface Vin {
    n: number;
    txid: string;
    vout: number;
    scriptSig: ScriptSig;
    sequence: number;
    voutDetails: VoutDetails;
}
interface ScriptSig {
    asm: string;
    hex: string;
    isTruncated: boolean;
}
interface VoutDetails {
    value: number;
    n: number;
    scriptPubKey: ScriptPubKey;
    scripthash: string;
}
interface ScriptPubKey {
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
    addresses: string[];
    isTruncated: boolean;
}
interface Vout {
    value: number;
    n: number;
    scriptPubKey: ScriptPubKey2;
}
interface ScriptPubKey2 {
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
    addresses: string[];
}
export {};
