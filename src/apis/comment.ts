import { useDefineApi } from "@/stores/useDefineApi";
import { type commentInfo, type commentParams } from "@/types/Comment";
import type { Page } from "@/types/misc";

export const getCommentListApi = useDefineApi<
    {
        params: commentParams;
    },
    Page<"comments", commentInfo>
>({
    url: "/comment/",
    method: "get"
});

export const uploadCommentApi = useDefineApi<
    {
        data: {
            blog_id: number,
            content: string
        };
    },
    null
>({
    url: "/comment/",
    method: "post"
});

export const deleteCommentApi = useDefineApi<
    {
        id: number
    },
    null
>({
    url: "/comment/",
    method: "delete"
});