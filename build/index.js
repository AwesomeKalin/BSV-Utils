#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import { auth } from './auth/auth.js';
import { upload } from './upload/upload.js';
import { nft } from './nft/nft.js';
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
    yargs.positional('uploadJson', {
        type: 'string',
        description: 'If you stopped uploading the file midway through, pass the generated json file, usually called uploadedFile.json',
        default: undefined,
        alias: 'json',
    });
}, async function (argv) {
    ranCommand = true;
    //@ts-expect-error
    await upload(argv.file, argv.fileName, argv.uploadJson);
})
    .command('nft', 'Bulk upload a folder full of NFTs.', (yargs) => {
    yargs.positional('prefix', {
        type: 'string',
        description: 'The prefix of the name of the NFT\'s',
        default: '#',
    });
    yargs.positional('folder', {
        type: 'string',
        description: 'The Folder the NFTs are in',
        required: true,
    });
    yargs.positional('description', {
        type: 'string',
        description: 'The NFTs description',
        required: true,
    });
    yargs.positional('fileformat', {
        type: 'string',
        description: 'The file format, excluding the "."',
        default: 'png',
    });
    yargs.positional('digits', {
        type: 'number',
        description: 'The number of digits in the file name of the nfts. Must be between 1 and 20 inclusive',
        required: true,
    });
    yargs.positional('defaultPrice', {
        type: 'number',
        description: 'Default Price of the NFTs in BSV',
        default: undefined,
    });
}, async function (argv) {
    ranCommand = true;
    //@ts-expect-error
    await nft(argv.prefix, argv.folder, argv.description, argv.fileformat, argv.digits, argv.defaultPrice);
})
    .help()
    .argv;
if (!ranCommand) {
    console.log(chalk.red('No arguments listed. Don\'t know how to use? Run bsv-utils --help'));
}
