"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOCKS = {};
function getLock(type) {
    const pw = new PromiseWrap();
    if (!LOCKS[type]) {
        LOCKS[type] = { curLock: null, lockAt: null, queue: [] };
    }
    LOCKS[type].queue.push(pw);
    process.nextTick(() => {
        loop(type);
    });
    return pw.promise;
}
exports.getLock = getLock;
function loop(type) {
    if (!LOCKS[type]) {
        return;
    }
    if (LOCKS[type].curLock) {
        if (LOCKS[type].lockAt + 12 * 1000 < Date.now()) {
            LOCKS[type].curLock.release();
            console.error(`Lock ${type} Timeout Released`);
        }
        return;
    }
    const p = LOCKS[type].queue.shift();
    if (!p) {
        return;
    }
    const lock = new Lock(type);
    LOCKS[type].curLock = lock;
    LOCKS[type].lockAt = Date.now();
    p.resolve(lock);
}
function release(type) {
    LOCKS[type].curLock = null;
    LOCKS[type].lockAt = null;
    if (LOCKS[type].queue.length === 0) {
        delete LOCKS[type];
        return;
    }
    loop(type);
}
class PromiseWrap {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
class Lock {
    constructor(type) {
        this.type = type;
        this.isReleased = false;
    }
    release() {
        if (this.isReleased) {
            return;
        }
        release(this.type);
    }
}
