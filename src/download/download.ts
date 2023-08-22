import axios, { AxiosResponse } from "axios";
import { SingleBar } from "cli-progress";
import { writeFileSync } from "fs";
import cliProgress, { Presets } from 'cli-progress';

export async function download(txid: string) {
    let firstDl: AxiosResponse;

    try {
        firstDl = await axios.get(`https://bico.media/${txid}`);
    } catch {
        await download(txid);
    }

    try {
        const manifestDecoded: { txs: string, name: string } = JSON.parse(firstDl.data);

        const bar: SingleBar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar.start(manifestDecoded.txs.length, 0);

        let fileBuffer: Buffer = Buffer.from("");

        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const txData: Uint8Array = new Uint8Array(await dlPart(manifestDecoded.txs[i]));

			fileBuffer = Buffer.concat([fileBuffer, txData]);

            bar.increment(1);
        }

        bar.stop();

        writeFileSync(manifestDecoded.name, fileBuffer);
    } catch {
        let headerLine: string = firstDl.headers['Content-Disposition'];
        let startFileNameIndex: number = headerLine.indexOf('"') + 1;
        let endFileNameIndex: number = headerLine.lastIndexOf('"');
        let fileName: string = headerLine.substring(startFileNameIndex, endFileNameIndex);

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