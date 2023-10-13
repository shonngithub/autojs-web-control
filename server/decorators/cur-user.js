"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("@/common/application");
const CurUser = application_1.createParamDecorator(ctx => {
    return ctx.state.curUser;
});
exports.default = CurUser;
