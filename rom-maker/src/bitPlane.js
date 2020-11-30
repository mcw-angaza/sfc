let ndarray = require("ndarray");

////////////////////////////////////////////////////////////////////////////////
let Dimension = require("./dimension");
let IndexMap = require("./indexMap");

////////////////////////////////////////////////////////////////////////////////
class BitPlane {
    constructor({ indexMap, plane }) {
        let width = indexMap.indices.shape[Dimension.WIDTH];
        let height = indexMap.indices.shape[Dimension.HEIGHT];
        this.bits = ndarray(new Array(width * height), [width, height]);
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                let bits = indexMap.indices
                    .get(i, j)
                    .toString(2)
                    .padStart(8, "0");
                this.bits.set(i, j, bits.charAt(7 - plane));
            }
        }
    }

    toBytes() {
        let bytes = [];
        let width = this.bits.shape[Dimension.WIDTH];
        let height = this.bits.shape[Dimension.HEIGHT];
        for (let j = 0; j < height; j += 1) {
            let bits = "";
            for (let i = 0; i < width; i += 1) {
                bits += this.bits.get(i, j);
            }
            let byte = parseInt(bits, 2);
            bytes.push(byte);
        }
        return bytes;
    }

    printDebug({ label }) {
        console.log(label);
        let width = this.bits.shape[Dimension.WIDTH];
        let height = this.bits.shape[Dimension.HEIGHT];
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                process.stdout.write(`${this.bits.get(i, j)} `);
            }
            process.stdout.write("\n");
        }
    }

    static interleaved({ a, b }) {
        let bitPlane = new BitPlane({
            indexMap: new IndexMap({
                pixels: ndarray(new Array(0), [0, 0]),
                palette: null
            }),
            plane: null
        });
        let width = a.bits.shape[Dimension.WIDTH];
        let height = a.bits.shape[Dimension.HEIGHT] * 2;
        let bits = ndarray(new Array(width * height), [width, height]);
        for (let j = 0; j < height; j += 2) {
            let j0 = Math.floor(j / 2);
            for (let i = 0; i < width; i += 1) {
                bits.set(i, j + 0, a.bits.get(i, j0));
                bits.set(i, j + 1, b.bits.get(i, j0));
            }
        }
        bitPlane.bits = bits;
        return bitPlane;
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = BitPlane;
