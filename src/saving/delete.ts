import { authenticate, getAuthClass } from "../util/authenticator.js";
import { getLatestVersionOfContract } from "../util/getLatestVersionOfContract.js";
import artifact from '../../artifacts/contracts/procedural-saving.json' with { type: 'json' };
import { bsv } from "scryptlib";
import { sleep } from "../util/sleep.js";
import axios from "axios";
import { MethodCallOptions, PubKey, SignatureResponse, TestWallet, WhatsonchainProvider, findSig } from "scrypt-ts";
import { getPrivateKey } from "../util/deployContract.js";
import { ProceduralSaving } from "../contracts/procedural-saving.cjs";
import chalk from "chalk";
import { getTxInput } from "../util/getInput.js";
import { WOCTx } from "../types/WOCTx.js";

export async function deleteFolderSave(txid: string) {
    const auth: authenticate = await getAuthClass();

    try {
        txid = await getLatestVersionOfContract(txid);
    } catch {
        console.log(chalk.red('This procedural save has already been deleted!'));
    }

    ProceduralSaving.loadArtifact(artifact);
    const privKey: bsv.PrivateKey = bsv.PrivateKey.fromWIF(await getPrivateKey(auth));
    const signer: TestWallet = new TestWallet(privKey, new WhatsonchainProvider(bsv.Networks.mainnet));
    const tx = new bsv.Transaction(await getRawTx(txid));
    const instance: ProceduralSaving = ProceduralSaving.fromTx(tx, 0);

    await instance.connect(signer);

    let { tx: checkTx } = await instance.methods.unlock((sigResps: SignatureResponse[]) => findSig(sigResps, privKey.toPublicKey()), PubKey(privKey.toPublicKey().toString()), {
        // Direct the signer to use the private key associated with `publicKey` and the specified sighash type to sign this transaction.
        pubKeyOrAddrToSign: {
            pubKeyOrAddr: privKey.toPublicKey(),
        },
        // Do not broadcast to blockchain
        partiallySigned: true,
    } as MethodCallOptions<ProceduralSaving>);

    let satsNeeded: number = checkTx.getFee() + 1;
    let inputs: number = 0;

    while (satsNeeded > 0) {
        const feeTx: { tx: WOCTx, voutIndex: number } = (await getTxInput(auth, privKey.toAddress().toString()));
        satsNeeded -= feeTx.tx.vout[feeTx.voutIndex].value * 100000000;
        inputs += 1;

        if ((inputs % 6) === 0) {
            satsNeeded += 1;
        }
    }

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