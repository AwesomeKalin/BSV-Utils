import { createHash } from "crypto";
import { readFileSync } from "fs";
import os from 'os';
import pkg from 'js-sha3';
const { cshake128, cshake256, keccak224, keccak256, keccak384, keccak512, kmac128, kmac256, shake128, shake256 } = pkg;
import crc from 'js-crc';
import { kalhash } from '../crypto-api/kalhash.js';
import Md2 from "../crypto-api/md2.js";
import { toHex } from "../crypto-api/hex.js";
import Md4 from '../crypto-api/md4.js';
import { kalhash as kalstring } from 'kalhash.js';

var crc16 = crc.crc16;
var crc32 = crc.crc32;

export function hash(file: Buffer | string) {
    const hashFunctions: string[] = JSON.parse(readFileSync(`${os.homedir()}/.bsvutils/hash.bsv`).toString());
    let hashList: hashArray = { shake256_1k: null, sha3_512: null, sha256: null, doublesha256: null, ripemd160: null, cshake256_1k: null, kmac256_1k: null, shake128_1k: null, cshake128_1k: null, kmac128_1k: null, sha512: null, keccak512: null, shake256_512: null, cshake256_512: null, kmac256_512: null, shake128_512: null, cshake128_512: null, kmac128_512: null, sha384: null, sha3_384: null, keccak384: null, shake256_384: null, cshake256_384: null, kmac256_384: null, shake128_384: null, cshake128_384: null, kmac128_384: null, shake256_320: null, cshake256_320: null, kmac256_320: null, shake128_320: null, cshake128_320: null, kmac128_320: null, sha512_256: null, sha3_256: null, keccak256: null, shake256_256: null, cshake256_256: null, kmac256_256: null, shake128_256: null, cshake128_256: null, kmac128_256: null, sha224: null, sha512_224: null, sha3_224: null, keccak224: null, shake256_224: null, cshake256_224: null, kmac256_224: null, shake128_224: null, cshake128_224: null, kmac128_224: null, sha1: null, shake256_160: null, cshake256_160: null, kmac256_160: null, shake128_160: null, cshake128_160: null, kmac128_160: null, md2: null, md4: null, md5: null, shake256_128: null, cshake256_128: null, kmac256_128: null, shake128_128: null, cshake128_128: null, kmac128_128: null, crc32: null, shake256_32: null, cshake256_32: null, kmac256_32: null, shake128_32: null, cshake128_32: null, kmac128_32: null, crc16: null, shake256_16: null, cshake256_16: null, kmac256_16: null, shake128_16: null, cshake128_16: null, kmac128_16: null, doubleshake256_1k: null, doublesha3_512: null, doubleripemd160: null, doublecshake256_1k: null, doublekmac256_1k: null, doubleshake128_1k: null, doublecshake128_1k: null, doublekmac128_1k: null, doublesha512: null, doublekeccak512: null, doubleshake256_512: null, doublecshake256_512: null, doublekmac256_512: null, doubleshake128_512: null, doublecshake128_512: null, doublekmac128_512: null, doublesha384: null, doublesha3_384: null, doublekeccak384: null, doubleshake256_384: null, doublecshake256_384: null, doublekmac256_384: null, doubleshake128_384: null, doublecshake128_384: null, doublekmac128_384: null, doubleshake256_320: null, doublecshake256_320: null, doublekmac256_320: null, doubleshake128_320: null, doublecshake128_320: null, doublekmac128_320: null, doublesha512_256: null, doublesha3_256: null, doublekeccak256: null, doubleshake256_256: null, doublecshake256_256: null, doublekmac256_256: null, doubleshake128_256: null, doublecshake128_256: null, doublekmac128_256: null, doublesha224: null, doublesha512_224: null, doublesha3_224: null, doublekeccak224: null, doubleshake256_224: null, doublecshake256_224: null, doublekmac256_224: null, doubleshake128_224: null, doublecshake128_224: null, doublekmac128_224: null, doublesha1: null, doubleshake256_160: null, doublecshake256_160: null, doublekmac256_160: null, doubleshake128_160: null, doublecshake128_160: null, doublekmac128_160: null, doublemd2: null, doublemd4: null, doublemd5: null, doubleshake256_128: null, doublecshake256_128: null, doublekmac256_128: null, doubleshake128_128: null, doublecshake128_128: null, doublekmac128_128: null, doublecrc32: null, doubleshake256_32: null, doublecshake256_32: null, doublekmac256_32: null, doubleshake128_32: null, doublecshake128_32: null, doublekmac128_32: null, doublecrc16: null, doubleshake256_16: null, doublecshake256_16: null, doublekmac256_16: null, doubleshake128_16: null, doublecshake128_16: null, doublekmac128_16: null, kalhash: null, doublekalhash: null, };

    if (hashFunctions.includes('shake256-1k')) {
        hashList.shake256_1k = shake256(file, 1024);
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
        let hasher = new Md2();
        hasher.update(file);

        hashList.md2 = toHex(hasher.finalize());
    }

    if (hashFunctions.includes('md4')) {
        let hasher = new Md4();
        hasher.update(file);

        hashList.md4 = toHex(hasher.finalize());
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

        hashList.doubleshake256_1k = shake256(shake256(file, 1024), 1024);
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

        const hash = createHash('sha512');
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
        let hasher = new Md2();
        hasher.update(file);

        let hasher2 = new Md2();
        hasher2.update(toHex(hasher.finalize()));

        hashList.doublemd2 = toHex(hasher2.finalize());
    }

    if (hashFunctions.includes('doublemd4')) {
        let hasher = new Md4();
        hasher.update(file);

        let hasher1 = new Md4();
        hasher1.update(toHex(hasher.finalize()));

        hashList.doublemd4 = toHex(hasher1.finalize());
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
        hashList.doublekalhash = kalstring(kalhash(file));
    }

    return hashList;
}

