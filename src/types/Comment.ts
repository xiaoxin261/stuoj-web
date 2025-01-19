import type { UserInfo } from "./User";
import {Colors} from "@/types/Colors";

export interface CommentInfo {
    blog: CommentInfo;
    content: string;
    create_time: string;
    id: number;
    status: number;
    update_time: string;
    user: UserInfo;
    [property: string]: any;
}

export interface CommentParams {
    page: number,
    size: number,
    user?: number,
    blog?: number,
    status?: number,
    order?: string,
    order_by?: string,
    "start-time"?: string,
    "end-time"?: string
}

export enum CommentStatus {
    Banned = 1,
    Public = 2,
}

export const CommentStatusMap = {
    [CommentStatus.Banned]: "屏蔽",
    [CommentStatus.Public]: "公开",
}

export const CommentStatusColor = {
    [CommentStatus.Banned]: Colors.yellow,
    [CommentStatus.Public]: Colors.green,
}
