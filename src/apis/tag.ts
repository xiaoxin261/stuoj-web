import {useDefineApi} from "@/stores/useDefineApi";
import type {ProblemInfo, Tag} from "@/types/Problem";
import type {Page} from "@/types/misc";
import type {TagParams} from "@/types/tag";

export const getTagListApi = useDefineApi<
    {
        params: TagParams;
    },
    Page<"tags", Tag>
>({
    url: "/tag/",
    method: "get"
});

export const deleteTagApi = useDefineApi<
    {
        id: number
    },
    {}
>({
    url: "/tag",
    method: "delete"
})

export const insertTagApi = useDefineApi<
    {
        data: Tag
    },
    number
>({
    url: "/tag/",
    method: "post"
});

export const updateTagApi = useDefineApi<
    {
        data: Tag
    },
    null
>({
    url: "/tag/",
    method: "put"
});
