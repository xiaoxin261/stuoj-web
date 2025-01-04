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