"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = require("./md5");
function createSign(data, key) {
    const keys = Object.keys(data);
    keys.sort();
    const signStr = keys.map(k => `${k}=${data[k]}`).join('&');
    const sign = md5_1.default(signStr + '&key=' + key);
    return sign;
}
exports.default = createSign;
