"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("./base.model");
exports.tableName = 'scheduler';
class DeviceModel extends base_model_1.default {
    constructor() {
        super({ tableName: exports.tableName });
    }
    getSchedulerList() {
        const sql = `
    SELECT * FROM t_scheduler sd
    LEFT JOIN t_script sc ON sc.script_id = sd.script_id`;
        return this.$db.query(sql);
    }
}
exports.DeviceModel = DeviceModel;
exports.default = new DeviceModel();
