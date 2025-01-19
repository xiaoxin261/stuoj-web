<template>
    <CodeEditor v-model="code_text" :mode="mode" :theme="theme" :options="options" />
    <div class="button-container">
        <LanguageSelect v-model:id="languageId" style="width: 50%; margin-right: 2%;" />
        <ElButton class="debug-button" @click="handleDebug" :disabled="languageId === 0" :loading="loading">调试</ElButton>
        <ElButton v-if="props.problem" class="submit-button" type="primary" @click="handleSubmit"
            :disabled="languageId === 0" :loading="loading">提交</ElButton>
    </div>
    <div class="result-container" v-if="resultFlag">
        <ElContainer v-loading="loading" class="result-container-content">
            <ElHeader class="result-container-header">
                <h1>{{ debugFlag ? '调试结果' : '提交结果' }}</h1>
            </ElHeader>
            <ElMain class="result-container-main">
                <div v-if="debugFlag">
                    <h3>输入</h3>
                    <ElInput type="textarea" v-model="debug_input" resize="none"
                        :autosize="{ minRows: 2, maxRows: 20 }" />
                    <h3>输出</h3>
                    <ElInput type="textarea" v-model="debug_out" resize="none" :readonly="true"
                        :autosize="{ minRows: 2, maxRows: 20 }" />
                    <div v-if="testState && testState.code === 1">
                        <ElText style="margin-right: 20px;">运行时间:{{ debug_state?.time }}s</ElText>
                        <ElText>运行内存:{{ debug_state?.memory }}KB</ElText>
                    </div>
                    <div v-else>
                        <ElText v-if="!debug_state?.stdout" type="danger">空输出</ElText>
                        <br />
                        <ElText type="danger">
                            {{ (debug_state?.compile_output || '') + '\n' + (debug_state?.stderr || '') }}
                        </ElText>
                    </div>
                </div>
                <div v-else>
                    <RecordInfo v-bind:id="judge_id" ref="recordInfoRef" />
                </div>
            </ElMain>
        </ElContainer>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { TestRun } from '@/apis/judge';
import { Submit } from '@/apis/judge';
import RecordInfo from '@/components/record/RecordInfo.vue';
import type { Judgement } from '@/types/Record';

const { execute: testExcute, state: testState } = TestRun();
const { execute: submitExcute, state: submitState } = Submit();

const props = withDefaults(defineProps<{
    modelValue?: string,
    mode?: string,
    theme?: string,
    options?: any,
    problem?: number | string,
    input_text?: string,
    langId?: number,
    source_text?: string,
}>(), {
    options: () => ({}),
    theme: 'monokai',
    input_text: '',
});

const loading = ref(false);

const languageId = ref(props.langId || 0);
const code_text = ref(props.source_text || '');
const debug_input = ref(props.input_text);
const debug_out = ref('');
const debug_state = ref<Judgement>();
const resultFlag = ref(false);
const debugFlag = ref(false);
const judge_id = ref(0);
const recordInfoRef = ref<InstanceType<typeof RecordInfo> | null>(null); // 显式声明类型

const emit = defineEmits(['update:modelValue']);

watch(() => code_text.value, (newValue) => {
    emit('update:modelValue', newValue);
});

const handleDebug = async () => {
    loading.value = true;
    debugFlag.value = true;
    resultFlag.value = true;
    if (recordInfoRef.value) {
        recordInfoRef.value.clear(); // 清空子组件内容
    }
    
    await testExcute({
        data: {
            language_id: languageId.value,
            source_code: code_text.value,
            stdin: debug_input.value,
        }
    });
    if (testState.value) {
        debug_out.value = testState.value.stdout ?? '';
        debug_state.value = testState.value;
    }
    loading.value = false;
};

const handleSubmit = async () => {
    loading.value = true;
    debugFlag.value = false;
    resultFlag.value = true;
    if (recordInfoRef.value) {
        recordInfoRef.value.clear(); // 清空子组件内容
    }
    let problem_id: number | undefined;

    if (typeof props.problem === 'string') {
        const match = props.problem.match(/\d+/);
        if (match) {
            problem_id = parseInt(match[0], 10);
        }
    } else {
        problem_id = props.problem;
    }
    if (problem_id != undefined)
        await submitExcute({
            data: {
                language_id: languageId.value,
                source_code: code_text.value,
                problem_id: problem_id,
            }
        });
    if (submitState.value) {
        judge_id.value = submitState.value;
    }
    loading.value = false;
};
</script>

<style scoped>
.button-container {
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    justify-content: flex-end;
}

.submit-button {
    width: 15%;
}

.result-container-content {
    border: 1px solid #dcdfe6;
}

.result-container-header {
    height: 30px;
    background-color: #f0f0f0c5;
}

.result-container-main {
    text-align: left;
}
</style>