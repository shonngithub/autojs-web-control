"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
exports.default = () => {
    return uuid.v1().replace(/-/gi, '');
};
