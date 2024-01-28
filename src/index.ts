#!/usr/bin/env node

import yargs from 'yargs';
import chalk from 'chalk';
import { auth } from './auth/auth.js';
import { upload } from './upload/upload.js';
import { nft, nftinfo } from './nft/nft.js';
import { readFileSync, writeFileSync } from 'fs';
import { download, resumeDl } from './download/download.js';
import { hashSettings } from './settings/hash.js';
import { createProceduralSave } from './saving/create.js';
import { deleteFolderSave } from './saving/delete.js';
import { updateProceduralSave } from './saving/update.js';

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

        yargs.positional('nftJson', {
            type: 'string',
            description: 'If you stopped uploading NFTs midway through, pass the generated json, usually called nfts.json',
            default: undefined
        });
    }, async function (argv) {
        ranCommand = true;
        if (argv.nftJson === undefined) {
            //@ts-expect-error
            await nft(argv.prefix, argv.folder, argv.description, argv.fileformat, argv.digits, argv.defaultPrice, 1);
        } else {
            //@ts-expect-error
            const nftJson: { nfts: Array<nftinfo> } = JSON.parse(readFileSync(argv.nftJson));
            //@ts-expect-error
            await nft(argv.prefix, argv.folder, argv.description, argv.fileformat, argv.digits, argv.defaultPrice, nftJson.nfts.length, nftJson);
        }
    })
    .command('download', 'Download a B://, B://cat or K:// format file (no authentiation required)', (yargs) => {
        yargs.positional('txid', {
            type: 'string',
            description: 'The transaction id of the file',
            required: true,
            alias: 'tx',
        });
    }, async function (argv) {
        ranCommand = true;
        //@ts-expect-error
        const {file, name} = await download(argv.txid);

        writeFileSync(name, file);
    })
    .command('resumeDl', 'Resume a download. Folder where parts were downloaded must NOT have been renamed', (yargs) => {
        yargs.positional('txid', {
            type: 'string',
            description: 'The transaction id of the file',
            required: true,
            alias: 'tx',
        });
    }, async function (argv) {
        ranCommand = true;
        //@ts-expect-error
        const {file, name} = await resumeDl(argv.txid);

        writeFileSync(name, file);
    })
    .command('createFolderSave', 'Deploy a contract that allows you to save files to BSV procedulary, allowing you to download any saved version', (yargs) => {
        yargs.positional('folder', {
            type: 'string',
            description: 'The follder in which you want to do the original save',
            required: true,
            alias: 'dir',
        });
        yargs.positional('encryption', {
            type: 'string',
            description: 'If encryption is desired, then input the path to a PGP key here. Must contain private key. (HIGHLY RECOMMENDED!)',
        });
    }, async function (argv) {
        ranCommand = true;
        //@ts-expect-error
        createProceduralSave(argv.folder, argv.encryption);
    })
    .command('hashAlgorithms', 'Select the hash algorithms to use when doing hashing', async function () {
        ranCommand = true;
        await hashSettings();
    })
    .command('deleteFolderSave', 'Delete the contract created with bsv-utils createFolderSave', (yargs) => {
        yargs.positional('txid', {
            type: 'string',
            description: 'The transaction id of the contract. Does not have to be the latest',
            required: true,
            alias: 'tx',
        });
    }, async function (argv) {
        ranCommand = true;
        //@ts-expect-error
        await deleteFolderSave(argv.txid);
    })
    .command('updateFolderSave', 'Update a procedural folder save.', (yargs) => {
        yargs.positional('txid', {
            type: 'string',
            description: 'The transaction id of the contract. Does not have to be the latest',
            required: true,
            alias: 'tx',
        });
        yargs.positional('folder', {
            type: 'string',
            description: 'The folder in which the files you want to add are',
            required: true,
            alias: 'dir',
        });
        yargs.positional('encryption', {
            type: 'string',
            description: 'If encryption is used on this save, then input the path to a PGP key here. Must contain private key',
        });
        yargs.positional('interval', {
            type: 'number',
            description: 'How often you want to update in seconds. Set to 0 for just a single update',
            default: 0,
        });
    }, async function (argv) {
        ranCommand = true;
        //@ts-expect-error
        await updateProceduralSave(argv.txid, argv.folder, argv.encryption, argv.interval);
    })
    .help()
    .argv;

if (!ranCommand) {
    console.log(chalk.red('No arguments listed. Don\'t know how to use? Run bsv-utils --help'));
}