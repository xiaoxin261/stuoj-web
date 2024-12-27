<template>
    <div class="solution-edit-title">
        <h4>题解修改</h4>
        <ElButton type="primary" @click="unfold">{{ unfoldFlag ? '收起' : '展开' }}</ElButton>
    </div>
    <ElForm v-if="unfoldFlag" :model="localSolution" label-width="auto">
        <ElFormItem label="ID" label-position="right">
            <ElInput v-model="localSolution.id" disabled />
        </ElFormItem>
        <ElFormItem label="题目ID" label-position="right">
            <ElInput v-model="localSolution.problem_id" disabled />
        </ElFormItem>
        <ElFormItem label="语言" label-position="right">
            <LanguageSelect v-model="localSolution.language_id" />
        </ElFormItem>
        <ElFormItem label="代码" label-position="right">
            <ElInput v-model="localSolution.source_code" type="textarea" />
        </ElFormItem>
        <ElFormItem>
            <ElButton type="primary" @click="handleSubmit">提交</ElButton>
            <ElButton @click="handleReset">重置</ElButton>
        </ElFormItem>
    </ElForm>
</template>

<script setup lang="ts">
import type { Solution } from '@/types/Problem';
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    solution?: Solution,
}>(), {
    solution: () => ({
        id: 0,
        problem_id: 0,
        language_id: 0,
        source_code: '',
    }),
});

const unfoldFlag = ref(false);

const unfold = () => {
    unfoldFlag.value = !unfoldFlag.value;
};

const emit = defineEmits(['update:solution']);

const localSolution = ref<Solution>({ ...props.solution });

const handleSubmit = async () => {
    emit('update:solution', localSolution.value);
};

const handleReset = () => {
    if (props.solution)
        localSolution.value = { ...props.solution };
    console.log(localSolution.value);
};

watch(props, () => {
    if (props.solution)
        localSolution.value = { ...props.solution };
    console.log(localSolution.value);
});
</script>

<style scoped>
.solution-edit-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
</style>
