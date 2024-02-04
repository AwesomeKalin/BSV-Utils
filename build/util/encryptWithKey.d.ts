/// <reference types="node" resolution-mode="require"/>
export declare function encryptWithKey(text: Buffer, key: string): Promise<Buffer>;
export declare function decryptWithKey(b: string, key: string): Promise<string>;
