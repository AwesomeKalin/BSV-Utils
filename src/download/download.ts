import axios, { AxiosResponse } from "axios";
import { SingleBar } from "cli-progress";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import cliProgress, { Presets } from 'cli-progress';

export async function download(txid: string) {
    let firstDl: AxiosResponse;

    try {
        firstDl = await axios.get(`https://bico.media/${txid}`);
    } catch {
        await download(txid);
    }

    try {
        const manifestDecoded: { txs: string, name: string } = firstDl.data;

        const bar: SingleBar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar.start(manifestDecoded.txs.length, 0);

        mkdirSync('temp');

        console.log(`Downloading ${manifestDecoded.name}`);

        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const txData: Uint8Array = new Uint8Array(await dlPart(manifestDecoded.txs[i]));

            writeFileSync(`./temp/${i}`, txData);

            bar.increment(1);
        }

        bar.stop();

        console.log('Combining parts');

        const bar2: SingleBar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar2.start(manifestDecoded.txs.length, 0);

        let fileBuffer: Buffer = Buffer.from("");

        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const data: Uint8Array = readFileSync(`./temp/${i}`);

            fileBuffer = Buffer.concat([fileBuffer, data]);

            bar2.increment(1);
        }

        bar2.stop();

        writeFileSync(manifestDecoded.name, fileBuffer);
    } catch {
        const match = firstDl.headers['content-disposition'].match(/filename="([^"]+)"/);
        let fileName: string = match[1];

        writeFileSync(fileName, firstDl.data);
    }
}

async function dlPart(txId: string) {
    try {
        return (await axios.get(`https://bico.media/${txId}`, {responseType: 'arraybuffer', responseEncoding: 'binary'})).data;
    } catch {
        return dlPart(txId);
    }
}