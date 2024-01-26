import { authenticate } from "./authenticator.js";
import { WOCDecode } from "../types/WOCDecode.js";
export declare function getTxInput(auth: authenticate, address: string): Promise<WOCDecode>;
export declare function rawTxGetter(auth: authenticate, tokenId: string, to: string): Promise<string>;
