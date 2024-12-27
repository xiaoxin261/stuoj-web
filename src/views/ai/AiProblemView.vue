<template>
  <div class="algorithm-form">
    <div class="form-input">
      <label for="title"></label>
      <input class="input" style="margin: 25px;width: 500px;" id="title" v-model="req.title"
        placeholder="请输入标题..."></input>
    </div>
    <div class="form-input">
      <label for="description"></label>
      <textarea class="input" id="description" v-model="req.description" placeholder="请输入算法情景描述..."
        style="height: 250px;width: 500px;"></textarea>
    </div>
    <div style="display: table-row;">
      <textarea class="input" id="input" v-model="req.input" placeholder="输入格式"
        style="height: 100px;width: 200px; margin-right: 100px; margin-top: 25px;"></textarea>
      <textarea class="input" id="output" v-model="req.output" placeholder="输出格式"
        style="height: 100px;width: 200px;margin-top: 25px;"></textarea>
    </div>
    <div style="display: table-row;">
      <textarea class="input" id="sample_input" v-model="req.Sample_input" placeholder="请输入题目样例输入"
        style="height: 100px;width: 200px; margin-right: 100px; margin-top: 5px;"></textarea>
      <textarea class="input" id="sample_output" v-model="req.Sample_output" placeholder="请输入题目样例输出"
        style="height: 100px;width: 200px;margin-top: 5px;"></textarea>
    </div>
    <div>
      <textarea class="input" id="hint" v-model="req.Hint" placeholder="请输入题目提示"
        style="height: 50px;width: 500px;margin-top: 5px;"></textarea>
    </div>
    <form class="form" style="margin: 15px;">
      <input placeholder="输入算法标签1" class="tagInput" type="text" v-model="taginput1">
      <input placeholder="输入算法标签2" class="tagInput" type="text" v-model="taginput2">
      <input placeholder="输入算法标签3" class="tagInput" type="text" v-model="taginput3">
    </form>
    <button class="uiverse" @click="submitForm">
      <div class="wrapper">
        <span>开始生成题目</span>
        <div class="circle circle-12"></div>
        <div class="circle circle-11"></div>
        <div class="circle circle-10"></div>
        <div class="circle circle-9"></div>
        <div class="circle circle-8"></div>
        <div class="circle circle-7"></div>
        <div class="circle circle-6"></div>
        <div class="circle circle-5"></div>
        <div class="circle circle-4"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-1"></div>
      </div>
    </button>
  </div>
  <div v-if="isLoading" class="loader-container">
    <div class="loader">
      <div>
        <ul>
          <li>
            <svg fill="currentColor" viewBox="0 0 90 120">
              <path
                d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z">
              </path>
            </svg>
          </li>
          <li>
            <svg fill="currentColor" viewBox="0 0 90 120">
              <path
                d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z">
              </path>
            </svg>
          </li>
          <li>
            <svg fill="currentColor" viewBox="0 0 90 120">
              <path
                d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z">
              </path>
            </svg>
          </li>
          <li>
            <svg fill="currentColor" viewBox="0 0 90 120">
              <path
                d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z">
              </path>
            </svg>
          </li>
          <li>
            <svg fill="currentColor" viewBox="0 0 90 120">
              <path
                d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z">
              </path>
            </svg>
          </li>
          <li>
            <svg fill="currentColor" viewBox="0 0 90 120">
              <path
                d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z">
              </path>
            </svg>
          </li>
        </ul>
      </div><span style="color: white;">AI生成中...</span>
    </div>
  </div>

</template>

<script setup lang="ts">
import '@/assets/aiprocess/proceedButton.css';
import '@/assets/aiprocess/textInput.css'
import '@/assets/aiprocess/loadingConponent.css'
import '@/assets/aiprocess/tagInput.css'
import { ref, watch } from 'vue';
import router from '@/router';
import type { ProblemSubmit } from '@/types/Ai';
import axios from 'axios';
import { aiApi } from '@/apis/ai';
import { uploadProblemApi } from '@/apis/problem';
import type { ProblemInfo } from '@/types/Problem';
import { userStore } from '@/stores/user';

const req = ref<ProblemSubmit>({ title: '', description: '', input: '', output: '', Sample_input: '' });
const aiProblemInfo = ref<ProblemInfo | null>(null);
const { execute: submitInfo, state: curProblemInfo } = aiApi();
const { token } = userStore();
// 响应式变量，控制加载状态
const isLoading = ref(false);
//算法的标签输入
const taginput1 = ref('');
const taginput2 = ref('');
const taginput3 = ref('');
const stringArray = ref<string[]>([]);
// 监听 curProblemInfo 的变化
watch(curProblemInfo, (newValue) => {
  if (newValue) {
    isLoading.value = false;
    clearTimeout(timer); // 清除定时器，避免不必要的执行
  }
});

// 设置一个定时器，在 10 秒后将 isLoading 设置为 false
const timer = setTimeout(() => {
  isLoading.value = false;
}, 10000);
// 提交表单的方法
const submitForm = async () => {
  // 开始加载
  isLoading.value = true;
  stringArray.value = [taginput1.value, taginput2.value, taginput3.value];
  // 控制台输出用户填写的文本区域和选择的算法标签

  await submitInfo({
    data: {
      title: req.value.title,
      description: req.value.description,
      input: req.value.input,
      output: req.value.output,
      sample_input: req.value.Sample_input,
      Sample_output: req.value.Sample_output,
      Tags: stringArray.value as string[],
      Hint: req.value.Hint,
    }
  }).then((res) => {
    aiProblemInfo.value = res.value as ProblemInfo;
    const title = res.value?.title;
    const description = res.value?.description;
    const input = res.value?.input;
    const output = res.value?.output;
    const sample_input = res.value?.sample_input;
    const sample_output = res?.value?.sample_output;
    const hint = res?.value?.hint;

    router.push({
      path: '/problemedit',
      query: {
        title: title,
        description: description,
        input: input,
        output: output,
        sample_input: sample_input,
        sample_output: sample_output,
        hint: hint
      }
    });
  });
};
</script>

<style scoped>
.algorithm-form {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100vh;
  margin: auto;
}
</style>