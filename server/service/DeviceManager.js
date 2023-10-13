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
const querystring = require("querystring");
const log4js_1 = require("@/utils/log4js");
const device_model_1 = require("@/model/device.model");
const WebSocketManager_1 = require("./WebSocketManager");
const moment = require("moment");
const logger = log4js_1.default('DeviceManager');
class DeviceManager {
    static getInstance() {
        if (!DeviceManager.instance) {
            logger.info('DeviceManager Not initialized!');
        }
        return DeviceManager.instance;
    }
    static init() {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager();
        }
        WebSocketManager_1.WebSocketManager.getInstance().addClientRequestListeners((req) => __awaiter(this, void 0, void 0, function* () {
            const params = querystring.parse(req.url.replace('/?', ''));
            if (params.token) {
                return { type: null };
            }
            const ip = (req.connection.remoteAddress || (req.headers['x-forwarded-for'] || '').split(/\s*,\s*/)[0]).replace(/[^0-9\.]/ig, '');
            const deviceName = params.name || ip;
            let device = yield device_model_1.default.getByDeviceName(deviceName);
            if (!device) {
                yield device_model_1.default.insert({ name: deviceName, ip, create_time: moment().format('YYYY-MM-DD HH:mm:ss') });
            }
            device = yield device_model_1.default.getByDeviceName(deviceName);
            yield device_model_1.default.updateById(device.device_id, { connect_time: moment().format('YYYY-MM-DD HH:mm:ss') });
            return { type: 'device', extData: device };
        }));
        WebSocketManager_1.WebSocketManager.getInstance().addClientStatusChangeListener((client, status) => {
            if (status === 'open' && client.type === 'device') {
                WebSocketManager_1.WebSocketManager.getInstance().sendMessage(client, { type: 'hello', data: { server_version: 2 } });
            }
        });
        WebSocketManager_1.WebSocketManager.getInstance().addClientMessageListener((client, data) => {
            if (client.type === 'device') {
                const message = JSON.parse(data);
                if (message.type === 'hello') {
                }
            }
        });
    }
    getOnlineDevices() {
        const deviceClients = [];
        WebSocketManager_1.WebSocketManager.getInstance().getClients().forEach((c) => {
            if (c.type === 'device') {
                deviceClients.push({
                    ip: c.ip,
                    device_name: c.extData.name,
                });
            }
        });
        return deviceClients;
    }
    disconnectDeviceByIp(ip) {
        WebSocketManager_1.WebSocketManager.getInstance().getClients().forEach((c) => {
            if (c.type === 'device' && c.ip === ip) {
                c.terminate();
            }
        });
    }
    disconnectDeviceByName(name) {
        WebSocketManager_1.WebSocketManager.getInstance().getClients().forEach((c) => {
            if (c.type === 'device' && c.extData.name === name) {
                c.terminate();
            }
        });
    }
}
exports.DeviceManager = DeviceManager;
