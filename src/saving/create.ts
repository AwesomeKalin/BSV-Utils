import { readFileSync, readdirSync, lstatSync, writeFileSync, mkdirSync } from "fs";
import { encryptWithKey } from "../util/encryptWithKey.js";
import { authenticate, getAuthClass } from "../util/authenticator.js";
import getPort from "get-port";
import { expressServer } from "../upload/expressServer.js";
import ngrok from 'ngrok';
import { uploadFiles } from "../upload/uploadFiles.js";
import { hash, hashArray } from "../util/hash.js";

export async function createProceduralSave(folder: string, pgp: string | undefined | null) {
    const auth: authenticate = await getAuthClass();

    let key: string = null;

    if (pgp != undefined || pgp != null) {
        key = readFileSync(pgp).toString();
    }
    
    //@ts-expect-error
    const dirContents: string[] = readdirSync(folder, { recursive: true });
    let files: string[] = [];

    for (var i = 0; i < dirContents.length; i++) {
        if (lstatSync(dirContents[i]).isFile()) {
            files.push(dirContents[i]);
        }
    }

    const port: number = await getPort();
    mkdirSync('./temp');
    const server: expressServer = new expressServer(port);
    const url: string = await ngrok.connect(port);

    let manifest: { name: string; txid: string; hashes: hashArray; }[];

    for (var i = 0; i < files.length; i++) {
        let fileToUpload: Buffer = readFileSync(files[i]);
        const fileToHash: Buffer = fileToUpload;

        if (pgp != null) {
            fileToUpload = await encryptWithKey(fileToUpload, pgp);
        }

        console.log(`Uploading ${files[i]}`);
        await auth.checkAuth();

        const txid: string = await uploadFiles(auth, fileToUpload, Date.now().toString(), url, undefined);

        console.log(`Hashing ${files[i]}`);

        const hashes: hashArray = hash(fileToHash);

        const toPush = { name: files[i], txid, hashes };

        manifest.push(toPush);
    }

    let manifestToUpload: Buffer = Buffer.from(JSON.stringify(manifest));
    await auth.checkAuth();

    const manifestTx: string = await uploadFiles(auth, manifestToUpload, Date.now().toString(), url, undefined);
}