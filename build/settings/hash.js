import checkbox from '@inquirer/checkbox';
import { writeFileSync } from 'fs';
import os from 'os';
export async function hashSettings() {
    const answer = await checkbox({
        message: 'Please select the hash algorithms you wish to use. If unsure, just leave the defaults',
        choices: [
            {
                name: 'shake256-1k',
                value: 'SHAKE256 with 1024 bits',
                checked: true,
            },
            {
                name: 'sha3-512',
                value: 'SHA3-512',
                checked: true,
            },
            {
                name: 'doublesha256',
                value: 'Double SHA256',
                checked: true,
            },
            {
                name: 'sha256',
                value: 'SHA256',
                checked: true,
            },
            {
                name: 'ripemd160',
                value: 'RIPEMD-160',
                checked: true,
            },
            {
                name: 'cshake256-1k',
                value: 'cSHAKE256 with 1024 bits',
            },
            {
                name: 'kmac256-1k',
                value: 'KMAC256 with 1024 bits',
            },
            {
                name: 'shake128-1k',
                value: 'SHAKE128 with 1024 bits',
            },
            {
                name: 'cshake128-1k',
                value: 'cSHAKE128 with 1024 bits',
            },
            {
                name: 'kmac128-1k',
                value: 'KMAC128 with 1024 bits',
            },
            {
                name: 'sha512',
                value: 'SHA512'
            },
            {
                name: 'keccak512',
                value: 'Keccak-512'
            },
            {
                name: 'shake256-512',
                value: 'SHAKE256 with 512 bits'
            },
            {
                name: 'cshake256-512',
                value: 'cSHAKE256 with 512 bits',
            },
            {
                name: 'kmac256-512',
                value: 'KMAC256 with 512 bits',
            },
            {
                name: 'shake128-512',
                value: 'SHAKE128 with 512 bits',
            },
            {
                name: 'cshake128-512',
                value: 'cSHAKE128 with 512 bits',
            },
            {
                name: 'kmac128-512',
                value: 'KMAC128 with 512 bits',
            },
            {
                name: 'sha384',
                value: 'SHA384',
            },
            {
                name: 'sha3-384',
                value: 'SHA3-384',
            },
            {
                name: 'keccak384',
                value: 'Keccak-384',
            },
            {
                name: 'shake256-384',
                value: 'SHAKE256 with 384 bits'
            },
            {
                name: 'cshake256-384',
                value: 'cSHAKE256 with 384 bits',
            },
            {
                name: 'kmac256-384',
                value: 'KMAC256 with 384 bits',
            },
            {
                name: 'shake128-384',
                value: 'SHAKE128 with 384 bits',
            },
            {
                name: 'cshake128-384',
                value: 'cSHAKE128 with 384 bits',
            },
            {
                name: 'kmac128-384',
                value: 'KMAC128 with 384 bits',
            },
            {
                name: 'shake256-320',
                value: 'SHAKE256 with 320 bits'
            },
            {
                name: 'cshake256-320',
                value: 'cSHAKE256 with 320 bits',
            },
            {
                name: 'kmac256-320',
                value: 'KMAC256 with 320 bits',
            },
            {
                name: 'shake128-320',
                value: 'SHAKE128 with 320 bits',
            },
            {
                name: 'cshake128-320',
                value: 'cSHAKE128 with 320 bits',
            },
            {
                name: 'kmac128-320',
                value: 'KMAC128 with 320 bits',
            },
            {
                name: 'ripemd320',
                value: 'RIPEMD-320',
            },
            {
                name: 'sha512-256',
                value: 'SHA512/256',
            },
            {
                name: 'sha3-256',
                value: 'SHA3-256',
            },
            {
                name: 'keccak256',
                value: 'Keccak-256',
            },
            {
                name: 'shake256-256',
                value: 'SHAKE256 with 256 bits'
            },
            {
                name: 'cshake256-256',
                value: 'cSHAKE256 with 256 bits',
            },
            {
                name: 'kmac256-256',
                value: 'KMAC256 with 256 bits',
            },
            {
                name: 'shake128-256',
                value: 'SHAKE128 with 256 bits',
            },
            {
                name: 'cshake128-256',
                value: 'cSHAKE128 with 256 bits',
            },
            {
                name: 'kmac128-256',
                value: 'KMAC128 with 256 bits',
            },
            {
                name: 'ripemd256',
                value: 'RIPEMD-256',
            },
            {
                name: 'sha224',
                value: 'SHA224',
            },
            {
                name: 'sha512-224',
                value: 'SHA512/224',
            },
            {
                name: 'sha3-224',
                value: 'SHA3-224',
            },
            {
                name: 'keccak224',
                value: 'Keccak-224',
            },
            {
                name: 'shake256-224',
                value: 'SHAKE256 with 224 bits'
            },
            {
                name: 'cshake256-224',
                value: 'cSHAKE256 with 224 bits',
            },
            {
                name: 'kmac256-224',
                value: 'KMAC256 with 224 bits',
            },
            {
                name: 'shake128-224',
                value: 'SHAKE128 with 224 bits',
            },
            {
                name: 'cshake128-224',
                value: 'cSHAKE128 with 224 bits',
            },
            {
                name: 'kmac128-224',
                value: 'KMAC128 with 224 bits',
            },
            {
                name: 'sha1',
                value: 'SHA1',
            },
            {
                name: 'shake256-160',
                value: 'SHAKE256 with 160 bits'
            },
            {
                name: 'cshake256-160',
                value: 'cSHAKE256 with 160 bits',
            },
            {
                name: 'kmac256-160',
                value: 'KMAC256 with 160 bits',
            },
            {
                name: 'shake128-160',
                value: 'SHAKE128 with 160 bits',
            },
            {
                name: 'cshake128-160',
                value: 'cSHAKE128 with 160 bits',
            },
            {
                name: 'kmac128-160',
                value: 'KMAC128 with 160 bits',
            },
            {
                name: 'ripemd160',
                value: 'RIPEMD-160',
            },
            {
                name: 'md2',
                value: 'MD2',
            },
            {
                name: 'md4',
                value: 'MD4',
            },
            {
                name: 'md5',
                value: 'MD5',
            },
            {
                name: 'shake256-128',
                value: 'SHAKE256 with 128 bits'
            },
            {
                name: 'cshake256-128',
                value: 'cSHAKE256 with 128 bits',
            },
            {
                name: 'kmac256-128',
                value: 'KMAC256 with 128 bits',
            },
            {
                name: 'shake128-128',
                value: 'SHAKE128 with 128 bits',
            },
            {
                name: 'cshake128-128',
                value: 'cSHAKE128 with 128 bits',
            },
            {
                name: 'kmac128-128',
                value: 'KMAC128 with 128 bits',
            },
            {
                name: 'ripemd128',
                value: 'RIPEMD-128',
            },
            {
                name: 'crc32',
                value: 'CRC-32',
            },
            {
                name: 'shake256-32',
                value: 'SHAKE256 with 32 bits'
            },
            {
                name: 'cshake256-32',
                value: 'cSHAKE256 with 32 bits',
            },
            {
                name: 'kmac256-32',
                value: 'KMAC256 with 32 bits',
            },
            {
                name: 'shake128-32',
                value: 'SHAKE128 with 32 bits',
            },
            {
                name: 'cshake128-32',
                value: 'cSHAKE128 with 32 bits',
            },
            {
                name: 'kmac128-32',
                value: 'KMAC128 with 32 bits',
            },
            {
                name: 'crc16',
                value: 'CRC-16',
            },
            {
                name: 'shake256-16',
                value: 'SHAKE256 with 16 bits'
            },
            {
                name: 'cshake256-16',
                value: 'cSHAKE256 with 16 bits',
            },
            {
                name: 'kmac256-16',
                value: 'KMAC256 with 16 bits',
            },
            {
                name: 'shake128-16',
                value: 'SHAKE128 with 16 bits',
            },
            {
                name: 'cshake128-16',
                value: 'cSHAKE128 with 16 bits',
            },
            {
                name: 'kmac128-16',
                value: 'KMAC128 with 16 bits',
            },
            {
                name: 'doubleshake256-1k',
                value: 'Double SHAKE256 with 1024 bits',
            },
            {
                name: 'doublesha3-512',
                value: 'Double SHA3-512',
            },
            {
                name: 'doubleripemd160',
                value: 'Double RIPEMD-160',
            },
            {
                name: 'doublecshake256-1k',
                value: 'Double cSHAKE256 with 1024 bits',
            },
            {
                name: 'doublekmac256-1k',
                value: 'Double KMAC256 with 1024 bits',
            },
            {
                name: 'doubleshake128-1k',
                value: 'Double SHAKE128 with 1024 bits',
            },
            {
                name: 'doublecshake128-1k',
                value: 'Double cSHAKE128 with 1024 bits',
            },
            {
                name: 'doublekmac128-1k',
                value: 'Double KMAC128 with 1024 bits',
            },
            {
                name: 'doublesha512',
                value: 'Double SHA512'
            },
            {
                name: 'doublekeccak512',
                value: 'Double Keccak-512'
            },
            {
                name: 'doubleshake256-512',
                value: 'Double SHAKE256 with 512 bits'
            },
            {
                name: 'doublecshake256-512',
                value: 'Double cSHAKE256 with 512 bits',
            },
            {
                name: 'doublekmac256-512',
                value: 'Double KMAC256 with 512 bits',
            },
            {
                name: 'doubleshake128-512',
                value: 'Double SHAKE128 with 512 bits',
            },
            {
                name: 'doublecshake128-512',
                value: 'Double cSHAKE128 with 512 bits',
            },
            {
                name: 'doublekmac128-512',
                value: 'Double KMAC128 with 512 bits',
            },
            {
                name: 'doublesha384',
                value: 'Double SHA384',
            },
            {
                name: 'doublesha3-384',
                value: 'Double SHA3-384',
            },
            {
                name: 'doublekeccak384',
                value: 'Double Keccak-384',
            },
            {
                name: 'doubleshake256-384',
                value: 'Double SHAKE256 with 384 bits'
            },
            {
                name: 'doublecshake256-384',
                value: 'Double cSHAKE256 with 384 bits',
            },
            {
                name: 'doublekmac256-384',
                value: 'Double KMAC256 with 384 bits',
            },
            {
                name: 'doubleshake128-384',
                value: 'Double SHAKE128 with 384 bits',
            },
            {
                name: 'doublecshake128-384',
                value: 'Double cSHAKE128 with 384 bits',
            },
            {
                name: 'doublekmac128-384',
                value: 'Double KMAC128 with 384 bits',
            },
            {
                name: 'doubleshake256-320',
                value: 'Double SHAKE256 with 320 bits'
            },
            {
                name: 'doublecshake256-320',
                value: 'Double cSHAKE256 with 320 bits',
            },
            {
                name: 'doublekmac256-320',
                value: 'Double KMAC256 with 320 bits',
            },
            {
                name: 'doubleshake128-320',
                value: 'Double SHAKE128 with 320 bits',
            },
            {
                name: 'doublecshake128-320',
                value: 'Double cSHAKE128 with 320 bits',
            },
            {
                name: 'doublekmac128-320',
                value: 'Double KMAC128 with 320 bits',
            },
            {
                name: 'doubleripemd320',
                value: 'Double RIPEMD-320',
            },
            {
                name: 'doublesha512-256',
                value: 'Double SHA512/256',
            },
            {
                name: 'doublesha3-256',
                value: 'Double SHA3-256',
            },
            {
                name: 'doublekeccak256',
                value: 'Double Keccak-256',
            },
            {
                name: 'doubleshake256-256',
                value: 'Double SHAKE256 with 256 bits'
            },
            {
                name: 'doublecshake256-256',
                value: 'Double cSHAKE256 with 256 bits',
            },
            {
                name: 'doublekmac256-256',
                value: 'Double KMAC256 with 256 bits',
            },
            {
                name: 'doubleshake128-256',
                value: 'Double SHAKE128 with 256 bits',
            },
            {
                name: 'doublecshake128-256',
                value: 'Double cSHAKE128 with 256 bits',
            },
            {
                name: 'doublekmac128-256',
                value: 'Double KMAC128 with 256 bits',
            },
            {
                name: 'doubleripemd256',
                value: 'Double RIPEMD-256',
            },
            {
                name: 'doublesha224',
                value: 'Double SHA224',
            },
            {
                name: 'doublesha512-224',
                value: 'Double SHA512/224',
            },
            {
                name: 'doublesha3-224',
                value: 'Double SHA3-224',
            },
            {
                name: 'doublekeccak224',
                value: 'Double Keccak-224',
            },
            {
                name: 'doubleshake256-224',
                value: 'Double SHAKE256 with 224 bits'
            },
            {
                name: 'doublecshake256-224',
                value: 'Double cSHAKE256 with 224 bits',
            },
            {
                name: 'doublekmac256-224',
                value: 'Double KMAC256 with 224 bits',
            },
            {
                name: 'doubleshake128-224',
                value: 'Double SHAKE128 with 224 bits',
            },
            {
                name: 'doublecshake128-224',
                value: 'Double cSHAKE128 with 224 bits',
            },
            {
                name: 'doublekmac128-224',
                value: 'Double KMAC128 with 224 bits',
            },
            {
                name: 'doublesha1',
                value: 'Double SHA1',
            },
            {
                name: 'doubleshake256-160',
                value: 'Double SHAKE256 with 160 bits'
            },
            {
                name: 'doublecshake256-160',
                value: 'Double cSHAKE256 with 160 bits',
            },
            {
                name: 'doublekmac256-160',
                value: 'Double KMAC256 with 160 bits',
            },
            {
                name: 'doubleshake128-160',
                value: 'Double SHAKE128 with 160 bits',
            },
            {
                name: 'doublecshake128-160',
                value: 'Double cSHAKE128 with 160 bits',
            },
            {
                name: 'doublekmac128-160',
                value: 'Double KMAC128 with 160 bits',
            },
            {
                name: 'doubleripemd160',
                value: 'Double RIPEMD-160',
            },
            {
                name: 'doublemd2',
                value: 'Double MD2',
            },
            {
                name: 'doublemd4',
                value: 'Double MD4',
            },
            {
                name: 'doublemd5',
                value: 'Double MD5',
            },
            {
                name: 'doubleshake256-128',
                value: 'Double SHAKE256 with 128 bits'
            },
            {
                name: 'doublecshake256-128',
                value: 'Double cSHAKE256 with 128 bits',
            },
            {
                name: 'doublekmac256-128',
                value: 'Double KMAC256 with 128 bits',
            },
            {
                name: 'doubleshake128-128',
                value: 'Double SHAKE128 with 128 bits',
            },
            {
                name: 'doublecshake128-128',
                value: 'Double cSHAKE128 with 128 bits',
            },
            {
                name: 'doublekmac128-128',
                value: 'Double KMAC128 with 128 bits',
            },
            {
                name: 'doubleripemd128',
                value: 'Double RIPEMD-128',
            },
            {
                name: 'doublecrc32',
                value: 'Double CRC-32',
            },
            {
                name: 'doubleshake256-32',
                value: 'Double SHAKE256 with 32 bits'
            },
            {
                name: 'doublecshake256-32',
                value: 'Double cSHAKE256 with 32 bits',
            },
            {
                name: 'doublekmac256-32',
                value: 'Double KMAC256 with 32 bits',
            },
            {
                name: 'doubleshake128-32',
                value: 'Double SHAKE128 with 32 bits',
            },
            {
                name: 'doublecshake128-32',
                value: 'Double cSHAKE128 with 32 bits',
            },
            {
                name: 'doublekmac128-32',
                value: 'Double KMAC128 with 32 bits',
            },
            {
                name: 'doublecrc16',
                value: 'Double CRC-16',
            },
            {
                name: 'doubleshake256-16',
                value: 'Double SHAKE256 with 16 bits'
            },
            {
                name: 'doublecshake256-16',
                value: 'Double cSHAKE256 with 16 bits',
            },
            {
                name: 'doublekmac256-16',
                value: 'Double KMAC256 with 16 bits',
            },
            {
                name: 'doubleshake128-16',
                value: 'Double SHAKE128 with 16 bits',
            },
            {
                name: 'doublecshake128-16',
                value: 'Double cSHAKE128 with 16 bits',
            },
            {
                name: 'doublekmac128-16',
                value: 'Double KMAC128 with 16 bits',
            },
            {
                name: 'kalhash',
                value: 'Kalhash',
            },
            {
                name: 'doublekalhash',
                value: 'Double Kalhash',
            },
        ]
    });
    writeFileSync(`${os.homedir()}/.bsvutils/account.bsv`, JSON.stringify(answer));
}
