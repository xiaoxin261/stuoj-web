<template>
    <div class="container">
      <div class="content">
        <div class="section">
          <h2>题目</h2>
          <p>{{ title }}</p>
        </div>
        <div class="section">
          <h2>题目描述</h2>
          <p>{{ description }}</p>
        </div>
        <div class="section">
          <h2>输入格式</h2>
          <p>{{ input }}</p>
        </div>
        <div class="section">
          <h2>输出格式</h2>
          <p>{{ output }}</p>
        </div>
        <div class="section">
          <h2>输入输出样例</h2>
          <div class="example">
            <div class="example-input">
              <h3>输入</h3>
              <p>{{ sample_input }}</p>
            </div>
            <div class="example-output">
              <h3>输出</h3>
              <p>{{ sample_output }}</p>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>说明和提示</h2>
          <p>{{ hint }}</p>
        </div>
     </div >
 <el-button class = "solve-button" type="primary" @click="handleSolve" link>尝试解题</el-Button>
    </div>
    <el-button class="solve-button" type="primary" @click="handleSolve" link>尝试解题</el-button>
    <el-button class="save-button" type="primary" @click="saveChanges">保存修改</el-button>
  </div>
  <div>
    <ProblemTagSelect v-model="tags" ref="problemTagSelectRef" />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { ElButton, ElContainer } from 'element-plus';
import { problemInfoApi } from '@/apis/aiProcessApis';
import { uploadProblemApi } from '@/apis/problem';
import type { ProblemInfo } from '@/types/Problem';
import { useRoute } from 'vue-router';
import { userStore } from '@/stores/user';
import { Difficulty, DifficultyMap } from '@/types/Problem';
const { token } = userStore();
const { execute: submitProblem, state: curProblemid } = uploadProblemApi();
const req = ref<ProblemInfo | null>(null);
console.log('这是第一次req', req);
export default {
  setup() {

    const route = useRoute();
    const title = ref<string>(String(route.query.title || '无'));
    const description = ref<string>(String(route.query.description || '无'));
    const input = ref<string>(String(route.query.input || '无'));
    const output = ref<string>(String(route.query.output || '无'));
    const sample_input = ref<string>(String(route.query.sample_input || '无'));
    const sample_output = ref<string>(String(route.query.sample_output || '无'));
    const hint = ref<string>(String(route.query.hint || '无'));
    const tags = ref<number[]>([]);

    // 定义 saveChanges 方法
    const saveChanges = () => {
      console.log('保存修改');
      // 将数据存储到本地
      localStorage.setItem('problemInfo', JSON.stringify({
        title: title.value,
        description: description.value,
        input: input.value,
        output: output.value,
        sample_input: sample_input.value,
        sample_output: sample_output.value,
        hint: hint.value,
      }));
      console.log('修改已保存', {
        title: title.value,
        description: description.value,
        input: input.value,
        output: output.value,
        sample_input: sample_input.value,
        sample_output: sample_output.value,
        hint: hint.value,
        tags: tags.value,
      });
    };

    // 定义 handleSolve 方法
    const handleSolve = async () => {
      // 创建 ProblemInfo 类型的对象
      const problemInfo: ProblemInfo = {

        create_time: new Date().toISOString(),
        description: description.value,
        difficulty: Difficulty.medium,
        hint: hint.value,
        id: 0,
        input: input.value,
        memory_limit: 1024,
        output: output.value,
        sample_input: sample_input.value,
        sample_output: sample_output.value,
        source: 'AI',
        status: 0,
        time_limit: 1000,
        title: title.value,
        update_time: new Date().toISOString(),
      };
      req.value = problemInfo as ProblemInfo;
      console.log('这是第二次req的数据', req);
      if (req.value) {
        await submitProblem({
          headers: {
            Authorization: `Bearer ${token.value}`
          },
          data: req.value,
        });
      }
      console.log('返回题目id', curProblemid.value);
      if (curProblemid.value?.code === 1) {

      }
      // 这里可以添加尝试解题的逻辑，例如跳转到解题页面或调用 API
    };

    return {
      title,
      description,
      input,
      output,
      sample_input,
      sample_output,
      hint,
      tags,
      saveChanges, // 返回 saveChanges 方法
      handleSolve, // 返回 handleSolve 方法
    };
  },
};
</script>

<style scoped>
.solve-button {
  position: fixed;
  top: 850px;
  /* 或者其他值 */
  left: auto;
  /* 或者其他值 */
}

/* 按钮的style */
.el-button {
  background-color: #409eff;
  /* Element Plus主题色 */
  border-color: #409eff;
  /* 按钮边框颜色 */
  color: white;
  /* 文字颜色 */
  padding: 10px 20px;
  /* 内边距 */
  font-size: 16px;
  /* 字体大小 */
  border-radius: 5px;
  /* 边框圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* 阴影效果 */
  transition: all 0.3s ease;
  /* 平滑过渡效果 */
  outline: none;
  /* 去除焦点时的轮廓线 */
}

.el-button:hover {
  background-color: #66b1ff;
  /* 鼠标悬停时的背景颜色 */
  border-color: #66b1ff;
  /* 鼠标悬停时的边框颜色 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  /* 鼠标悬停时的阴影效果 */
}

.el-button:active {
  background-color: #3a8ee6;
  /* 点击时的背景颜色 */
  border-color: #3a8ee6;
  /* 点击时的边框颜色 */
  transform: translateY(2px);
  /* 点击时的位移效果 */
}


.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #edecec;
}

.content {
  width: 80%;
  max-width: 800px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 20px;
}

.section h2 {
  color: #333;
  margin-bottom: 10px;
}

.example {
  display: flex;
  justify-content: space-between;
}

.example-input,
.example-output {
  flex: 1;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

pre {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 10px;
  white-space: pre-wrap;
}

p,
pre {
  white-space: pre-wrap;
  /* 保留空白符序列，但是正常换行 */
  word-wrap: break-word;
  /* 长单词或URL在必要时可以断行 */
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 10px;
}
</style>