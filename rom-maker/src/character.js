let fs = require("fs");
let savePixels = require("save-pixels");

////////////////////////////////////////////////////////////////////////////////
let BitPlane = require("./bitPlane");
let IndexMap = require("./indexMap");

////////////////////////////////////////////////////////////////////////////////
class Character {
    constructor({ pixels, palette }) {
        this.pixels = pixels;
        this.indexMap = new IndexMap({ pixels, palette });
    }

    toBytes() {
        let bitPlane0 = new BitPlane({ indexMap: this.indexMap, plane: 0 });
        let bitPlane1 = new BitPlane({ indexMap: this.indexMap, plane: 1 });
        let bitPlane2 = new BitPlane({ indexMap: this.indexMap, plane: 2 });
        let bitPlane3 = new BitPlane({ indexMap: this.indexMap, plane: 3 });
        let interleaved0 = BitPlane.interleaved({ a: bitPlane0, b: bitPlane1 });
        let interleaved1 = BitPlane.interleaved({ a: bitPlane2, b: bitPlane3 });
        return interleaved0.toBytes().concat(interleaved1.toBytes());
    }

    saveDebug({ file }) {
        let stream = fs.createWriteStream(`out/${file}`);
        savePixels(this.pixels, "png").pipe(stream);
        stream.on("finish", () => stream.end());
    }

    printDebug({ label }) {
        this.indexMap.printDebug({ label: `${label}, indexMap` });
        let bitPlane0 = new BitPlane({ indexMap: this.indexMap, plane: 0 });
        bitPlane0.printDebug({ label: `${label}, bitPlane_0` });
        let bitPlane1 = new BitPlane({ indexMap: this.indexMap, plane: 1 });
        bitPlane1.printDebug({ label: `${label}, bitPlane_1` });
        let bitPlane2 = new BitPlane({ indexMap: this.indexMap, plane: 2 });
        bitPlane2.printDebug({ label: `${label}, bitPlane_2` });
        let bitPlane3 = new BitPlane({ indexMap: this.indexMap, plane: 3 });
        bitPlane3.printDebug({ label: `${label}, bitPlane_3` });
        let interleaved0 = BitPlane.interleaved({ a: bitPlane0, b: bitPlane1 });
        interleaved0.printDebug({ label: `${label}, interleaved_0` });
        let interleaved1 = BitPlane.interleaved({ a: bitPlane2, b: bitPlane3 });
        interleaved1.printDebug({ label: `${label}, interleaved_1` });
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = Character;
