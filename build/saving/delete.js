import { getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { bsv } from "scryptlib";
import { sleep } from "../util/sleep.js";
import axios from "axios";
import { PubKey, SignatureHashType, TestWallet, WhatsonchainProvider, findSig } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";
import { ProceduralSaving } from "../contracts/procedural-saving.js";
export async function deleteFolderSave(txid) {
    const auth = await getAuthClass();
    txid = await getLatestVersionOfContract(txid);
    const tx = await getRawTx(txid);
    await ProceduralSaving.loadArtifact(artifact);
    const instance = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);
    const privKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    const signer = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    await instance.connect(signer);
    const nextInstance = instance.next();
    nextInstance.methods.unlock((sigResps) => findSig(sigResps, privKey.toPublicKey(), SignatureHashType.ANYONECANPAY_ALL), PubKey(privKey.toPublicKey().toString()), {
        // Direct the signer to use the private key associated with `publicKey` and the specified sighash type to sign this transaction.
        pubKeyOrAddrToSign: {
            pubKeyOrAddr: privKey.toPublicKey(),
            sigHashType: SignatureHashType.ANYONECANPAY_ALL,
        },
        // This flag ensures the call tx is only created locally and not broadcasted.
        partiallySigned: true,
        // Prevents automatic addition of fee inputs.
        autoPayFee: false,
    });
    console.log(instance);
    console.log('Seperator');
    console.log(nextInstance);
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
