<template>
    <ProblemSelect v-model:model-value="paramsSelect" @confirm-clicked="handleQuery" />
    <ProblemList :problems="problems" />

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Page } from '@/types/misc';
import type { ProblemInfo, ProblemParams } from '@/types/Problem';
import { getProblemListApi } from '@/apis/problem';

const { execute } = getProblemListApi();
const paramsSelect = ref<ProblemParams>();
const paramsPage = ref<ProblemParams>();
const params = ref<ProblemParams>({
    page: 1,
    size: 20,
});
const problemPage = ref<Page<"problems", ProblemInfo>>();
const problems = ref<ProblemInfo[]>([]);
onMounted(() => {
    handleQuery();
});
const handleQuery = async () => {
    params.value = {
        ...paramsSelect.value,
        page: paramsPage.value?.page || 1,
        size: paramsPage.value?.size || 20,
    }
    await execute({
        params: params.value
    }).then((res) => {
        problems.value = res.value?.problems || [];
    });
}
</script>