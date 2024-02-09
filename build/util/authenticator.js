import password from '@inquirer/password';
import RelysiaSDK from '@relysia/sdk';
import chalk from 'chalk';
import isBase64 from 'is-base64';
import { decrypt } from './encryption.js';
import { readFileSync } from 'fs';
import os from 'os';
export class authenticate {
    relysia = new RelysiaSDK();
    timestamp;
    email;
    accPassword;
    async auth(email, password) {
        this.email = email;
        this.accPassword = password;
        try {
            await this.relysia.authentication.v1.auth({ email: this.email, password: this.accPassword });
        }
        catch {
            this.auth(email, password);
        }
        this.timestamp = Date.now();
    }
    async checkAuth() {
        if (Date.now() - 600000 > this.timestamp) {
            await this.auth(this.email, this.accPassword);
        }
        return true;
    }
}
export async function getAuthClass() {
    const account = readFileSync(`${os.homedir()}/.bsvutils/account.bsv`);
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
    let authenticator = new authenticate();
    authenticator.auth(accJson.email, accJson.accPassword);
    return authenticator;
}
