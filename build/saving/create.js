import { readFileSync, readdirSync, lstatSync, mkdirSync } from "fs";
import { encryptWithKey } from "../util/encryptWithKey.js";
import { getAuthClass } from "../util/authenticator.js";
import getPort from "get-port";
import { expressServer } from "../upload/expressServer.js";
import ngrok from 'ngrok';
import { uploadFiles } from "../upload/uploadFiles.js";
import { hash } from "../util/hash.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { getAllAddr } from "../util/getAddr.js";
import { Addr } from "scrypt-ts";
import { deployContract } from "../util/deployContract.js";
import { buildContractClass } from 'scryptlib';
export async function createProceduralSave(folder, pgp) {
    const auth = await getAuthClass();
    let key = null;
    if (pgp != undefined || pgp != null) {
        key = readFileSync(pgp).toString();
    }
    //@ts-expect-error
    const dirContents = readdirSync(folder, { recursive: true });
    let files = [];
    for (var i = 0; i < dirContents.length; i++) {
        if (lstatSync(dirContents[i]).isFile()) {
            files.push(dirContents[i]);
        }
    }
    const port = await getPort();
    mkdirSync('./temp');
    const server = new expressServer(port);
    const url = await ngrok.connect(port);
    let manifest = [];
    for (var i = 0; i < files.length; i++) {
        let fileToUpload = readFileSync(`${folder}/${files[i]}`);
        const fileToHash = fileToUpload;
        if (pgp != null) {
            fileToUpload = await encryptWithKey(fileToUpload, pgp);
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
    const manifestTx = await uploadFiles(auth, manifestToUpload, Date.now().toString(), url, undefined);
    console.log('Deploying contract to blockchain');
    const ProceduralSaving = buildContractClass(artifact);
    const addressFrom = getAllAddr(auth)[0];
    let instance = new ProceduralSaving(manifestTx, Addr(addressFrom));
    const lockingScript = instance.lockingScript;
    console.log(`Contract deployed at ${await deployContract(auth, lockingScript, addressFrom)}`);
}
