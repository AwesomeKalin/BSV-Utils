import Hasher from "./hasher.js";
/**
 * Hasher for 32 bit little endian blocks
 * @interface
 */
class Hasher32le extends Hasher {
    blockUnits;
    constructor(options) {
        super(options);
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
            this.blockUnits = [];
            for (let b = 0; b < this.blockSizeInBytes; b += 4) {
                this.blockUnits.push(this.state.message.charCodeAt(b) |
                    this.state.message.charCodeAt(b + 1) << 8 |
                    this.state.message.charCodeAt(b + 2) << 16 |
                    this.state.message.charCodeAt(b + 3) << 24);
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
    getStateHash(size = this.state.hash.length) {
        size = size || this.state.hash.length;
        let hash = '';
        for (let i = 0; i < size; i++) {
            hash += String.fromCharCode(this.state.hash[i] & 0xff) +
                String.fromCharCode(this.state.hash[i] >> 8 & 0xff) +
                String.fromCharCode(this.state.hash[i] >> 16 & 0xff) +
                String.fromCharCode(this.state.hash[i] >> 24 & 0xff);
        }
        return hash;
    }
    /**
     * Add to message cumulative size of message in bits
     */
    addLengthBits() {
        // @todo fix length to 64 bit
        this.state.message +=
            String.fromCharCode(this.state.length << 3 & 0xff) +
                String.fromCharCode(this.state.length >> 5 & 0xff) +
                String.fromCharCode(this.state.length >> 13 & 0xff) +
                String.fromCharCode(this.state.length >> 21 & 0xff) +
                String.fromCharCode(this.state.length >> 29 & 0xff) +
                "\x00\x00\x00";
    }
}
export default Hasher32le;
