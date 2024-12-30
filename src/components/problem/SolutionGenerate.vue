<template>
    <ElContainer v-loading="loading" style="display: flex;flex-direction: column;">
        <div class="section">
            <h2>已有题解代码</h2>
            <ElInput v-model="solution" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"></ElInput>
        </div>
        <div class="section">
            <h2>草拟题解代码</h2>
            <ElInput v-model="source_code" readonly type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" />
        </div>
        <div class="section">
            <h2>解题思路</h2>
            <ElInput v-model="explanation" readonly type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" />
        </div>
        <div class="button">
            <ElText size="large" tag="b">目标语言</ElText>
            <LanguageSelect style="width: 30%;" v-model:lang="target_language" />
            <ElButton type="primary" @click="generate">生成</ElButton>
        </div>
    </ElContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { solutionGenerateApi } from '@/apis/ai';
import { type ProblemInfo, type Tag } from "@/types/Problem";
import type { Language } from '@/types/Judge';
import LanguageSelect from '../judge/LanguageSelect.vue';


const { execute } = solutionGenerateApi();

const props = defineProps<{
    problem: ProblemInfo;
    tags: Tag[];
}>();

const solution = ref<string>("");

const target_language = ref<Language>({ id: 1, name: "C" });

const language = ref<string>("");
const source_code = ref<string>("");
const explanation = ref<string>("");

const loading = ref(false);

const generate = async () => {
    loading.value = true;
    await execute({
        data: {
            ...props.problem,
            tags: props.tags.map(tag => tag.name),
            solution: solution.value,
            language: target_language.value.name,
        }
    }).then(res => {
        language.value = res.value?.language || '';
        source_code.value = res.value?.source_code || '';
        explanation.value = res.value?.explanation || '';
    }).finally(() => { loading.value = false; });
}

</script>

<style scoped>
.button {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>