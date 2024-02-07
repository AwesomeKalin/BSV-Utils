import * as openpgp from 'openpgp';
// Encrypt a string using a given secret key
export async function encryptWithKey(text, key) {
    const privateKey = await openpgp.readKey({ armoredKey: key });
    const publicKey = privateKey.toPublic();
    const message = await openpgp.createMessage({ binary: text });
    const encrypted = await openpgp.encrypt({
        message,
        encryptionKeys: publicKey,
        //@ts-expect-error
        signingKeys: privateKey,
    });
    return Buffer.from(encrypted);
}
// Decrypt a buffer using a given secret key
export async function decryptWithKey(b, key) {
    const privateKey = await openpgp.readKey({ armoredKey: key });
    const publicKey = privateKey.toPublic();
    const message = await openpgp.readMessage({ armoredMessage: b });
    //@ts-expect-error
    const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
        verificationKeys: publicKey,
        expectSigned: true,
        format: 'string',
    });
    return decrypted.toString();
}
