<template>
  <ElContainer v-loading="loading" style="display: flex;flex-direction: column;">
    <div class="section">
      <el-alert type="info">
        输入或者从题面获取题目数据，选择目标语言，点击翻译按钮，将自动翻译题目。
      </el-alert>
    </div>
    <br/>
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
      <h2>提示</h2>
      <ElInput v-model="problem.hint" type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 6 }">
      </ElInput>
    </div>
    <div class="button">
      <ElText size="large" tag="b">目标语言</ElText>
      <LangSelect v-model:lang="targetLanguage" />
      <ElButton type="primary" @click="translate" :disabled="targetLanguage === ''">翻译</ElButton>
    </div>

  </ElContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type ProblemInfo } from '@/types/Problem';
import { problemTranslateApi } from '@/apis/ai';
import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import LanguageSelect from "@/components/judge/LanguageSelect.vue";

const { execute } = problemTranslateApi();

const props = defineProps<{
  problem: ProblemInfo;
}>();


const problem = ref<ProblemInfo>(props.problem);
const targetLanguage = ref<string>("");

const emit = defineEmits(['update:problem']);

const insert = () => {
  emit('update:problem', problem.value);
}
const reset = () => {
  problem.value = props.problem;
}

const loading = ref<boolean>(false);

const translate = async () => {
  loading.value = true;
  await execute({
    data: {
      ...problem.value,
      target_lang: targetLanguage.value
    }
  }).then(res => {
    problem.value = {
      ...problem.value,
      ...res.value,
    }
  }).finally(() => { loading.value = false; });
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
  gap: 20px;
}
</style>