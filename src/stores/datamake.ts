import { createGlobalState } from "@vueuse/core";
import { Type, type Global, type Row, type Value } from "@/types/Problem";
import { generateRandomHash } from "@/utils/hash";

export const datamakeStore = createGlobalState(() => {
    const globalMap: Map<string, Global> = new Map();
    const rowMap: Map<string, Row> = new Map();
    const valueMap: Map<string, Value> = new Map();
    // 创建 Global 实例
    const CreateGlobal = () => {
        const hash = generateRandomHash();
        let global: Global = {
            id: hash,
            rows: [],
            rowIds: []
        };
        globalMap.set(hash, global);
        return hash;
    }

    // 更新 Global 实例
    const UpdateGlobal = (id: string, global: Global) => {
        globalMap.set(id, global);
    };

    // 获取 Global 实例
    const GetGlobal = (id: string) => {
        let global = globalMap.get(id);
        const rowIds = global?.rowIds || [];
        let rows: Row[] = [];
        rowIds.forEach(rowId => {
            let row = GetRow(rowId);
            if (row) {
                rows.push(row);
            }
        });
        return { ...global, rows };
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
        return globalMap.get(globalId)?.rowIds || [];
    }

    // 创建 Row 实例
    const CreateRow = (globalId: string) => {
        const hash = generateRandomHash();
        let row: Row = {
            row_size_id: 0,
            values: [],
            valueIds: [],
            globalId: globalId
        };
        let global = globalMap.get(globalId);
        if (global?.rowIds) {
            global.rowIds.push(hash);
            UpdateGlobal(globalId, global);
        }
        rowMap.set(hash, row);
        return hash;
    }

    // 更新 Row 实例
    const UpdateRow = (id: string, row: Row) => {
        rowMap.set(id, row);
    };

    // 获取 Row 实例
    const GetRow = (id: string): Row => {
        let row = rowMap.get(id);
        const valueIds = row?.valueIds || [];
        let values: Value[] = [];
        valueIds.forEach(valueId => {
            let value = GetValue(valueId);
            if (value) {
                values.push(value);
            }
        });
        return { ...row, values: values, row_size_id: row?.row_size_id || 0 };
    }

    // 删除 Row 实例
    const DeleteRow = (id: string) => {
        const _row = rowMap.get(id);
        rowMap.delete(id);
        _row?.valueIds?.forEach(valueId => {
            DeleteValue(valueId);
        });
        let globalId = _row?.globalId;
        if (globalId) {
            let global = globalMap.get(globalId);
            if (global?.rowIds) {
                global.rowIds = global.rowIds.filter(r => r !== id);
                UpdateGlobal(globalId, global);
            }
        }
    };

    const GetValueIds = (rowId: string) => {
        return rowMap.get(rowId)?.valueIds || [];
    }

    // 创建 Value 实例
    const CreateValue = (rowId: string) => {
        const hash = generateRandomHash();
        let value: Value = {
            type: Type.Int,
            rowId: rowId
        };
        valueMap.set(hash, value);
        let row = rowMap.get(rowId);
        if (row?.valueIds) {
            row.valueIds.push(hash);
            UpdateRow(rowId, row);
        }
    
        return hash;
    }

    // 更新 Value 实例
    const UpdateValue = (id: string, value: Value) => {
        valueMap.set(id, value);
    }

    // 获取 Value 实例
    const GetValue = (id: string) => {
        return valueMap.get(id);
    }

    // 删除 Value 实例
    const DeleteValue = (id: string) => {
        let rowId = valueMap.get(id)?.rowId;
        valueMap.delete(id);
        if (rowId) {
            let row = rowMap.get(rowId);
            if (row?.valueIds) {
                row.valueIds = row.valueIds.filter(v => v !== id);
                UpdateRow(rowId, row);
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