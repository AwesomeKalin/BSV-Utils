import { authenticate } from "../util/authenticator.js";
export declare function issueToken(nftManifest: {
    name: string;
    symbol: string;
    description: string;
    image: string;
    tokenSupply: number;
    decimals: number;
    satsPerToken: number;
    properties: {
        legal: {
            terms: string;
            licenceId: string;
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
    splitable: boolean;
    data: {};
}, auth: authenticate): any;
