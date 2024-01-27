import { authenticate, getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { Ripemd160, bsv } from "scryptlib";
import { sleep } from "../util/sleep.js";
import axios from "axios";
import { PubKey, TestWallet, WhatsonchainProvider, pubKey2Addr, ripemd160 } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";
import { ProceduralSaving } from "../contracts/procedural-saving.js";

export async function deleteFolderSave(txid: string) {
    const auth: authenticate = await getAuthClass();

    txid = await getLatestVersionOfContract(txid);

    const tx = await getRawTx(txid);
    await ProceduralSaving.loadArtifact(artifact);
    const instance: ProceduralSaving = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);

    const privKey: bsv.PrivateKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    const signer: TestWallet = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    await instance.connect(signer);

    const nextInstance: ProceduralSaving = instance.next();
    nextInstance.unlock(undefined, PubKey(privKey.toPublicKey().toString()));

    console.log(instance);
    console.log('Seperator');
    console.log(nextInstance);
}

export async function getRawTx(txid: string) {
    try {
        sleep(0.4);
        return (await axios.get<string>(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)).data;
    } catch {
        return await getRawTx(txid);
    }
}