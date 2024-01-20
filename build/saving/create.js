import { readFileSync, readdirSync, lstatSync, mkdirSync } from "fs";
import { encryptWithKey } from "../util/encryptWithKey.js";
import { getAuthClass } from "../util/authenticator.js";
import getPort from "get-port";
import { expressServer } from "../upload/expressServer.js";
import ngrok from 'ngrok';
import { uploadFiles } from "../upload/uploadFiles.js";
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
    let manifest;
    for (var i = 0; i < files.length; i++) {
        let fileToUpload = readFileSync(files[i]);
        if (pgp != null) {
            fileToUpload = await encryptWithKey(fileToUpload, pgp);
        }
        console.log(`Uploading ${files[i]}`);
        const txid = await uploadFiles(auth, fileToUpload, Date.now().toString(), url, undefined);
        console.log(`Hashing ${files[i]}`);
    }
}
