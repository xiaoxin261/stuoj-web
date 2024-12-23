<template>
    <div class="algorithm-form">
      <div class="form-input">
        <label for="description">算法情景描述:</label>
        <textarea
          id="description"
          v-model="req.description"
          placeholder="请输入算法情景描述..."
          rows="15"
          cols="50"
        ></textarea>
      </div>
      <div class="form-tags">
        <label>算法标签:</label>
        <el-form-item label-width="auto">
            <ProblemTagSelect v-model="req.tags" ref="problemTagSelectRef" />
        </el-form-item>
        <!-- <el-checkbox-group v-model="req.tags">
          <el-checkbox label="二分">二分</el-checkbox>
          <el-checkbox label="贪心">贪心</el-checkbox>
          <el-checkbox label="动态规划">动态规划</el-checkbox>
          <el-checkbox label="深度优先搜索">深度优先搜索</el-checkbox>
          <el-checkbox label="广度优先搜索">广度优先搜索</el-checkbox> -->
          <!-- 根据需要添加更多的算法标签 -->
        <!-- </el-checkbox-group> -->
      </div>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref ,onMounted} from 'vue';
  import { ElCheckbox, ElCheckboxGroup, ElButton } from 'element-plus';
  import router from '@/router';
  import type { ProblemSubmit } from '@/types/AiProcess';
  import ProblemTagSelect from '@/components/problem/ProblemTagSelect.vue';

  // 响应式数据
  const req = ref<ProblemSubmit>({title:'',description:'',tags:[]});
  const aiProblemInfo = ref<ProblemInfo | null>(null);
  const {execute:submitInfo, state:curProblemInfo} = aiProcessApi();
  const {execute:submitProblem, state:curProblemid} = uploadProblemApi();
  const { token } = userStore();
  // 提交表单的方法
  const submitForm = async () => {
  // 控制台输出用户填写的文本区域和选择的算法标签
  console.log('标题:', req.value.title);
  console.log('算法情景描述:', req.value.description);
  console.log('选择的算法标签:', req.value.tags);
  await submitInfo({
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    data: {
      title: req.value.title,
      description: req.value.description,
      tags: req.value.tags
    }
  });
  console.log('返回题目信息', curProblemInfo);
  aiProblemInfo.value = curProblemInfo.value?.data as ProblemInfo;
  console.log('题目信息和des', aiProblemInfo.value.title, aiProblemInfo.value?.description);
  const title = aiProblemInfo.value?.title;
const description = aiProblemInfo.value?.description;
const input = aiProblemInfo.value?.input;
const output =aiProblemInfo.value?.output;
const sample_input = aiProblemInfo.value?.sample_input;
const sample_output = aiProblemInfo?.value?.sample_output;
const hint = aiProblemInfo?.value?.hint;

  // 将 aiProblemInfo 作为路由参数传递
  router.push({
    path: '/problemdisplay',
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

  // if(curProblemInfo.value?.code === 1){
  //  const res = curProblemInfo.value?.data as ProblemInfo; 
  //  await submitProblem({
  //   headers: {
  //           Authorization: `Bearer ${token.value}`
  //       },
  //   data : res.value
  //  });
  //  console.log('返回题目id',curProblemid);
  //  if(curProblemid.value?.code===1)
  //  {
  //   const problemId = curProblemid.value.data
  //   console.log('题目id',problemId);
    //router.push({path:'/web/problem/:problemId'});
  // }
  //}

    
  };
  </script>
  
  <style scoped>
  .algorithm-form {
    display: flex;
    flex-direction: column;
    width: 600px; /* 可根据实际情况调整宽度 */
    margin: auto;
  }
  
  .form-input, .form-tags {
    margin-bottom: 15px;
  }
  
  .el-button {
    align-self: center;
  }

  </style>