import axios, { AxiosResponse } from "axios";
import { authenticate } from "./authenticator.js";
import RelysiaSDK from '@relysia/sdk';
import { WOCDecode } from "../types/WOCDecode.js";

export async function getTxInput(auth: authenticate, address: string) {
    await auth.checkAuth();
    let relysia: RelysiaSDK = auth.relysia;
    let token: string;
    let getBal: AxiosResponse<Balance>;

    try {
        getBal = await axios.get('https://api.relysia.com/v2/balance', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        });
    } catch {
        return await getTxInput(auth, address);
    }

    try {
        token = await getBal.data.data.coins[1].tokenId;
    } catch {
        const createToken: AxiosResponse<TokenCreate> = await axios.post('https://api.relysia.com/v2/issue', {
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

    const rawtx: string = await rawTxGetter(auth, token, address);

    return await wocdecode(rawtx);
}

export async function rawTxGetter(auth: authenticate, tokenId: string, to: string) {
    await auth.checkAuth();
    let relysia: RelysiaSDK = auth.relysia;

    let rawTxResponse: AxiosResponse<RawTx>;

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
    } catch {
        return await rawTxGetter(auth, tokenId, to);
    }

    try {
        axios.get('https://api.relysia.com/v1/tokenMetrics', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        })
    } catch {

    }

    return rawTxResponse.data.data.rawTxs[0];
}

interface Balance {
    statusCode: number;
    data: {
        status: string;
        msg: string;
        totalBalance: {
            currency: string;
            balance: number
        }
        coins: {
            protocol: string;
            balance: number;
        } | {
            Id: string;
            protocol: string;
            tokenId: string;
            splittable: boolean;
            splitable: boolean;
            verified: boolean;
            name: string;
            address: string;
            satsPerToken: number;
            symbol: string;
            redeemAddr: string;
            image: string;
            amount: number;
            supply: number;
            decimals: number;
            sn?: number[];
        }[];
        meta?: {
            nextPageToken: number;
        }
    };
}

interface TokenCreate {
    statusCode: number;
    data: {
        status: string;
        msg: string;
        tokenId: string;
        tokenObj: {
            userId: string;
            symbol: string;
            name: string;
            description: string;
            image: string;
            totalSupply: number;
            satsPerToken: number;
            decimals: number;
            properties: {
                legal: {
                    terms: string;
                    licenseId: string;
                };
                issuer: {
                    organisation: string;
                    legalForm: string;
                    governingLaw: string;
                    issuerCountry: string;
                    jurisdiction: string;
                    email: string;
                };
                meta: {
                    schemaId: string;
                    website: string;
                    legal: {
                        terms: string;
                    };
                    media: {
                        URI: string;
                        type: string;
                        altURI: string;
                    }[];
                };
            };
        };
        spittable: boolean;
        protocolId: string;
        contractTxid: string;
        issueTxid: string;
        contractAddress: string;
        contractPublickey: string;
        splitable: boolean;
    }
}

interface RawTx {
    statusCode: number;
    data: {
        status: string;
        msg: string;
        rawTxs: string[];
    }
}

async function wocdecode(txhex: string) {
    try {
        return (await axios.post<WOCDecode>('https://api.whatsonchain.com/v1/bsv/main/tx/decode', {
            txhex,
        })).data;
    } catch (e) {
        console.log(e);
        await wocdecode(txhex);
    }
}