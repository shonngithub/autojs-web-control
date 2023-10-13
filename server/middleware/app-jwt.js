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
const jwt = require("jsonwebtoken");
const moment = require("moment");
const unless = require("koa-unless");
const result_utils_1 = require("@/utils/result-utils");
exports.secret = 'hahahahahah' + moment().format('YYYYMMDD');
exports.sign = (data) => {
    const token = jwt.sign(data, exports.secret, { expiresIn: '6h' });
    return token;
};
const JWTTokenError = {
    TokenExpiredError: '登录过期,请重新登录！',
    JsonWebTokenError: '权限验证失败，请重新登录！',
    NotBeforeError: 'jwt not active！',
};
exports.verify = (ctx) => {
    const token = ctx.query.token || ctx.header.authorization || ctx.cookies.get('authorization');
    return verifyToken(token);
};
function verifyToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            jwt.verify(token, exports.secret, (error, decoded) => {
                if (error) {
                    error.message = JWTTokenError[error.name];
                    error.name = 'JWTTokenError';
                    reject(error);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    });
}
exports.verifyToken = verifyToken;
exports.middleware = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield exports.verify(ctx);
        yield next();
    }
    catch (error) {
        ctx.body = result_utils_1.ResultUtils.forbidden(error.meaasge);
    }
});
exports.appJwt = () => {
    exports.middleware.unless = unless;
    return exports.middleware.unless({ method: 'OPTIONS', path: [/^\/static/, /^\/user\/login/] });
};
