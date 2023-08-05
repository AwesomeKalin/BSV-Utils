/// <reference types="node" resolution-mode="require"/>
export declare function encrypt(text: string, key: string): Promise<Buffer>;
export declare function decrypt(b: Buffer, key: string): Promise<string>;
