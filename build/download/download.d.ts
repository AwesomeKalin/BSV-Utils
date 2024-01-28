export declare function download(txid: string): Promise<{
    file: any;
    name: string;
}>;
export declare function resumeDl(txid: string): Promise<void>;
