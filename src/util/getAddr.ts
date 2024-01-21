import axios, { AxiosResponse } from "axios";
import { authenticate } from "./authenticator.js";
import RelysiaSDK from '@relysia/sdk';

export async function getAllAddr(auth: authenticate): Promise<string[]> {
    await auth.checkAuth();
    let relysia: RelysiaSDK = auth.relysia;
    let address: AxiosResponse<any, any>;

    try {
        address = await axios.get('https://api.relysia.com/v1/allAddresses', {
            headers: {
                authToken: relysia.authentication.v1.getAuthToken(),
            }
        })
    } catch {
        return await getAllAddr(auth);
    }

    return await address.data.data.addresses;
}