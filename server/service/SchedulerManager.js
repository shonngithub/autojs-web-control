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
const cron_1 = require("cron");
const log4js_1 = require("@/utils/log4js");
const scheduler_model_1 = require("@/model/scheduler.model");
const script_model_1 = require("@/model/script.model");
const ScriptExecutor_1 = require("./ScriptExecutor");
const logger = log4js_1.default('SchedulerManager');
const jobs = new Map();
class SchedulerManager {
    static getInstance() {
        if (!SchedulerManager.instance) {
            logger.info('SchedulerManager Not initialized!');
        }
        return SchedulerManager.instance;
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            SchedulerManager.instance = new SchedulerManager();
            yield SchedulerManager.instance.initJobFromDb();
        });
    }
    initJobFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            jobs.clear();
            const schedulers = yield scheduler_model_1.default.getAll();
            for (const i in schedulers) {
                yield SchedulerManager.getInstance().addCronJob(schedulers[i].scheduler_id);
            }
        });
    }
    removeCronJonb(scheduler_id) {
        if (!jobs.has(scheduler_id)) {
            return;
        }
        const job = jobs.get(scheduler_id);
        job.stop();
        jobs.delete(scheduler_id);
    }
    addCronJob(scheduler_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (jobs.has(scheduler_id)) {
                return;
            }
            const scheduler = yield scheduler_model_1.default.getById(scheduler_id);
            if (!scheduler.active) {
                return;
            }
            try {
                const job = new cron_1.CronJob(scheduler.cron_time, this.onTick.bind(this, scheduler.scheduler_id));
                jobs.set(scheduler.scheduler_id, job);
                logger.info(`定时任务${scheduler.scheduler_name}添加成功，将于${job.nextDate().format('YY-MM-DD HH:mm')}执行`);
                job.start();
            }
            catch (error) {
                throw new Error('时间格式错误');
            }
        });
    }
    onTick(scheduler_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const scheduler = yield scheduler_model_1.default.getById(scheduler_id);
            if (!scheduler.active) {
                this.removeCronJonb(scheduler.scheduler_id);
            }
            const job = jobs.get(scheduler_id);
            logger.info(`执行定时任务${scheduler.scheduler_name}`);
            const script = yield script_model_1.default.getById(scheduler.script_id);
            ScriptExecutor_1.default.getInstance().run(scheduler.device_ids, `${scheduler.scheduler_name}-${script.script_name}`, script.script);
            if (job.nextDate().isBefore(new Date())) {
                logger.info(`最后一次执行该任务`);
            }
        });
    }
}
exports.SchedulerManager = SchedulerManager;
