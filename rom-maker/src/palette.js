let fs = require("fs");

////////////////////////////////////////////////////////////////////////////////
let Channel = require("./channel");
let Color = require("./color");
let Dimension = require("./dimension");

////////////////////////////////////////////////////////////////////////////////
class Palette {
    constructor({ pixels }) {
        let width = pixels.shape[Dimension.WIDTH];
        let height = pixels.shape[Dimension.HEIGHT];
        let colors = {};
        let transparent = new Color({ r: 255, g: 0, b: 255 });
        colors[transparent.toHexStr()] = transparent;
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                let r = pixels.get(i, j, Channel.RED);
                let g = pixels.get(i, j, Channel.GREEN);
                let b = pixels.get(i, j, Channel.BLUE);
                let color = new Color({ r, g, b });
                colors[color.toHexStr()] = color;
            }
        }
        this.colors = Object.values(colors);
    }

    getIndex({ color }) {
        return this.colors.findIndex(c => c.toHexStr() == color.toHexStr());
    }

    toBytes() {
        let bytes = [];
        for (let i = 0; i < 16; i += 1) {
            if (i < this.colors.length) {
                let color = this.colors[i];
                bytes = bytes.concat(color.toSfcBytes());
            } else {
                bytes = bytes.concat([0, 0]);
            }
        }
        return bytes;
    }

    printDebug({ label }) {
        console.log(label);
        this.colors.forEach((color, index) => {
            let indexStr = index.toString().padStart(2, " ");
            let hexStr = color.toHexStr();
            let sfcStr = color.toSfcStr();
            let rgbStr = color.toRgbStr();
            console.log(`${indexStr}:\t${hexStr}\t${sfcStr}\t${rgbStr}`);
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = Palette;
