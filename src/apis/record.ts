import { useDefineApi } from "@/stores/useDefineApi"
import type { Page } from "@/types/misc";
import type { Judgement, RecordParams, Submission } from "@/types/Record"
import type { UserInfo } from "@/types/User";

export const getRecordListApi = useDefineApi<
    {
        params: RecordParams;
    },
    Page<"submissions", Submission>
>({
    url: "/record/",
    method: "get"
})

export const getRecordInfoApi = useDefineApi<
    {
        id: number
    },
    {
        submission: Submission,
        judgements: Judgement[]
    }
>({
    url: "/record",
    method: "get"
})

export const getAcUserApi = useDefineApi<
    {
        params: {
            problem: number;
            size: number;
        };
    },
    UserInfo[]
>({
    url: "/record/ac/user",
    method: "get"
})

export const deleteRecordApi = useDefineApi<
    {
        id: number
    },
    {}
>({
    url: "/record",
    method: "delete"
})