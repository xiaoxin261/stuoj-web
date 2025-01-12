import { useDefineApi } from "@/stores/useDefineApi"
import type { Page } from "@/types/misc";
import type { Judgement, RecordParams, Submission } from "@/types/Record"

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