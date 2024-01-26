import { bsv } from "scrypt-ts";
import { WOCDecode } from "../types/WOCDecode.js";
import { authenticate } from "./authenticator.js";
import { getTxInput } from "./getInput.js";
import RelysiaSDK from '@relysia/sdk';
import axios, { AxiosResponse } from "axios";
import { getBSVAddressFromMnemonic } from "./mnemonicToPrivateKey.js";

export async function deployContract(auth: authenticate, lockingScript: bsv.Script, address: string) {
    await auth.checkAuth();

    const decodedTx: WOCDecode = await getTxInput(auth, address);
    const inputTxHash: string = decodedTx.vin[1].txid;
    const inputScript: string = decodedTx.vin[1].scriptSig.asm;
    const inputSats: number = decodedTx.vin[1].voutDetails.value / 100000000;

    let tx = new bsv.Transaction();

    tx.from({
        txId: inputTxHash,
        outputIndex: 1,
        script: bsv.Script.fromASM(inputScript).toHex(),
        satoshis: inputSats
    });

    tx.addOutput(
        new bsv.Transaction.Output({
            script: lockingScript,
            satoshis: 1,
        })
    );

    tx.feePerKb(1);
    tx.change(address);

    let feeNeeded: number = tx.getFee();
    let satsNeeded: number = (feeNeeded + 1) - inputSats;

    while (satsNeeded > 0) {
        const input: WOCDecode = await getTxInput(auth, address);
        const txHash: string = input.vin[1].txid;
        const script: string = input.vin[1].scriptSig.asm;
        const sats: number = input.vin[1].voutDetails.value / 100000000;

        tx.from({
            txId: txHash,
            outputIndex: 1,
            script,
            satoshis: sats,
        });

        satsNeeded -= feeNeeded;
        feeNeeded = tx.getFee();
        satsNeeded += feeNeeded;
    }

    tx = tx.seal().sign(await getPrivateKey(auth));

    await wocBroadcast(tx.serialize());

    return tx.hash;
}

export async function getPrivateKey(auth: authenticate) {
    await auth.checkAuth();
    let relysia: RelysiaSDK = auth.relysia;

    let mnemonicGetter: AxiosResponse<Mnemonic>;
    let mnemonic: string;

    try {
        mnemonicGetter = await axios.get('https://api.relysia.com/v1/mnemonic', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        });

        mnemonic = mnemonicGetter.data.data.mnemonic;
    } catch {
        return await getPrivateKey(auth);
    }

    return getBSVAddressFromMnemonic(mnemonic);
}

interface Mnemonic {
    statusCode: number;
    data: {
        status: string;
        msg: string;
        mnemonic: string;
    }
}

async function wocBroadcast(txhex: string) {
    try {
        await axios.post('https://api.whatsonchain.com/v1/bsv/main/tx/raw', {
            txhex,
        });
    } catch {
        wocBroadcast(txhex);
    }
}