import * as openpgp from 'openpgp';

// Encrypt a string using a given secret key
export async function encryptWithKey(text: Buffer, key: string) {
    const privateKey: openpgp.Key = await openpgp.readKey({ armoredKey: key });
    const publicKey: openpgp.Key = privateKey.toPublic();

    const message: openpgp.Message<Buffer> = await openpgp.createMessage({ binary: text });
    const encrypted: string = await openpgp.encrypt({
        message,
        encryptionKeys: publicKey,
        //@ts-expect-error
        signingKeys: privateKey,
    });
    return Buffer.from(encrypted);
}

// Decrypt a buffer using a given secret key
export async function decryptWithKey(b: Buffer, key: string) {
    const privateKey: openpgp.Key = await openpgp.readKey({ armoredKey: key });
    const publicKey: openpgp.Key = privateKey.toPublic();

    const message: openpgp.Message<Buffer> = await openpgp.readMessage({ binaryMessage: b });
    const { data: decrypted } = await openpgp.decrypt({
        message,
        //@ts-expect-error
        decryptionKeys: privateKey,
        verificationKeys: publicKey,
        expectSigned: true,
    });
    return decrypted.toString();
}