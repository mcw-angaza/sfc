let ndarray = require("ndarray");

////////////////////////////////////////////////////////////////////////////////
let Dimension = require("./dimension");

////////////////////////////////////////////////////////////////////////////////
const BITS_PER_PIXEL = 4;
const CHARACTER_SIZE = 8;

////////////////////////////////////////////////////////////////////////////////
class CharacterMap {
    constructor() {
        let width = 16;
        let height = 0;
        this.array = ndarray(new Array(width * height), [width, height]);
    }

    addSprite({ sprite }) {
        let entryPoint = (() => {
            let width = this.array.shape[Dimension.WIDTH];
            let height = this.array.shape[Dimension.HEIGHT];
            for (let j = 0; j < height; j += 1) {
                for (let i = 0; i < width; i += 1) {
                    if (this.array.get(i, j) === null) {
                        return { i, j };
                    }
                }
            }
            return null;
        })();

        if (entryPoint === null) {
            entryPoint = { i: 0, j: this.array.shape[Dimension.HEIGHT] };
            this.resizeToFit({ sprite });
        }

        let width = sprite.characters.shape[Dimension.WIDTH];
        let height = sprite.characters.shape[Dimension.HEIGHT];
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                this.array.set(
                    entryPoint.i + i,
                    entryPoint.j + j,
                    sprite.characters.get(i, j)
                );
            }
        }
    }

    toBytes() {
        let characters = [];
        let width = this.array.shape[Dimension.WIDTH];
        let height = this.array.shape[Dimension.HEIGHT];
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                characters.push(this.array.get(i, j));
            }
        }
        let bytes = [];
        characters.forEach(character => {
            if (character) {
                character.toBytes().forEach(byte => bytes.push(byte));
            } else {
                let numPixels = CHARACTER_SIZE * CHARACTER_SIZE;
                let numBytes = numPixels * (BITS_PER_PIXEL / 8);
                for (let i = 0; i < numBytes; i += 1) {
                    bytes.push(0);
                }
            }
        });
        return bytes;
    }

    resizeToFit({ sprite }) {
        let width = this.array.shape[Dimension.WIDTH];
        let newHeight =
            this.array.shape[Dimension.HEIGHT] +
            sprite.characters.shape[Dimension.HEIGHT];
        let array = ndarray(new Array(width, newHeight), [width, newHeight]);
        for (let j = 0; j < newHeight; j += 1) {
            for (let i = 0; i < width; i += 1) {
                if (j < this.array.shape[Dimension.HEIGHT]) {
                    array.set(i, j, this.array.get(i, j));
                } else {
                    array.set(i, j, null);
                }
            }
        }
        this.array = array;
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = CharacterMap;
