import axios from "axios";
import { writeFileSync } from "fs";
import cliProgress, { Presets } from 'cli-progress';
export async function download(txid) {
    let firstDl;
    try {
        firstDl = await axios.get(`https://bico.media/${txid}`);
    }
    catch {
        await download(txid);
    }
    try {
        const manifestDecoded = JSON.parse(firstDl.data);
        const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar.start(manifestDecoded.txs.length, 0);
        let fileBuffer = Buffer.from("");
        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const txData = new Uint8Array(await dlPart(manifestDecoded.txs[i]));
            fileBuffer = Buffer.concat([fileBuffer, txData]);
            bar.increment(1);
        }
        bar.stop();
        writeFileSync(manifestDecoded.name, fileBuffer);
    }
    catch {
        let headerLine = firstDl.headers['Content-Disposition'];
        let startFileNameIndex = headerLine.indexOf('"') + 1;
        let endFileNameIndex = headerLine.lastIndexOf('"');
        let fileName = headerLine.substring(startFileNameIndex, endFileNameIndex);
        writeFileSync(fileName, firstDl.data);
    }
}
async function dlPart(txId) {
    try {
        return (await axios.get(`https://bico.media/${txId}`, { responseType: 'arraybuffer', responseEncoding: 'binary' })).data;
    }
    catch {
        return dlPart(txId);
    }
}
