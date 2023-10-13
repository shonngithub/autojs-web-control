"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("./base.model");
exports.tableName = 't_divice';
class DeviceModel extends base_model_1.default {
    constructor() {
        super({ tableName: exports.tableName });
    }
}
exports.DeviceModel = DeviceModel;
exports.default = new DeviceModel();
