import {Colors} from "@/types/Colors";

export interface UserInfo {
    /**
     * 用户头像
     */
    avatar: string;
    create_time?: string;
    email?: string;
    id: number;
    role: Role;
    signature: string;
    update_time: string;
    username: string;
    [property: string]: any;
}

export enum Role {
    Visitor = 0,
    Banned = 1,
    Muted = 2,
    User = 3,
    Vip = 4,
    Editor = 5,
    Admin = 6,
    Root = 7,
}

export const UserRoleMap = {
    [Role.Visitor]: "访客",
    [Role.Banned]: "封禁",
    [Role.Muted]: "禁言",
    [Role.User]: "用户",
    [Role.Vip]: "会员",
    [Role.Editor]: "编辑",
    [Role.Admin]: "管理",
    [Role.Root]: "站长",
};

export const UserRoleColor = {
    [Role.Visitor]: Colors.gray9,
    [Role.Banned]: Colors.black,
    [Role.Muted]: Colors.gray4,
    [Role.User]: Colors.blue,
    [Role.Vip]: Colors.purple,
    [Role.Editor]: Colors.green,
    [Role.Admin]: Colors.yellow,
    [Role.Root]: Colors.red,
}

export interface LoginReq{
    email: string;
    password: string;
}

export interface RegisterReq{
    email: string;
    password: string;
    verify_code: string;
}

export interface UserParams {
    page: number
    size: number
    title?: string
    difficulty?: number
    tag?: string
    status?: number
}
