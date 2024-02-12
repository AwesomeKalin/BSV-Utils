/// <reference types="node" resolution-mode="require"/>
import { authenticate } from '../util/authenticator.js';
import { Spinner } from 'nanospinner';
export declare function uploadFiles(auth: authenticate, fileBuffer: Buffer, fileName: string, ngrok: string, showProgress?: boolean, spinner?: Spinner): Promise<string>;
export declare function resumeUpload(auth: authenticate, fileBuffer: Buffer, fileName: string, ngrok: string, spinner: Spinner, nextToUpload: number, txs: Array<string>): Promise<string>;
