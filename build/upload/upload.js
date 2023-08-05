import chalk from "chalk";
import { getAuthClass } from "../util/authenticator.js";
import { createSpinner } from "nanospinner";
import { mkdirSync, readFileSync, unlinkSync } from "fs";
import ngrok from 'ngrok';
import { expressServer } from "./expressServer.js";
import getPort from "get-port";
import { uploadFiles } from "./uploadFiles.js";
export async function upload(file, fileName) {
    const spinner = createSpinner(chalk.blue('Loading your file')).start();
    let authenticator = await getAuthClass();
    const fileBuffer = readFileSync(file);
    mkdirSync('./temp');
    const port = await getPort();
    const server = new expressServer(port);
    const url = await ngrok.connect(port);
    const txid = await uploadFiles(authenticator, fileBuffer, fileName, url, spinner);
    server.shutdown();
    await ngrok.disconnect();
    unlinkSync('./temp');
    console.log(chalk.greenBright(`Successfully uploaded. The transaction ID is ${txid}`));
    process.exit(0);
}
