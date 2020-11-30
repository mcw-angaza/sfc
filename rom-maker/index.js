let fs = require("fs");
let getPixels = require("get-pixels");
let ndarray = require("ndarray");
let path = require("path");

////////////////////////////////////////////////////////////////////////////////
let Character = require("./src/character");
let CharacterMap = require("./src/characterMap");
let Dimension = require("./src/dimension");
let Log = require("./src/log");
let Palette = require("./src/palette");
let Rom = require("./src/rom");

////////////////////////////////////////////////////////////////////////////////
const CHARACTER_SIZE = 8;
const IN_DIR = path.join(__dirname, "in");
const MAX_COLORS = 16;

////////////////////////////////////////////////////////////////////////////////
let sprites = fs
    .readdirSync(IN_DIR)
    .filter(file => file.endsWith(".png"))
    .map(file => ({
        id: path.basename(file).slice(0, -path.extname(file).length),
        file,
        type: path.extname(file).substring(1)
    }));

////////////////////////////////////////////////////////////////////////////////
async function loadPixels() {
    for (let i = 0; i < sprites.length; i += 1) {
        let sprite = sprites[i];
        await new Promise(resolve => {
            getPixels(path.join(IN_DIR, sprite.file), (err, pixels) => {
                if (err) {
                    Log.error(err);
                    process.exit(1);
                }
                sprite.pixels = pixels;
                resolve();
            });
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
(async () => {
    await loadPixels();

    sprites.forEach(sprite => {
        let width = sprite.pixels.shape[Dimension.WIDTH];
        let height = sprite.pixels.shape[Dimension.HEIGHT];
        if (
            width !== height ||
            width % CHARACTER_SIZE !== 0 ||
            height % CHARACTER_SIZE !== 0
        ) {
            Log.error(
                `Invalid size [${width}x${height}] for sprite [${sprite.id}]`
            );
            process.exit(1);
        }
    });

    sprites.sort((a, b) => a.pixels.data.length < b.pixels.data.length);

    let palettes = [];
    sprites.forEach(sprite => {
        let palette = new Palette({ id: sprite.id, pixels: sprite.pixels });
        let numColors = palette.colors.length;
        if (numColors > MAX_COLORS) {
            Log.error(
                `Too many colors [${numColors}] in palette [${sprite.id}]`
            );
            process.exit(1);
        }
        sprite.palette = palette;
        palettes.push(palette);
    });

    sprites.forEach(sprite => {
        let width = sprite.pixels.shape[Dimension.WIDTH] / CHARACTER_SIZE;
        let height = sprite.pixels.shape[Dimension.HEIGHT] / CHARACTER_SIZE;
        let characters = ndarray(new Array(width * height), [width, height]);
        for (let j = 0; j < height; j += 1) {
            for (let i = 0; i < width; i += 1) {
                let pixels = sprite.pixels
                    .lo(i * CHARACTER_SIZE, j * CHARACTER_SIZE)
                    .hi(CHARACTER_SIZE, CHARACTER_SIZE);
                let character = new Character({
                    pixels,
                    palette: sprite.palette
                });
                let characterId = `${sprite.id}_${i}_${j}`;
                characters.set(i, j, character);
            }
        }
        sprite.characters = characters;
    });

    let characterMap = new CharacterMap();
    sprites.forEach(sprite => characterMap.addSprite({ sprite }));

    Rom.save({ arr: [characterMap], file: "sprite.rom" });
    Rom.save({ arr: palettes, file: "palette.rom" });
})();
