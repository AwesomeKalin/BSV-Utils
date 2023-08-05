import axios from "axios";
export async function issueToken(nftManifest, auth) {
    try {
        return (await axios.post('https://api.relysia.com/v2/issue', nftManifest, {
            headers: {
                authToken: auth.relysia.authentication.v1.getAuthToken(),
                type: 'NFT',
            }
        })).data.data.tokenId;
    }
    catch {
        return await issueToken(nftManifest, auth);
    }
}
