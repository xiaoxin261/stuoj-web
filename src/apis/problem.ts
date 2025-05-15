import { useDefineApi } from "@/stores/useDefineApi";
import type { Global, ProblemHistory, ProblemInfo, ProblemParams, Solution, Testcase } from "@/types/Problem";
import type { Page } from "@/types/misc";


export const getProblemListApi = useDefineApi<
    {
        params: ProblemParams;
    },
    Page<"problems", ProblemInfo>
>({
    url: "/problem/",
    method: "get"
});

export const getProblemApi = useDefineApi<
    {
        id: number
        params?: {
            testcases?: boolean,
            solutions?: boolean,
        }
    },
    ProblemInfo
>({
    url: "/problem",
    method: "get"
});

export const insertProblemApi = useDefineApi<
    {
        data: ProblemInfo
    },
    number
>({
    url: "/problem/",
    method: "post"
});

export const updateProblemApi = useDefineApi<
    {
        data: ProblemInfo
    },
    null
>({
    url: "/problem/",
    method: "put"
})

export const deleteProblemApi = useDefineApi<
    {
        id: number
    },
    null
>({
    url: "/problem",
    method: "delete"
})

export const problemAddTagApi = useDefineApi<
    {
        data: {
            problem_id: number,
            tag_id: number
        }
    },
    null
>({
    url: "/problem/tag",
    method: "post"
})

export const problemRemoveTagApi = useDefineApi<
    {
        data: {
            problem_id: number,
            tag_id: number
        }
    },
    null
>({
    url: "/problem/tag",
    method: "delete"
})

export const getTestcaseListApi = useDefineApi<
    {
        params: {
            problem: number,
            page: number,
            size: number,
        }
    },
    Page<"testcases", Testcase>
>({
    url: "/testcase/",
    method: "get"
})

export const getTestcaseApi = useDefineApi<
    {
        id: number
    },
    Testcase
>({
    url: "/testcase",
    method: "get"
})

export const uploadTestcaseApi = useDefineApi<
    {
        data: Testcase
    },
    number
>({
    url: "/testcase/",
    method: "post"
})

export const updateTestcaseApi = useDefineApi<
    {
        data: Testcase
    },
    null
>({
    url: "/testcase/",
    method: "put"
})

export const deleteTestcaseApi = useDefineApi<
    {
        id: number
    },
    null
>({
    url: "/testcase",
    method: "delete"
})

export const datamakeApi = useDefineApi<
    { data: Global },
    string
>({
    url: "/testcase/datamake",
    method: "post"
})

export const getSolutionListApi = useDefineApi<
    {
        params: {
            problem: number,
            page: number,
            size: number,
        }
    },
    Page<"solutions", Solution>
>({
    url: "/solution/",
    method: "get"
})

export const getSolutionApi = useDefineApi<
    {
        id: number
    },
    Solution
>({
    url: "/solution",
    method: "get"
})

export const uploadSolutionApi = useDefineApi<
    {
        data: Solution
    },
    number
>({
    url: "/solution/",
    method: "post"
})

export const updateSolutionApi = useDefineApi<
    {
        data: Solution
    },
    null
>({
    url: "/solution/",
    method: "put"
})

export const deleteSolutionApi = useDefineApi<
    {
        id: number
    },
    null
>({
    url: "/solution",
    method: "delete"
})

export const getProblemHistoryApi = useDefineApi<
    {
        id: number
    },
    ProblemHistory
>({
    url: "/problem/history",
    method: "get"
})