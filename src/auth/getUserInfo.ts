import { decrypt } from "../util/encryption.js";
import input from '@inquirer/input';
import chalk from 'chalk';

export async function getUserInfo(account: Buffer) {
    let decoded: string;
    try {
        decoded = Buffer.from(account.toString('ascii'), 'base64').toString();
    } catch {
        try {
            decoded = Buffer.from(await decrypt(account, await input({ message: 'Please enter your decryption key: ' })), 'base64').toString();
        } catch {
            console.log(chalk.red('Incorrect Password'));
            process.exit(1);
        }
    }

    const accJson: {email: string, accPassword: string} = JSON.parse(decoded);

    return accJson.email;
}