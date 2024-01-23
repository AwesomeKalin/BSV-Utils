import Hasher8 from "./hasher8.js";
/**
 * Calculates [MD2](https://tools.ietf.org/html/rfc1319) hash
 *
 * @example <caption>Calculates MD2 hash from string "message" - ES6 style</caption>
 * import Md2 from "crypto-api/src/hasher/md2";
 * import {toHex} from "crypto-api/src/encoder/hex";
 *
 * let hasher = new Md2();
 * hasher.update('message');
 * console.log(toHex(hasher.finalize()));
 *
 * @example <caption>Calculates MD2 hash from UTF string "message" - ES6 style</caption>
 * import Md2 from "crypto-api/src/hasher/md2";
 * import {toHex} from "crypto-api/src/encoder/hex";
 * import {fromUtf} from "crypto-api/src/encoder/utf";
 *
 * let hasher = new Md2();
 * hasher.update(fromUtf('message'));
 * console.log(toHex(hasher.finalize()));
 *
 * @example <caption>Calculates MD2 hash from string "message" - ES5 style</caption>
 * <script src="https://nf404.github.io/crypto-api/crypto-api.min.js"></script>
 * <script>
 *   var hasher = CryptoApi.getHasher('md2');
 *   hasher.update('message');
 *   console.log(CryptoApi.encoder.toHex(hasher.finalize()));
 * </script>
 *
 * @example <caption>Calculates MD2 hash from UTF string "message" - ES5 style</caption>
 * <script src="https://nf404.github.io/crypto-api/crypto-api.min.js"></script>
 * <script>
 *   console.log(CryptoApi.hash('md2', 'message'));
 * </script>
 */
declare class Md2 extends Hasher8 {
    constructor(options?: {
        rounds?: number;
    });
    /**
     * Reset hasher to initial state
     */
    reset(): void;
    /**
     * Process ready blocks
     */
    processBlock(block: number[]): void;
    /**
     * Finalize hash and return result
     */
    finalize(): string;
}
export default Md2;
