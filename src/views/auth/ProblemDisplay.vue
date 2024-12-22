<template>
  <div class="container">
    <div class="content">
      <div class="section">
        <h2>题目</h2>
        <textarea v-model="title" class="editable-text"></textarea>
      </div>
      <div class="section">
        <h2>题目描述</h2>
        <textarea v-model="description" class="editable-text"></textarea>
      </div>
      <div class="section">
        <h2>输入格式</h2>
        <textarea v-model="input" class="editable-text"></textarea>
      </div>
      <div class="section">
        <h2>输出格式</h2>
        <textarea v-model="output" class="editable-text"></textarea>
      </div>
      <div class="section">
        <h2>输入输出样例</h2>
        <div class="example">
          <div class="example-input">
            <h3>输入</h3>
            <textarea v-model="sample_input" class="editable-text"></textarea>
          </div>
          <div class="example-output">
            <h3>输出</h3>
            <textarea v-model="sample_output" class="editable-text"></textarea>
          </div>
        </div>
      </div>
      <div class="section">
        <h2>说明和提示</h2>
        <textarea v-model="hint" class="editable-text"></textarea>
      </div>
    </div>
    <el-button class="solve-button" type="primary" @click="handleSolve" link>尝试解题</el-button>
    <el-button class="save-button" type="primary" @click="saveChanges">保存修改</el-button>
  </div>
</template>

  
  <script lang="ts" >
  import { nextTick } from 'vue';
import router from '@/router';
import { ElButton, ElContainer } from 'element-plus';
import {problemInfoApi} from '@/apis/aiProcessApis';
import { ref } from 'vue';
import { onMounted } from 'vue';
import type { ProblemInfo } from '@/types/Problem';
// 初始化 req 为一个响应式引用，并指定类型为 ProblemInfo | null
const req = ref<ProblemInfo | null>(null);

// 获取本地存储中的问题信息，并进行空值检查
const problemInfoString = localStorage.getItem('aiProblemInfo');
// 定义响应式变量
const title = ref('');
const description = ref('');
const input = ref('');
const output = ref('');
const sample_input = ref('');
const sample_output = ref('');
const hint = ref('');
if (problemInfoString) {
  try {
    req.value = JSON.parse(problemInfoString);
   
    // 检查 req.value 是否包含 title 和 description 字段
    if (req.value) {
      console.log('req有值', req.value);
      console.log('获取问题题目信息成功', req.value?.title);
      title.value = req.value.title;
      description.value = req.value.description;
    } else {
      console.warn('问题信息中缺少 title 或 description 字段');
    }
  } catch (error) {
    console.error('解析问题信息失败:', error);
  }
}




// 初始化响应式变量
onMounted(async () => {
  if (req.value) {
    console.log('进入onmounted', req.value);
    title.value = req.value.title;
    description.value = req.value.description;
    input.value = req.value.input;
    output.value = req.value.output;
    sample_input.value = req.value.sample_input;
    sample_output.value = req.value.sample_output;
    hint.value = req.value.hint;
  } else {
    console.log('进入else', req.value);
  }
  await nextTick(); // 确保 DOM 更新
});

  // 保存修改的方法
const saveChanges = () => {
  if (req.value) {
    req.value.title = title.value;
    req.value.description = description.value;
    req.value.input = input.value;
    req.value.output = output.value;
    req.value.sample_input = sample_input.value;
    req.value.sample_output = sample_output.value;
    req.value.hint = hint.value;
    localStorage.setItem('problemInfo', JSON.stringify(req.value));
    console.log('修改已保存', req.value);
  }
};
  </script>
  
  <style scoped>

.solve-button {
  position: fixed;
  top: 850px; /* 或者其他值 */
  left: auto; /* 或者其他值 */
}

/* 按钮的style */
.el-button {
  background-color: #409eff; /* Element Plus主题色 */
  border-color: #409eff; /* 按钮边框颜色 */
  color: white; /* 文字颜色 */
  padding: 10px 20px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  border-radius: 5px; /* 边框圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
  outline: none; /* 去除焦点时的轮廓线 */
}
.el-button:hover {
  background-color: #66b1ff; /* 鼠标悬停时的背景颜色 */
  border-color: #66b1ff; /* 鼠标悬停时的边框颜色 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2); /* 鼠标悬停时的阴影效果 */
}
.el-button:active {
  background-color: #3a8ee6; /* 点击时的背景颜色 */
  border-color: #3a8ee6; /* 点击时的边框颜色 */
  transform: translateY(2px); /* 点击时的位移效果 */
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
  
  .example-input, .example-output {
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
  p, pre {
  white-space: pre-wrap; /* 保留空白符序列，但是正常换行 */
  word-wrap: break-word; /* 长单词或URL在必要时可以断行 */
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 10px;
}
  </style>