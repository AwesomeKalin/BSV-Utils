import { authenticate } from "./authenticator.js";
export declare function getTxInput(auth: authenticate, address: string): Promise<any>;
export declare function rawTxGetter(auth: authenticate, tokenId: string, to: string): Promise<string>;
