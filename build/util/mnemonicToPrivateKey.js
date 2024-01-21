import * as bip39 from 'bip39';
import { bsv } from 'scrypt-ts';
export function getBSVAddressFromMnemonic(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdPrivateKey = bsv.HDPrivateKey.fromSeed(seed, bsv.Networks.mainnet);
    const child = hdPrivateKey.deriveChild("m/44'/0'/0'/0/0");
    const address = child.publicKey.toAddress(bsv.Networks.mainnet);
    return child.privateKey.toWIF();
}
