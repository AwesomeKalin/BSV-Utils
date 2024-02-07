import chalk from "chalk";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import { download } from "../download/download.js";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { getRawTx } from "./delete.js";
import { bsv } from "scryptlib";
import { compareHashes, hash } from "../util/hash.js";
import { outputFileSync } from "fs-extra/esm";
import { decrypt } from "../util/encryption.js";
export async function downloadProceduralSave(txid, findLatest, pgp, folder) {
    if (findLatest) {
        try {
            txid = await getLatestVersionOfContract(txid);
        }
        catch {
            console.log(chalk.red('This procedural save has been deleted. Defaulting to provided transaction'));
        }
    }
    let key = null;
    if (pgp != undefined || pgp != null) {
        key = pgp;
    }
    console.log('Downloading manifest');
    ProceduralSaving.loadArtifact(artifact);
    const tx = await getRawTx(txid);
    const instance = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);
    let manifest;
    if (key === null) {
        manifest = (await download(instance.manifest)).file;
    }
    else {
        const file = Buffer.from((await download(instance.manifest)).file);
        manifest = JSON.parse(await decrypt(file, key));
    }
    console.log('Downloaded!');
    for (var i = 0; i < manifest.length; i++) {
        console.log(`Downloading ${manifest[i].name}`);
        let file = (await download(manifest[i].txid)).file;
        if (typeof file === 'string') {
            file = Buffer.from(file);
        }
        if (key !== null) {
            file = await decrypt(file, key);
        }
        const hashed = hash(file);
        if (!compareHashes(manifest[i].hashes, hashed)) {
            console.log(chalk.red('Recieved incorrect file! Terminating'));
            process.exit(1);
        }
        outputFileSync(`${folder}/${manifest[i].name}`, file);
        console.log('Downloaded!');
    }
    process.exit(0);
}
