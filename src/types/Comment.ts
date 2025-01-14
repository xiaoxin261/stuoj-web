import type { UserInfo } from "./User";
import type { BlogInfo } from "./Blog";

export interface commentInfo {
    blog: BlogInfo;
    content: string;
    create_time: string;
    id: number;
    status: number;
    update_time: string;
    user: UserInfo;
    [property: string]: any;
}

export interface commentParams{
    page: number,
    size: number,
    user?: number,
    blog?: number,
    status?: number,
    "start-time"?: string,
    "end-time"?: string
}