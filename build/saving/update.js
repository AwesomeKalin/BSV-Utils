import chalk from "chalk";
import { getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import { TestWallet, WhatsonchainProvider, findSig } from "scrypt-ts";
import { PubKey, bsv } from "scryptlib";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import { getPrivateKey } from "../util/deployContract.js";
import { getRawTx } from "./delete.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { mkdirSync, readFileSync, readdirSync, lstatSync, rmSync } from "fs";
import getPort from "get-port";
import { tunnelmole } from "tunnelmole";
import { expressServer } from "../upload/expressServer.js";
import { download } from "../download/download.js";
import { hash } from "../util/hash.js";
import { compareHashes } from "../util/hash.js";
import { uploadFiles } from "../upload/uploadFiles.js";
import { getTxInput } from "../util/getInput.js";
import { decrypt, encrypt } from "../util/encryption.js";
import cliProgress, { Presets } from 'cli-progress';
export async function updateProceduralSave(txid, folder, pgp, interval) {
    const auth = await getAuthClass();
    ProceduralSaving.loadArtifact(artifact);
    try {
        txid = await getLatestVersionOfContract(txid);
    }
    catch {
        console.log(chalk.red('This procedural save has been deleted!'));
        process.exit(1);
    }
    const privKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    let key = null;
    if (pgp != undefined || pgp != null) {
        key = pgp;
    }
    const port = await getPort();
    mkdirSync('./temp');
    const server = new expressServer(port);
    const url = await tunnelmole({ port });
    if (interval !== 0) {
        setInterval(async () => {
            txid = await updater(auth, txid, privKey, key, url, folder);
            console.log(`Updated folder save at ${txid}`);
        }, interval * 1000);
    }
    else {
        await updater(auth, txid, privKey, key, url, folder);
        rmSync('temp', { recursive: true, force: true });
        process.exit(0);
    }
}
async function updater(auth, txid, privKey, key, url, folder) {
    const signer = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    const tx = await getRawTx(txid);
    const instance = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);
    await instance.connect(signer);
    const manifestTx = instance.manifest;
    let manifest;
    console.log('Downloading old manifest');
    if (key === null) {
        manifest = (await download(manifestTx)).file;
    }
    else {
        const file = Buffer.from((await download(manifestTx)).file);
        manifest = JSON.parse((await decrypt(file, key)).toString());
    }
    console.log('Downloaded!');
    //@ts-expect-error
    const dirContents = readdirSync(folder, { recursive: true });
    let files = [];
    for (var i = 0; i < dirContents.length; i++) {
        if (lstatSync(`${folder}/${dirContents[i]}`).isFile()) {
            files.push(dirContents[i]);
        }
    }
    const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar.start(files.length + 2, 0);
    let newManifest = [];
    let changed = false;
    for (var i = 0; i < files.length; i++) {
        let fileToUpload = readFileSync(`${folder}/${files[i]}`);
        const fileToHash = fileToUpload;
        const hashes = hash(Buffer.from(fileToHash));
        let fileTx = await compareManifestEntry(manifest, files[i], hashes);
        if (fileTx === false) {
            if (key != null) {
                fileToUpload = await encrypt(fileToUpload, key);
            }
            fileTx = await uploadFiles(auth, fileToUpload, Date.now().toString(), url, undefined);
            changed = true;
        }
        const toPush = { name: files[i], txid: fileTx, hashes };
        newManifest.push(toPush);
        bar.increment(1);
    }
    if (!changed) {
        console.log('No files updated');
        return txid;
    }
    let manifestToUpload = Buffer.from(JSON.stringify(newManifest));
    if (key != null) {
        manifestToUpload = await encrypt(manifestToUpload, key);
    }
    const newManifestTx = await uploadFiles(auth, manifestToUpload, Date.now().toString(), url, undefined);
    bar.increment(1);
    console.log(newManifestTx);
    const nextInstance = instance.next();
    nextInstance.updateManifest(newManifestTx);
    let { tx: checkTx } = await instance.methods.changeManifest((sigResps) => findSig(sigResps, privKey.toPublicKey()), PubKey(privKey.toPublicKey().toString()), newManifestTx, {
        // Direct the signer to use the private key associated with `publicKey` and the specified sighash type to sign this transaction.
        pubKeyOrAddrToSign: {
            pubKeyOrAddr: privKey.toPublicKey(),
        },
        changeAddress: privKey.toAddress(),
        next: {
            instance: nextInstance,
            balance: instance.balance,
        },
        // Do not broadcast to blockchain
        partiallySigned: true,
    });
    let satsNeeded = checkTx.getFee() + 1;
    let inputs = 0;
    while (satsNeeded > 0) {
        const feeTx = (await getTxInput(auth, privKey.toAddress().toString()));
        satsNeeded -= feeTx.tx.vout[feeTx.voutIndex].value * 100000000;
        inputs += 1;
        if ((inputs % 6) === 0) {
            satsNeeded += 1;
        }
    }
    let { tx: callTX } = await instance.methods.changeManifest((sigResps) => findSig(sigResps, privKey.toPublicKey()), PubKey(privKey.toPublicKey().toString()), newManifestTx, {
        // Direct the signer to use the private key associated with `publicKey` and the specified sighash type to sign this transaction.
        pubKeyOrAddrToSign: {
            pubKeyOrAddr: privKey.toPublicKey(),
        },
        changeAddress: privKey.toAddress(),
        next: {
            instance: nextInstance,
            balance: instance.balance,
        },
    });
    const nextTxId = callTX.id;
    bar.increment(1);
    bar.stop();
    console.log(`Updated contract on blockchain: ${nextTxId}`);
    return nextTxId;
}
async function compareManifestEntry(manifest, name, entry) {
    for (var i = 0; i < manifest.length; i++) {
        if (manifest[i].name !== name) {
            return false;
        }
        const result = compareHashes(entry, manifest[i].hashes);
        if (result == true) {
            return manifest[i].txid;
        }
        return false;
    }
}
