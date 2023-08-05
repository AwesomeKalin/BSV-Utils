import { readFileSync, readdirSync, writeFileSync } from "fs";
import { uploadFiles } from "../upload/uploadFiles.js";
import { getAuthClass } from "../util/authenticator.js";
import { expressServer } from "../upload/expressServer.js";
import getPort from "get-port";
import ngrok from 'ngrok';
import cliProgress, { Presets } from 'cli-progress';
import { makeid } from "../util/randomString.js";
import axios from "axios";
import chalk from "chalk";
export async function nft(prefix, folder, description, fileformat, digits, defaultPrice) {
    const folderLength = readdirSync(folder).length;
    const bar = new cliProgress.SingleBar({}, Presets.shades_classic);
    bar.start(folderLength, 0);
    let toUpload = 1;
    const auth = await getAuthClass();
    const port = await getPort();
    const server = new expressServer(port);
    const url = await ngrok.connect(port);
    let nftManifestList = { nfts: [] };
    while (true) {
        const zerosToPad = digits - (toUpload.toString().length);
        const fileNameToUpload = `${'0'.repeat(zerosToPad)}${toUpload.toString()}`;
        const filePathToUpload = `${folder}/${fileNameToUpload}.${fileformat}`;
        let txid;
        try {
            txid = await uploadFiles(auth, readFileSync(filePathToUpload), `${fileNameToUpload}.${fileformat}`, url, undefined);
        }
        catch {
            writeFileSync('./nfts.json', JSON.stringify(nftManifestList));
            await ngrok.disconnect();
            console.log(chalk.greenBright('Successfully uploaded and created atomic swap offers for NFTs. A JSON full of the NFTs can be found in nfts.json'));
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
        };
        const tokenId = (await axios.post('https://api.relysia.com/v2/issue', nftManifest, {
            headers: {
                authToken: auth.relysia.authentication.v1.getAuthToken(),
                type: 'NFT',
            }
        })).data.data.tokenId;
        let offerHex;
        if (defaultPrice !== undefined) {
            offerHex = (await axios.post('https://api.relysia.com/v1/offer', {
                dataArray: [
                    {
                        tokenId,
                        amount: 1,
                        type: "BSV",
                        wantedAmount: defaultPrice
                    }
                ]
            }, {
                headers: {
                    authToken: auth.relysia.authentication.v1.getAuthToken(),
                }
            })).data.data.contents[0];
        }
        else {
            offerHex = undefined;
        }
        const nftManifestPush = {
            tokenId,
            offerHex,
        };
        nftManifestList.nfts.push(nftManifestPush);
        bar.increment(1);
    }
}
