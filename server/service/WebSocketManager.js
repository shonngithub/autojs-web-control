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
const events_1 = require("events");
const WebSocket = require("ws");
const log4js_1 = require("@/utils/log4js");
const logger = log4js_1.default('WebSocketManager');
const clientRequestListeners = [];
const clientMessageListeners = [];
const clientStatusChangeListeners = [];
const deviceLogListeners = [];
const messageAnswer = new Map();
class WebSocketManager extends events_1.EventEmitter {
    static init(server) {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager(server);
        }
        WebSocketManager.instance.ping();
        return WebSocketManager.instance;
    }
    static getInstance() {
        if (!WebSocketManager.instance) {
            logger.info('WebSocketManager Not initialized!');
        }
        return WebSocketManager.instance;
    }
    constructor(server) {
        super();
        this.httpServer = server;
        this.wss = new WebSocket.Server({ noServer: true });
        this.setListeners();
    }
    setListeners() {
        this.httpServer.on('upgrade', (request, socket, head) => {
            this.authenticate(request, (authenticateInfo) => {
                if (authenticateInfo.type) {
                    this.wss.handleUpgrade(request, socket, head, (ws) => {
                        ws.type = authenticateInfo.type;
                        ws.extData = authenticateInfo.extData;
                        this.wss.emit('connection', ws, request);
                    });
                }
            });
        });
        this.wss.addListener('connection', this.onWebSocketConnection.bind(this));
        this.wss.addListener('error', (err) => {
            logger.error('WebSocket.Server error -> ' + err.message);
        });
    }
    ping() {
        if (!this.pingTimeout) {
            this.pingTimeout = setInterval(() => {
                this.wss.clients.forEach((ws) => {
                    if (ws.isAlive === false) {
                        return ws.terminate();
                    }
                    ws.isAlive = false;
                    ws.ping(() => { });
                });
            }, 3000);
        }
    }
    authenticate(req, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = '';
            let extData = null;
            for (let i = 0; i < clientRequestListeners.length; i++) {
                const r = yield clientRequestListeners[i](req);
                type = r.type || type;
                extData = r.extData || extData;
            }
            cb({ type, extData });
        });
    }
    onWebSocketConnection(client, req) {
        return __awaiter(this, void 0, void 0, function* () {
            client.ip = req.connection.remoteAddress || (req.headers['x-forwarded-for'] || '').split(/\s*,\s*/)[0];
            client.ip = client.ip.replace(/[^0-9\.]/ig, '');
            logger.info('WebSocket.Server connection client ip -> ' + client.ip + ' url -> ' + req.url);
            client.addListener('close', (code, message) => {
                console.log('\n\nclose>>>>');
                logger.info('WebSocket.Client close ip -> ' + client.ip + ' code -> ' + code + ' message-> ' + message);
                clientStatusChangeListeners.forEach((listener) => {
                    listener(client, 'close');
                });
            });
            client.addListener('error', (err) => {
                logger.info('WebSocket.Client error ip -> ' + client.ip + ' message-> ' + err.message);
                clientStatusChangeListeners.forEach((listener) => {
                    listener(client, 'error');
                });
            });
            client.addListener('message', (data) => {
                const message = JSON.parse(data);
                if (message.type === 'respond') {
                    const answer = messageAnswer.get(message.message_id);
                    answer && answer(null, message);
                }
                else if (message.type === 'log') {
                    deviceLogListeners.forEach((listener) => {
                        listener(client, message);
                    });
                }
                else {
                    clientMessageListeners.forEach((listener) => {
                        listener(client, data);
                    });
                }
            });
            client.isAlive = true;
            client.addEventListener('pong', () => {
                console.log('pong');
                client.isAlive = true;
            });
            logger.info('WebSocket.Client open ip -> ' + client.ip);
            clientStatusChangeListeners.forEach((listener) => {
                listener(client, 'open');
            });
        });
    }
    addDeviceLogListener(listener) {
        deviceLogListeners.push(listener);
    }
    addClientRequestListeners(listener) {
        clientRequestListeners.push(listener);
    }
    addClientMessageListener(listener) {
        clientMessageListeners.push(listener);
    }
    addClientStatusChangeListener(listener) {
        clientStatusChangeListeners.push(listener);
    }
    sendMessage(client, message, cb) {
        if (client.readyState === WebSocket.OPEN) {
            message.message_id = `${Date.now()}_${Math.random()}`;
            client.send(JSON.stringify(message), (err) => {
                if (err) {
                    logger.error(`send message appear error, message -> ${err.message}`);
                    cb(err);
                }
                else {
                    messageAnswer.set(message.message_id, cb);
                }
            });
        }
    }
    broadcast(message) {
        for (const ws of this.wss.clients.values()) {
            this.sendMessage(ws, message);
        }
    }
    sendMessageToClients(clients, message) {
        clients.forEach((client) => {
            this.sendMessage(client, message);
        });
    }
    getClients() {
        return this.wss.clients;
    }
}
exports.WebSocketManager = WebSocketManager;
