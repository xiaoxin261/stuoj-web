import {Colors} from "@/types/Colors";
import type { UserInfo } from "./User";

export interface ProblemInfo {
    create_time?: string;
    description?: string;
    difficulty: Difficulty;
    hint?: string;
    id?: number;
    input?: string;
    memory_limit?: number;
    output?: string;
    sample_input?: string;
    sample_output?: string;
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
    problem_id?: number;
    serial?: number;
    test_input: string;
    test_output: string;
    [property: string]: any;
}

export interface Global {
    rows: Row[];
    [property: string]: any;
}

export interface Row {
    row_size_id: number;
    values: Value[];
    [property: string]: any;
}

export interface Value {
    max?: number;
    max_id?: number;
    min?: number;
    min_id?: number;
    type: Type;
    value_size_id?: number;
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
    problem: ProblemInfo;
    sample_input: string;
    sample_output: string;
    source: string;
    time_limit: number;
    title: string;
    user: UserInfo;
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
    invalid = 1,
    editing = 2,
    debugging = 3,
    hidden = 4,
    public = 5,
}

export const ProblemStatusMap = {
    [ProblemStatus.invalid]: "作废",
    [ProblemStatus.editing]: "出题",
    [ProblemStatus.debugging]: "调试",
    [ProblemStatus.hidden]: "隐藏",
    [ProblemStatus.public]: "公开",
}

export const ProblemStatusColor = {
    [ProblemStatus.invalid]: Colors.black,
    [ProblemStatus.editing]: Colors.yellow,
    [ProblemStatus.debugging]: Colors.red,
    [ProblemStatus.hidden]: Colors.gray9,
    [ProblemStatus.public]: Colors.green,
}

export enum Difficulty {
    U = 0,
    E = 1,
    D = 2,
    C = 3,
    B = 4,
    A = 5,
    S = 6,
}

export const DifficultyMap = {
    [Difficulty.U]: "[?]未知",
    [Difficulty.E]: "[E]入门",
    [Difficulty.D]: "[D]简单",
    [Difficulty.C]: "[C]中等",
    [Difficulty.B]: "[B]较难",
    [Difficulty.A]: "[A]困难",
    [Difficulty.S]: "[S]超难",
}

export const DifficultyColor = {
    [Difficulty.U]: Colors.gray9,
    [Difficulty.E]: Colors.yellow,
    [Difficulty.D]: Colors.green,
    [Difficulty.C]: Colors.blue,
    [Difficulty.B]: Colors.red,
    [Difficulty.A]: Colors.purple,
    [Difficulty.S]: Colors.black,
}

export interface ProblemParams {
    page: number
    size: number
    title?: string
    difficulty?: number
    tag?: string
    status?: number
}
