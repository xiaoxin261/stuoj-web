export type Page<P extends string, T> = {
    [key in P]: T[];
} & {
    page?: number;
    size?: number;
    total: number;
};

export enum Album {
    avatar = 1,
    problem = 2,
    blog = 3,
}

export const AlbumMap = {
    [Album.avatar]: "头像",
    [Album.problem]: "题目",
    [Album.blog]: "博客",
}

export enum OrderBy {
    id = "id",
    user = "user_id",
    problem = "problem_id",
    blog = "blog_id",
    create_time = "create_time",
    update_time = "update_time",
    status = "status",
}

export const OrderByMap = {
    [OrderBy.user]: "用户",
    [OrderBy.problem]: "题目",
    [OrderBy.blog]: "博客",
    [OrderBy.create_time]: "创建时间",
    [OrderBy.update_time]: "更新时间",
    [OrderBy.status]: "状态",
}