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
const application_1 = require("@/common/application");
const result_utils_1 = require("@/utils/result-utils");
const scheduler_model_1 = require("@/model/scheduler.model");
const role_1 = require("@/decorators/role");
const SchedulerManager_1 = require("@/service/SchedulerManager");
let Scheduler = class Scheduler {
    get_scheduler_list() {
        return __awaiter(this, void 0, void 0, function* () {
            const schedulers = yield scheduler_model_1.default.getSchedulerList();
            return result_utils_1.ResultUtils.success({ schedulers });
        });
    }
    add_scheduler(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield scheduler_model_1.default.insert(body);
            SchedulerManager_1.SchedulerManager.getInstance().addCronJob(res.insertId);
            return result_utils_1.ResultUtils.success();
        });
    }
    start_scheduler(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield scheduler_model_1.default.updateById(body.scheduler_id, { active: 1 });
            SchedulerManager_1.SchedulerManager.getInstance().addCronJob(body.scheduler_id);
            return result_utils_1.ResultUtils.success();
        });
    }
    update_scheduler(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield scheduler_model_1.default.updateById(body.scheduler_id, { active: 0 });
            SchedulerManager_1.SchedulerManager.getInstance().removeCronJonb(body.scheduler_id);
            return result_utils_1.ResultUtils.success();
        });
    }
    remove_scheduler(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const scheduler = yield scheduler_model_1.default.getById(body.scheduler_id);
            yield scheduler_model_1.default.deleteById(scheduler.scheduler_id);
            SchedulerManager_1.SchedulerManager.getInstance().removeCronJonb(scheduler.scheduler_id);
            return result_utils_1.ResultUtils.success();
        });
    }
};
__decorate([
    application_1.Get('/get_scheduler_list'),
    application_1.Description('获取计划列表'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Scheduler.prototype, "get_scheduler_list", null);
__decorate([
    application_1.Post('/add_scheduler'),
    application_1.Description('新增计划'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Scheduler.prototype, "add_scheduler", null);
__decorate([
    application_1.Post('/start_scheduler'),
    application_1.Description('停止计划'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Scheduler.prototype, "start_scheduler", null);
__decorate([
    application_1.Post('/stop_scheduler'),
    application_1.Description('停止计划'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Scheduler.prototype, "update_scheduler", null);
__decorate([
    application_1.Post('/remove_scheduler'),
    application_1.Description('删除计划'),
    __param(0, application_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Scheduler.prototype, "remove_scheduler", null);
Scheduler = __decorate([
    application_1.Controller('/scheduler'),
    application_1.Description('计划'),
    role_1.default()
], Scheduler);
exports.Scheduler = Scheduler;
