<template>
    <div class="container-main">
        <Problems />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getProblemListApi } from '@/apis/problem';
import { DifficultyMap, type ProblemInfo, ProblemStatusMap } from '@/types/Problem';
import type { Page } from '@/types/misc';
import ProblemTagSelect from '@/components/problem/ProblemTagSelect.vue';
import ProblemDifficultySelect from '@/components/problem/ProblemDifficultySelect.vue';
import { formatDateStr } from "@/utils/date";

interface Scope {
    row: {
        difficulty: keyof typeof DifficultyMap;
        status: keyof typeof ProblemStatusMap;
    };
}
const problemSelect = ref<ProblemParams>();
const problemPage = ref<Page<"problems", ProblemInfo>>();
const problems = ref<ProblemInfo[]>([]);
const { state, execute } = getProblemListApi()
interface ProblemParams {
    page: number
    size: number
    title?: string
    difficulty?: number
    tag?: number[]
    status?: number
}
const params = ref<ProblemParams>({
    page: 1,
    size: 20
});

const getList = async () => {
    await execute({
        params: {
            ...params.value,
            tag: params.value.tag?.join(',') // 将数组转换为字符串
        }
    })
    if (state.value) {
        problemPage.value = state.value;
        problems.value = problemPage.value.problems;
    }
}

onMounted(() => {
    getList();
});

const problemTagSelectRef = ref<InstanceType<typeof ProblemTagSelect> | null>(null);
const difficultySelectRef = ref<InstanceType<typeof ProblemDifficultySelect> | null>(null);
const handleReset = () => {
    if (difficultySelectRef.value)
        difficultySelectRef.value.reset();

    if (problemTagSelectRef.value)
        problemTagSelectRef.value.resetAndConfirm();

    params.value.title = '';
};

</script>