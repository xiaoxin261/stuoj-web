import { useDefineApi } from "@/stores/useDefineApi"
import type { Language } from "@/types/Judge"

export const getLanguageListApi = useDefineApi<
    {},
    Language[]
>({
    url: "/language/list",
    method: "get"
});

export const updateLanguageApi = useDefineApi<
    {
        data: Language
    },
    null
>({
    url: "/language/update",
    method: "put"
});