/**
 * Rotate x to n bits left
 */
declare function rotateLeft(x: number, n: number): number;
/**
 * Rotate x to n bits right
 */
declare function rotateRight(x: number, n: number): number;
/**
 * Rotate 64bit to n bits right and return hi
 */
declare function rotateRight64hi(hi: number, lo: number, n: number): number;
/**
 * Rotate 64bit to n bits right and return lo
 */
declare function rotateRight64lo(hi: number, lo: number, n: number): number;
export { rotateLeft, rotateRight, rotateRight64lo, rotateRight64hi };
