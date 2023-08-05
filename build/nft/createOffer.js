import axios from "axios";
export async function createOffer(tokenId, defaultPrice, auth) {
    try {
        (await axios.post('https://api.relysia.com/v1/offer', {
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
    catch {
        return await createOffer(tokenId, defaultPrice, auth);
    }
}
