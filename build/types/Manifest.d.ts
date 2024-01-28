import { hashArray } from "../util/hash.js";
export interface ManifestEntry {
    name?: string;
    txid?: string;
    hashes?: hashArray;
}
