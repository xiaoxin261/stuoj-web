export interface BlogInfo {
    content?: string;
    create_time: string;
    id: number;
    problem_id?: number;
    status: number;
    title: string;
    update_time: string;
    user_id: number;
    [property: string]: any;
}

export enum BlogStatus {
    Banned = 1,
    Draft = 2,
    Review = 3,
    Public = 4,
    Notice = 5,
}

export const BlogStatusMap = {
    [BlogStatus.Banned]: "屏蔽",
    [BlogStatus.Public]: "公开",
    [BlogStatus.Draft]: "草稿",
    [BlogStatus.Review]: "审核",
    [BlogStatus.Notice]: "公告",
}

export const BlogStatusColor = {
    [BlogStatus.Banned]: "#E6A23C",
    [BlogStatus.Public]: "#67C23A",
    [BlogStatus.Draft]: "#999999",
    [BlogStatus.Review]: "#409EFF",
    [BlogStatus.Notice]: "#9D3DCF",
}