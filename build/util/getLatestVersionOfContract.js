import axios from "axios";
import { sleep } from "./sleep.js";
export async function getLatestVersionOfContract(txid) {
    let checkIfSpent;
    try {
        sleep(0.4);
        checkIfSpent = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/0/confirmed/spent`);
    }
    catch {
        try {
            sleep(0.4);
            checkIfSpent = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/0/unconfirmed/spent`);
        }
        catch {
            return txid;
        }
    }
    const txCheck = await getFullTx(checkIfSpent.data.txid);
    if (txCheck.vout[0].scriptPubKey.type !== 'nonstandard') {
        throw 'Not a contract!';
    }
    else {
        return await getLatestVersionOfContract(checkIfSpent.data.txid);
    }
}
export async function getFullTx(txid) {
    sleep(0.4);
    return (await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`)).data;
}
