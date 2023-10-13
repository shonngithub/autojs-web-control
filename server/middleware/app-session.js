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
const session = require("koa-session");
const redis_1 = require("@/utils/redis");
const store = {
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const sess = yield redis_1.redis.get(key);
            return JSON.parse(sess);
        });
    },
    set(key, sess, maxAge) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.redis.set(key, JSON.stringify(sess), 'PX', maxAge);
        });
    },
    destroy(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.redis.del(key);
        });
    },
};
const CONFIG = {
    key: 'j:sess',
    maxAge: 1000 * 60 * 60 * 2,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    store,
};
exports.default = (koaInstance) => {
    koaInstance.keys = [CONFIG.key];
    return session(CONFIG, koaInstance);
};
