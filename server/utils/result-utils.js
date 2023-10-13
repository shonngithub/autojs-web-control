"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResultUtils {
    static success(msgOrData, data) {
        if (data !== undefined || typeof msgOrData === 'string') {
            return { code: 200, message: msgOrData || '操作成功！', data: data || null };
        }
        return { code: 200, message: '操作成功！', data: msgOrData || null };
    }
    static badRequest(message, data) {
        return { code: 400, message, data };
    }
    static forbidden(message, data) {
        return { code: 403, message, data };
    }
    static internalServerError(message, data) {
        return { code: 500, message, data };
    }
}
exports.ResultUtils = ResultUtils;
