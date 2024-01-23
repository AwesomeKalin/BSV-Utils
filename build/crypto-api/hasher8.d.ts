import Hasher from "./hasher.js";
/**
 * Hasher for 8 bit blocks
 * @interface
 */
declare class Hasher8 extends Hasher {
    blockUnits: any[];
    /**
     * @param {Object} [options]
     */
    constructor(options: {});
    /**
     * Process ready blocks
     */
    process(): void;
    /**
     * Process ready blocks
     */
    processBlock(M: any): void;
    /**
     * Get hash from state
     */
    getStateHash(size: number): string;
}
export default Hasher8;