export type hashArray = { shake256_1k: string; sha3_512: string; sha256: string; doublesha256: string; ripemd160: string; cshake256_1k: string; kmac256_1k: string; shake128_1k: string; cshake128_1k: string; kmac128_1k: string; sha512: string; keccak512: string; shake256_512: string; cshake256_512: string; kmac256_512: string; shake128_512: string; cshake128_512: string; kmac128_512: string; sha384: string; sha3_384: string; keccak384: string; shake256_384: string; cshake256_384: string; kmac256_384: string; shake128_384: string; cshake128_384: string; kmac128_384: string; shake256_320: string; cshake256_320: string; kmac256_320: string; shake128_320: string; cshake128_320: string; kmac128_320: string; sha512_256: string; sha3_256: string; keccak256: string; shake256_256: string; cshake256_256: string; kmac256_256: string; shake128_256: string; cshake128_256: string; kmac128_256: string; sha224: string; sha512_224: string; sha3_224: string; keccak224: string; shake256_224: string; cshake256_224: string; kmac256_224: string; shake128_224: string; cshake128_224: string; kmac128_224: string; sha1: string; shake256_160: string; cshake256_160: string; kmac256_160: string; shake128_160: string; cshake128_160: string; kmac128_160: string; md2: any; md4: any; md5: string; shake256_128: string; cshake256_128: string; kmac256_128: string; shake128_128: string; cshake128_128: string; kmac128_128: string; crc32: string; shake256_32: string; cshake256_32: string; kmac256_32: string; shake128_32: string; cshake128_32: string; kmac128_32: string; crc16: string; shake256_16: string; cshake256_16: string; kmac256_16: string; shake128_16: string; cshake128_16: string; kmac128_16: string; doubleshake256_1k: string; doublesha3_512: string; doubleripemd160: string; doublecshake256_1k: string; doublekmac256_1k: string; doubleshake128_1k: string; doublecshake128_1k: string; doublekmac128_1k: string; doublesha512: string; doublekeccak512: string; doubleshake256_512: string; doublecshake256_512: string; doublekmac256_512: string; doubleshake128_512: string; doublecshake128_512: string; doublekmac128_512: string; doublesha384: string; doublesha3_384: string; doublekeccak384: string; doubleshake256_384: string; doublecshake256_384: string; doublekmac256_384: string; doubleshake128_384: string; doublecshake128_384: string; doublekmac128_384: string; doubleshake256_320: string; doublecshake256_320: string; doublekmac256_320: string; doubleshake128_320: string; doublecshake128_320: string; doublekmac128_320: string; doublesha512_256: string; doublesha3_256: string; doublekeccak256: string; doubleshake256_256: string; doublecshake256_256: string; doublekmac256_256: string; doubleshake128_256: string; doublecshake128_256: string; doublekmac128_256: string; doublesha224: string; doublesha512_224: string; doublesha3_224: string; doublekeccak224: string; doubleshake256_224: string; doublecshake256_224: string; doublekmac256_224: string; doubleshake128_224: string; doublecshake128_224: string; doublekmac128_224: string; doublesha1: string; doubleshake256_160: string; doublecshake256_160: string; doublekmac256_160: string; doubleshake128_160: string; doublecshake128_160: string; doublekmac128_160: string; doublemd2: any; doublemd4: any; doublemd5: string; doubleshake256_128: string; doublecshake256_128: string; doublekmac256_128: string; doubleshake128_128: string; doublecshake128_128: string; doublekmac128_128: string; doublecrc32: string; doubleshake256_32: string; doublecshake256_32: string; doublekmac256_32: string; doubleshake128_32: string; doublecshake128_32: string; doublekmac128_32: string; doublecrc16: string; doubleshake256_16: string; doublecshake256_16: string; doublekmac256_16: string; doubleshake128_16: string; doublecshake128_16: string; doublekmac128_16: string; kalhash: any; doublekalhash: any; };

