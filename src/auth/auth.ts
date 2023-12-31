import chalk from 'chalk';
import { readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { login } from './login.js';
import { getUserInfo } from './getUserInfo.js';
import select from '@inquirer/select';
import os from 'os';

export async function auth() {
    console.log(chalk.greenBright('Thank you for your interest in this library!'));
    let account: Buffer;
    try {
        account = readFileSync(`${os.homedir()}/.bsvutils/account.bsv`);
        console.log(`Currently logged in to ${await getUserInfo(account)}`);
        const nextToDo: string = await select({
            message: 'What would you like to do next?',
            choices: [
                {
                    name: 'Remove Account and Exit to Terminal',
                    value: 'remove-account',
                },
                {
                    name: 'Switch Account',
                    value: 'switch-account'
                },
                {
                    name: 'Exit to Terminal',
                    value: 'exit-cli',
                }
            ]
        });

        if (nextToDo === 'remove-account') {
            unlinkSync(`${os.homedir()}/.bsvutils/account.bsv`);
            process.exit(0);
        } else if (nextToDo === 'switch-account') {
            account = await login();

            console.log(chalk.greenBright('Successfully Logged In. Saving Information to Drive'));
            writeFileSync(`${os.homedir()}/.bsvutils/account.bsv`, account);
            console.clear();
            await auth();
        } else {
            process.exit(0);
        }
    }
    catch {
        console.log(chalk.greenBright('Let\'s get your Relysia account setup! If you don\'t have a Relysia account, head over to https://relysia.com/auth/register then come back here!'));

        account = await login();

        console.log(chalk.greenBright('Successfully Logged In. Saving Information to Drive'));
        try {
            writeFileSync(`${os.homedir()}/.bsvutils/account.bsv`, account);
        } catch {
            mkdirSync(`${os.homedir()}/.bsvutils`);
            writeFileSync(`${os.homedir()}/.bsvutils/account.bsv`, account);
        }
        console.clear();
        await auth();
    }
}