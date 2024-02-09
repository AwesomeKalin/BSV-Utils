import input from '@inquirer/input';
import password from '@inquirer/password';
import RelysiaSDK from '@relysia/sdk';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { encrypt } from '../util/encryption.js';
export async function login() {
    const email = await input({ message: 'Relysia Email: ' });
    const accPassword = await password({ message: 'Relysia Password: ' });
    const encryptionPassword = await password({ message: 'Would you like to encrypt this information? If so, please enter a password, otherwise leave blank: ' });
    const spinner = createSpinner('Testing credentials and saving').start();
    try {
        const relysia = new RelysiaSDK();
        await relysia.authentication.v1.auth({ email, password: accPassword });
        const toSave = Buffer.from(JSON.stringify({
            email,
            accPassword
        })).toString('base64');
        if (encryptionPassword != '') {
            spinner.stop();
            return await encrypt(Buffer.from(toSave), encryptionPassword);
        }
        spinner.stop();
        return Buffer.from(toSave);
    }
    catch {
        spinner.stop();
        console.log(chalk.red('Are you sure that you entered the correct email and/or password?'));
        return login();
    }
}
