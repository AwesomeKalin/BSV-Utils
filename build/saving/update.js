import chalk from "chalk";
import { getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import { TestWallet, WhatsonchainProvider } from "scrypt-ts";
import { bsv } from "scryptlib";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import { getPrivateKey } from "../util/deployContract.js";
import { getRawTx } from "./delete.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { mkdirSync, readFileSync } from "fs";
import getPort from "get-port";
import { tunnelmole } from "tunnelmole";
import { expressServer } from "../upload/expressServer.js";
import { download } from "../download/download.js";
import { decryptWithKey } from "../util/encryptWithKey.js";
export async function updateProceduralSave(txid, folder, pgp, interval) {
    const auth = await getAuthClass();
    try {
        txid = await getLatestVersionOfContract(txid);
    }
    catch {
        console.log(chalk.red('This procedural save has been deleted!'));
    }
    const privKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    const signer = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    let key = null;
    if (pgp != undefined || pgp != null) {
        key = readFileSync(pgp).toString();
    }
    const port = await getPort();
    mkdirSync('./temp');
    const server = new expressServer(port);
    const url = await tunnelmole({ port });
    if (interval !== 0) {
        setInterval(async () => {
            txid = await updater(auth, txid, privKey, signer, key, url);
            console.log(`Updated folder save at ${txid}`);
        }, interval * 1000);
    }
    else {
        txid = await updater(auth, txid, privKey, signer, key, url);
        console.log(`Updated folder save at ${txid}`);
    }
}
async function updater(auth, txid, privKey, signer, key, url) {
    const tx = await getRawTx(txid);
    ProceduralSaving.loadArtifact(artifact);
    const instance = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);
    await instance.connect(signer);
    const manifestTx = instance.manifest;
    let manifest;
    if (key === null) {
        manifest = JSON.parse((await download(manifestTx)).file);
    }
    else {
        const file = (await download(manifestTx)).file;
        manifest = JSON.parse(await decryptWithKey(file, key));
    }
}
