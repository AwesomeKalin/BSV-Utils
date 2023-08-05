import chalk from "chalk";
import { getAuthClass } from "../util/authenticator.js";
import { createSpinner } from "nanospinner";
import { mkdirSync, readFileSync, rmSync, unlinkSync } from "fs";
import ngrok from 'ngrok';
import { expressServer } from "./expressServer.js";
import getPort from "get-port";
import { resumeUpload, uploadFiles } from "./uploadFiles.js";
export async function upload(file, fileName, uploadJson) {
    let authenticator = await getAuthClass();
    const spinner = createSpinner(chalk.blue('Loading your file')).start();
    spinner.stop();
    const fileBuffer = readFileSync(file);
    mkdirSync('./temp');
    const port = await getPort();
    const server = new expressServer(port);
    const url = await ngrok.connect(port);
    let txid;
    if (uploadJson === 'none') {
        txid = await uploadFiles(authenticator, fileBuffer, fileName, url, spinner);
    }
    else {
        const parsedJson = JSON.parse(readFileSync(uploadJson).toString());
        const uploadedParts = parsedJson.txs.length;
        txid = await resumeUpload(authenticator, fileBuffer, parsedJson.name, url, spinner, uploadedParts, parsedJson.txs);
        unlinkSync(uploadJson);
    }
    await ngrok.disconnect();
    rmSync('./temp', { recursive: true, force: true });
    console.log(chalk.greenBright(`Successfully uploaded. The transaction ID is ${txid}`));
    process.exit(0);
}
