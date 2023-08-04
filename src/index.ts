#!/usr/bin/env node

import yargs from 'yargs';
import chalk from 'chalk';

let ranCommand = false;

yargs(process.argv.slice(2)).scriptName('bsv-utils').command('auth', 'Authenticate with your Relysia account', () => { }, function () {
    ranCommand = true;
    console.log('Hi');
}).help().argv;

if (!ranCommand) {
    console.log(chalk.red('Hi'));
}