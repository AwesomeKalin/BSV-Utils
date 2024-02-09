import * as openpgp from 'openpgp';
// Encrypt a string using a given secret key
export async function encrypt(text, key) {
    const message = await openpgp.createMessage({ binary: text });
    const encrypted = await openpgp.encrypt({
        message,
        passwords: [key],
        format: 'binary',
    });
    return Buffer.from(encrypted);
}
// Decrypt a buffer using a given secret key
export async function decrypt(b, key) {
    const message = await openpgp.readMessage({ binaryMessage: b });
    const { data: decrypted } = await openpgp.decrypt({
        message,
        passwords: [key],
        format: 'binary',
    });
    return Buffer.from(decrypted);
}
