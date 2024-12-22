export interface BaseUserInfo {
    avatar: string;
    create_time?: string;
    email?: string;
    id: number;
    role: ROLE;
    signature: string;
    update_time: string;
    username: string;
    [property: string]: any;
}

export enum ROLE {
    Visitor = -1,
    Banned = 0,
    User = 1,
    Admin = 2,
    Root = 3,
}

export const RoleMap = {
    [ROLE.Visitor]: "Visitor",
    [ROLE.Banned]: "Banned",
    [ROLE.User]: "User",
    [ROLE.Admin]: "Admin",
    [ROLE.Root]: "Root"
};

export interface LoginReq{
    email: string;
    password: string;
}

export interface RegisterReq{
    username: string;
    email: string;
    password: string;
}