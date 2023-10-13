"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
exports.default = (str) => {
    const md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
};
