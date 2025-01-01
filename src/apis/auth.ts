import { useDefineApi } from "@/stores/useDefineApi"

export const LoginApi = useDefineApi<
    {
        data: {
            email: string;
            password: string;
        };
    },
    string
>({
    url: "/user/login",
    method: "POST"
});

export const RegisterApi = useDefineApi<
    {
        data: {
            username: string;
            email: string;
            password: string;
            verify_code: string;
        };
    },
    string
>({
    url: "/user/register",
    method: "POST"
});

export const SendVerificationCodeApi = useDefineApi<
    {
        data: {
            email: string;
        };
    },
    string
>({
    url: "/email/send",
    method: "POST"
});