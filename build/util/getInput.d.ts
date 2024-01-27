import { authenticate } from "./authenticator.js";
import { WOCTx } from "../types/WOCTx.js";
export declare function getTxInput(auth: authenticate, address: string): Promise<{
    tx: WOCTx;
    voutIndex: number;
}>;
export declare function rawTxGetter(auth: authenticate, tokenId: string, to: string): Promise<string>;
