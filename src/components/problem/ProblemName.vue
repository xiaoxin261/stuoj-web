<template>
    <a class="color-none" :href="`/problem/${problem_info.id}`">
        <span class="problem-name" :style="{ fontSize: props.size + 'px', color: problemColor }">{{ problem_info.title
            }}</span>
    </a>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import type { ProblemInfo } from '@/types/Problem';
import { getProblemApi } from '@/apis/problem';
import { DifficultyColor } from '@/types/Problem';

const { execute } = getProblemApi();

const props = defineProps({
    problem: {
        type: Object as PropType<ProblemInfo>,
        default: () => { }
    },
    id: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 16
    }
});

const problem_info = ref<ProblemInfo>(props.problem);
const problemColor = ref<string>(DifficultyColor[problem_info.value.difficulty]);

onMounted(async () => {
    if (props.id !== 0) {
        await execute({ id: props.id }).then((res) => {
            if (!res.value) {
                return;
            };
            problem_info.value = res.value.problem;
            problemColor.value = DifficultyColor[problem_info.value.difficulty];
        });
    }
});
</script>

<style scoped>
.problem-name {
    font-weight: bold;
}
</style>