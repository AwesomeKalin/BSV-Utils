import { readFileSync, readdirSync, lstatSync, mkdirSync, rmSync } from "fs";
import { getAuthClass } from "../util/authenticator.js";
import getPort from "get-port";
import { expressServer } from "../upload/expressServer.js";
import { uploadFiles } from "../upload/uploadFiles.js";
import { hash } from "../util/hash.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { Addr, TestWallet, WhatsonchainProvider, bsv } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";
import chalk from "chalk";
import { tunnelmole } from 'tunnelmole';
import { getTxInput } from "../util/getInput.js";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import { encrypt } from "../util/encryption.js";
export async function createProceduralSave(folder, pgp) {
    const auth = await getAuthClass();
    let key = null;
    if (pgp != undefined || pgp != null) {
        key = pgp;
    }
    //@ts-expect-error
    const dirContents = readdirSync(folder, { recursive: true });
    let files = [];
    for (var i = 0; i < dirContents.length; i++) {
        if (lstatSync(`${folder}/${dirContents[i]}`).isFile()) {
            files.push(dirContents[i]);
        }
    }
    const port = await getPort();
    mkdirSync('./temp');
    const server = new expressServer(port);
    const url = await tunnelmole({ port });
    let manifest = [];
    for (var i = 0; i < files.length; i++) {
        let fileToUpload = readFileSync(`${folder}/${files[i]}`);
        const fileToHash = fileToUpload;
        if (pgp != null) {
            fileToUpload = await encrypt(fileToUpload, key);
        }
        console.log(`Uploading ${files[i]}`);
        const txid = await uploadFiles(auth, fileToUpload, Date.now().toString(), url, undefined);
        console.log(`Hashing ${files[i]}`);
        const hashes = hash(fileToHash);
        const toPush = { name: files[i], txid, hashes };
        manifest.push(toPush);
    }
    console.log('Uploading manifest');
    let manifestToUpload = Buffer.from(JSON.stringify(manifest));
    if (pgp != null) {
        manifestToUpload = await encrypt(manifestToUpload, key);
    }
    const manifestTx = await uploadFiles(auth, manifestToUpload, Date.now().toString(), url, undefined);
    console.log('Deploying contract to blockchain');
    ProceduralSaving.loadArtifact(artifact);
    const privKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    let instance = new ProceduralSaving(manifestTx, Addr(privKey.toAddress().toByteString()));
    const lockingScript = instance.lockingScript;
    const tx = new bsv.Transaction().addOutput(new bsv.Transaction.Output({
        script: lockingScript,
        satoshis: 1,
    })).feePerKb(1);
    const signer = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    instance.connect(signer);
    let satsNeeded = +(tx.getEstimateSize() / 1000).toFixed(0) + 2;
    let inputs = 0;
    while (satsNeeded > 0) {
        const feeTx = (await getTxInput(auth, privKey.toAddress().toString()));
        satsNeeded -= feeTx.tx.vout[feeTx.voutIndex].value * 100000000;
        inputs += 1;
        if ((inputs % 6) === 0) {
            satsNeeded += 1;
        }
    }
    const contract = (await instance.deploy(1)).id;
    console.log(chalk.greenBright(`Contract deployed at ${contract}`));
    rmSync('./temp', { recursive: true, force: true });
    process.exit(0);
}
