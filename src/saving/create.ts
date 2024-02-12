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
import { WOCTx } from "../types/WOCTx.js";
import cliProgress, { Presets } from 'cli-progress';

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

    const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar.start(files.length + 2, 0);

    for (var i = 0; i < files.length; i++) {
        let fileToUpload: Buffer = readFileSync(`${folder}/${files[i]}`);
        const fileToHash: Buffer = fileToUpload;

        if (pgp != null) {
            fileToUpload = await encrypt(fileToUpload, key);
        }

        const txid: string = await uploadFiles(auth, fileToUpload, Date.now().toString(), url, undefined);

        const hashes: hashArray = hash(fileToHash);

        const toPush: ManifestEntry = { name: files[i], txid, hashes };

        manifest.push(toPush);

        bar.increment(1);
    }

    let manifestToUpload: Buffer = Buffer.from(JSON.stringify(manifest));

    if (pgp != null) {
        manifestToUpload = await encrypt(manifestToUpload, key);
    }

    const manifestTx: string = await uploadFiles(auth, manifestToUpload, Date.now().toString(), url, undefined);

    bar.increment(1);

    ProceduralSaving.loadArtifact(artifact);
    const privKey: bsv.PrivateKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    let instance = new ProceduralSaving(manifestTx, Addr(privKey.toAddress().toByteString()));
    const lockingScript: bsv.Script = instance.lockingScript;

    const tx = new bsv.Transaction().addOutput(
        new bsv.Transaction.Output({
            script: lockingScript,
            satoshis: 1,
        })
    ).feePerKb(1);

    const signer: TestWallet = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    instance.connect(signer);

    let satsNeeded: number = +(tx.getEstimateSize() / 1000).toFixed(0) + 2;
    let inputs: number = 0;

    while (satsNeeded > 0) {
        const feeTx: { tx: WOCTx, voutIndex: number } = (await getTxInput(auth, privKey.toAddress().toString()));
        satsNeeded -= feeTx.tx.vout[feeTx.voutIndex].value * 100000000;
        inputs += 1;

        if ((inputs % 6) === 0) {
            satsNeeded += 1;
        }
    }

    const contract: string = await deployInstance(instance);

    console.log(chalk.greenBright(`Contract deployed at ${contract}`));

    rmSync('./temp', { recursive: true, force: true });

    process.exit(0);
}

async function deployInstance(instance: ProceduralSaving) {
    try {
        return (await instance.deploy(1)).id;
    } catch {
        return await deployInstance(instance);
    }
}