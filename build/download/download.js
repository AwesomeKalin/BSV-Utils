import axios from "axios";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
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
        const manifestDecoded = firstDl.data;
        console.log(`Downloading ${manifestDecoded.name}`);
        const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar.start(manifestDecoded.txs.length, 0);
        mkdirSync('temp');
        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const txData = new Uint8Array(await dlPart(manifestDecoded.txs[i]));
            writeFileSync(`./temp/${i}`, txData);
            bar.increment(1);
        }
        bar.stop();
        console.log('Combining parts');
        const bar2 = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar2.start(manifestDecoded.txs.length, 0);
        let fileBuffer = Buffer.from("");
        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const data = readFileSync(`./temp/${i}`);
            fileBuffer = Buffer.concat([fileBuffer, data]);
            bar2.increment(1);
        }
        rmSync('temp', { recursive: true, force: true });
        bar2.stop();
        writeFileSync(manifestDecoded.name, fileBuffer);
    }
    catch {
        const match = firstDl.headers['content-disposition'].match(/filename="([^"]+)"/);
        let fileName = match[1];
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
export async function resumeDl(txid) {
    const firstDl = await axios.get(`https://bico.media/${txid}`);
    const manifestDecoded = firstDl.data;
    console.log(`Downloading ${manifestDecoded.name}`);
    const iStart = readdirSync('./temp').length - 5;
    const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar.start(manifestDecoded.txs.length, iStart);
    for (var i = iStart; i < manifestDecoded.txs.length; i++) {
        const txData = new Uint8Array(await dlPart(manifestDecoded.txs[i]));
        writeFileSync(`./temp/${i}`, txData);
        bar.increment(1);
    }
    bar.stop();
    console.log('Combining parts');
    const bar2 = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar2.start(manifestDecoded.txs.length, 0);
    let fileBuffer = Buffer.from("");
    for (var i = 0; i < manifestDecoded.txs.length; i++) {
        const data = readFileSync(`./temp/${i}`);
        fileBuffer = Buffer.concat([fileBuffer, data]);
        bar2.increment(1);
    }
    rmSync('temp', { recursive: true, force: true });
    bar2.stop();
    writeFileSync(manifestDecoded.name, fileBuffer);
}
