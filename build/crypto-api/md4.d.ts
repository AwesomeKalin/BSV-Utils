import Hasher32le from "./hasher32le.js";
/**
 * Calculates [MD4](https://tools.ietf.org/html/rfc1320) hash
 *
 * @example <caption>Calculates MD4 hash from string "message" - ES6 style</caption>
 * import Md4 from "crypto-api/src/hasher/md4";
 * import {toHex} from "crypto-api/src/encoder/hex";
 *
 * let hasher = new Md4();
 * hasher.update('message');
 * console.log(toHex(hasher.finalize()));
 *
 * @example <caption>Calculates MD4 hash from UTF string "message" - ES6 style</caption>
 * import Md4 from "crypto-api/src/hasher/md4";
 * import {toHex} from "crypto-api/src/encoder/hex";
 * import {fromUtf} from "crypto-api/src/encoder/utf";
 *
 * let hasher = new Md4();
 * hasher.update(fromUtf('message'));
 * console.log(toHex(hasher.finalize()));
 *
 * @example <caption>Calculates MD4 hash from string "message" - ES5 style</caption>
 * <script src="https://nf404.github.io/crypto-api/crypto-api.min.js"></script>
 * <script>
 *   var hasher = CryptoApi.getHasher('md4');
 *   hasher.update('message');
 *   console.log(CryptoApi.encoder.toHex(hasher.finalize()));
 * </script>
 *
 * @example <caption>Calculates MD4 hash from UTF string "message" - ES5 style</caption>
 * <script src="https://nf404.github.io/crypto-api/crypto-api.min.js"></script>
 * <script>
 *   console.log(CryptoApi.hash('md4', 'message'));
 * </script>
 */
declare class Md4 extends Hasher32le {
    /**
     * Reset hasher to initial state
     */
    reset(): void;
    static FF(x: number, y: number, z: number): number;
    static GG(x: number, y: number, z: number): number;
    static HH(x: number, y: number, z: number): number;
    static CC(f: {
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (x: number, y: number, z: number): number;
        (arg0: number, arg1: number, arg2: number): number;
    }, k: number, a: number, x: number, y: number, z: number, m: number, s: number): number;
    /**
     * Process ready blocks
     */
    processBlock(block: number[]): void;
    /**
     * Finalize hash and return result
     */
    finalize(): string;
}
export default Md4;
