"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const log4js_1 = require("./log4js");
const logger = log4js_1.default('redis.ts');
exports.redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    db: 1,
    retryStrategy: times => Math.min(times * 500, 2000),
});
exports.redis.on('ready', () => {
    logger.info('redis connection is established');
});
exports.redis.on('error', (error) => {
    logger.error('redis error: ', error.message);
});
