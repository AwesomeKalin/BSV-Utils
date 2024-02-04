import chalk from "chalk";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import { ManifestEntry } from "../types/Manifest.js";
import { download } from "../download/download.js";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { getRawTx } from "./delete.js";
import { bsv } from "scryptlib";
import { readFileSync } from "fs";
import { decryptWithKey } from "../util/encryptWithKey.js";
import { compareHashes, hash, hashArray } from "../util/hash.js";
import { outputFileSync } from "fs-extra/esm";

export async function downloadProceduralSave(txid: string, findLatest: boolean, pgp: string, folder: string) {
    if (findLatest) {
        try {
            txid = await getLatestVersionOfContract(txid);
        } catch {
            console.log(chalk.red('This procedural save has been deleted. Defaulting to provided transaction'));
        }
    }

    let key: string | null = null;

    if (pgp != undefined || pgp != null) {
        key = readFileSync(pgp).toString();
    }

    console.log('Downloading manifest');

    ProceduralSaving.loadArtifact(artifact)
    const tx = await getRawTx(txid);
    const instance: ProceduralSaving = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);

    let manifest: ManifestEntry[];

    if (key === null) {
        manifest = (await download(instance.manifest)).file;
    } else {
        const file: string = (await download(instance.manifest)).file;
        manifest = JSON.parse(await decryptWithKey(file, key));
    }

    console.log('Downloaded!');

    for (var i = 0; i < manifest.length; i++) {
        console.log(`Downloading ${manifest[i].name}`);
        let file: Buffer | string = (await download(manifest[i].txid)).file;

        if (key !== null) {
            //@ts-expect-error
            file = await decryptWithKey(file, key);
        }

        const hashed: hashArray = hash(file);

        if (!compareHashes(hashed, manifest[i].hashes)) {
            console.log(chalk.red('Recieved incorrect file! Terminating'));
            process.exit(1);
        }

        outputFileSync(`${folder}/${manifest[i].name}`, file);
        
        console.log('Downloaded!');
    }

    process.exit(0);
}