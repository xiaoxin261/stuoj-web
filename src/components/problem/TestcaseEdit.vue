<template>
    <div class="testcase-edit-title">
        <h4>测试数据修改</h4>
        <ElButton type="primary" @click="unfold">{{ unfoldFlag ? '收起' : '展开' }}</ElButton>
    </div>
    <ElForm v-if="unfoldFlag" :model="currentTestcase" label-width="auto">
        <ElFormItem label-position="right">
            <ElRow :gutter="20">
                <ElCol :span="8">
                    <ElFormItem label="测试点ID" label-position="right">
                        <ElInput v-model="currentTestcase.id" disabled />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="8">
                    <ElFormItem label="题目ID" label-position="right">
                        <ElInput v-model="currentTestcase.problem_id" disabled />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="8">
                    <ElFormItem label="测试点编号" label-position="right">
                        <ElInput v-model="currentTestcase.serial" />
                    </ElFormItem>
                </ElCol>
            </ElRow>
        </ElFormItem>
        <ElFormItem label="输入" label-position="right">
            <ElInput v-model="currentTestcase.test_input" type="textarea" />
        </ElFormItem>
        <ElFormItem label="输出" label-position="right">
            <ElInput v-model="currentTestcase.test_output" type="textarea" />
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

const { currentTestcase, resetCurrentTestcase } = problemEditStore();

const unfoldFlag = ref(false);

const unfold = () => {
    unfoldFlag.value = !unfoldFlag.value;
};


const handleReset = () => {
    resetCurrentTestcase();
};


</script>

<style scoped>
.testcase-edit-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.button-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>