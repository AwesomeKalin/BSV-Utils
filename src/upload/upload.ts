import chalk from "chalk";
import { authenticate, getAuthClass } from "../util/authenticator.js";
import { Spinner, createSpinner } from "nanospinner";
import { mkdirSync, readFileSync } from "fs";
import ngrok from 'ngrok';
import { expressServer } from "./expressServer.js";
import getPort from "get-port";
import { uploadFiles } from "./uploadFiles.js";

export async function upload(file: string, fileName: string) {
    const spinner: Spinner = createSpinner(chalk.blue('Loading your file')).start();
    let authenticator: authenticate = await getAuthClass();
    
    const fileBuffer: Buffer = readFileSync(file);
    mkdirSync('./temp');
    const port: number = await getPort();
    const server: expressServer = new expressServer(port);
    const url: string = await ngrok.connect(port);

    const txid: string = await uploadFiles(authenticator, fileBuffer, fileName, url, spinner);

    server.shutdown();
    await ngrok.disconnect();
    console.log(chalk.greenBright(`Successfully uploaded. The transaction ID is ${txid}`));
    process.exit(0);
}