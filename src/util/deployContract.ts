import { bsv } from "scrypt-ts";
import { authenticate, getAuthClass } from "./authenticator.js";
import { getTxInput } from "./getInput.js";
import RelysiaSDK from '@relysia/sdk';
import axios, { AxiosResponse } from "axios";
import { getBSVAddressFromMnemonic } from "./mnemonicToPrivateKey.js";
import { sleep } from "./sleep.js";
import { WOCTx } from "../types/WOCTx.js";

export async function deployContract(auth: authenticate, lockingScript: bsv.Script, address: string) {
    await auth.checkAuth();

    console.log('Getting initial tx input');

    const decoded = await getTxInput(auth, address);
    const decodedTx: WOCTx = decoded.tx;
    const voutIndex: number = decoded.voutIndex;
    const inputTxHash: string = decodedTx.hash;
    const inputScript: string = decodedTx.vout[voutIndex].scriptPubKey.asm;
    const inputSats: number = decodedTx.vout[voutIndex].value * 100000000;

    console.log('Input found!');

    let tx = new bsv.Transaction();

    tx.from({
        txId: inputTxHash,
        outputIndex: voutIndex,
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

    return await broadcastWithFee(auth, tx, inputSats, address);
}

export async function getPrivateKey(auth: authenticate) {
    await auth.checkAuth();
    let relysia: RelysiaSDK = auth.relysia;

    console.log('Getting mnemonic');

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

    console.log('Got mnemonic, getting private key');

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
    sleep(0.4);
    try {
        await axios.post('https://api.whatsonchain.com/v1/bsv/main/tx/raw', {
            txhex,
        });
    } catch {
        wocBroadcast(txhex);
    }
}

export async function broadcastWithFee(auth: authenticate, tx: bsv.Transaction, inputSats: number, address: string) {
    tx = await addInputsToTx(tx, inputSats)

    tx = tx.seal().sign(await getPrivateKey(auth));

    console.log('Transaction signed, broadcasting to blockchain');

    await wocBroadcast(tx.uncheckedSerialize());

    await auth.checkAuth();

    await checkMetrics(auth);

    return tx.hash;
}

export async function addInputsToTx(tx: bsv.Transaction, inputSats: number) {
    const auth: authenticate = await getAuthClass();
    const address: string = new bsv.PrivateKey(await getPrivateKey(auth)).toAddress().toString();
    let feeNeeded: number = tx.getFee();
    let satsNeeded: number = (feeNeeded + 1) - inputSats;

    console.log('Adding additional inputs, if needed');

    while (satsNeeded > 0) {
        const inputTx = await getTxInput(auth, address);
        const input: WOCTx = inputTx.tx;
        const inputIndex: number = inputTx.voutIndex;
        const txHash: string = input.hash;
        const script: string = input.vout[inputIndex].scriptPubKey.asm;
        const sats: number = input.vout[inputIndex].value * 100000000;

        tx.from({
            txId: txHash,
            outputIndex: inputIndex,
            script: bsv.Script.fromASM(script).toHex(),
            satoshis: sats,
        });

        satsNeeded -= feeNeeded;
        satsNeeded -= sats;
        feeNeeded = tx.getFee();
        satsNeeded += feeNeeded;
    }

    console.log('Inputs added');

    return tx;
}

async function checkMetrics(auth: authenticate) {
    await auth.checkAuth();

    try {
        await axios.get('https://api.relysia.com/v1/metrics', {
            headers: {
                authToken: auth.relysia.authentication.v1.getAuthToken(),
            }
        });
    } catch {
        await checkMetrics(auth);
    }
}