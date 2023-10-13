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
const app_jwt_1 = require("@/middleware/app-jwt");
const WebSocketManager_1 = require("./WebSocketManager");
const logger = log4js_1.default('AdminSocketManager');
class AdminSocketManager {
    static getInstance() {
        if (!AdminSocketManager.instance) {
            logger.info('AdminSocketManager Not initialized!');
        }
        return AdminSocketManager.instance;
    }
    static init() {
        if (!AdminSocketManager.instance) {
            AdminSocketManager.instance = new AdminSocketManager();
        }
        WebSocketManager_1.WebSocketManager.getInstance().addClientRequestListeners((req) => __awaiter(this, void 0, void 0, function* () {
            const params = querystring.parse(req.url.replace('/?', ''));
            try {
                const data = yield app_jwt_1.verifyToken(params.token);
                return { type: 'admin', extData: data };
            }
            catch (error) {
                return { type: null };
            }
        }));
        WebSocketManager_1.WebSocketManager.getInstance().addDeviceLogListener((client, data) => {
            data.data.device = client.extData;
            WebSocketManager_1.WebSocketManager.getInstance().getClients().forEach((c) => {
                if (c.type === 'admin') {
                    WebSocketManager_1.WebSocketManager.getInstance().sendMessage(c, data);
                }
            });
        });
        WebSocketManager_1.WebSocketManager.getInstance().addClientStatusChangeListener((client, status) => {
            if (client.type === 'device') {
                WebSocketManager_1.WebSocketManager.getInstance().getClients().forEach((c) => {
                    if (c.type === 'admin') {
                        logger.info('WebSocket.Client device_change ip -> ' + client.ip + ' status -> ' + status);
                        WebSocketManager_1.WebSocketManager.getInstance().sendMessage(c, { type: 'device_change', data: { status } });
                    }
                });
            }
        });
    }
}
exports.AdminSocketManager = AdminSocketManager;
