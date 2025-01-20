<template>
    <div class="testcase-edit-title">
        <h4>测试数据修改</h4>
        <ElButton type="primary" @click="unfold">{{ unfoldFlag ? '收起' : '展开' }}</ElButton>
    </div>
    <ElForm v-if="unfoldFlag" :model="localTestcase" label-width="auto">
        <ElFormItem label-position="right">
            <ElRow :gutter="20">
                <ElCol :span="8">
                    <ElFormItem label="测试点ID" label-position="right">
                        <ElInput v-model="localTestcase.id" disabled />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="8">
                    <ElFormItem label="题目ID" label-position="right">
                        <ElInput v-model="localTestcase.problem_id" disabled />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="8">
                    <ElFormItem label="测试点编号" label-position="right">
                        <ElInput v-model="localTestcase.serial" />
                    </ElFormItem>
                </ElCol>
            </ElRow>
        </ElFormItem>
        <ElFormItem label="输入" label-position="right">
            <ElInput v-model="localTestcase.test_input" type="textarea" />
        </ElFormItem>
        <ElFormItem label="输出" label-position="right">
            <ElInput v-model="localTestcase.test_output" type="textarea" />
        </ElFormItem>
        <ElFormItem>
            <div class="button-group">
                <ElSwitch v-model="testEditAutoSumit" active-text="自动提交" />
                <div style="width: 50%; display: flex; justify-content: flex-end;">
                    <ElButton @click="handleReset">重置</ElButton>
                    <ElButton type="primary" @click="handleSubmit">提交</ElButton>
                </div>
            </div>
        </ElFormItem>
    </ElForm>
</template>

<script setup lang="ts">
import type { Testcase } from '@/types/Problem';
import { ElSwitch } from 'element-plus';
import { ref, watch } from 'vue';
import { miscStore } from '@/stores/misc';

const { testEditAutoSumit } = miscStore();

const props = withDefaults(defineProps<{
    testcase?: Testcase,
}>(), {
    testcase: () => ({
        id: 0,
        serial: 0,
        problem_id: 0,
        test_input: '',
        test_output: '',
    }),
});

const unfoldFlag = ref(false);

const unfold = () => {
    unfoldFlag.value = !unfoldFlag.value;
};

const emit = defineEmits(['update:testcase']);

const oldTestcase = ref<Testcase>({ ...props.testcase });

const localTestcase = ref<Testcase>({ ...props.testcase });

const handleSubmit = async () => {
    emit('update:testcase', localTestcase.value);
};

const handleReset = () => {
    if (props.testcase)
        localTestcase.value = { ...oldTestcase.value };
};

watch(props, () => {
    if (props.testcase && props.testcase.hash !== localTestcase.value.hash) {
        oldTestcase.value = { ...props.testcase };
        localTestcase.value = { ...props.testcase };
    }
});

watch(localTestcase, () => {
    if (testEditAutoSumit.value && props.testcase.hash === localTestcase.value.hash)
        handleSubmit();
}, { deep: true });

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