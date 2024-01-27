import { authenticate, getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { AbstractContract, bsv, buildContractClass } from "scryptlib";
import { sleep } from "../util/sleep.js";
import axios from "axios";
import { SignatureResponse, TestWallet, findSig } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";

export async function deleteFolderSave(txid: string) {
    const auth: authenticate = await getAuthClass();

    txid = await getLatestVersionOfContract(txid);

    const tx = await getRawTx(txid);
    const ProceduralSaving = buildContractClass(artifact);
    const instance: AbstractContract = ProceduralSaving.fromTransaction(tx, 0);

    const privKey: bsv.PrivateKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    instance.connect(new TestWallet(privKey));

    const nextInstance: AbstractContract = instance.next();
    nextInstance.methods.unlock((sigResps: SignatureResponse[]) => findSig(sigResps, privKey.toAddress('livenet')), privKey.toPublicKey());

    console.log(nextInstance.lockingScript);
}

export async function getRawTx(txid: string) {
    try {
        sleep(0.4);
        return (await axios.get<string>(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)).data;
    } catch {
        return await getRawTx(txid);
    }
}