import { authenticate, getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { bsv } from "scryptlib";
import { sleep } from "../util/sleep.js";
import axios from "axios";
import { MethodCallOptions, PubKey, SignatureHashType, SignatureResponse, TestWallet, WhatsonchainProvider, findSig } from "scrypt-ts";
import { broadcastWithFee, getPrivateKey } from "../util/deployContract.js";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import chalk from "chalk";
import { getTxInput } from "../util/getInput.js";

export async function deleteFolderSave(txid: string) {
    const auth: authenticate = await getAuthClass();

    try {
        txid = await getLatestVersionOfContract(txid);
    } catch {
        console.log(chalk.red('This procedural save has already been deleted!'));
    }

    const tx = await getRawTx(txid);
    ProceduralSaving.loadArtifact(artifact);
    const instance: ProceduralSaving = ProceduralSaving.fromTx(new bsv.Transaction(tx), 0);

    const privKey: bsv.PrivateKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    const signer: TestWallet = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    await instance.connect(signer);

    await getTxInput(auth, privKey.toAddress().toString());

    let { tx: callTX } = await instance.methods.unlock((sigResps: SignatureResponse[]) => findSig(sigResps, privKey.toPublicKey()), PubKey(privKey.toPublicKey().toString()), {
        // Direct the signer to use the private key associated with `publicKey` and the specified sighash type to sign this transaction.
        pubKeyOrAddrToSign: {
            pubKeyOrAddr: privKey.toPublicKey(),
        },
    } as MethodCallOptions<ProceduralSaving>);

    console.log(`Deleted folder save at ${callTX.id}`);
}

export async function getRawTx(txid: string) {
    try {
        sleep(0.4);
        return (await axios.get<string>(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)).data;
    } catch {
        return await getRawTx(txid);
    }
}