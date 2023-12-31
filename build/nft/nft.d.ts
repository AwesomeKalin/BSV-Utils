export declare function nft(prefix: string, folder: string, description: string, fileformat: string, digits: number, defaultPrice: number, toUpload: number, nftManifestList?: {
    nfts: Array<nftinfo>;
}): Promise<void>;
export interface nftinfo {
    tokenId: string;
    offerHex: string;
}
