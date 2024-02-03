import chalk from "chalk";
import { authenticate, getAuthClass } from "../util/authenticator.js";
import { Spinner, createSpinner } from "nanospinner";
import { mkdirSync, readFileSync, rmSync, unlinkSync } from "fs";
import { expressServer } from "./expressServer.js";
import getPort from "get-port";
import { resumeUpload, uploadFiles } from "./uploadFiles.js";
import { tunnelmole } from "tunnelmole";

export async function upload(file: string, fileName: string, uploadJson: string) {
    let authenticator: authenticate = await getAuthClass();
    const spinner: Spinner = createSpinner(chalk.blue('Loading your file')).start();

    const fileBuffer: Buffer = readFileSync(file);
    mkdirSync('./temp');
    const port: number = await getPort();
    const server: expressServer = new expressServer(port);
    const url: string = await tunnelmole({ port });

    let txid: string;

    if (uploadJson === undefined) {
        txid = await uploadFiles(authenticator, fileBuffer, fileName, url, spinner);
    } else {
        const parsedJson: { txs: Array<string>, name: string } = JSON.parse(readFileSync(uploadJson).toString());
        const uploadedParts: number = parsedJson.txs.length;

        txid = await resumeUpload(authenticator, fileBuffer, parsedJson.name, url, spinner, uploadedParts, parsedJson.txs);

        unlinkSync(uploadJson);
    }

    rmSync('./temp', { recursive: true, force: true });
    console.log(chalk.greenBright(`Successfully uploaded. The transaction ID is ${txid}`));
    process.exit(0);
}