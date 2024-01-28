import { readFileSync, readdirSync, lstatSync, mkdirSync, rmSync } from "fs";
import { encryptWithKey } from "../util/encryptWithKey.js";
import { authenticate, getAuthClass } from "../util/authenticator.js";
import getPort from "get-port";
import { expressServer } from "../upload/expressServer.js";
import { uploadFiles } from "../upload/uploadFiles.js";
import { hash, hashArray } from "../util/hash.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { bsv } from "scrypt-ts";
import { deployContract } from "../util/deployContract.js";
import { Ripemd160, buildContractClass } from 'scryptlib';
import { getPrivateKey } from "../util/deployContract.js";
import chalk from "chalk";
import { tunnelmole } from 'tunnelmole';
import { ManifestEntry } from "../types/Manifest.js";

export async function createProceduralSave(folder: string, pgp: string | undefined | null) {
    const auth: authenticate = await getAuthClass();

    let key: string | null = null;

    if (pgp != undefined || pgp != null) {
        key = readFileSync(pgp).toString();
    }

    //@ts-expect-error
    const dirContents: string[] = readdirSync(folder, { recursive: true });
    let files: string[] = [];

    for (var i = 0; i < dirContents.length; i++) {
        if (lstatSync(`${folder}/${dirContents[i]}`).isFile()) {
            files.push(dirContents[i]);
        }
    }

    const port: number = await getPort();
    mkdirSync('./temp');
    const server: expressServer = new expressServer(port);
    const url: string = await tunnelmole({ port });

    let manifest: ManifestEntry[] = [];

    for (var i = 0; i < files.length; i++) {
        let fileToUpload: Buffer = readFileSync(`${folder}/${files[i]}`);
        const fileToHash: Buffer = fileToUpload;

        if (pgp != null) {
            fileToUpload = await encryptWithKey(fileToUpload, pgp);
        }

        console.log(`Uploading ${files[i]}`);

        const txid: string = await uploadFiles(auth, fileToUpload, Date.now().toString(), url, undefined);

        console.log(`Hashing ${files[i]}`);

        const hashes: hashArray = hash(fileToHash);

        const toPush = { name: files[i], txid, hashes };

        manifest.push(toPush);
    }

    console.log('Uploading manifest');

    let manifestToUpload: Buffer = Buffer.from(JSON.stringify(manifest));

    const manifestTx: string = await uploadFiles(auth, manifestToUpload, Date.now().toString(), url, undefined);

    console.log('Deploying contract to blockchain');

    const ProceduralSaving = buildContractClass(artifact);
    const addressFrom: bsv.PublicKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth)).toPublicKey();
    let instance = new ProceduralSaving(manifestTx, Ripemd160(addressFrom.toString()));
    const lockingScript: bsv.Script = instance.lockingScript;

    const contract = await deployContract(auth, lockingScript, addressFrom.toAddress().toString())

    console.log(chalk.greenBright(`Contract deployed at ${contract}`));

    rmSync('./temp', { recursive: true, force: true });

    process.exit(0);
}