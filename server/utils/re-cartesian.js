"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reCartesian(dataList, structure, results = []) {
    const keyMap = {};
    dataList.forEach(row => {
        const key = row[structure.table][structure.id];
        if (!keyMap[key]) {
            keyMap[key] = [];
            row[structure.table].groups = () => keyMap[key];
            results.push(row[structure.table]);
        }
        keyMap[key].push(row);
    });
    Object.keys(structure)
        .filter(k => !['table', 'id'].find(it => k === it))
        .forEach(key => {
        const value = structure[key];
        const stru = Array.isArray(value) ? value[0] : value;
        results.forEach(row => {
            const data = reCartesian(row.groups(), stru);
            row[key] = Array.isArray(value) ? data : data[0];
        });
    });
    return results;
}
exports.default = reCartesian;
