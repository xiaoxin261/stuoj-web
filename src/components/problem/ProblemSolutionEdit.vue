<template>
    <div class="solution-edit-title">
        <h4>题解修改</h4>
        <ElButton type="primary" @click="unfold">{{ unfoldFlag ? '收起' : '展开' }}</ElButton>
    </div>
    <ElForm v-if="unfoldFlag" :model="currentSolution" label-width="auto">
        <ElFormItem label-position="right">
            <ElRow :gutter="20">
                <ElCol :span="12">
                    <ElFormItem label="测试点ID" label-position="right">
                        <ElInput v-model="currentSolution.id" disabled />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                    <ElFormItem label="题目ID" label-position="right">
                        <ElInput v-model="currentSolution.problem_id" disabled />
                    </ElFormItem>
                </ElCol>
            </ElRow>
        </ElFormItem>
        <ElFormItem label="语言" label-position="right">
            <LanguageSelect v-model:id="currentSolution.language_id" />
        </ElFormItem>
        <ElFormItem label="代码" label-position="right">
            <ElInput v-model="currentSolution.source_code" type="textarea" :autosize="{ minRows: 10, maxRows: 20 }" />
        </ElFormItem>
        <ElFormItem>
            <div style="width: 100%; display: flex; justify-content: flex-end;">
                <ElButton @click="handleReset">重置</ElButton>
            </div>
        </ElFormItem>
    </ElForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { problemEditStore } from '@/stores/problemEdit';

const { currentSolution, resetCurrentSolution } = problemEditStore();

const unfoldFlag = ref(false);

const unfold = () => {
    unfoldFlag.value = !unfoldFlag.value;
};

const handleReset = () => {
    resetCurrentSolution();
};

</script>

<style scoped>
.solution-edit-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
</style>
