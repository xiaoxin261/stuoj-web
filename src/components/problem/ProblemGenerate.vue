<template>
    <ElContainer v-loading="loading" style="display: flex;flex-direction: column;">
        <div class="section">
            <div class="title">
                <h2>题目</h2>
                <ElButtonGroup>
                    <ElButton type="primary" :icon="DArrowLeft" @click="insert">插入到题面</ElButton>
                    <ElButton type="info" @click="reset">从题面获取
                        <ElIcon>
                            <DArrowRight />
                        </ElIcon>
                    </ElButton>
                </ElButtonGroup>
            </div>
            <ElInput v-model="problem.title"></ElInput>
        </div>
        <div class="section">
            <h2>题目描述</h2>
            <ElInput v-model="problem.description" type="textarea" resize="none"
                :autosize="{ minRows: 5, maxRows: 10 }">
            </ElInput>
        </div>
        <div class="section">
            <h2>输入格式</h2>
            <ElInput v-model="problem.input" type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 6 }">
            </ElInput>
        </div>
        <div class="section">
            <h2>输出格式</h2>
            <ElInput v-model="problem.output" type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 6 }">
            </ElInput>
        </div>
        <div class="section">
            <h2>输入输出样例</h2>
            <div class="example">
                <div class="example-input">
                    <h3>输入</h3>
                    <ElInput v-model="problem.sample_input" type="textarea" resize="none"
                        :autosize="{ minRows: 4, maxRows: 6 }">
                    </ElInput>
                </div>
                <div class="example-output">
                    <h3>输出</h3>
                    <ElInput v-model="problem.sample_output" type="textarea" resize="none"
                        :autosize="{ minRows: 4, maxRows: 6 }">
                    </ElInput>
                </div>
            </div>
        </div>
        <div class="section">
            <h2>说明和提示</h2>
            <ElInput v-model="problem.hint" type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 6 }">
            </ElInput>
        </div>
        <div class="button">
            <ElButton type="primary" @click="generate">生成</ElButton>
        </div>
    </ElContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type ProblemInfo } from "@/types/Problem";
import { problemGenerateApi } from "@/apis/ai";
import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { ElButtonGroup } from "element-plus";

const { execute } = problemGenerateApi();

const props = defineProps<{
    problem: ProblemInfo
}>();

const problem = ref<ProblemInfo>(props.problem);

const emit = defineEmits(['update:problem']);

const insert = () => {
    emit('update:problem', problem.value);
}

const reset = () => {
    problem.value = props.problem;
}

const loading = ref<boolean>(false);

const generate = async () => {
    loading.value = true;
    await execute({
        data: problem.value
    }).then(res => {
        problem.value = {
            ...problem.value,
            ...res.value,
        }
    });
    loading.value = false;
}
</script>

<style scoped>
.title {
    display: flex;
    justify-content: space-between;
}

.button {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}
</style>