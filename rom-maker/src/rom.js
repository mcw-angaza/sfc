let fs = require("fs");

////////////////////////////////////////////////////////////////////////////////
let Log = require("./log");

////////////////////////////////////////////////////////////////////////////////
class Rom {
    static save({ arr, file }) {
        let bytes = [];
        arr.forEach(elem => {
            elem.toBytes().forEach(byte => bytes.push(byte));
        });
        let byteArray = new Uint8Array(bytes);
        fs.writeFileSync(`rom/${file}`, new Buffer.from(byteArray));
        Log.blue(`${bytes.length}B ROM [${file}]`);
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = Rom;
