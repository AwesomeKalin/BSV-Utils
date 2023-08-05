#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import { auth } from './auth/auth.js';
let ranCommand = false;
yargs(process.argv.slice(2)).scriptName('bsv-utils').command('auth', 'Authenticate with your Relysia account', () => { }, async function () {
    ranCommand = true;
    await auth();
}).help().argv;
if (!ranCommand) {
    console.log(chalk.red('No arguments listed. Don\'t know how to use? Run bsv-utils --help'));
}
