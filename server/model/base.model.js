"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@/utils/db");
class BaseService {
    constructor(args) {
        this.$db = db_1.default;
        this.$tableName = args.tableName;
        this.$primaryKey = args.primaryKey || `${args.tableName}_id`;
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.table(this.$tableName).where({ [this.$primaryKey]: id }).findOrEmpty();
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.table(this.$tableName).select();
        });
    }
    getPage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.table(this.$tableName).select();
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.table(this.$tableName).where({ [this.$primaryKey]: id }).delete();
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.table(this.$tableName).insert(data);
        });
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.table(this.$tableName).where({ [this.$primaryKey]: id }).update(data);
        });
    }
}
exports.default = BaseService;
