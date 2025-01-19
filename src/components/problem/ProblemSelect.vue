<template>
    <ElForm :model="params">
        <el-form-item label="题名" label-position="right">
            <el-input v-model="params.title" />
        </el-form-item>
        <el-form-item label="难度" label-position="right">
            <TagSelect v-model:arr-str="params.difficulty" :str-map="DifficultyMap" ref="difficultyTagSelectRef" />
        </el-form-item>
        <el-form-item v-if="admin" label="状态" label-position="right">
            <TagSelect v-model:arr-str="params.status" :str-map="ProblemStatusMap" ref="statusTagSelectRef" />
        </el-form-item>
        <el-form-item label-width="auto">
            <ProblemTag layout="horizontal" :remove-flag="true" v-model:tag-ids="tagIds" ref="problemTagRef" />
        </el-form-item>
        <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleConfirm">查询</el-button>
        </el-form-item>
    </ElForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DifficultyMap, ProblemStatusMap, type ProblemParams } from '@/types/Problem';
import ProblemTag from '@/components/problem/ProblemTag.vue';
import TagSelect from '@/components/TagSelect.vue';

const props = withDefaults(defineProps<{
    params?: ProblemParams;
    admin?: boolean;
}>(), {
    params: () => ({ page: 1, size: 20 }),
    admin: false,
});

const tagIds = ref<number[]>([]);

const emit = defineEmits(['update:params', 'confirmClicked']);
const params = ref<ProblemParams>(props.params);

const problemTagRef = ref<InstanceType<typeof ProblemTag> | null>(null);
const difficultyTagSelectRef = ref<InstanceType<typeof TagSelect> | null>(null);
const statusTagSelectRef = ref<InstanceType<typeof TagSelect> | null>(null);
const handleReset = () => {
    if (difficultyTagSelectRef.value)
        difficultyTagSelectRef.value.reset();

    if (problemTagRef.value)
        problemTagRef.value.reset();

    if (statusTagSelectRef.value)
        statusTagSelectRef.value.reset();
    params.value.title = '';
    emit('update:params', params.value);
};
const handleConfirm = () => {
    params.value.tag = tagIds.value.join(',');
    emit('update:params', params.value);
    emit('confirmClicked');
};
</script>