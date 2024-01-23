import Hasher from "./hasher.js";
/**
 * Hasher for 8 bit blocks
 * @interface
 */
class Hasher8 extends Hasher {
    blockUnits;
    /**
     * @param {Object} [options]
     */
    constructor(options) {
        super(options);
        /**
         * Size of unit = 1 byte
         */
        this.unitSize = 1;
        /**
         * Size of block in bytes
         */
        this.blockSizeInBytes = this.blockSize * this.unitSize;
        /**
         * Current block (only for speed optimization)
         */
        this.blockUnits = [];
    }
    /**
     * Process ready blocks
     */
    process() {
        while (this.state.message.length >= this.blockSizeInBytes) {
            this.blockUnits = new Array(this.blockSizeInBytes);
            for (let i = 0; i < this.blockSizeInBytes; i++) {
                this.blockUnits[i] = this.state.message.charCodeAt(i) | 0;
            }
            this.state.message = this.state.message.substr(this.blockSizeInBytes);
            this.processBlock(this.blockUnits);
        }
    }
    /**
     * Process ready blocks
     */
    processBlock(M) {
    }
    /**
     * Get hash from state
     */
    getStateHash(size) {
        size = size || this.state.hash.length;
        let hash = '';
        for (let i = 0; i < size; i++) {
            hash += String.fromCharCode(this.state.hash[i] & 0xff);
        }
        return hash;
    }
}
export default Hasher8;
