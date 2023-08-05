import chunks from 'buffer-chunks';
import axios from 'axios';
import fs from 'fs';
import cliProgress, { Presets } from 'cli-progress';
export async function uploadFiles(auth, fileBuffer, fileName, ngrok, spinner) {
    await auth.checkAuth();
    let relysia = auth.relysia;
    if (fileBuffer.length > 921600) {
        // Split buffer
        const bufferList = chunks(fileBuffer, 921600);
        const chunk = bufferList.length;
        if (spinner !== undefined) {
            spinner.stop();
        }
        let txid = [];
        const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
        bar.start(chunk + 1, 0);
        for (var i = 0; i < bufferList.length; i++) {
            txid.push(await uploadFiles(auth, bufferList[i], Date.now().toString(), ngrok));
            bar.increment(1);
        }
        const fileJson = JSON.stringify({ txs: txid, name: fileName });
        return await uploadFiles(auth, Buffer.from(fileJson), `${fileName}.json`, ngrok);
        bar.increment(1);
        bar.stop();
    }
    else {
        // Upload
        let toReturn;
        const fileName = Date.now().toString();
        fs.writeFileSync(`./public/${fileName}`, fileBuffer);
        const url = `${ngrok}/${fileName}`;
        // Send TX
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
            toReturn = await uploadFiles(auth, fileBuffer, fileName, ngrok);
        });
        return toReturn;
    }
}
// return data.uploadObj.txid
