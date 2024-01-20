import { createHash } from "crypto";
import { readFileSync } from "fs";
import os from 'os';
import { cshake128, cshake256, keccak224, keccak256, keccak384, keccak512, kmac128, kmac256, shake128, shake256 } from 'js-sha3';
import md2 from 'js-md2';
import md4 from 'js-md4';
import crc from 'js-crc';
import kalhash from 'kalhash.js';

var crc16 = crc.crc16;
var crc32 = crc.crc32;

export function hash(file: Buffer) {
    const hashFunctions: string[] = JSON.parse(readFileSync(`${os.homedir()}/.bsvutils/hash.bsv`).toString());
    let hashList: { shake256_1k: string; sha3_512: string; sha256: string; doublesha256: string; ripemd160: string; cshake256_1k: string; kmac256_1k: string; shake128_1k: string; cshake128_1k: string; kmac128_1k: string; sha512: string; keccak512: string; shake256_512: string; cshake256_512: string; kmac256_512: string; shake128_512: string; cshake128_512: string; kmac128_512: string; sha384: string; sha3_384: string; keccak384: string; shake256_384: string; cshake256_384: string; kmac256_384: string; shake128_384: string; cshake128_384: string; kmac128_384: string; shake256_320: string; cshake256_320: string; kmac256_320: string; shake128_320: string; cshake128_320: string; kmac128_320: string; ripemd320: string; sha512_256: string; sha3_256: string; keccak256: string; shake256_256: string; cshake256_256: string; kmac256_256: string; shake128_256: string; cshake128_256: string; kmac128_256: string; ripemd256: string; sha224: string; sha512_224: string; sha3_224: string; keccak224: string; shake256_224: string; cshake256_224: string; kmac256_224: string; shake128_224: string; cshake128_224: string; kmac128_224: string; sha1: string; shake256_160: string; cshake256_160: string; kmac256_160: string; shake128_160: string; cshake128_160: string; kmac128_160: string; md2: any; md4: any; md5: string; shake256_128: string; cshake256_128: string; kmac256_128: string; shake128_128: string; cshake128_128: string; kmac128_128: string; ripemd128: string; crc32: string; shake256_32: string; cshake256_32: string; kmac256_32: string; shake128_32: string; cshake128_32: string; kmac128_32: string; crc16: string; shake256_16: string; cshake256_16: string; kmac256_16: string; shake128_16: string; cshake128_16: string; kmac128_16: string; doubleshake256_1k: string; doublesha3_512: string; doubleripemd160: string; doublecshake256_1k: string; doublekmac256_1k: string; doubleshake128_1k: string; doublecshake128_1k: string; doublekmac128_1k: string; doublesha512: string; doublekeccak512: string; doubleshake256_512: string; doublecshake256_512: string; doublekmac256_512: string; doubleshake128_512: string; doublecshake128_512: string; doublekmac128_512: string; doublesha384: string; doublesha3_384: string; doublekeccak384: string; doubleshake256_384: string; doublecshake256_384: string; doublekmac256_384: string; doubleshake128_384: string; doublecshake128_384: string; doublekmac128_384: string; doubleshake256_320: string; doublecshake256_320: string; doublekmac256_320: string; doubleshake128_320: string; doublecshake128_320: string; doublekmac128_320: string; doubleripemd320: string; doublesha512_256: string; doublesha3_256: string; doublekeccak256: string; doubleshake256_256: string; doublecshake256_256: string; doublekmac256_256: string; doubleshake128_256: string; doublecshake128_256: string; doublekmac128_256: string; doubleripemd256: string; doublesha224: string; doublesha512_224: string; doublesha3_224: string; doublekeccak224: string; doubleshake256_224: string; doublecshake256_224: string; doublekmac256_224: string; doubleshake128_224: string; doublecshake128_224: string; doublekmac128_224: string; doublesha1: string; doubleshake256_160: string; doublecshake256_160: string; doublekmac256_160: string; doubleshake128_160: string; doublecshake128_160: string; doublekmac128_160: string; doublemd2: any; doublemd4: any; doublemd5: string; doubleshake256_128: string; doublecshake256_128: string; doublekmac256_128: string; doubleshake128_128: string; doublecshake128_128: string; doublekmac128_128: string; doubleripemd128: string; doublecrc32: string; doubleshake256_32: string; doublecshake256_32: string; doublekmac256_32: string; doubleshake128_32: string; doublecshake128_32: string; doublekmac128_32: string; doublecrc16: string; doubleshake256_16: string; doublecshake256_16: string; doublekmac256_16: string; doubleshake128_16: string; doublecshake128_16: string; doublekmac128_16: string; kalhash: any; doublekalhash: any; };

    if (hashFunctions.includes('shake256-1k')) {
        const hash = createHash('shake256', { outputLength: 128 });
        hash.update(file);

        hashList.shake256_1k = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha3-512')) {
        const hash = createHash('sha3-512');
        hash.update(file);

        hashList.sha3_512 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha256')) {
        const hash = createHash('sha256');
        hash.update(file);

        hashList.sha256 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha256')) {
        const hash = createHash('sha256');
        hash.update(file);

        const hash2 = createHash('sha256');
        hash2.update(hash.copy().digest('hex'));

        hashList.doublesha256 = hash2.copy().digest('hex');
    }

    if (hashFunctions.includes('ripemd160')) {
        const hash = createHash('ripemd160');
        hash.update(file);

        hashList.ripemd160 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('cshake256-1k')) {
        hashList.cshake256_1k = cshake256(file, 1024, '', '');
    }

    if (hashFunctions.includes('kmac256-1k')) {
        hashList.kmac256_1k = kmac256('', file, 1024, '');
    }

    if (hashFunctions.includes('shake128-1k')) {
        hashList.shake128_1k = shake128(file, 1024);
    }

    if (hashFunctions.includes('cshake128-1k')) {
        hashList.cshake128_1k = cshake128(file, 1024, '', '');
    }

    if (hashFunctions.includes('kmac128-1k')) {
        hashList.kmac128_1k = kmac128('', file, 1024, '');
    }

    if (hashFunctions.includes('sha512')) {
        const hash = createHash('sha512');
        hash.update(file);

        hashList.sha512 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('keccak512')) {
        hashList.keccak512 = keccak512(file);
    }

    if (hashFunctions.includes('shake256-512')) {
        hashList.shake256_512 = shake256(file, 512);
    }

    if (hashFunctions.includes('cshake256-512')) {
        hashList.cshake256_512 = cshake256(file, 512, '', '');
    }

    if (hashFunctions.includes('kmac256-512')) {
        hashList.kmac256_512 = kmac256('', file, 512, '');
    }

    if (hashFunctions.includes('shake128-512')) {
        hashList.shake128_512 = shake128(file, 512);
    }

    if (hashFunctions.includes('cshake128-512')) {
        hashList.cshake128_512 = cshake128(file, 512, '', '');
    }

    if (hashFunctions.includes('kmac128-512')) {
        hashList.kmac128_512 = kmac128('', file, 512, '');
    }

    if (hashFunctions.includes('sha384')) {
        const hash = createHash('sha384');
        hash.update(file);

        hashList.sha384 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha3-384')) {
        const hash = createHash('sha3-384');
        hash.update(file);

        hashList.sha3_384 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('keccak384')) {
        hashList.keccak384 = keccak384(file);
    }

    if (hashFunctions.includes('shake256-384')) {
        hashList.shake256_384 = shake256(file, 384);
    }

    if (hashFunctions.includes('cshake256-384')) {
        hashList.cshake256_384 = cshake256(file, 384, '', '');
    }

    if (hashFunctions.includes('kmac256-384')) {
        hashList.kmac256_384 = kmac256('', file, 384, '');
    }

    if (hashFunctions.includes('shake128-384')) {
        hashList.shake128_384 = shake128(file, 384);
    }

    if (hashFunctions.includes('cshake128-384')) {
        hashList.cshake128_384 = cshake128(file, 384, '', '');
    }

    if (hashFunctions.includes('kmac128-384')) {
        hashList.kmac128_384 = kmac128('', file, 384, '');
    }

    if (hashFunctions.includes('shake256-320')) {
        hashList.shake256_320 = shake256(file, 320);
    }

    if (hashFunctions.includes('cshake256-320')) {
        hashList.cshake256_320 = cshake256(file, 320, '', '');
    }

    if (hashFunctions.includes('kmac256-320')) {
        hashList.kmac256_320 = kmac256('', file, 320, '');
    }

    if (hashFunctions.includes('shake128-320')) {
        hashList.shake128_320 = shake128(file, 320);
    }

    if (hashFunctions.includes('cshake128-320')) {
        hashList.cshake128_320 = cshake128(file, 320, '', '');
    }

    if (hashFunctions.includes('kmac128-320')) {
        hashList.kmac128_320 = kmac128('', file, 320, '');
    }

    if (hashFunctions.includes('ripemd320')) {
        const hash = createHash('ripemd', { outputLength: 40 });
        hash.update(file);

        hashList.ripemd320 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha512-256')) {
        const hash = createHash('sha512-256');
        hash.update(file);

        hashList.sha512_256 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha3-256')) {
        const hash = createHash('sha3-256');
        hash.update(file);

        hashList.sha3_256 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('keccak256')) {
        hashList.keccak256 = keccak256(file);
    }

    if (hashFunctions.includes('shake256-256')) {
        hashList.shake256_256 = shake256(file, 256);
    }

    if (hashFunctions.includes('cshake256-256')) {
        hashList.cshake256_256 = cshake256(file, 256, '', '');
    }

    if (hashFunctions.includes('kmac256-256')) {
        hashList.kmac256_256 = kmac256('', file, 256, '');
    }

    if (hashFunctions.includes('shake128-256')) {
        hashList.shake128_256 = shake128(file, 256);
    }

    if (hashFunctions.includes('cshake128-256')) {
        hashList.cshake128_256 = cshake128(file, 256, '', '');
    }

    if (hashFunctions.includes('kmac128-256')) {
        hashList.kmac128_256 = kmac128('', file, 256, '');
    }

    if (hashFunctions.includes('ripemd256')) {
        const hash = createHash('ripemd', { outputLength: 32 });
        hash.update(file);

        hashList.ripemd256 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha224')) {
        const hash = createHash('sha224');
        hash.update(file);

        hashList.sha224 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha512-224')) {
        const hash = createHash('sha512-224');
        hash.update(file);

        hashList.sha512_224 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('sha3-224')) {
        const hash = createHash('sha3-224');
        hash.update(file);

        hashList.sha3_224 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('keccak224')) {
        hashList.keccak224 = keccak224(file);
    }

    if (hashFunctions.includes('shake256-224')) {
        hashList.shake256_224 = shake256(file, 224);
    }

    if (hashFunctions.includes('cshake256-224')) {
        hashList.cshake256_224 = cshake256(file, 224, '', '');
    }

    if (hashFunctions.includes('kmac256-224')) {
        hashList.kmac256_224 = kmac256('', file, 224, '');
    }

    if (hashFunctions.includes('shake128-224')) {
        hashList.shake128_224 = shake128(file, 224);
    }

    if (hashFunctions.includes('cshake128-224')) {
        hashList.cshake128_224 = cshake128(file, 224, '', '');
    }

    if (hashFunctions.includes('kmac128-224')) {
        hashList.kmac128_224 = kmac128('', file, 224, '');
    }

    if (hashFunctions.includes('sha1')) {
        const hash = createHash('sha1');
        hash.update(file);

        hashList.sha1 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('shake256-160')) {
        hashList.shake256_160 = shake256(file, 160);
    }

    if (hashFunctions.includes('cshake256-160')) {
        hashList.cshake256_160 = cshake256(file, 160, '', '');
    }

    if (hashFunctions.includes('kmac256-160')) {
        hashList.kmac256_160 = kmac256('', file, 160, '');
    }

    if (hashFunctions.includes('shake128-160')) {
        hashList.shake128_160 = shake128(file, 160);
    }

    if (hashFunctions.includes('cshake128-160')) {
        hashList.cshake128_160 = cshake128(file, 160, '', '');
    }

    if (hashFunctions.includes('kmac128-160')) {
        hashList.kmac128_160 = kmac128('', file, 160, '');
    }

    if (hashFunctions.includes('md2')) {
        hashList.md2 = md2(file);
    }

    if (hashFunctions.includes('md4')) {
        hashList.md4 = md4(file);
    }

    if (hashFunctions.includes('md5')) {
        const hash = createHash('md5');
        hash.update(file);

        hashList.md5 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('shake256-128')) {
        hashList.shake256_128 = shake256(file, 128);
    }

    if (hashFunctions.includes('cshake256-128')) {
        hashList.cshake256_128 = cshake256(file, 128, '', '');
    }

    if (hashFunctions.includes('kmac256-128')) {
        hashList.kmac256_128 = kmac256('', file, 128, '');
    }

    if (hashFunctions.includes('shake128-128')) {
        hashList.shake128_128 = shake128(file, 128);
    }

    if (hashFunctions.includes('cshake128-128')) {
        hashList.cshake128_128 = cshake128(file, 128, '', '');
    }

    if (hashFunctions.includes('kmac128-128')) {
        hashList.kmac128_128 = kmac128('', file, 128, '');
    }

    if (hashFunctions.includes('ripemd128')) {
        const hash = createHash('ripemd', { outputLength: 16 });
        hash.update(file);

        hashList.ripemd128 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('crc32')) {
        hashList.crc32 = crc32(file);
    }

    if (hashFunctions.includes('shake256-32')) {
        hashList.shake256_32 = shake256(file, 32);
    }

    if (hashFunctions.includes('cshake256-32')) {
        hashList.cshake256_32 = cshake256(file, 32, '', '');
    }

    if (hashFunctions.includes('kmac256-32')) {
        hashList.kmac256_32 = kmac256('', file, 32, '');
    }

    if (hashFunctions.includes('shake128-32')) {
        hashList.shake128_32 = shake128(file, 32);
    }

    if (hashFunctions.includes('cshake128-32')) {
        hashList.cshake128_32 = cshake128(file, 32, '', '');
    }

    if (hashFunctions.includes('kmac128-32')) {
        hashList.kmac128_32 = kmac128('', file, 32, '');
    }

    if (hashFunctions.includes('crc16')) {
        hashList.crc16 = crc16(file);
    }

    if (hashFunctions.includes('shake256-16')) {
        hashList.shake256_16 = shake256(file, 16);
    }

    if (hashFunctions.includes('cshake256-16')) {
        hashList.cshake256_16 = cshake256(file, 16, '', '');
    }

    if (hashFunctions.includes('kmac256-16')) {
        hashList.kmac256_16 = kmac256('', file, 16, '');
    }

    if (hashFunctions.includes('shake128-16')) {
        hashList.shake128_16 = shake128(file, 16);
    }

    if (hashFunctions.includes('cshake128-16')) {
        hashList.cshake128_16 = cshake128(file, 16, '', '');
    }

    if (hashFunctions.includes('kmac128-16')) {
        hashList.kmac128_16 = kmac128('', file, 16, '');
    }

    if (hashFunctions.includes('doubleshake256-1k')) {
        const hash1 = createHash('shake256', { outputLength: 128 });
        hash1.update(file);

        const hash = createHash('shake256', { outputLength: 128 });
        hash.update(hash1.copy().digest('hex'));

        hashList.doubleshake256_1k = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha3-512')) {
        const hash1 = createHash('sha3-512');
        hash1.update(file);

        const hash = createHash('sha3-512');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha3_512 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doubleripemd160')) {
        const hash1 = createHash('ripemd160');
        hash1.update(file);

        const hash = createHash('ripemd160');
        hash.update(hash1.copy().digest('hex'));

        hashList.doubleripemd160 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublecshake256-1k')) {
        hashList.doublecshake256_1k = cshake256(cshake256(file, 1024, '', ''), 1024, '', '');
    }

    if (hashFunctions.includes('doublekmac256-1k')) {
        hashList.doublekmac256_1k = kmac256('', kmac256('', file, 1024, ''), 1024, '');
    }

    if (hashFunctions.includes('doubleshake128-1k')) {
        hashList.doubleshake128_1k = shake128(shake128(file, 1024), 1024);
    }

    if (hashFunctions.includes('doublecshake128-1k')) {
        hashList.doublecshake128_1k = cshake128(cshake128(file, 1024, '', ''), 1024, '', '');
    }

    if (hashFunctions.includes('doublekmac128-1k')) {
        hashList.doublekmac128_1k = kmac128('', kmac128('', file, 1024, ''), 1024, '');
    }

    if (hashFunctions.includes('doublesha512')) {
        const hash1 = createHash('sha512');
        hash1.update(file);

        const hash = createHash('doublesha512');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha512 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublekeccak512')) {
        hashList.doublekeccak512 = keccak512(keccak512(file));
    }

    if (hashFunctions.includes('doubleshake256-512')) {
        hashList.doubleshake256_512 = shake256(shake256(file, 512), 512);
    }

    if (hashFunctions.includes('doublecshake256-512')) {
        hashList.doublecshake256_512 = cshake256(cshake256(file, 512, '', ''), 512, '', '');
    }

    if (hashFunctions.includes('doublekmac256-512')) {
        hashList.doublekmac256_512 = kmac256('', kmac256('', file, 512, ''), 512, '');
    }

    if (hashFunctions.includes('doubleshake128-512')) {
        hashList.doubleshake128_512 = shake128(shake128(file, 512), 512);
    }

    if (hashFunctions.includes('doublecshake128-512')) {
        hashList.doublecshake128_512 = cshake128(cshake128(file, 512, '', ''), 512, '', '');
    }

    if (hashFunctions.includes('doublekmac128-512')) {
        hashList.doublekmac128_512 = kmac128('', kmac128('', file, 512, ''), 512, '');
    }

    if (hashFunctions.includes('doublesha384')) {
        const hash1 = createHash('sha384');
        hash1.update(file);

        const hash = createHash('sha384');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha384 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha3-384')) {
        const hash1 = createHash('sha3-384');
        hash1.update(file);

        const hash = createHash('sha3-384');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha3_384 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublekeccak384')) {
        hashList.doublekeccak384 = keccak384(keccak384(file));
    }

    if (hashFunctions.includes('doubleshake256-384')) {
        hashList.doubleshake256_384 = shake256(shake256(file, 384), 384);
    }

    if (hashFunctions.includes('doublecshake256-384')) {
        hashList.doublecshake256_384 = cshake256(cshake256(file, 384, '', ''), 384, '', '');
    }

    if (hashFunctions.includes('doublekmac256-384')) {
        hashList.doublekmac256_384 = kmac256('', kmac256('', file, 384, ''), 384, '');
    }

    if (hashFunctions.includes('doubleshake128-384')) {
        hashList.doubleshake128_384 = shake128(shake128(file, 384), 384);
    }

    if (hashFunctions.includes('doublecshake128-384')) {
        hashList.doublecshake128_384 = cshake128(cshake128(file, 384, '', ''), 384, '', '');
    }

    if (hashFunctions.includes('doublekmac128-384')) {
        hashList.doublekmac128_384 = kmac128('', kmac128('', file, 384, ''), 384, '');
    }

    if (hashFunctions.includes('doubleshake256-320')) {
        hashList.doubleshake256_320 = shake256(shake256(file, 320), 320);
    }

    if (hashFunctions.includes('doublecshake256-320')) {
        hashList.doublecshake256_320 = cshake256(cshake256(file, 320, '', ''), 320, '', '');
    }

    if (hashFunctions.includes('doublekmac256-320')) {
        hashList.doublekmac256_320 = kmac256('', kmac256('', file, 320, ''), 320, '');
    }

    if (hashFunctions.includes('doubleshake128-320')) {
        hashList.doubleshake128_320 = shake128(shake128(file, 320), 320);
    }

    if (hashFunctions.includes('doublecshake128-320')) {
        hashList.doublecshake128_320 = cshake128(cshake128(file, 320, '', ''), 320, '', '');
    }

    if (hashFunctions.includes('doublekmac128-320')) {
        hashList.doublekmac128_320 = kmac128('', kmac128('', file, 320, ''), 320, '');
    }

    if (hashFunctions.includes('doubleripemd320')) {
        const hash1 = createHash('ripemd', { outputLength: 40 });
        hash1.update(file);

        const hash = createHash('ripemd', { outputLength: 40 });
        hash.update(hash1.copy().digest('hex'));

        hashList.doubleripemd320 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha512-256')) {
        const hash1 = createHash('sha512-256');
        hash1.update(file);

        const hash = createHash('sha512-256');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha512_256 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha3-256')) {
        const hash1 = createHash('sha3-256');
        hash1.update(file);

        const hash = createHash('sha3-256');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha3_256 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublekeccak256')) {
        hashList.doublekeccak256 = keccak256(keccak256(file));
    }

    if (hashFunctions.includes('doubleshake256-256')) {
        hashList.doubleshake256_256 = shake256(shake256(file, 256), 256);
    }

    if (hashFunctions.includes('doublecshake256-256')) {
        hashList.doublecshake256_256 = cshake256(cshake256(file, 256, '', ''), 256, '', '');
    }

    if (hashFunctions.includes('doublekmac256-256')) {
        hashList.doublekmac256_256 = kmac256('', kmac256('', file, 256, ''), 256, '');
    }

    if (hashFunctions.includes('doubleshake128-256')) {
        hashList.doubleshake128_256 = shake128(shake128(file, 256), 256);
    }

    if (hashFunctions.includes('doublecshake128-256')) {
        hashList.doublecshake128_256 = cshake128(cshake128(file, 256, '', ''), 256, '', '');
    }

    if (hashFunctions.includes('doublekmac128-256')) {
        hashList.doublekmac128_256 = kmac128('', kmac128('', file, 256, ''), 256, '');
    }

    if (hashFunctions.includes('doubleripemd256')) {
        const hash1 = createHash('ripemd', { outputLength: 32 });
        hash1.update(file);

        const hash = createHash('ripemd', { outputLength: 32 });
        hash.update(hash1.copy().digest('hex'));

        hashList.doubleripemd256 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha224')) {
        const hash1 = createHash('sha224');
        hash1.update(file);

        const hash = createHash('sha224');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha224 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha512-224')) {
        const hash1 = createHash('sha512-224');
        hash1.update(file);

        const hash = createHash('sha512-224');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha512_224 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublesha3-224')) {
        const hash1 = createHash('sha3-224');
        hash1.update(file);

        const hash = createHash('sha3-224');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha3_224 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublekeccak224')) {
        hashList.doublekeccak224 = keccak224(keccak224(file));
    }

    if (hashFunctions.includes('doubleshake256-224')) {
        hashList.doubleshake256_224 = shake256(shake256(file, 224), 224);
    }

    if (hashFunctions.includes('doublecshake256-224')) {
        hashList.doublecshake256_224 = cshake256(cshake256(file, 224, '', ''), 224, '', '');
    }

    if (hashFunctions.includes('doublekmac256-224')) {
        hashList.doublekmac256_224 = kmac256('', kmac256('', file, 224, ''), 224, '');
    }

    if (hashFunctions.includes('doubleshake128-224')) {
        hashList.doubleshake128_224 = shake128(shake128(file, 224), 224);
    }

    if (hashFunctions.includes('doublecshake128-224')) {
        hashList.doublecshake128_224 = cshake128(cshake128(file, 224, '', ''), 224, '', '');
    }

    if (hashFunctions.includes('doublekmac128-224')) {
        hashList.doublekmac128_224 = kmac128('', kmac128('', file, 224, ''), 224, '');
    }

    if (hashFunctions.includes('doublesha1')) {
        const hash1 = createHash('sha1');
        hash1.update(file);

        const hash = createHash('sha1');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublesha1 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doubleshake256-160')) {
        hashList.doubleshake256_160 = shake256(shake256(file, 160), 160);
    }

    if (hashFunctions.includes('doublecshake256-160')) {
        hashList.doublecshake256_160 = cshake256(cshake256(file, 160, '', ''), 160, '', '');
    }

    if (hashFunctions.includes('doublekmac256-160')) {
        hashList.doublekmac256_160 = kmac256('', kmac256('', file, 160, ''), 160, '');
    }

    if (hashFunctions.includes('doubleshake128-160')) {
        hashList.doubleshake128_160 = shake128(shake128(file, 160), 160);
    }

    if (hashFunctions.includes('doublecshake128-160')) {
        hashList.doublecshake128_160 = cshake128(cshake128(file, 160, '', ''), 160, '', '');
    }

    if (hashFunctions.includes('doublekmac128-160')) {
        hashList.doublekmac128_160 = kmac128('', kmac128('', file, 160, ''), 160, '');
    }

    if (hashFunctions.includes('doublemd2')) {
        hashList.doublemd2 = md2(md2(file));
    }

    if (hashFunctions.includes('doublemd4')) {
        hashList.doublemd4 = md4(md4(file));
    }

    if (hashFunctions.includes('doublemd5')) {
        const hash1 = createHash('md5');
        hash1.update(file);

        const hash = createHash('md5');
        hash.update(hash1.copy().digest('hex'));

        hashList.doublemd5 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doubleshake256-128')) {
        hashList.doubleshake256_128 = shake256(shake256(file, 128), 128);
    }

    if (hashFunctions.includes('doublecshake256-128')) {
        hashList.doublecshake256_128 = cshake256(cshake256(file, 128, '', ''), 128, '', '');
    }

    if (hashFunctions.includes('doublekmac256-128')) {
        hashList.doublekmac256_128 = kmac256('', kmac256('', file, 128, ''), 128, '');
    }

    if (hashFunctions.includes('doubleshake128-128')) {
        hashList.doubleshake128_128 = shake128(shake128(file, 128), 128);
    }

    if (hashFunctions.includes('doublecshake128-128')) {
        hashList.doublecshake128_128 = cshake128(cshake128(file, 128, '', ''), 128, '', '');
    }

    if (hashFunctions.includes('doublekmac128-128')) {
        hashList.doublekmac128_128 = kmac128('', kmac128('', file, 128, ''), 128, '');
    }

    if (hashFunctions.includes('doubleripemd128')) {
        const hash1 = createHash('ripemd', { outputLength: 16 });
        hash1.update(file);

        const hash = createHash('ripemd', { outputLength: 16 });
        hash.update(hash1.copy().digest('hex'));

        hashList.doubleripemd128 = hash.copy().digest('hex');
    }

    if (hashFunctions.includes('doublecrc32')) {
        hashList.doublecrc32 = crc32(crc32(file));
    }

    if (hashFunctions.includes('doubleshake256-32')) {
        hashList.doubleshake256_32 = shake256(shake256(file, 32), 32);
    }

    if (hashFunctions.includes('doublecshake256-32')) {
        hashList.doublecshake256_32 = cshake256(cshake256(file, 32, '', ''), 32, '', '');
    }

    if (hashFunctions.includes('doublekmac256-32')) {
        hashList.doublekmac256_32 = kmac256('', kmac256('', file, 32, ''), 32, '');
    }

    if (hashFunctions.includes('doubleshake128-32')) {
        hashList.doubleshake128_32 = shake128(shake128(file, 32), 32);
    }

    if (hashFunctions.includes('doublecshake128-32')) {
        hashList.doublecshake128_32 = cshake128(cshake128(file, 32, '', ''), 32, '', '');
    }

    if (hashFunctions.includes('doublekmac128-32')) {
        hashList.doublekmac128_32 = kmac128('', kmac128('', file, 32, ''), 32, '');
    }

    if (hashFunctions.includes('doublecrc16')) {
        hashList.doublecrc16 = crc16(crc16(file));
    }

    if (hashFunctions.includes('doubleshake256-16')) {
        hashList.doubleshake256_16 = shake256(shake256(file, 16), 16);
    }

    if (hashFunctions.includes('doublecshake256-16')) {
        hashList.doublecshake256_16 = cshake256(cshake256(file, 16, '', ''), 16, '', '');
    }

    if (hashFunctions.includes('doublekmac256-16')) {
        hashList.doublekmac256_16 = kmac256('', kmac256('', file, 16, ''), 16, '');
    }

    if (hashFunctions.includes('doubleshake128-16')) {
        hashList.doubleshake128_16 = shake128(shake128(file, 16), 16);
    }

    if (hashFunctions.includes('doublecshake128-16')) {
        hashList.doublecshake128_16 = cshake128(cshake128(file, 16, '', ''), 16, '', '');
    }

    if (hashFunctions.includes('doublekmac128-16')) {
        hashList.doublekmac128_16 = kmac128('', kmac128('', file, 16, ''), 16, '');
    }

    if (hashFunctions.includes('kalhash')) {
        hashList.kalhash = kalhash(file);
    }

    if (hashFunctions.includes('doublekalhash')) {
        hashList.doublekalhash = kalhash(kalhash(file));
    }

    return hashList;
}