import { bsv } from "scrypt-ts";
import { getTxInput } from "./getInput.js";
import axios from "axios";
import { getBSVAddressFromMnemonic } from "./mnemonicToPrivateKey.js";
import WhatsOnChain from 'whatsonchain';
export async function deployContract(auth, lockingScript, address) {
    await auth.checkAuth();
    const decodedTx = await getTxInput(auth, address);
    const inputTxHash = decodedTx.vin[1].txid;
    const inputScript = decodedTx.vin[1].scriptSig.asm;
    const inputSats = decodedTx.vin[1].voutDetails.value / 100000000;
    let tx = new bsv.Transaction();
    tx.from({
        txId: inputTxHash,
        outputIndex: 1,
        script: bsv.Script.fromASM(inputScript).toHex(),
        satoshis: inputSats
    });
    tx.addOutput(new bsv.Transaction.Output({
        script: lockingScript,
        satoshis: 1,
    }));
    tx.feePerKb(1);
    tx.change(address);
    let feeNeeded = tx.getFee();
    let satsNeeded = (feeNeeded + 1) - inputSats;
    while (satsNeeded > 0) {
        const input = await getTxInput(auth, address);
        const txHash = input.vin[1].txid;
        const script = input.vin[1].scriptSig.asm;
        const sats = input.vin[1].voutDetails.value / 100000000;
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
    const woc = new WhatsOnChain('mainnet');
    await woc.broadcast(tx.serialize());
    return tx.hash;
}
async function getPrivateKey(auth) {
    await auth.checkAuth();
    let relysia = auth.relysia;
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
    return getBSVAddressFromMnemonic(mnemonic);
}