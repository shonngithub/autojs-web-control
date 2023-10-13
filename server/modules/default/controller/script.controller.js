"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("@/common/application");
const result_utils_1 = require("@/utils/result-utils");
const joi = require("joi");
const moment = require("moment");
const ScriptExecutor_1 = require("@/service/ScriptExecutor");
const script_model_1 = require("@/model/script.model");
const role_1 = require("@/decorators/role");
let Script = class Script {
    run(body) {
        return __awaiter(this, void 0, void 0, function* () {
            ScriptExecutor_1.default.getInstance().run(body.devices, body.fileName, body.script);
            return result_utils_1.ResultUtils.success();
        });
    }
    run2(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield script_model_1.default.getById(body.script_id);
            ScriptExecutor_1.default.getInstance().run(body.devices.join(','), script.script_name, script.script);
            return result_utils_1.ResultUtils.success();
        });
    }
    stopAll(body) {
        return __awaiter(this, void 0, void 0, function* () {
            ScriptExecutor_1.default.getInstance().stopAll(body.devices);
            return result_utils_1.ResultUtils.success();
        });
    }
    get_script(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield script_model_1.default.getById(query.id);
            return result_utils_1.ResultUtils.success(script);
        });
    }
    get_device_list() {
        return __awaiter(this, void 0, void 0, function* () {
            const scripts = yield script_model_1.default.getAll();
            return result_utils_1.ResultUtils.success({ scripts });
        });
    }
    add_device(body) {
        return __awaiter(this, void 0, void 0, function* () {
            body.create_time = moment(body.create_time || new Date()).format('YYYY-MM-DD HH:mm:ss');
            body.update_time = moment(body.update_time || new Date()).format('YYYY-MM-DD HH:mm:ss');
            const res = yield script_model_1.default.insert(body);
            return result_utils_1.ResultUtils.success({ script_id: res.insertId });
        });
    }
    update_device(body) {
        return __awaiter(this, void 0, void 0, function* () {
            body.create_time = undefined;
            body.update_time = moment(body.update_time || new Date()).format('YYYY-MM-DD HH:mm:ss');
            yield script_model_1.default.updateById(body.script_id, body);
            return result_utils_1.ResultUtils.success();
        });
    }
    remove_device(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield script_model_1.default.deleteById(body.script_id);
            return result_utils_1.ResultUtils.success();
        });
    }
};
__decorate([
    application_1.Post('/run'),
    application_1.Description('执行脚本'),
    application_1.BodySchame({
        devices: joi.string(),
        fileName: joi.string(),
        script: joi.string(),
    }),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Script.prototype, "run", null);
__decorate([
    application_1.Post('/run2'),
    application_1.Description('执行脚本2'),
    application_1.BodySchame({
        script_id: joi.any(),
        devices: joi.array().items(joi.any()),
    }),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Script.prototype, "run2", null);
__decorate([
    application_1.Post('/stop_all'),
    application_1.Description('执行脚本2'),
    application_1.BodySchame({
        devices: joi.array().items(joi.any()),
    }),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Script.prototype, "stopAll", null);
__decorate([
    application_1.Get('/get_script'),
    application_1.Description('获取脚本列表'),
    __param(0, application_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Script.prototype, "get_script", null);
__decorate([
    application_1.Get('/get_script_list'),
    application_1.Description('获取脚本列表'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Script.prototype, "get_device_list", null);
__decorate([
    application_1.Post('/add_script'),
    application_1.Description('新建脚本'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Script.prototype, "add_device", null);
__decorate([
    application_1.Post('/update_script'),
    application_1.Description('脚本保存'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Script.prototype, "update_device", null);
__decorate([
    application_1.Post('/remove_script'),
    application_1.Description('删除脚本'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Script.prototype, "remove_device", null);
Script = __decorate([
    application_1.Controller('/script'),
    application_1.Description('脚本'),
    role_1.default()
], Script);
exports.Script = Script;
