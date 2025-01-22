import { useDefineApi } from "@/stores/useDefineApi"
import type { Language } from "@/types/Judge"
import type { Judgement } from "@/types/Record";

export const Submit = useDefineApi<
    {
        data: {
            problem_id: number;
            language_id: number;
            source_code: string;
        }
    },
    number
>({
    url: "/judge/submit",
    method: "post",
});

export const getLanguageListApi = useDefineApi<
    {},
    Language[]
>({
    url: "/judge/language",
    method: "get"
});

export const TestRun = useDefineApi<
    {
        data: {
            stdin: string;
            language_id: number;
            source_code: string;
        }
    },
    Judgement
>({
    url: "/judge/testrun",
    method: "post"
});

