import {Colors} from "@/types/Colors";
import type { ProblemInfo } from "./Problem";
import type { UserInfo } from "@/types/User";

export interface BlogInfo {
    content?: string;
    create_time: string;
    id: number;
    problem?: ProblemInfo;
    status: number;
    title: string;
    update_time: string;
    user: UserInfo;
    [property: string]: any;
}

export enum BlogStatus {
    Banned = 1,
    Draft = 2,
    Public = 3,
    Notice = 4,
}

export const BlogStatusMap = {
    [BlogStatus.Banned]: "屏蔽",
    [BlogStatus.Public]: "公开",
    [BlogStatus.Draft]: "草稿",
    [BlogStatus.Notice]: "公告",
}

export const BlogStatusColor = {
    [BlogStatus.Banned]: Colors.yellow,
    [BlogStatus.Public]: Colors.green,
    [BlogStatus.Draft]: Colors.gray9,
    [BlogStatus.Notice]: Colors.purple,
}
