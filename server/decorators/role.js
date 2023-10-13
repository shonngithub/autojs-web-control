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
const app_jwt_1 = require("../middleware/app-jwt");
function Role(...roles) {
    const role = application_1.Use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const signData = yield app_jwt_1.verify(ctx);
        ctx.state.curUser = signData;
        yield next();
    }));
    const description = application_1.Description(`【${roles.join()}】`);
    return (target, propertyKey) => {
        role(target, propertyKey);
        description(target, propertyKey);
    };
}
exports.default = Role;
