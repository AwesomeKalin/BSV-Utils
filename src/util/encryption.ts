import * as openpgp from 'openpgp';

// Encrypt a string using a given secret key
export async function encrypt(text: string, key: string) {
    const message: openpgp.Message<string> = await openpgp.createMessage({ text });
    const encrypted: Uint8Array = await openpgp.encrypt({
        message,
        passwords: [key],
        format: 'binary',
    });
    return Buffer.from(encrypted);
}

// Decrypt a buffer using a given secret key
export async function decrypt(b: Buffer, key: string) {
    const message: openpgp.Message<Buffer> = await openpgp.readMessage({ binaryMessage: b });
    const { data: decrypted } = await openpgp.decrypt({
        message,
        passwords: [key],
        format: 'binary',
    });
    return decrypted.toString();
}