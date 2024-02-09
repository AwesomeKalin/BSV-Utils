/// <reference types="node" resolution-mode="require"/>
export declare function encrypt(text: Buffer, key: string): Promise<Buffer>;
export declare function decrypt(b: Buffer, key: string): Promise<Buffer>;
