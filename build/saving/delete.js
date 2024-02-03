import { getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { bsv } from "scryptlib";
import { sleep } from "../util/sleep.js";
import axios from "axios";
import { PubKey, TestWallet, WhatsonchainProvider, findSig } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import chalk from "chalk";
import { getTxInput } from "../util/getInput.js";
export async function deleteFolderSave(txid) {
    const auth = await getAuthClass();
    try {
        txid = await getLatestVersionOfContract(txid);
    }
    catch {
        console.log(chalk.red('This procedural save has already been deleted!'));
    }
    const tx = await getRawTx(txid);
    ProceduralSaving.loadArtifact(artifact);
    const instance = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);
    const privKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    const signer = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    await instance.connect(signer);
    await getTxInput(auth, privKey.toAddress().toString());
    let { tx: callTX } = await instance.methods.unlock((sigResps) => findSig(sigResps, privKey.toPublicKey()), PubKey(privKey.toPublicKey().toString()), {
        // Direct the signer to use the private key associated with `publicKey` and the specified sighash type to sign this transaction.
        pubKeyOrAddrToSign: {
            pubKeyOrAddr: privKey.toPublicKey(),
        },
    });
    console.log(`Deleted folder save at ${callTX.id}`);
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
