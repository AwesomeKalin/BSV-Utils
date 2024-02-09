import input from '@inquirer/input';
import password from '@inquirer/password';
import RelysiaSDK from '@relysia/sdk';
import chalk from 'chalk';
import { Spinner, createSpinner } from 'nanospinner';
import { encrypt } from '../util/encryption.js';

export async function login() {
    const email: string = await input({ message: 'Relysia Email: ' });
    const accPassword: string = await password({ message: 'Relysia Password: ' });
    const encryptionPassword: string = await password({ message: 'Would you like to encrypt this information? If so, please enter a password, otherwise leave blank: ' });
    const spinner: Spinner = createSpinner('Testing credentials and saving').start();
    try {
        const relysia: RelysiaSDK = new RelysiaSDK();
        await relysia.authentication.v1.auth({ email, password: accPassword });
        const toSave: string = Buffer.from(JSON.stringify({
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