<template>
    <ElContainer v-loading="loading" style="display: flex;flex-direction: column;">
      <div class="section">
        <el-alert type="info">
          点击生成按钮，将自动生成测试用例。
        </el-alert>
      </div>
        <div class="section">
            <h2 class="section-title">输入</h2>
            <ElInput v-model="testcase.test_input" readonly type="textarea" resize="none"
                :autosize="{ minRows: 5, maxRows: 10 }" />
        </div>
        <div class="section">
            <h2 class="section-title">输入解释</h2>
            <ElInput v-model="input_explanation" readonly type="textarea" resize="none"
                :autosize="{ minRows: 5, maxRows: 10 }" />
        </div>
        <div class="section">
            <h2 class="section-title">输出</h2>
            <ElInput v-model="testcase.test_output" readonly type="textarea" resize="none"
                :autosize="{ minRows: 5, maxRows: 10 }" />
        </div>
        <div class="section">
            <h2 class="section-title">输出解释</h2>
            <ElInput v-model="output_explanation" readonly type="textarea" resize="none"
                :autosize="{ minRows: 5, maxRows: 10 }" />
        </div>
        <div class="button">
            <ElButton type="primary" @click="generate">生成</ElButton>
        </div>
    </ElContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { testcaseGenerateApi } from '@/apis/ai';
import { type ProblemInfo, type Tag, type Testcase } from "@/types/Problem";

const { execute } = testcaseGenerateApi();

const props = defineProps<{
    problem: ProblemInfo;
    tags:Tag[];
}>();

const loading = ref(false);

const testcase = ref<Testcase>({
    test_input: '',
    test_output: '',
});

const input_explanation = ref<string>('');
const output_explanation = ref<string>('');

const generate = async () => {
    loading.value = true;
    await execute({
        data: {
            ...props.problem,
            tags: props.tags.map(tag => tag.name),
        }
    }).then(res => {
        if (res.value)
            testcase.value = res.value;
        input_explanation.value = res.value?.input_explanation || '';
        output_explanation.value = res.value?.output_explanation || '';
    }).finally(() => { loading.value = false; });
}


</script>

<style scoped>
.button {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}
</style>