import axios from "axios";
import { sleep } from "./sleep.js";
export async function getTxInput(auth, address) {
    await auth.checkAuth();
    let relysia = auth.relysia;
    let token;
    let getBal;
    try {
        getBal = await axios.get('https://api.relysia.com/v2/balance', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        });
    }
    catch (e) {
        console.log(e);
        return await getTxInput(auth, address);
    }
    try {
        token = await getBal.data.data.coins[1].tokenId;
    }
    catch {
        const createToken = await axios.post('https://api.relysia.com/v2/issue', {
            name: "Store Bonus Points",
            symbol: "SBP",
            description: "A supermarket bonus point.",
            image: "https://upload.wikimedia.org/wikipedia/en/9/95/Test_image.jpg",
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
                    website: "vaionex.com",
                    legal: {
                        terms: "Your token terms and description."
                    },
                    media: [
                        {
                            URI: "string",
                            type: "string",
                            altURI: "string"
                        }
                    ]
                }
            },
            splitable: false,
            data: {}
        }, {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
                type: 'NFT',
            }
        });
        token = createToken.data.data.tokenId;
    }
    const rawtx = await rawTxGetter(auth, token, address);
    return await getInputTx(await wocdecode(rawtx));
}
export async function rawTxGetter(auth, tokenId, to) {
    await auth.checkAuth();
    let relysia = auth.relysia;
    let rawTxResponse;
    try {
        rawTxResponse = await axios.post('https://api.relysia.com/v1/rawtx', {
            dataArray: [
                {
                    to,
                    amount: 1,
                    tokenId
                }
            ]
        }, {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        });
    }
    catch (e) {
        console.log(e);
        return await rawTxGetter(auth, tokenId, to);
    }
    try {
        axios.get('https://api.relysia.com/v1/tokenMetrics', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        });
    }
    catch {
    }
    return rawTxResponse.data.data.rawTxs[0].rawtx;
}
async function wocdecode(txhex) {
    sleep(0.4);
    try {
        return (await axios.post('https://api.whatsonchain.com/v1/bsv/main/tx/decode', {
            txhex,
        })).data;
    }
    catch (e) {
        console.log(e);
        await wocdecode(txhex);
    }
}
async function getInputTx(decoded) {
    const inputHash = decoded.vin[1].txid;
    const voutIndex = decoded.vin[1].vout;
    sleep(0.4);
    try {
        return { tx: (await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${inputHash}`)).data, voutIndex };
    }
    catch {
        return await getInputTx(decoded);
    }
}
