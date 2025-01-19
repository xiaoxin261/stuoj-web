import { useDefineApi } from "@/stores/useDefineApi";
import { type CommentInfo, type CommentParams } from "@/types/Comment";
import type { Page } from "@/types/misc";

export const getCommentListApi = useDefineApi<
    {
        params: CommentParams;
    },
    Page<"comments", CommentInfo>
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