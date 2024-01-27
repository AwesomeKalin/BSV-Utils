import axios, { AxiosResponse } from "axios";
import { sleep } from "./sleep.js";
import { WOCTx } from "../types/WOCTx.js";

export async function getLatestVersionOfContract(txid: string) {
    let checkIfSpent: AxiosResponse<WOCSpent>;

    try {
        sleep(0.4);
        checkIfSpent = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/0/confirmed/spent`);
    } catch {
        try {
            sleep(0.4);
            checkIfSpent = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/0/unconfirmed/spent`);
        } catch {
            return txid;
        }
    }

    const txCheck: WOCTx = await getFullTx(checkIfSpent.data.txid);

    if (txCheck.vout[0].scriptPubKey.type !== 'nonstandard') {
        return txid;
    } else {
        return await getLatestVersionOfContract(checkIfSpent.data.txid);
    }
}

export interface WOCSpent {
    txid: string;
    vin: number;
    status: string;
}

export async function getFullTx(txid: string) {
    sleep(0.4);
    return (await axios.get<WOCTx>(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`)).data;
}