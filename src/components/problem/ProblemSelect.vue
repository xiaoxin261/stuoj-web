<template>
    <ElForm :model="parmas">
        <el-form-item label="题名" label-position="right">
            <el-input v-model="parmas.title" />
        </el-form-item>
        <el-form-item label="难度" label-position="right">
            <ProblemDifficultySelect v-model="parmas.difficulty" ref="difficultySelectRef" />
        </el-form-item>
        <el-form-item label-width="auto">
            <ProblemTagSelect v-model="tags" ref="problemTagSelectRef" />
        </el-form-item>
        <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleConfirm">查询</el-button>
        </el-form-item>
    </ElForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ProblemParams } from '@/types/Problem';
import ProblemTagSelect from '@/components/problem/ProblemTagSelect.vue';
import ProblemDifficultySelect from '@/components/problem/ProblemDifficultySelect.vue';

const props = withDefaults(defineProps<{
    modelValue?: ProblemParams;
}>(), {
    modelValue: () => ({ page: 1, size: 20 })
});

const tags = ref<number[]>([]);

const emit = defineEmits(['update:modelValue', 'confirmClicked']);
const parmas = ref<ProblemParams>(props.modelValue);

const problemTagSelectRef = ref<InstanceType<typeof ProblemTagSelect> | null>(null);
const difficultySelectRef = ref<InstanceType<typeof ProblemDifficultySelect> | null>(null);
const handleReset = () => {
    if (difficultySelectRef.value)
        difficultySelectRef.value.reset();

    if (problemTagSelectRef.value)
        problemTagSelectRef.value.resetAndConfirm();
    parmas.value.title = '';
    emit('update:modelValue', parmas.value);
};
const handleConfirm = () => {
    parmas.value.tag =tags.value.join(',');
    emit('update:modelValue', parmas.value);
    emit('confirmClicked');
};
</script>