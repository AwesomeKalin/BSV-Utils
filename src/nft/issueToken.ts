import axios from "axios";
import { authenticate } from "../util/authenticator.js";

export async function issueToken(nftManifest: { name: string; symbol: string; description: string; image: string; tokenSupply: number; decimals: number; satsPerToken: number; properties: { legal: { terms: string; licenceId: string; }; issuer: { organisation: string; legalForm: string; governingLaw: string; issuerCountry: string; jurisdiction: string; email: string; }; meta: { schemaId: string; website: string; legal: { terms: string; }; media: { URI: string; type: string; altURI: string; }[]; }; }; splitable: boolean; data: {}; }, auth: authenticate) {
    try {
        return (await axios.post('https://api.relysia.com/v2/issue', nftManifest, {
            headers: {
                authToken: auth.relysia.authentication.v1.getAuthToken(),
                type: 'NFT',
            }
        })).data.data.tokenId;
    } catch {
        return await issueToken(nftManifest, auth);
    }
}