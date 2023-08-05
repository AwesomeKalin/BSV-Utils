import { decrypt } from "../util/encryption.js";
import input from '@inquirer/input';
import chalk from 'chalk';
export async function getUserInfo(account) {
    let decoded;
    try {
        decoded = Buffer.from(account.toString('ascii'), 'base64').toString();
    }
    catch {
        try {
            decoded = Buffer.from(await decrypt(account, await input({ message: 'Please enter your decryption key: ' })), 'base64').toString();
        }
        catch {
            console.log(chalk.red('Incorrect Password'));
            process.exit(1);
        }
    }
    const accJson = JSON.parse(decoded);
    return accJson.email;
}
