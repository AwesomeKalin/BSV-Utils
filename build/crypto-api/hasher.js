/**
 * Base hasher class
 * @interface
 */
class Hasher {
    unitSize;
    unitOrder;
    blockSize;
    blockSizeInBytes;
    options;
    state;
    /**
     * @param {Object} options
     * @constructor
     */
    constructor(options) {
        /**
         * Size of unit in bytes (4 = 32 bits)
         */
        this.unitSize = 4;
        /**
         * Bytes order in unit
         *   0 - normal
         *   1 - reverse
         */
        this.unitOrder = 0;
        /**
         * Size of block in units
         */
        this.blockSize = 16;
        /**
         * Size of block in bytes
         */
        this.blockSizeInBytes = this.blockSize * this.unitSize;
        this.options = options || {};
        this.reset();
    }
    /**
     * Reset hasher to initial state
     */
    reset() {
        /**
         * All algorithm variables that changed during process
         */
        this.state = {};
        this.state.message = '';
        this.state.length = 0;
    }
    /**
     * Return current state
     */
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    /**
     * Set current state
     */
    setState(state) {
        this.state = state;
    }
    /**
     * Update message from binary string
     */
    update(message) {
        this.state.message += message;
        this.state.length += message.length;
        this.process();
    }
    /**
     * Process ready blocks
     */
    process() {
    }
    /**
     * Finalize hash and return result
     */
    finalize() {
        return '';
    }
    /**
     * Get hash from state
     */
    getStateHash(size) {
        return '';
    }
    /**
     * Add PKCS7 padding to message
     * Pad with bytes all of the same value as the number of padding bytes
     */
    addPaddingPKCS7(length) {
        this.state.message += new Array(length + 1).join(String.fromCharCode(length));
    }
    /**
     * Add ISO7816-4 padding to message
     * Pad with 0x80 followed by zero bytes
     */
    addPaddingISO7816(length) {
        this.state.message += "\x80" + new Array(length).join("\x00");
    }
    /**
     * Add zero padding to message
     * Pad with 0x00 characters
     */
    addPaddingZero(length) {
        this.state.message += new Array(length + 1).join("\x00");
    }
}
export default Hasher;
