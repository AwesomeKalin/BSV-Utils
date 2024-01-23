/**
 * Rotate x to n bits left
 */
function rotateLeft(x, n) {
    return ((x << n) | (x >>> (32 - n))) | 0;
}
/**
 * Rotate x to n bits right
 */
function rotateRight(x, n) {
    return ((x >>> n) | (x << (32 - n))) | 0;
}
/**
 * Rotate 64bit to n bits right and return hi
 */
function rotateRight64hi(hi, lo, n) {
    if (n === 32) {
        return lo;
    }
    if (n > 32) {
        return rotateRight64hi(lo, hi, n - 32);
    }
    return ((hi >>> n) | (lo << (32 - n))) & (0xFFFFFFFF);
}
/**
 * Rotate 64bit to n bits right and return lo
 */
function rotateRight64lo(hi, lo, n) {
    if (n === 32) {
        return hi;
    }
    if (n > 32) {
        return rotateRight64lo(lo, hi, n - 32);
    }
    return ((lo >>> n) | (hi << (32 - n))) & (0xFFFFFFFF);
}
export { rotateLeft, rotateRight, rotateRight64lo, rotateRight64hi };
