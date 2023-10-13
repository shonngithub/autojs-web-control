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
const joi = require("joi");
const application_1 = require("@/common/application");
const result_utils_1 = require("@/utils/result-utils");
const device_model_1 = require("@/model/device.model");
const role_1 = require("@/decorators/role");
const DeviceManager_1 = require("@/service/DeviceManager");
let Device = class Device {
    get_device_list() {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield device_model_1.default.getAll();
            const onlineDevices = DeviceManager_1.DeviceManager.getInstance().getOnlineDevices();
            devices.forEach((d) => {
                const ol = onlineDevices.find(i => i.device_name === d.name);
                if (ol) {
                    d.is_online = true;
                }
            });
            return result_utils_1.ResultUtils.success({ devices });
        });
    }
    add_device(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield device_model_1.default.insert(body);
            return result_utils_1.ResultUtils.success();
        });
    }
    update_device(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const isRepeat = yield device_model_1.default.getByDeviceName(body.name);
            if (isRepeat) {
            }
            yield device_model_1.default.updateById(body.device_id, body);
            return result_utils_1.ResultUtils.success();
        });
    }
    remove_device(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_model_1.default.getById(body.device_id);
            yield device_model_1.default.deleteById(body.device_id);
            DeviceManager_1.DeviceManager.getInstance().disconnectDeviceByIp(device.ip);
            return result_utils_1.ResultUtils.success();
        });
    }
    disconnect_device(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_model_1.default.getById(body.device_id);
            DeviceManager_1.DeviceManager.getInstance().disconnectDeviceByIp(device.ip);
            return result_utils_1.ResultUtils.success();
        });
    }
    onlineList(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const onlineDevices = DeviceManager_1.DeviceManager.getInstance().getOnlineDevices();
            return result_utils_1.ResultUtils.success(onlineDevices);
        });
    }
};
__decorate([
    application_1.Get('/get_device_list'),
    application_1.Description('获取设备列表'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Device.prototype, "get_device_list", null);
__decorate([
    application_1.Post('/add_device'),
    application_1.Description('新增设备'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Device.prototype, "add_device", null);
__decorate([
    application_1.Post('/update_device'),
    application_1.Description('编辑设备'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Device.prototype, "update_device", null);
__decorate([
    application_1.Post('/remove_device'),
    application_1.Description('删除设备'),
    application_1.BodySchame({
        device_id: joi.number(),
    }),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Device.prototype, "remove_device", null);
__decorate([
    application_1.Post('/disconnect_device'),
    application_1.Description('断开连接'),
    application_1.BodySchame({
        device_id: joi.number(),
    }),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Device.prototype, "disconnect_device", null);
__decorate([
    application_1.Get('/online/list'),
    application_1.Description('已连接设备列表'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Device.prototype, "onlineList", null);
Device = __decorate([
    application_1.Controller('/device'),
    application_1.Description('设备'),
    role_1.default()
], Device);
exports.Device = Device;
