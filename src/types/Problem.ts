export interface ProblemInfo {
    create_time?: string;
    description: string;
    difficulty?: Difficulty;
    hint: string;
    id?: number;
    input: string;
    memory_limit?: number;
    output: string;
    sample_input: string;
    sample_output: string;
    source?: string;
    status?: number;
    time_limit?: number;
    title: string;
    update_time?: string;
    [property: string]: any;
}

export interface Tag {
    id: number;
    name: string;
    ProblemTag: null;
    [property: string]: any;
}

export interface Solution {
    id?: number;
    language_id: number;
    problem_id: number;
    source_code: string;
    [property: string]: any;
}

export interface Testcase {
    id?: number;
    problem_id: number;
    serial: number;
    test_input: string;
    test_output: string;
    [property: string]: any;
}

export interface Global {
    rows: Row[];
    rowIds?: string[];
    [property: string]: any;
}

export interface Row {
    row_size_id: number;
    values: Value[];
    valueIds?: string[];
    globalId?: string;
    [property: string]: any;
}

export interface Value {
    max?: number;
    max_id?: number;
    min?: number;
    min_id?: number;
    type: Type;
    value_size_id?: number;
    rowId?: string;
    [property: string]: any;
}

export enum Type {
    Float = "float",
    Int = "int",
}

export interface ProblemHistory {
    create_time: string;
    description: string;
    difficulty: number;
    hint: string;
    id: number;
    input: string;
    memory_limit: number;
    operation: number;
    output: string;
    problem_id: number;
    sample_input: string;
    sample_output: string;
    source: string;
    time_limit: number;
    title: string;
    user_id: number;
    [property: string]: any;
}

export interface FpsProblemInfo {
    create_time: string;
    description: string;
    input: string;
    memory_limit: number;
    output: string;
    sample_input: string;
    sample_output: string;
    time_limit: number;
    title: string;
    update_time: string;
    [property: string]: any;
}

export interface FpsTestcase {
    test_input?: string;
    test_output?: string;
    [property: string]: any;
}

export interface FpsSolution {
    create_time: string;
    language_id: number;
    source_code: string;
    update_time: string;
    [property: string]: any;
}

export enum ProblemStatus {
    invalid = 0,
    public = 1,
    editing = 2,
    eebugging = 3,
}

export const ProblemStatusMap = {
    [ProblemStatus.invalid]: "作废",
    [ProblemStatus.public]: "公开",
    [ProblemStatus.editing]: "出题中",
    [ProblemStatus.eebugging]: "调试中",
}

export enum Difficulty {
    unknown = 0,
    E = 1,
    D = 2,
    C = 3,
    B = 4,
    A = 5,
    S = 6,
}

export const DifficultyMap = {
    [Difficulty.unknown]: "暂无评定",
    [Difficulty.E]: "E级（入门）",
    [Difficulty.D]: "D级（简单）",
    [Difficulty.C]: "C级（中等）",
    [Difficulty.B]: "B级（较难）",
    [Difficulty.A]: "A级（困难）",
    [Difficulty.S]: "S级（超级困难）",
}

export interface ProblemParams {
    page: number
    size: number
    title?: string
    difficulty?: number
    tag?: string
    status?: number
}