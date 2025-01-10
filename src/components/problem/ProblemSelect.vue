<template>
    <ElForm :model="parmas">
        <el-form-item label="题名" label-position="right">
            <el-input v-model="parmas.title" />
        </el-form-item>
        <el-form-item label="难度" label-position="right">
            <ProblemDifficultySelect v-model:difficulty="parmas.difficulty" ref="difficultySelectRef" />
        </el-form-item>
        <el-form-item v-if="admin" label="状态" label-position="right">
            <ProblemStatusSelect v-model:status="parmas.status" ref="statusSelectRef" />
        </el-form-item>
        <el-form-item label-width="auto">
            <ProblemTag layout="horizontal" :remove-flag="true" v-model:tags="tags" ref="problemTagRef" />
        </el-form-item>
        <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleConfirm">查询</el-button>
        </el-form-item>
    </ElForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ProblemParams, Tag } from '@/types/Problem';
import ProblemTag from '@/components/problem/ProblemTag.vue';
import ProblemDifficultySelect from '@/components/problem/ProblemDifficultySelect.vue';
import ProblemStatusSelect from '@/components/problem/ProblemStatusSelect.vue';

const props = withDefaults(defineProps<{
    params?: ProblemParams;
    admin?: boolean;
}>(), {
    params: () => ({ page: 1, size: 20 }),
    admin: false,
});

const tags = ref<Tag[]>([]);

const emit = defineEmits(['update:params', 'confirmClicked']);
const parmas = ref<ProblemParams>(props.params);

const problemTagRef = ref<InstanceType<typeof ProblemTag> | null>(null);
const difficultySelectRef = ref<InstanceType<typeof ProblemDifficultySelect> | null>(null);
const statusSelectRef = ref<InstanceType<typeof ProblemStatusSelect> | null>(null);
const handleReset = () => {
    if (difficultySelectRef.value)
        difficultySelectRef.value.reset();

    if (problemTagRef.value)
        problemTagRef.value.reset();

    if (statusSelectRef.value)
        statusSelectRef.value.reset();
    parmas.value.title = '';
    emit('update:params', parmas.value);
};
const handleConfirm = () => {
    parmas.value.tag = tags.value.map(tag => tag.id).join(',');
    emit('update:params', parmas.value);
    emit('confirmClicked');
};
</script>