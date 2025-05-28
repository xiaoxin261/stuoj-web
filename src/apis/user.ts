import { useDefineApi } from "@/stores/useDefineApi"
import type { Role, UserInfo, UserParams } from "@/types/User";
import type { Page } from "@/types/misc";

export const getUserListApi = useDefineApi<
    {
        params: UserParams;
    },
    Page<"users", UserInfo>
>({
    url: "/user/",
    method: "get"
});

export const getUserInfoApi = useDefineApi<
    {
        id: number;
    },
    UserInfo
>({
    url: "/user",
    method: "GET"
});

export const ModifyUserInfo = useDefineApi<
    {
        data: {
            id: number;
            username: string;
            signature: string;
        }
    },
    null
>({
    url: "/user/modify",
    method: "PUT"
});


export const GetId = useDefineApi<
    {},
    number
>({
    url: "/user/current",
    method: "GET"
});

export const uploadAvatarApi = useDefineApi<
    {
        data: FormData;
    },
    null
>({
    url: "/user/avatar",
    method: "POST"
});

export const ModifyPassword = useDefineApi<
    {
        data: {
            email: string;
            password: string;
            verify_code: string;
        }
    },
    null
>({
    url: "/user/password",
    method: "PUT"
});

export const modifyUserRoleApi = useDefineApi<
    {
        data: {
            id: number;
            role: Role;
        }
    },
    null
>({
    url: "/user/role",
    method: "PUT"
});