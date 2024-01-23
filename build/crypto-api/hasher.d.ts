/// <reference types="node" resolution-mode="require"/>
/**
 * Base hasher class
 * @interface
 */
declare class Hasher {
    unitSize: number;
    unitOrder: number;
    blockSize: number;
    blockSizeInBytes: number;
    options: any;
    state: {
        checksum?: any[];
        hash?: any;
        message?: string;
        length?: number;
    };
    /**
     * @param {Object} options
     * @constructor
     */
    constructor(options: {});
    /**
     * Reset hasher to initial state
     */
    reset(): void;
    /**
     * Return current state
     */
    getState(): any;
    /**
     * Set current state
     */
    setState(state: {
        message?: string;
        length?: number;
    }): void;
    /**
     * Update message from binary string
     */
    update(message: string | any[] | Buffer): void;
    /**
     * Process ready blocks
     */
    process(): void;
    /**
     * Finalize hash and return result
     */
    finalize(): string;
    /**
     * Get hash from state
     */
    getStateHash(size: number): string;
    /**
     * Add PKCS7 padding to message
     * Pad with bytes all of the same value as the number of padding bytes
     */
    addPaddingPKCS7(length: number): void;
    /**
     * Add ISO7816-4 padding to message
     * Pad with 0x80 followed by zero bytes
     */
    addPaddingISO7816(length: any): void;
    /**
     * Add zero padding to message
     * Pad with 0x00 characters
     */
    addPaddingZero(length: number): void;
}
export default Hasher;
