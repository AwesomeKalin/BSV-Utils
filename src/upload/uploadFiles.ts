import RelysiaSDK from '@relysia/sdk';
import chunks from 'buffer-chunks';
import axios from 'axios';
import fs, { writeFileSync } from 'fs';
import { authenticate } from '../util/authenticator.js';
import { Spinner } from 'nanospinner';
import cliProgress, { Presets } from 'cli-progress';
import { sleep } from '../util/sleep.js';

export async function uploadFiles(auth: authenticate, fileBuffer: Buffer, fileName: string, ngrok: string, spinner?: Spinner): Promise<string> {
    await auth.checkAuth();
    let relysia: RelysiaSDK = auth.relysia;

    if (fileBuffer.length > 921600) {
        // Split buffer
        const bufferList: Array<Buffer> = chunks(fileBuffer, 921600);
        const chunk: number = bufferList.length;

        if (spinner !== undefined) {
            spinner.stop();
        }

        let txid: Array<string> = [];
        const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar.start(chunk + 1, 0);

        for (var i = 0; i < bufferList.length; i++) {
            txid.push(await uploadFiles(auth, bufferList[i], Date.now().toString(), ngrok));
            const tempJson: string = JSON.stringify({ txs: txid, name: fileName });
            writeFileSync('./uploadedFile.json', tempJson);
            bar.increment(1);
        }

        const fileJson: string = JSON.stringify({ txs: txid, name: fileName });
        bar.increment(1);
        bar.stop();
        return await uploadFiles(auth, Buffer.from(fileJson), `${fileName}.json`, ngrok);
    } else {
        if (spinner !== undefined) {
            spinner.stop();
        }

        // Upload
        let toReturn: string;

        const uploadFileName: string = Date.now().toString();
        fs.writeFileSync(`./temp/${uploadFileName}`, fileBuffer);

        const url: string = `${ngrok}/${uploadFileName}`;

        // Send TX
        sleep(1);
        await axios.post('https://api.relysia.com/upload', {
            fileUrl: url,
            fileName: fileName
        }, {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken()
            }
        }).then((response2) => {
            toReturn = response2.data.data.uploadObj.txid;
        }).catch(async (error) => {
            console.log(error);
            sleep(1);
            toReturn = await uploadFiles(auth, fileBuffer, fileName, ngrok);
        });

        return toReturn;
    }
}

export async function resumeUpload(auth: authenticate, fileBuffer: Buffer, fileName: string, ngrok: string, spinner: Spinner, nextToUpload: number, txs: Array<string>): Promise<string> {
    await auth.checkAuth();
    let relysia: RelysiaSDK = auth.relysia;

    // Split buffer
    const bufferList: Array<Buffer> = chunks(fileBuffer, 921600);
    const chunk: number = bufferList.length;

    if (spinner !== undefined) {
        spinner.stop();
    }

    let txid: Array<string> = txs;
    const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar.start(chunk + 1, nextToUpload);

    for (var i = nextToUpload; i < bufferList.length; i++) {
        txid.push(await uploadFiles(auth, bufferList[i], Date.now().toString(), ngrok));
        const tempJson: string = JSON.stringify({ txs: txid, name: fileName });
        writeFileSync('./uploadedFile.json', tempJson);
        bar.increment(1);
    }

    const fileJson: string = JSON.stringify({ txs: txid, name: fileName });
    bar.increment(1);
    bar.stop();
    return await uploadFiles(auth, Buffer.from(fileJson), `${fileName}.json`, ngrok);
}