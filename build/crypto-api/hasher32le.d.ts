import Hasher from "./hasher.js";
/**
 * Hasher for 32 bit little endian blocks
 * @interface
 */
declare class Hasher32le extends Hasher {
    blockUnits: any[];
    constructor(options?: {});
    /**
     * Process ready blocks
     */
    process(): void;
    /**
     * Process ready blocks
     */
    processBlock(M: any[]): void;
    /**
     * Get hash from state
     */
    getStateHash(size?: number): string;
    /**
     * Add to message cumulative size of message in bits
     */
    addLengthBits(): void;
}
export default Hasher32le;
