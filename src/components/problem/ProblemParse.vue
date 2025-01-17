<template>
  <ElContainer v-loading="loading" style="display: flex;flex-direction: column;">
    <div class="section">
      <el-alert type="info">
        将任意格式题目数据粘贴到下方，点击解析按钮，将自动解析题目。
      </el-alert>
    </div>
    <div class="section">
      <div class="title">
        <h5>待解析数据</h5>
      </div>
      <ElInput v-model="problem_data" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"></ElInput>
    </div>
    <br/>
    <div class="section">
      <div class="title">
        <h4>题目</h4>
        <ElButtonGroup>
          <ElButton type="primary" :icon="DArrowLeft" @click="insert">插入到题面</ElButton>
          <ElButton type="info" @click="parse">解析题目数据</ElButton>
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
      <h2>标签</h2>
      <div style="display: flex; gap:2px;">
        <ElTag v-for="tag in tags" :key="tag" closable @close="tags.splice(tags.indexOf(tag), 1)">{{ tag }}
        </ElTag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" style="width: 60px;" size="small"
                  @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
          + New Tag
        </el-button>
      </div>
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
      <h2>提示</h2>
      <ElInput v-model="problem.hint" type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 6 }">
      </ElInput>
    </div>
  </ElContainer>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { type ProblemInfo, type Tag } from "@/types/Problem";
import {problemParseApi} from "@/apis/ai";
import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { ElButtonGroup, type InputInstance } from "element-plus";

const { execute } = problemParseApi();

const props = defineProps<{
  problem: ProblemInfo;
  tags: Tag[];
}>();

const problem = ref<ProblemInfo>(props.problem);
const tags = ref<string[]>(props.tags.map(tag => tag.name));
const problem_data = ref<string>("");
const emit = defineEmits(['update:problem']);

const insert = () => {
  emit('update:problem', problem.value);
}

const reset = () => {
  problem.value = props.problem;
  tags.value = props.tags.map(tag => tag.name);
}

const inputVisible = ref(false);
const inputValue = ref('');
const InputRef = ref<InputInstance>();

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}


const handleInputConfirm = () => {
  if (inputValue.value) {
    tags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const loading = ref<boolean>(false);

const parse = async () => {
  loading.value = true;
  await execute({
    data: {
      data: problem_data.value,
    }
  }).then(res => {
    problem.value = {
      ...problem.value,
      ...res.value,
    }
    if (res.value) {
      tags.value = res.value.tags;
    }
  }).finally(() => { loading.value = false; });
}
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.button {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>