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
const application_1 = require("@/common/application");
const log4js_1 = require("@/utils/log4js");
const result_utils_1 = require("@/utils/result-utils");
const logger = log4js_1.default('error-handle.ts');
exports.default = () => {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (error) {
            if (error.name === application_1.PARAM_VALIDATIONE_RROR) {
                return (ctx.body = result_utils_1.ResultUtils.badRequest(error.message));
            }
            if (error.name === 'TokenExpiredError') {
                return (ctx.body = result_utils_1.ResultUtils.forbidden('登陆过期，请重新登陆！'));
            }
            ctx.body = result_utils_1.ResultUtils.internalServerError(error.message);
            logger.error('server error：', error);
        }
    });
};
