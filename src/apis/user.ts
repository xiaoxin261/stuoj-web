import { useDefineApi } from "@/stores/useDefineApi"
import type { UserInfo, UserParams } from "@/types/User";
import type { Page } from "@/types/misc";

export const getUserListApi = useDefineApi<
    {
        params: UserParams;
    },
    Page<"users", UserInfo>
>({
    url: "/admin/user",
    method: "get"
});

export const GetUserInfo = useDefineApi<
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
        id: number;
        data: {
            username: string;
            email: string;
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

export const UploadAvatar = useDefineApi<
    {
        id: number;
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