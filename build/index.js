#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import { auth } from './auth/auth.js';
import { upload } from './upload/upload.js';
let ranCommand = false;
yargs(process.argv.slice(2))
    .scriptName('bsv-utils')
    .command('auth', 'Authenticate with your Relysia account', () => { }, async function () {
    ranCommand = true;
    await auth();
}).command('upload', 'Upload a file (Max 2GB) to the blockchain in the B:// or K:// formats', (yargs) => {
    yargs.positional('file', {
        type: 'string',
        description: 'The file you want to upload to the blockchain',
        required: true,
    });
    yargs.positional('fileName', {
        type: 'string',
        description: 'What you want to name the file on the blockchain',
        default: 'file',
        alias: 'name',
    });
}, async function (argv) {
    ranCommand = true;
    //@ts-expect-error
    await upload(argv.file, argv.fileName);
}).help().argv;
if (!ranCommand) {
    console.log(chalk.red('No arguments listed. Don\'t know how to use? Run bsv-utils --help'));
}
