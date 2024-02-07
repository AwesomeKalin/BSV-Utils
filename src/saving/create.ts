import { readFileSync, readdirSync, lstatSync, mkdirSync, rmSync } from "fs";
import { authenticate, getAuthClass } from "../util/authenticator.js";
import getPort from "get-port";
import { expressServer } from "../upload/expressServer.js";
import { uploadFiles } from "../upload/uploadFiles.js";
import { hash, hashArray } from "../util/hash.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { Addr, TestWallet, WhatsonchainProvider, bsv } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";
import chalk from "chalk";
import { tunnelmole } from 'tunnelmole';
import { ManifestEntry } from "../types/Manifest.js";
import { getTxInput } from "../util/getInput.js";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import { encrypt } from "../util/encryption.js";

export async function createProceduralSave(folder: string, pgp: string | undefined | null) {
    const auth: authenticate = await getAuthClass();

    let key: string | null = null;

    if (pgp != undefined || pgp != null) {
        key = pgp;
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
            fileToUpload = await encrypt(fileToUpload.toString(), key);
        }

        console.log(`Uploading ${files[i]}`);

        const txid: string = await uploadFiles(auth, fileToUpload, Date.now().toString(), url, undefined);

        console.log(`Hashing ${files[i]}`);

        const hashes: hashArray = hash(fileToHash);

        const toPush: ManifestEntry = { name: files[i], txid, hashes };

        manifest.push(toPush);
    }

    console.log('Uploading manifest');

    let manifestToUpload: Buffer = Buffer.from(JSON.stringify(manifest));

    if (pgp != null) {
        manifestToUpload = await encrypt(manifestToUpload.toString(), key);
    }

    const manifestTx: string = await uploadFiles(auth, manifestToUpload, Date.now().toString(), url, undefined);

    console.log('Deploying contract to blockchain');

    ProceduralSaving.loadArtifact(artifact);
    const privKey: bsv.PrivateKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    let instance = new ProceduralSaving(manifestTx, Addr(privKey.toAddress().toByteString()));
    const lockingScript: bsv.Script = instance.lockingScript;

    const tx = new bsv.Transaction().addOutput(
        new bsv.Transaction.Output({
            script: lockingScript,
            satoshis: 1,
        })
    );

    const signer: TestWallet = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    instance.connect(signer);

    for (var i = 0; i < (tx.getFee() + 2) / 3; i++) {
        await getTxInput(auth, privKey.toAddress().toString());
    }

    const contract: string = (await instance.deploy(1)).id;

    console.log(chalk.greenBright(`Contract deployed at ${contract}`));

    rmSync('./temp', { recursive: true, force: true });

    process.exit(0);
}