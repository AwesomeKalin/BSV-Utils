import chalk from "chalk";
import { authenticate, getAuthClass } from "../util/authenticator.js";
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
import { ManifestEntry } from "../types/Manifest.js";
import { download } from "../download/download.js";
import { decryptWithKey } from "../util/encryptWithKey.js";

export async function updateProceduralSave(txid: string, folder: string, pgp: string, interval: number) {
    const auth: authenticate = await getAuthClass();

    try {
        txid = await getLatestVersionOfContract(txid);
    } catch {
        console.log(chalk.red('This procedural save has been deleted!'));
    }

    const privKey: bsv.PrivateKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    const signer: TestWallet = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));

    let key: string | null = null;

    if (pgp != undefined || pgp != null) {
        key = readFileSync(pgp).toString();
    }

    const port: number = await getPort();
    mkdirSync('./temp');
    const server: expressServer = new expressServer(port);
    const url: string = await tunnelmole({ port });

    if (interval !== 0) {
        setInterval(async () => {
            txid = await updater(auth, txid, privKey, signer, key, url);
            console.log(`Updated folder save at ${txid}`);
        }, interval * 1000);
    } else {
        txid = await updater(auth, txid, privKey, signer, key, url);
        console.log(`Updated folder save at ${txid}`);
    }
}

async function updater(auth: authenticate, txid: string, privKey: bsv.PrivateKey, signer: TestWallet, key: string | null, url: string) {
    const tx = await getRawTx(txid);
    ProceduralSaving.loadArtifact(artifact);
    const instance: ProceduralSaving = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);

    await instance.connect(signer);
    const manifestTx: string = instance.manifest;
    let manifest: ManifestEntry[];

    if (key === null) {
        manifest = JSON.parse((await download(manifestTx)).file);
    } else {
        const file: Buffer = (await download(manifestTx)).file;
        manifest = JSON.parse(await decryptWithKey(file, key));
    }
}