export function compareHashes(entry: hashArray, original: hashArray) {
    if (original.shake256_1k !== null && original.shake256_1k === entry.shake256_1k) return true;
    if (original.sha3_512 !== null && original.sha3_512 === entry.sha3_512) return true;
    if (original.sha256 !== null && original.sha256 === entry.sha256) return true;
    if (original.doublesha256 !== null && original.doublesha256 === entry.doublesha256) return true;
    if (original.ripemd160 !== null && original.ripemd160 === entry.ripemd160) return true;
    if (original.cshake256_1k !== null && original.cshake256_1k === entry.cshake256_1k) return true;
    if (original.kmac256_1k !== null && original.kmac256_1k === entry.kmac256_1k) return true;
    if (original.shake128_1k !== null && original.shake128_1k === entry.shake128_1k) return true;
    if (original.cshake128_1k !== null && original.cshake128_1k === entry.cshake128_1k) return true;
    if (original.kmac128_1k !== null && original.kmac128_1k === entry.kmac128_1k) return true;
    if (original.sha512 !== null && original.sha512 === entry.sha512) return true;
    if (original.keccak512 !== null && original.keccak512 === entry.keccak512) return true;
    if (original.shake256_512 !== null && original.shake256_512 === entry.shake256_512) return true;
    if (original.cshake256_512 !== null && original.cshake256_512 === entry.cshake256_512) return true;
    if (original.kmac256_512 !== null && original.kmac256_512 === entry.kmac256_512) return true;
    if (original.shake128_512 !== null && original.shake128_512 === entry.shake128_512) return true;
    if (original.cshake128_512 !== null && original.cshake128_512 === entry.cshake128_512) return true;
    if (original.kmac128_512 !== null && original.kmac128_512 === entry.kmac128_512) return true;
    if (original.sha384 !== null && original.sha384 === entry.sha384) return true;
    if (original.keccak384 !== null && original.keccak384 === entry.keccak384) return true;
    if (original.shake256_384 !== null && original.shake256_384 === entry.shake256_384) return true;
    if (original.cshake256_384 !== null && original.cshake256_384 === entry.cshake256_384) return true;
    if (original.kmac256_384 !== null && original.kmac256_384 === entry.kmac256_384) return true;
    if (original.shake128_384 !== null && original.shake128_384 === entry.shake128_384) return true;
    if (original.cshake128_384 !== null && original.cshake128_384 === entry.cshake128_384) return true;
    if (original.kmac128_384 !== null && original.kmac128_384 === entry.kmac128_384) return true;
    if (original.shake256_320 !== null && original.shake256_320 === entry.shake256_320) return true;
    if (original.cshake256_320 !== null && original.cshake256_320 === entry.cshake256_320) return true;
    if (original.kmac256_320 !== null && original.kmac256_320 === entry.kmac256_320) return true;
    if (original.shake128_320 !== null && original.shake128_320 === entry.shake128_320) return true;
    if (original.cshake128_320 !== null && original.cshake128_320 === entry.cshake128_320) return true;
    if (original.kmac128_320 !== null && original.kmac128_320 === entry.kmac128_320) return true;
    if (original.sha512_256 !== null && original.sha512_256 === entry.sha512_256) return true;
    if (original.sha3_256 !== null && original.sha3_256 === entry.sha3_256) return true;
    if (original.keccak256 !== null && original.keccak256 === entry.keccak256) return true;
    if (original.shake256_256 !== null && original.shake256_256 === entry.shake256_256) return true;
    if (original.cshake256_256 !== null && original.cshake256_256 === entry.cshake256_256) return true;
    if (original.kmac256_256 !== null && original.kmac256_256 === entry.kmac256_256) return true;
    if (original.shake128_256 !== null && original.shake128_256 === entry.shake128_256) return true;
    if (original.cshake128_256 !== null && original.cshake128_256 === entry.cshake128_256) return true;
    if (original.kmac128_256 !== null && original.kmac128_256 === entry.kmac128_256) return true;
    if (original.sha224 !== null && original.sha224 === entry.sha224) return true;
    if (original.sha512_224 !== null && original.sha512_224 === entry.sha512_224) return true;
    if (original.sha3_224 !== null && original.sha3_224 === entry.sha3_224) return true;
    if (original.keccak224 !== null && original.keccak224 === entry.keccak224) return true;
    if (original.shake256_224 !== null && original.shake256_224 === entry.shake256_224) return true;
    if (original.cshake256_224 !== null && original.cshake256_224 === entry.cshake256_224) return true;
    if (original.kmac256_224 !== null && original.kmac256_224 === entry.kmac256_224) return true;
    if (original.shake128_224 !== null && original.shake128_224 === entry.shake128_224) return true;
    if (original.cshake128_224 !== null && original.cshake128_224 === entry.cshake128_224) return true;
    if (original.kmac128_224 !== null && original.kmac128_224 === entry.kmac128_224) return true;
    if (original.sha1 !== null && original.sha1 === entry.sha1) return true;
    if (original.shake256_160 !== null && original.shake256_160 === entry.shake256_160) return true;
    if (original.cshake256_160 !== null && original.cshake256_160 === entry.cshake256_160) return true;
    if (original.kmac256_160 !== null && original.kmac256_160 === entry.kmac256_160) return true;
    if (original.shake128_160 !== null && original.shake128_160 === entry.shake128_160) return true;
    if (original.cshake128_160 !== null && original.cshake128_160 === entry.cshake128_160) return true;
    if (original.kmac128_160 !== null && original.kmac128_160 === entry.kmac128_160) return true;
    if (original.md2 !== null && original.md2 === entry.md2) return true;
    if (original.md4 !== null && original.md4 === entry.md4) return true;
    if (original.md5 !== null && original.md5 === entry.md5) return true;
    if (original.shake256_128 !== null && original.shake256_128 === entry.shake256_128) return true;
    if (original.cshake256_128 !== null && original.cshake256_128 === entry.cshake256_128) return true;
    if (original.kmac256_128 !== null && original.kmac256_128 === entry.kmac256_128) return true;
    if (original.shake128_128 !== null && original.shake128_128 === entry.shake128_128) return true;
    if (original.cshake128_128 !== null && original.cshake128_128 === entry.cshake128_128) return true;
    if (original.kmac128_128 !== null && original.kmac128_128 === entry.kmac128_128) return true;
    if (original.crc32 !== null && original.crc32 === entry.crc32) return true;
    if (original.shake256_32 !== null && original.shake256_32 === entry.shake256_32) return true;
    if (original.cshake256_32 !== null && original.cshake256_32 === entry.cshake256_32) return true;
    if (original.kmac256_32 !== null && original.kmac256_32 === entry.kmac256_32) return true;
    if (original.shake128_32 !== null && original.shake128_32 === entry.shake128_32) return true;
    if (original.cshake128_32 !== null && original.cshake128_32 === entry.cshake128_32) return true;
    if (original.kmac128_32 !== null && original.kmac128_32 === entry.kmac128_32) return true;
    if (original.crc16 !== null && original.crc16 === entry.crc16) return true;
    if (original.shake256_16 !== null && original.shake256_16 === entry.shake256_16) return true;
    if (original.cshake256_16 !== null && original.cshake256_16 === entry.cshake256_16) return true;
    if (original.kmac256_16 !== null && original.kmac256_16 === entry.kmac256_16) return true;
    if (original.shake128_16 !== null && original.shake128_16 === entry.shake128_16) return true;
    if (original.cshake128_16 !== null && original.cshake128_16 === entry.cshake128_16) return true;
    if (original.kmac128_16 !== null && original.kmac128_16 === entry.kmac128_16) return true;
    if (original.doubleshake256_1k !== null && original.doubleshake256_1k === entry.doubleshake256_1k) return true;
    if (original.doublesha3_512 !== null && original.doublesha3_512 === entry.doublesha3_512) return true;
    if (original.doubleripemd160 !== null && original.doubleripemd160 === entry.doubleripemd160) return true;
    if (original.doublecshake256_1k !== null && original.doublecshake256_1k === entry.doublecshake256_1k) return true;
    if (original.doublekmac256_1k !== null && original.doublekmac256_1k === entry.doublekmac256_1k) return true;
    if (original.doubleshake128_1k !== null && original.doubleshake128_1k === entry.doubleshake128_1k) return true;
    if (original.doublecshake128_1k !== null && original.doublecshake128_1k === entry.doublecshake128_1k) return true;
    if (original.doublekmac128_1k !== null && original.doublekmac128_1k === entry.doublekmac128_1k) return true;
    if (original.doublesha512 !== null && original.doublesha512 === entry.doublesha512) return true;
    if (original.doublekeccak512 !== null && original.doublekeccak512 === entry.doublekeccak512) return true;
    if (original.doubleshake256_512 !== null && original.doubleshake256_512 === entry.doubleshake256_512) return true;
    if (original.doublecshake256_512 !== null && original.doublecshake256_512 === entry.doublecshake256_512) return true;
    if (original.doublekmac256_512 !== null && original.doublekmac256_512 === entry.doublekmac256_512) return true;
    if (original.doubleshake128_512 !== null && original.doubleshake128_512 === entry.doubleshake128_512) return true;
    if (original.doublecshake128_512 !== null && original.doublecshake128_512 === entry.doublecshake128_512) return true;
    if (original.doublekmac128_512 !== null && original.doublekmac128_512 === entry.doublekmac128_512) return true;
    if (original.doublesha384 !== null && original.doublesha384 === entry.doublesha384) return true;
    if (original.doublekeccak384 !== null && original.doublekeccak384 === entry.doublekeccak384) return true;
    if (original.doubleshake256_384 !== null && original.doubleshake256_384 === entry.doubleshake256_384) return true;
    if (original.doublecshake256_384 !== null && original.doublecshake256_384 === entry.doublecshake256_384) return true;
    if (original.doublekmac256_384 !== null && original.doublekmac256_384 === entry.doublekmac256_384) return true;
    if (original.doubleshake128_384 !== null && original.doubleshake128_384 === entry.doubleshake128_384) return true;
    if (original.doublecshake128_384 !== null && original.doublecshake128_384 === entry.doublecshake128_384) return true;
    if (original.doublekmac128_384 !== null && original.doublekmac128_384 === entry.doublekmac128_384) return true;
    if (original.doubleshake256_320 !== null && original.doubleshake256_320 === entry.doubleshake256_320) return true;
    if (original.doublecshake256_320 !== null && original.doublecshake256_320 === entry.doublecshake256_320) return true;
    if (original.doublekmac256_320 !== null && original.doublekmac256_320 === entry.doublekmac256_320) return true;
    if (original.doubleshake128_320 !== null && original.doubleshake128_320 === entry.doubleshake128_320) return true;
    if (original.doublecshake128_320 !== null && original.doublecshake128_320 === entry.doublecshake128_320) return true;
    if (original.doublekmac128_320 !== null && original.doublekmac128_320 === entry.doublekmac128_320) return true;
    if (original.doublesha512_256 !== null && original.doublesha512_256 === entry.doublesha512_256) return true;
    if (original.doublesha3_256 !== null && original.doublesha3_256 === entry.doublesha3_256) return true;
    if (original.doublekeccak256 !== null && original.doublekeccak256 === entry.doublekeccak256) return true;
    if (original.doubleshake256_256 !== null && original.doubleshake256_256 === entry.doubleshake256_256) return true;
    if (original.doublecshake256_256 !== null && original.doublecshake256_256 === entry.doublecshake256_256) return true;
    if (original.doublekmac256_256 !== null && original.doublekmac256_256 === entry.doublekmac256_256) return true;
    if (original.doubleshake128_256 !== null && original.doubleshake128_256 === entry.doubleshake128_256) return true;
    if (original.doublecshake128_256 !== null && original.doublecshake128_256 === entry.doublecshake128_256) return true;
    if (original.doublekmac128_256 !== null && original.doublekmac128_256 === entry.doublekmac128_256) return true;
    if (original.doublesha224 !== null && original.doublesha224 === entry.doublesha224) return true;
    if (original.doublesha512_224 !== null && original.doublesha512_224 === entry.doublesha512_224) return true;
    if (original.doublesha3_224 !== null && original.doublesha3_224 === entry.doublesha3_224) return true;
    if (original.doublekeccak224 !== null && original.doublekeccak224 === entry.doublekeccak224) return true;
    if (original.doubleshake256_224 !== null && original.doubleshake256_224 === entry.doubleshake256_224) return true;
    if (original.doublecshake256_224 !== null && original.doublecshake256_224 === entry.doublecshake256_224) return true;
    if (original.doublekmac256_224 !== null && original.doublekmac256_224 === entry.doublekmac256_224) return true;
    if (original.doubleshake128_224 !== null && original.doubleshake128_224 === entry.doubleshake128_224) return true;
    if (original.doublecshake128_224 !== null && original.doublecshake128_224 === entry.doublecshake128_224) return true;
    if (original.doublekmac128_224 !== null && original.doublekmac128_224 === entry.doublekmac128_224) return true;
    if (original.doublesha1 !== null && original.doublesha1 === entry.doublesha1) return true;
    if (original.doubleshake256_160 !== null && original.doubleshake256_160 === entry.doubleshake256_160) return true;
    if (original.doublecshake256_160 !== null && original.doublecshake256_160 === entry.doublecshake256_160) return true;
    if (original.doublekmac256_160 !== null && original.doublekmac256_160 === entry.doublekmac256_160) return true;
    if (original.doubleshake128_160 !== null && original.doubleshake128_160 === entry.doubleshake128_160) return true;
    if (original.doublecshake128_160 !== null && original.doublecshake128_160 === entry.doublecshake128_160) return true;
    if (original.doublekmac128_160 !== null && original.doublekmac128_160 === entry.doublekmac128_160) return true;
    if (original.doublemd2 !== null && original.doublemd2 === entry.doublemd2) return true;
    if (original.doublemd4 !== null && original.doublemd4 === entry.doublemd4) return true;
    if (original.doublemd5 !== null && original.doublemd5 === entry.doublemd5) return true;
    if (original.doubleshake256_128 !== null && original.doubleshake256_128 === entry.doubleshake256_128) return true;
    if (original.doublecshake256_128 !== null && original.doublecshake256_128 === entry.doublecshake256_128) return true;
    if (original.doublekmac256_128 !== null && original.doublekmac256_128 === entry.doublekmac256_128) return true;
    if (original.doubleshake128_128 !== null && original.doubleshake128_128 === entry.doubleshake128_128) return true;
    if (original.doublecshake128_128 !== null && original.doublecshake128_128 === entry.doublecshake128_128) return true;
    if (original.doublekmac128_128 !== null && original.doublekmac128_128 === entry.doublekmac128_128) return true;
    if (original.doublecrc32 !== null && original.doublecrc32 === entry.doublecrc32) return true;
    if (original.doubleshake256_32 !== null && original.doubleshake256_32 === entry.doubleshake256_32) return true;
    if (original.doublecshake256_32 !== null && original.doublecshake256_32 === entry.doublecshake256_32) return true;
    if (original.doublekmac256_32 !== null && original.doublekmac256_32 === entry.doublekmac256_32) return true;
    if (original.doubleshake128_32 !== null && original.doubleshake128_32 === entry.doubleshake128_32) return true;
    if (original.doublecshake128_32 !== null && original.doublecshake128_32 === entry.doublecshake128_32) return true;
    if (original.doublekmac128_32 !== null && original.doublekmac128_32 === entry.doublekmac128_32) return true;
    if (original.doublecrc16 !== null && original.doublecrc16 === entry.doublecrc16) return true;
    if (original.doubleshake256_16 !== null && original.doubleshake256_16 === entry.doubleshake256_16) return true;
    if (original.doublecshake256_16 !== null && original.doublecshake256_16 === entry.doublecshake256_16) return true;
    if (original.doublekmac256_16 !== null && original.doublekmac256_16 === entry.doublekmac256_16) return true;
    if (original.doubleshake128_16 !== null && original.doubleshake128_16 === entry.doubleshake128_16) return true;
    if (original.doublecshake128_16 !== null && original.doublecshake128_16 === entry.doublecshake128_16) return true;
    if (original.doublekmac128_16 !== null && original.doublekmac128_16 === entry.doublekmac128_16) return true;
    return false;
}