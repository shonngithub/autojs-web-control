"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocketManager_1 = require("./WebSocketManager");
const DeviceManager_1 = require("./DeviceManager");
class ScriptExecutor {
    static getInstance() {
        if (!ScriptExecutor.instance) {
            ScriptExecutor.instance = new ScriptExecutor();
        }
        return ScriptExecutor.instance;
    }
    run(devices, fileName, script) {
        const ol = DeviceManager_1.DeviceManager.getInstance().getOnlineDevices();
        if (ol.length === 0) {
            throw new Error('没有在线设备');
        }
        const data = {
            type: 'command',
            data: {
                command: 'run',
                id: fileName,
                view_id: fileName,
                name: fileName,
                script,
            },
        };
        WebSocketManager_1.WebSocketManager.getInstance().getClients().forEach((client) => {
            if (client.type === 'device' && (!devices || devices.includes(client.extData.device_id))) {
                WebSocketManager_1.WebSocketManager.getInstance().sendMessage(client, data);
            }
        });
    }
    stopAll(devices) {
        const ol = DeviceManager_1.DeviceManager.getInstance().getOnlineDevices();
        if (ol.length === 0) {
            throw new Error('没有在线设备');
        }
        const data = {
            type: 'command',
            data: {
                command: 'stopAll',
            },
        };
        WebSocketManager_1.WebSocketManager.getInstance().getClients().forEach((client) => {
            if (client.type === 'device' && (!devices || devices.includes(client.extData.device_id))) {
                WebSocketManager_1.WebSocketManager.getInstance().sendMessage(client, data);
            }
        });
    }
}
exports.default = ScriptExecutor;
