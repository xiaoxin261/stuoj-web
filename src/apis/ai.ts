import { useDefineApi } from "@/stores/useDefineApi"
import type { ProblemInfo, Testcase } from "src/types/Problem";

export const problemGenerateApi = useDefineApi<
    {
        data: ProblemInfo
    },
    ProblemInfo
>({
    url: "/admin/problem/generate",
    method: "POST"
});

export const problemTranslateApi = useDefineApi<
    {
        data: ProblemInfo
    },
    ProblemInfo
>({
    url: "/admin/problem/translate",
    method: "POST"
});

export const testcaseGenerateApi = useDefineApi<
    {
        data: ProblemInfo
    },
    Testcase & {
        input_explanation: string;
        output_explanation: string;
    }
>({
    url: "/admin/testcase/generate",
    method: "POST"
});

export const solutionGenerateApi = useDefineApi<
    {
        data: ProblemInfo
    },
    {
        language: string;
        source_code: string;
        explanation: string;
    }
>({
    url: "/admin/solution/generate",
    method: "POST"
});