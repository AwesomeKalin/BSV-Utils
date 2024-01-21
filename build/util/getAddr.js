import axios from "axios";
export async function getAllAddr(auth) {
    await auth.checkAuth();
    let relysia = auth.relysia;
    let address;
    try {
        address = await axios.get('https://api.relysia.com/v1/allAddresses', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        });
    }
    catch {
        return await getAllAddr(auth);
    }
    return await address.data.data.addresses;
}
