"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const Koa = require("koa");
const application_1 = require("@/common/application");
const enums_1 = require("@/utils/enums");
const result_utils_1 = require("@/utils/result-utils");
const appJwt = require("@/middleware/app-jwt");
const role_1 = require("@/decorators/role");
const cur_user_1 = require("@/decorators/cur-user");
const admin_model_1 = require("@/model/admin.model");
let Auth = class Auth {
    login(body, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield admin_model_1.default.getByName(body.username);
            if (!admin || admin.password !== body.password) {
                return result_utils_1.ResultUtils.badRequest('账号或密码错误');
            }
            const token = appJwt.sign({
                id: admin.admin_id,
                username: admin.uname,
            });
            ctx.cookies.set('authorization', token);
            return result_utils_1.ResultUtils.success({ token });
        });
    }
    logout(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.cookies.set('authorization', '');
            return result_utils_1.ResultUtils.success();
        });
    }
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            return result_utils_1.ResultUtils.success({
                roles: ['admin'],
                introduction: 'I am a super administrator',
                avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                name: 'Super Admin',
            });
        });
    }
    password(curUser, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield admin_model_1.default.getById(curUser.admin_id);
            yield admin_model_1.default.changePassword(admin.admin_id, body.password);
            return result_utils_1.ResultUtils.success();
        });
    }
};
__decorate([
    application_1.Post('/login'),
    application_1.Description('用户登陆'),
    application_1.BodySchame({
        username: joi.string().required(),
        password: joi.string().required(),
    }),
    __param(0, application_1.Body()), __param(1, application_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "login", null);
__decorate([
    application_1.Post('/logout'),
    application_1.Description('退出'),
    __param(0, application_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "logout", null);
__decorate([
    application_1.Get('/info'),
    application_1.Description('用户信息'),
    role_1.default(enums_1.SYS_ROLE.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Auth.prototype, "info", null);
__decorate([
    application_1.Post('/password'),
    application_1.Description('修改密码'),
    role_1.default(enums_1.SYS_ROLE.admin),
    __param(0, cur_user_1.default()), __param(1, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "password", null);
Auth = __decorate([
    application_1.Controller('/auth'),
    application_1.Description('auth')
], Auth);
exports.Auth = Auth;
