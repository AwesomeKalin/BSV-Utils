import { WOCTx } from "../types/WOCTx.js";
export declare function getLatestVersionOfContract(txid: string): Promise<string>;
export interface WOCSpent {
    txid: string;
    vin: number;
    status: string;
}
export declare function getFullTx(txid: string): Promise<WOCTx>;
