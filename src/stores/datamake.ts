import { createGlobalState } from "@vueuse/core";
import { Type, type Global, type GlobalId, type Row, type RowId, type Value, type ValueId } from "@/types/Problem";
import { generateRandomHash } from "@/utils/hash";

export const datamakeStore = createGlobalState(() => {
    const globalMap: Map<string, GlobalId> = new Map();
    const rowMap: Map<string, RowId> = new Map();
    const valueMap: Map<string, ValueId> = new Map();

    // 创建 Global 实例
    const CreateGlobal = () => {
        const hash = generateRandomHash();
        let global: GlobalId = {
            id: hash,
            rows: []
        };
        globalMap.set(hash, global);
        return hash;
    }

    // 更新 Global 实例
    const UpdateGlobal = (id: string, global: Global) => {
        const updatedGlobal: GlobalId = {
            id,
            ...global
        };
        globalMap.set(id, updatedGlobal);
    };

    // 获取 Global 实例
    const GetGlobal = (id: string) => {
        return globalMap.get(id) as Global;
    }

    // 删除 Global 实例
    const DeleteGlobal = (id: string) => {
        globalMap.delete(id);
        rowMap.forEach((row, key) => {
            if (row.globalId === id) {
                DeleteRow(key);
            }
        });
    };

    const GetRowIds = (globalId: string) => {
        let global = globalMap.get(globalId);
        if (global) {
            return global.rows.map(r => r.id);
        }
        return [];
    }

    // 创建 Row 实例
    const CreateRow = (globalId: string) => {
        const hash = generateRandomHash();
        let row: RowId = {
            globalId: globalId,
            id: hash,
            values: []
        };
        rowMap.set(hash, row);
        let global = globalMap.get(globalId);
        if (global) {
            global.rows.push(row);
            UpdateGlobal(globalId, global);
        }
        return hash;
    }

    // 更新 Row 实例
    const UpdateRow = (id: string, row: Row) => {
        let _row = rowMap.get(id);
        if (_row) {
            const updatedRow: RowId = {
                globalId: _row.globalId,
                id: _row.id,
                ...row
            };
            rowMap.set(id, updatedRow);
            let global = globalMap.get(_row.globalId);
            if (global) {
                global.rows = global.rows.map(r => r.id === id ? updatedRow : r);
                UpdateGlobal(_row.globalId, global);
            }
        }
    };

    // 获取 Row 实例
    const GetRow = (id: string) => {
        return rowMap.get(id) as Row;
    }

    // 删除 Row 实例
    const DeleteRow = (id: string) => {
        const _row = rowMap.get(id);
        rowMap.delete(id);
        valueMap.forEach((value, key) => {
            if (value.rowId === id) {
                DeleteValue(key);
            }
        });
        if (_row) {
            let global = globalMap.get(_row.globalId);
            if (global) {
                global.rows = global.rows.filter(r => r.id !== id);
                UpdateGlobal(_row.globalId, global);
            }
        }
    };

    const GetValueIds = (rowId: string) => {
        let _row = rowMap.get(rowId);
        if (_row) {
            return _row.values.map(v => v.id);
        }
        return [];
    }

    // 创建 Value 实例
    const CreateValue = (rowId: string) => {
        const hash = generateRandomHash();
        let value: ValueId = {
            rowId: rowId,
            id: hash,
            type: Type.Int
        };
        valueMap.set(hash, value);
        let _row = rowMap.get(rowId);
        if (_row) {
            _row.values.push(value);
            UpdateRow(rowId, _row);
        }
        return hash;
    }

    // 更新 Value 实例
    const UpdateValue = (id: string, value: Value) => {
        let _value = valueMap.get(id);
        if (_value) {
            const updatedValue: ValueId = {
                rowId: _value.rowId,
                id: _value.id,
                ...value
            };
            valueMap.set(id, updatedValue);
            let _row = rowMap.get(_value.rowId);
            if (_row) {
                _row.values = _row.values.map(v => v.id === id ? updatedValue : v);
                UpdateRow(_value.rowId, _row);
            }
        }
    }

    // 获取 Value 实例
    const GetValue = (id: string) => {
        return valueMap.get(id) as Value;
    }

    // 删除 Value 实例
    const DeleteValue = (id: string) => {
        const _value = valueMap.get(id);
        valueMap.delete(id);
        if (_value) {
            let _row = rowMap.get(_value.rowId);
            if (_row) {
                _row.values = _row.values.filter(v => v.id !== id);
                UpdateRow(_value.rowId, _row);
            }
        }
    };

    return {
        CreateGlobal,
        UpdateGlobal,
        GetGlobal,
        DeleteGlobal,
        CreateRow,
        UpdateRow,
        GetRow,
        DeleteRow,
        CreateValue,
        UpdateValue,
        GetValue,
        DeleteValue,
        GetRowIds,
        GetValueIds
    };
});