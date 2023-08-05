import RelysiaSDK from '@relysia/sdk';
export declare class authenticate {
    relysia: RelysiaSDK;
    timestamp: number;
    email: string;
    accPassword: string;
    auth(email: string, password: string): Promise<void>;
    checkAuth(): Promise<boolean>;
}
export declare function getAuthClass(): Promise<authenticate>;
