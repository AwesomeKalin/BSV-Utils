import { bsv } from "scrypt-ts";
import { getAuthClass } from "./authenticator.js";
import { getTxInput } from "./getInput.js";
import axios from "axios";
import { getBSVAddressFromMnemonic } from "./mnemonicToPrivateKey.js";
import { sleep } from "./sleep.js";
export async function deployContract(auth, lockingScript, address) {
    await auth.checkAuth();
    console.log('Getting initial tx input');
    const decoded = await getTxInput(auth, address);
    const decodedTx = decoded.tx;
    const voutIndex = decoded.voutIndex;
    const inputTxHash = decodedTx.hash;
    const inputScript = decodedTx.vout[voutIndex].scriptPubKey.asm;
    const inputSats = decodedTx.vout[voutIndex].value * 100000000;
    console.log('Input found!');
    let tx = new bsv.Transaction();
    tx.from({
        txId: inputTxHash,
        outputIndex: voutIndex,
        script: bsv.Script.fromASM(inputScript).toHex(),
        satoshis: inputSats
    });
    tx.addOutput(new bsv.Transaction.Output({
        script: lockingScript,
        satoshis: 1,
    }));
    tx.feePerKb(1);
    tx.change(address);
    return await broadcastWithFee(auth, tx, inputSats, address);
}
export async function getPrivateKey(auth) {
    await auth.checkAuth();
    let relysia = auth.relysia;
    console.log('Getting mnemonic');
    let mnemonicGetter;
    let mnemonic;
    try {
        mnemonicGetter = await axios.get('https://api.relysia.com/v1/mnemonic', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        });
        mnemonic = mnemonicGetter.data.data.mnemonic;
    }
    catch {
        return await getPrivateKey(auth);
    }
    console.log('Got mnemonic, getting private key');
    return getBSVAddressFromMnemonic(mnemonic);
}
async function wocBroadcast(txhex) {
    sleep(0.4);
    try {
        await axios.post('https://api.whatsonchain.com/v1/bsv/main/tx/raw', {
            txhex,
        });
    }
    catch {
        wocBroadcast(txhex);
    }
}
export async function broadcastWithFee(auth, tx, inputSats, address) {
    tx = await addInputsToTx(tx, inputSats);
    tx = tx.seal().sign(await getPrivateKey(auth));
    console.log('Transaction signed, broadcasting to blockchain');
    await wocBroadcast(tx.uncheckedSerialize());
    await auth.checkAuth();
    await checkMetrics(auth);
    return tx.hash;
}
export async function addInputsToTx(tx, inputSats) {
    const auth = await getAuthClass();
    const address = new bsv.PrivateKey(await getPrivateKey(auth)).toAddress().toString();
    let feeNeeded = tx.getFee();
    let satsNeeded = (feeNeeded + 1) - inputSats;
    console.log('Adding additional inputs, if needed');
    while (satsNeeded > 0) {
        const inputTx = await getTxInput(auth, address);
        const input = inputTx.tx;
        const inputIndex = inputTx.voutIndex;
        const txHash = input.hash;
        const script = input.vout[inputIndex].scriptPubKey.asm;
        const sats = input.vout[inputIndex].value * 100000000;
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
async function checkMetrics(auth) {
    await auth.checkAuth();
    try {
        await axios.get('https://api.relysia.com/v1/metrics', {
            headers: {
                authToken: auth.relysia.authentication.v1.getAuthToken(),
            }
        });
    }
    catch {
        await checkMetrics(auth);
    }
}
