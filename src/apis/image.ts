import { useDefineApi } from "@/stores/useDefineApi";
import { Album } from "@/types/misc";

export const uploadImageApi = useDefineApi<
    {
        params: {
            role: Album;
        };
        data: FormData;
    },
    string
>({
    method: "post",
    url: "/upload/image",
});