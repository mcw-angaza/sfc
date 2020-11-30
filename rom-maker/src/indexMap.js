let ndarray = require("ndarray");

////////////////////////////////////////////////////////////////////////////////
let Channel = require("./channel");
let Color = require("./color");
let Dimension = require("./dimension");

////////////////////////////////////////////////////////////////////////////////
class IndexMap {
    constructor({ pixels, palette }) {
        let width = pixels.shape[Dimension.WIDTH];
        let height = pixels.shape[Dimension.HEIGHT];
        this.indices = ndarray(new Uint8Array(width * height), [width, height]);
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                let r = pixels.get(i, j, Channel.RED);
                let g = pixels.get(i, j, Channel.GREEN);
                let b = pixels.get(i, j, Channel.BLUE);
                let index = palette.getIndex({ color: new Color({ r, g, b }) });
                this.indices.set(i, j, index);
            }
        }
    }

    printDebug({ label }) {
        console.log(label);
        let width = this.indices.shape[Dimension.WIDTH];
        let height = this.indices.shape[Dimension.HEIGHT];
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                process.stdout.write(`${this.indices.get(i, j)} `);
            }
            process.stdout.write("\n");
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = IndexMap;
