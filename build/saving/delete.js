import { getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { bsv, buildContractClass } from "scryptlib";
import { sleep } from "../util/sleep.js";
import axios from "axios";
import { TestWallet, findSig } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";
export async function deleteFolderSave(txid) {
    const auth = await getAuthClass();
    txid = await getLatestVersionOfContract(txid);
    const tx = await getRawTx(txid);
    const ProceduralSaving = buildContractClass(artifact);
    const instance = ProceduralSaving.fromTransaction(tx, 0);
    const privKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    instance.connect(new TestWallet(privKey));
    const nextInstance = instance.next();
    nextInstance.methods.unlock((sigResps) => findSig(sigResps, privKey.toAddress('livenet')), privKey.toPublicKey());
    console.log(nextInstance.lockingScript);
}
export async function getRawTx(txid) {
    try {
        sleep(0.4);
        return (await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)).data;
    }
    catch {
        return await getRawTx(txid);
    }
}
