import axios, { AxiosResponse } from "axios";
import { SingleBar } from "cli-progress";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import cliProgress, { Presets } from 'cli-progress';

export async function download(txid: string) {
    let firstDl: AxiosResponse;

    try {
        firstDl = await axios.get(`https://bico.media/${txid}`, {
            responseType: 'arraybuffer',
        });
    } catch {
        await download(txid);
    }

    try {
        const manifestDecoded: { txs: string, name: string } = JSON.parse(firstDl.data);

        const bar: SingleBar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar.start(manifestDecoded.txs.length, 0);

        mkdirSync('dlTemp');

        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const txData: Uint8Array = (await download(manifestDecoded.txs[i])).file;

            writeFileSync(`./dlTemp/${i}`, txData);

            bar.increment(1);
        }

        bar.stop();

        console.log('Combining parts');

        const bar2: SingleBar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar2.start(manifestDecoded.txs.length, 0);

        let fileBuffer: Buffer = Buffer.from("");

        for (var i = 0; i < manifestDecoded.txs.length; i++) {
            const data: Buffer = readFileSync(`./dlTemp/${i}`);

            fileBuffer = Buffer.concat([fileBuffer, data]);

            bar2.increment(1);
        }

        rmSync('dlTemp', { recursive: true, force: true });

        bar2.stop();

        return { file: fileBuffer, name: manifestDecoded.name };
    } catch {
        const match = firstDl.headers['content-disposition'].match(/filename="([^"]+)"/);
        let fileName: string = match[1];

        return { file: firstDl.data, name: fileName };
    }
}

export async function resumeDl(txid: string) {
    const firstDl: AxiosResponse = await axios.get(`https://bico.media/${txid}`);

    const manifestDecoded: { txs: string, name: string } = firstDl.data;

    console.log(`Downloading ${manifestDecoded.name}`);

    const iStart: number = readdirSync('./temp').length - 5;

    const bar: SingleBar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar.start(manifestDecoded.txs.length, iStart);

    for (var i = iStart; i < manifestDecoded.txs.length; i++) {
        const txData: Uint8Array = new Uint8Array((await download(manifestDecoded.txs[i])).file);

        writeFileSync(`./temp/${i}`, txData);

        bar.increment(1);
    }

    bar.stop();

    console.log('Combining parts');

    const bar2: SingleBar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar2.start(manifestDecoded.txs.length, 0);

    let fileBuffer: Buffer = Buffer.from("");

    for (var i = 0; i < manifestDecoded.txs.length; i++) {
        const data: Buffer = readFileSync(`./temp/${i}`);

        fileBuffer = Buffer.concat([fileBuffer, data]);

        bar2.increment(1);
    }

    rmSync('temp', { recursive: true, force: true });

    bar2.stop();

    writeFileSync(manifestDecoded.name, fileBuffer);
}