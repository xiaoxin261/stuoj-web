<template>
  <div class="problem-page">
    <div class="content">
      <div class="section">
        <h2>题目</h2>
        <p>{{ problem.title }}</p>
      </div>
      <div class="section">
        <h2>题目描述</h2>
        <p>{{ problem.description }}</p>
      </div>
      <div class="section">
        <h2>输入格式</h2>
        <p>{{ problem.input }}</p>
      </div>
      <div class="section">
        <h2>输出格式</h2>
        <p>{{ problem.output }}</p>
      </div>
      <div class="section">
        <h2>输入输出样例</h2>
        <div class="example">
          <div class="example-input">
            <h3>输入</h3>
            <p>{{ problem.sample_input }}</p>
          </div>
          <div class="example-output">
            <h3>输出</h3>
            <p>{{ problem.sample_output }}</p>
          </div>
        </div>
      </div>
      <div class="section">
        <h2>说明和提示</h2>
        <p>{{ problem.hint }}</p>
      </div>
    </div>
    <div class="editor">
      <el-input type="textarea" v-model="code" placeholder="请输入代码" :rows="20" class="code-textarea">
      </el-input>
      <el-button type="primary" @click="submitCode">提交代码</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElInput, ElButton } from 'element-plus';
import router from '@/router';

// 响应式数据
const problem = ref({
  title: '',
  description: '',
  input: '',
  output: '',
  sample_input: '',
  sample_output: '',
  hint: ''
});
const code = ref('');

onMounted(() => {
  const query = router.currentRoute.value.query;
  Object.assign(problem.value, query);
});

// 提交代码的方法
const submitCode = () => {
  console.log('提交的代码:', code.value);

  // 这里可以添加将代码提交到后端的逻辑
};
</script>

<style scoped>
p {
  white-space: pre-wrap;
  /*保留文本的换行符和空格*/
}

.problem-page {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.content {
  flex: 1;
  border: 1px solid #ebeef5;
  padding: 20px;
}

.section {
  margin-bottom: 20px;
}

.section h2 {
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
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
}

.editor {
  flex: 1;
  border: 1px solid #ebeef5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.code-textarea {
  /* 设置一个固定的最大高度 */
  max-height: 1000px;
  overflow-y: auto;
  /* 当内容超出时显示垂直滚动条 */
}
</style>