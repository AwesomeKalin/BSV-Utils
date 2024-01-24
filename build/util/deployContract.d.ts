import { bsv } from "scrypt-ts";
import { authenticate } from "./authenticator.js";
export declare function deployContract(auth: authenticate, lockingScript: bsv.Script, address: string): Promise<string>;
export declare function getPrivateKey(auth: authenticate): Promise<string>;
