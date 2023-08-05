import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { uploadFiles } from "../upload/uploadFiles.js";
import { authenticate, getAuthClass } from "../util/authenticator.js";
import { expressServer } from "../upload/expressServer.js";
import getPort from "get-port";
import ngrok from 'ngrok';
import cliProgress, { Presets } from 'cli-progress';
import { makeid } from "../util/randomString.js";
import axios from "axios";
import chalk from "chalk";
import { issueToken } from "./issueToken.js";
import { createOffer } from "./createOffer.js";

export async function nft(prefix: string, folder: string, description: string, fileformat: string, digits: number, defaultPrice: number, toUpload: number, nftManifestList: { nfts: Array<nftinfo> } = { nfts: [] }) {
    const folderLength: number = readdirSync(folder).length;
    const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar.start(folderLength, toUpload - 1);

    const auth: authenticate = await getAuthClass();

    const port: number = await getPort();
    mkdirSync('./temp');
    const server: expressServer = new expressServer(port);
    const url: string = await ngrok.connect(port);

    while (true) {
        const zerosToPad: number = digits - (toUpload.toString().length);
        const fileNameToUpload: string = `${'0'.repeat(zerosToPad)}${toUpload.toString()}`;
        const filePathToUpload: string = `${folder}/${fileNameToUpload}.${fileformat}`;

        let txid: string;
        try {
            txid = await uploadFiles(auth, readFileSync(filePathToUpload), `${fileNameToUpload}.${fileformat}`, url, undefined);
        } catch {
            await ngrok.disconnect();
            rmSync('./temp', { recursive: true, force: true });
            bar.stop();
            console.log(chalk.greenBright('Successfully uploaded and created atomic swap offers for NFTs. A JSON full of the NFTs can be found in nfts.json'))
            process.exit(0);
        }

        await auth.checkAuth();

        const nftManifest = {
            name: `${prefix}${toUpload}`,
            symbol: makeid(9),
            description,
            image: `https://bico.media/${txid}`,
            tokenSupply: 1,
            decimals: 0,
            satsPerToken: 1,
            properties: {
                legal: {
                    terms: "STAS, Inc. retains all rights to the token script.  Use is subject to terms at https://stastoken.com/license.",
                    licenceId: "stastoken.com"
                },
                issuer: {
                    organisation: "Vaionex Corp.",
                    legalForm: "Limited",
                    governingLaw: "US",
                    issuerCountry: "US",
                    jurisdiction: "US",
                    email: "info@vaionex.com"
                },
                meta: {
                    schemaId: "STAS1.0",
                    website: "https://github.com/AwesomeKalin/BSV-Utils",
                    legal: {
                        terms: "https://github.com/AwesomeKalin/BSV-Utils/README.md"
                    },
                    media: [
                        {
                            URI: `B://${txid}`,
                            type: "NFT",
                            altURI: `https://bico.media/${txid}`
                        }
                    ]
                }
            },
            splitable: false,
            data: {}
        }

        const tokenId: string = await issueToken(nftManifest, auth);

        let offerHex: string;

        if (defaultPrice !== undefined) {
            offerHex = await createOffer(tokenId, defaultPrice, auth);
        } else {
            offerHex = undefined;
        }

        const nftManifestPush: nftinfo = {
            tokenId,
            offerHex,
        }

        nftManifestList.nfts.push(nftManifestPush);
        writeFileSync('./nfts.json', JSON.stringify(nftManifestList));
        toUpload += 1;
        bar.increment(1);
    }
}

interface nftinfo {
    tokenId: string,
    offerHex: string,
}