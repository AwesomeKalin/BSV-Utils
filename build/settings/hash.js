import checkbox from '@inquirer/checkbox';
import { writeFileSync } from 'fs';
import os from 'os';
export async function hashSettings() {
    const answer = await checkbox({
        message: 'Please select the hash algorithms you wish to use. If unsure, just leave the defaults',
        choices: [
            {
                value: 'shake256-1k',
                name: 'SHAKE256 with 1024 bits',
                checked: true,
            },
            {
                value: 'sha3-512',
                name: 'SHA3-512',
                checked: true,
            },
            {
                value: 'doublesha256',
                name: 'Double SHA256',
                checked: true,
            },
            {
                value: 'sha256',
                name: 'SHA256',
                checked: true,
            },
            {
                value: 'ripemd160',
                name: 'RIPEMD-160',
                checked: true,
            },
            {
                value: 'cshake256-1k',
                name: 'cSHAKE256 with 1024 bits',
            },
            {
                value: 'kmac256-1k',
                name: 'KMAC256 with 1024 bits',
            },
            {
                value: 'shake128-1k',
                name: 'SHAKE128 with 1024 bits',
            },
            {
                value: 'cshake128-1k',
                name: 'cSHAKE128 with 1024 bits',
            },
            {
                value: 'kmac128-1k',
                name: 'KMAC128 with 1024 bits',
            },
            {
                value: 'sha512',
                name: 'SHA512'
            },
            {
                value: 'keccak512',
                name: 'Keccak-512'
            },
            {
                value: 'shake256-512',
                name: 'SHAKE256 with 512 bits'
            },
            {
                value: 'cshake256-512',
                name: 'cSHAKE256 with 512 bits',
            },
            {
                value: 'kmac256-512',
                name: 'KMAC256 with 512 bits',
            },
            {
                value: 'shake128-512',
                name: 'SHAKE128 with 512 bits',
            },
            {
                value: 'cshake128-512',
                name: 'cSHAKE128 with 512 bits',
            },
            {
                value: 'kmac128-512',
                name: 'KMAC128 with 512 bits',
            },
            {
                value: 'sha384',
                name: 'SHA384',
            },
            {
                value: 'sha3-384',
                name: 'SHA3-384',
            },
            {
                value: 'keccak384',
                name: 'Keccak-384',
            },
            {
                value: 'shake256-384',
                name: 'SHAKE256 with 384 bits'
            },
            {
                value: 'cshake256-384',
                name: 'cSHAKE256 with 384 bits',
            },
            {
                value: 'kmac256-384',
                name: 'KMAC256 with 384 bits',
            },
            {
                value: 'shake128-384',
                name: 'SHAKE128 with 384 bits',
            },
            {
                value: 'cshake128-384',
                name: 'cSHAKE128 with 384 bits',
            },
            {
                value: 'kmac128-384',
                name: 'KMAC128 with 384 bits',
            },
            {
                value: 'shake256-320',
                name: 'SHAKE256 with 320 bits'
            },
            {
                value: 'cshake256-320',
                name: 'cSHAKE256 with 320 bits',
            },
            {
                value: 'kmac256-320',
                name: 'KMAC256 with 320 bits',
            },
            {
                value: 'shake128-320',
                name: 'SHAKE128 with 320 bits',
            },
            {
                value: 'cshake128-320',
                name: 'cSHAKE128 with 320 bits',
            },
            {
                value: 'kmac128-320',
                name: 'KMAC128 with 320 bits',
            },
            {
                value: 'ripemd320',
                name: 'RIPEMD-320',
            },
            {
                value: 'sha512-256',
                name: 'SHA512/256',
            },
            {
                value: 'sha3-256',
                name: 'SHA3-256',
            },
            {
                value: 'keccak256',
                name: 'Keccak-256',
            },
            {
                value: 'shake256-256',
                name: 'SHAKE256 with 256 bits'
            },
            {
                value: 'cshake256-256',
                name: 'cSHAKE256 with 256 bits',
            },
            {
                value: 'kmac256-256',
                name: 'KMAC256 with 256 bits',
            },
            {
                value: 'shake128-256',
                name: 'SHAKE128 with 256 bits',
            },
            {
                value: 'cshake128-256',
                name: 'cSHAKE128 with 256 bits',
            },
            {
                value: 'kmac128-256',
                name: 'KMAC128 with 256 bits',
            },
            {
                value: 'ripemd256',
                name: 'RIPEMD-256',
            },
            {
                value: 'sha224',
                name: 'SHA224',
            },
            {
                value: 'sha512-224',
                name: 'SHA512/224',
            },
            {
                value: 'sha3-224',
                name: 'SHA3-224',
            },
            {
                value: 'keccak224',
                name: 'Keccak-224',
            },
            {
                value: 'shake256-224',
                name: 'SHAKE256 with 224 bits'
            },
            {
                value: 'cshake256-224',
                name: 'cSHAKE256 with 224 bits',
            },
            {
                value: 'kmac256-224',
                name: 'KMAC256 with 224 bits',
            },
            {
                value: 'shake128-224',
                name: 'SHAKE128 with 224 bits',
            },
            {
                value: 'cshake128-224',
                name: 'cSHAKE128 with 224 bits',
            },
            {
                value: 'kmac128-224',
                name: 'KMAC128 with 224 bits',
            },
            {
                value: 'sha1',
                name: 'SHA1',
            },
            {
                value: 'shake256-160',
                name: 'SHAKE256 with 160 bits'
            },
            {
                value: 'cshake256-160',
                name: 'cSHAKE256 with 160 bits',
            },
            {
                value: 'kmac256-160',
                name: 'KMAC256 with 160 bits',
            },
            {
                value: 'shake128-160',
                name: 'SHAKE128 with 160 bits',
            },
            {
                value: 'cshake128-160',
                name: 'cSHAKE128 with 160 bits',
            },
            {
                value: 'kmac128-160',
                name: 'KMAC128 with 160 bits',
            },
            {
                value: 'ripemd160',
                name: 'RIPEMD-160',
            },
            {
                value: 'md2',
                name: 'MD2',
            },
            {
                value: 'md4',
                name: 'MD4',
            },
            {
                value: 'md5',
                name: 'MD5',
            },
            {
                value: 'shake256-128',
                name: 'SHAKE256 with 128 bits'
            },
            {
                value: 'cshake256-128',
                name: 'cSHAKE256 with 128 bits',
            },
            {
                value: 'kmac256-128',
                name: 'KMAC256 with 128 bits',
            },
            {
                value: 'shake128-128',
                name: 'SHAKE128 with 128 bits',
            },
            {
                value: 'cshake128-128',
                name: 'cSHAKE128 with 128 bits',
            },
            {
                value: 'kmac128-128',
                name: 'KMAC128 with 128 bits',
            },
            {
                value: 'ripemd128',
                name: 'RIPEMD-128',
            },
            {
                value: 'crc32',
                name: 'CRC-32',
            },
            {
                value: 'shake256-32',
                name: 'SHAKE256 with 32 bits'
            },
            {
                value: 'cshake256-32',
                name: 'cSHAKE256 with 32 bits',
            },
            {
                value: 'kmac256-32',
                name: 'KMAC256 with 32 bits',
            },
            {
                value: 'shake128-32',
                name: 'SHAKE128 with 32 bits',
            },
            {
                value: 'cshake128-32',
                name: 'cSHAKE128 with 32 bits',
            },
            {
                value: 'kmac128-32',
                name: 'KMAC128 with 32 bits',
            },
            {
                value: 'crc16',
                name: 'CRC-16',
            },
            {
                value: 'shake256-16',
                name: 'SHAKE256 with 16 bits'
            },
            {
                value: 'cshake256-16',
                name: 'cSHAKE256 with 16 bits',
            },
            {
                value: 'kmac256-16',
                name: 'KMAC256 with 16 bits',
            },
            {
                value: 'shake128-16',
                name: 'SHAKE128 with 16 bits',
            },
            {
                value: 'cshake128-16',
                name: 'cSHAKE128 with 16 bits',
            },
            {
                value: 'kmac128-16',
                name: 'KMAC128 with 16 bits',
            },
            {
                value: 'doubleshake256-1k',
                name: 'Double SHAKE256 with 1024 bits',
            },
            {
                value: 'doublesha3-512',
                name: 'Double SHA3-512',
            },
            {
                value: 'doubleripemd160',
                name: 'Double RIPEMD-160',
            },
            {
                value: 'doublecshake256-1k',
                name: 'Double cSHAKE256 with 1024 bits',
            },
            {
                value: 'doublekmac256-1k',
                name: 'Double KMAC256 with 1024 bits',
            },
            {
                value: 'doubleshake128-1k',
                name: 'Double SHAKE128 with 1024 bits',
            },
            {
                value: 'doublecshake128-1k',
                name: 'Double cSHAKE128 with 1024 bits',
            },
            {
                value: 'doublekmac128-1k',
                name: 'Double KMAC128 with 1024 bits',
            },
            {
                value: 'doublesha512',
                name: 'Double SHA512'
            },
            {
                value: 'doublekeccak512',
                name: 'Double Keccak-512'
            },
            {
                value: 'doubleshake256-512',
                name: 'Double SHAKE256 with 512 bits'
            },
            {
                value: 'doublecshake256-512',
                name: 'Double cSHAKE256 with 512 bits',
            },
            {
                value: 'doublekmac256-512',
                name: 'Double KMAC256 with 512 bits',
            },
            {
                value: 'doubleshake128-512',
                name: 'Double SHAKE128 with 512 bits',
            },
            {
                value: 'doublecshake128-512',
                name: 'Double cSHAKE128 with 512 bits',
            },
            {
                value: 'doublekmac128-512',
                name: 'Double KMAC128 with 512 bits',
            },
            {
                value: 'doublesha384',
                name: 'Double SHA384',
            },
            {
                value: 'doublesha3-384',
                name: 'Double SHA3-384',
            },
            {
                value: 'doublekeccak384',
                name: 'Double Keccak-384',
            },
            {
                value: 'doubleshake256-384',
                name: 'Double SHAKE256 with 384 bits'
            },
            {
                value: 'doublecshake256-384',
                name: 'Double cSHAKE256 with 384 bits',
            },
            {
                value: 'doublekmac256-384',
                name: 'Double KMAC256 with 384 bits',
            },
            {
                value: 'doubleshake128-384',
                name: 'Double SHAKE128 with 384 bits',
            },
            {
                value: 'doublecshake128-384',
                name: 'Double cSHAKE128 with 384 bits',
            },
            {
                value: 'doublekmac128-384',
                name: 'Double KMAC128 with 384 bits',
            },
            {
                value: 'doubleshake256-320',
                name: 'Double SHAKE256 with 320 bits'
            },
            {
                value: 'doublecshake256-320',
                name: 'Double cSHAKE256 with 320 bits',
            },
            {
                value: 'doublekmac256-320',
                name: 'Double KMAC256 with 320 bits',
            },
            {
                value: 'doubleshake128-320',
                name: 'Double SHAKE128 with 320 bits',
            },
            {
                value: 'doublecshake128-320',
                name: 'Double cSHAKE128 with 320 bits',
            },
            {
                value: 'doublekmac128-320',
                name: 'Double KMAC128 with 320 bits',
            },
            {
                value: 'doubleripemd320',
                name: 'Double RIPEMD-320',
            },
            {
                value: 'doublesha512-256',
                name: 'Double SHA512/256',
            },
            {
                value: 'doublesha3-256',
                name: 'Double SHA3-256',
            },
            {
                value: 'doublekeccak256',
                name: 'Double Keccak-256',
            },
            {
                value: 'doubleshake256-256',
                name: 'Double SHAKE256 with 256 bits'
            },
            {
                value: 'doublecshake256-256',
                name: 'Double cSHAKE256 with 256 bits',
            },
            {
                value: 'doublekmac256-256',
                name: 'Double KMAC256 with 256 bits',
            },
            {
                value: 'doubleshake128-256',
                name: 'Double SHAKE128 with 256 bits',
            },
            {
                value: 'doublecshake128-256',
                name: 'Double cSHAKE128 with 256 bits',
            },
            {
                value: 'doublekmac128-256',
                name: 'Double KMAC128 with 256 bits',
            },
            {
                value: 'doubleripemd256',
                name: 'Double RIPEMD-256',
            },
            {
                value: 'doublesha224',
                name: 'Double SHA224',
            },
            {
                value: 'doublesha512-224',
                name: 'Double SHA512/224',
            },
            {
                value: 'doublesha3-224',
                name: 'Double SHA3-224',
            },
            {
                value: 'doublekeccak224',
                name: 'Double Keccak-224',
            },
            {
                value: 'doubleshake256-224',
                name: 'Double SHAKE256 with 224 bits'
            },
            {
                value: 'doublecshake256-224',
                name: 'Double cSHAKE256 with 224 bits',
            },
            {
                value: 'doublekmac256-224',
                name: 'Double KMAC256 with 224 bits',
            },
            {
                value: 'doubleshake128-224',
                name: 'Double SHAKE128 with 224 bits',
            },
            {
                value: 'doublecshake128-224',
                name: 'Double cSHAKE128 with 224 bits',
            },
            {
                value: 'doublekmac128-224',
                name: 'Double KMAC128 with 224 bits',
            },
            {
                value: 'doublesha1',
                name: 'Double SHA1',
            },
            {
                value: 'doubleshake256-160',
                name: 'Double SHAKE256 with 160 bits'
            },
            {
                value: 'doublecshake256-160',
                name: 'Double cSHAKE256 with 160 bits',
            },
            {
                value: 'doublekmac256-160',
                name: 'Double KMAC256 with 160 bits',
            },
            {
                value: 'doubleshake128-160',
                name: 'Double SHAKE128 with 160 bits',
            },
            {
                value: 'doublecshake128-160',
                name: 'Double cSHAKE128 with 160 bits',
            },
            {
                value: 'doublekmac128-160',
                name: 'Double KMAC128 with 160 bits',
            },
            {
                value: 'doubleripemd160',
                name: 'Double RIPEMD-160',
            },
            {
                value: 'doublemd2',
                name: 'Double MD2',
            },
            {
                value: 'doublemd4',
                name: 'Double MD4',
            },
            {
                value: 'doublemd5',
                name: 'Double MD5',
            },
            {
                value: 'doubleshake256-128',
                name: 'Double SHAKE256 with 128 bits'
            },
            {
                value: 'doublecshake256-128',
                name: 'Double cSHAKE256 with 128 bits',
            },
            {
                value: 'doublekmac256-128',
                name: 'Double KMAC256 with 128 bits',
            },
            {
                value: 'doubleshake128-128',
                name: 'Double SHAKE128 with 128 bits',
            },
            {
                value: 'doublecshake128-128',
                name: 'Double cSHAKE128 with 128 bits',
            },
            {
                value: 'doublekmac128-128',
                name: 'Double KMAC128 with 128 bits',
            },
            {
                value: 'doubleripemd128',
                name: 'Double RIPEMD-128',
            },
            {
                value: 'doublecrc32',
                name: 'Double CRC-32',
            },
            {
                value: 'doubleshake256-32',
                name: 'Double SHAKE256 with 32 bits'
            },
            {
                value: 'doublecshake256-32',
                name: 'Double cSHAKE256 with 32 bits',
            },
            {
                value: 'doublekmac256-32',
                name: 'Double KMAC256 with 32 bits',
            },
            {
                value: 'doubleshake128-32',
                name: 'Double SHAKE128 with 32 bits',
            },
            {
                value: 'doublecshake128-32',
                name: 'Double cSHAKE128 with 32 bits',
            },
            {
                value: 'doublekmac128-32',
                name: 'Double KMAC128 with 32 bits',
            },
            {
                value: 'doublecrc16',
                name: 'Double CRC-16',
            },
            {
                value: 'doubleshake256-16',
                name: 'Double SHAKE256 with 16 bits'
            },
            {
                value: 'doublecshake256-16',
                name: 'Double cSHAKE256 with 16 bits',
            },
            {
                value: 'doublekmac256-16',
                name: 'Double KMAC256 with 16 bits',
            },
            {
                value: 'doubleshake128-16',
                name: 'Double SHAKE128 with 16 bits',
            },
            {
                value: 'doublecshake128-16',
                name: 'Double cSHAKE128 with 16 bits',
            },
            {
                value: 'doublekmac128-16',
                name: 'Double KMAC128 with 16 bits',
            },
            {
                value: 'kalhash',
                name: 'Kalhash',
            },
            {
                value: 'doublekalhash',
                name: 'Double Kalhash',
            },
        ]
    });
    writeFileSync(`${os.homedir()}/.bsvutils/hash.bsv`, JSON.stringify(answer));
}
