class Color {
    constructor({ r, g, b }) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toRgbStr() {
        let r = this.r.toString().padStart(3, " ");
        let g = this.g.toString().padStart(3, " ");
        let b = this.b.toString().padStart(3, " ");
        return `(${r}, ${g}, ${b})`;
    }

    toHexStr() {
        let r = this.r.toString(16).padStart(2, "0");
        let g = this.g.toString(16).padStart(2, "0");
        let b = this.b.toString(16).padStart(2, "0");
        return `0x${r}${g}${b}`;
    }

    toSfcStr() {
        let r = this.r.toString(2).padStart(8, "0");
        let g = this.g.toString(2).padStart(8, "0");
        let b = this.b.toString(2).padStart(8, "0");
        return `0b0${b.slice(0, -3)}${g.slice(0, -3)}${r.slice(0, -3)}`;
    }

    toSfcBytes() {
        let r = this.r.toString(2).padStart(8, "0");
        let g = this.g.toString(2).padStart(8, "0");
        let b = this.b.toString(2).padStart(8, "0");
        let bits = `0${b.slice(0, -3)}${g.slice(0, -3)}${r.slice(0, -3)}`;
        let msb = bits.substring(0, 8);
        let lsb = bits.substring(8, 16);
        let bytes = [];
        bytes.push(parseInt(lsb, 2));
        bytes.push(parseInt(msb, 2));
        return bytes;
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = Color;
