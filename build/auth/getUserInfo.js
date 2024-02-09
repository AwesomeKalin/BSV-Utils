import { decrypt } from "../util/encryption.js";
import password from '@inquirer/password';
import chalk from 'chalk';
import isBase64 from 'is-base64';
export async function getUserInfo(account) {
    let decoded;
    if (isBase64(account.toString())) {
        decoded = Buffer.from(account.toString('ascii'), 'base64').toString();
    }
    else {
        try {
            decoded = (await decrypt(account, await password({ message: 'Please enter your decryption key: ' })), 'base64').toString();
            console.clear();
        }
        catch {
            console.log(chalk.red('Incorrect Password'));
            process.exit(1);
        }
    }
    const accJson = JSON.parse(decoded);
    return accJson.email;
}
