<template>
  <div class="algorithm-form">
    <div class="form-input">
      <label for="title">标题:</label>
      <el-input
        id="title"
        v-model="req.title"
        placeholder="请输入标题..."
      ></el-input>
    </div>
    <div class="form-input">
      <label for="description">算法情景描述:</label>
      <textarea
        id="description"
        v-model="req.description"
        placeholder="请输入算法情景描述..."
        rows="15"
        cols="50"
      ></textarea>
      <div class="form-tags">
        <label>算法标签:</label>
        <el-form-item label-width="auto">
            <ProblemTagSelect v-model="req.tags" ref="problemTagSelectRef" />
        </el-form-item>
      </div>
    </div>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref ,onMounted} from 'vue';
  import { ElCheckbox, ElCheckboxGroup, ElButton } from 'element-plus';
  import router from '@/router';
  import type { ProblemSubmit } from '@/types/AiProcess';
  import axios from 'axios';
  import{aiProcessApi} from'@/apis/aiProcessApis';
  import { uploadProblemApi } from '@/apis/problem';
  import type { ProblemInfo } from '@/types/Problem';
  import { userStore } from '@/stores/user';
  import ProblemTagSelect from '@/components/problem/ProblemTagSelect.vue';
  // 响应式数据
  const req = ref<ProblemSubmit>({title:'',description:'',tags:[]});
  const aiProblemInfo = ref<ProblemInfo | null>(null);;
  const {execute:submitInfo, state:getProblemInfo} = aiProcessApi();
  const {execute:submitProblem, state:getProblemid} = uploadProblemApi();
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
    data:{
      title:req.value.title,
      description:req.value.description,
      tags:req.value.tags
  }
  });
  console.log('返回题目信息',getProblemInfo);
  aiProblemInfo.value = getProblemInfo.value?.data as ProblemInfo;
 console.log('题目信息和des',aiProblemInfo.value.title,aiProblemInfo.value?.description);

  router.push({path:'/problemdisplay'});
  // if(getProblemInfo.value?.code === 1){
  //  const res = getProblemInfo.value?.data as ProblemInfo; 
  //  await submitProblem({
  //   headers: {
  //           Authorization: `Bearer ${token.value}`
  //       },
  //   data : res.value
  //  });
  //  console.log('返回题目id',getProblemid);
  //  if(getProblemid.value?.code===1)
  //  {
  //   const problemId = getProblemid.value.data;
  //   console.log('题目id',problemId);
  //   //router.push({path:'/web/problem/:problemId'});
  //  }
  // }

    
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