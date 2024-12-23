<template>
  <div class="algorithm-form">
    <div class="form-input">
      <label for="title"></label>
      <input class="input" style="margin: 25px;width: 500px;"
        id="title"
        v-model="req.title"
        placeholder="请输入标题..."
      ></input>
    </div>
    <div class="form-input">
      <label for="description"></label>
      <textarea class="input"         id="description"
        v-model="req.description"
        placeholder="请输入算法情景描述..."
        style="height: 250px;width: 500px;"
        ></textarea>
    </div>
    <div style="display: table-row;">
      <textarea class="input"         id="input"
        v-model="req.input"
        placeholder="请输入题目样例输入"
        style="height: 100px;width: 200px; margin-right: 100px; margin-top: 25px;"
        ></textarea>
        <textarea class="input"         id="output"
        v-model="req.output"
        placeholder="请输入题目样例输出"
        style="height: 100px;width: 200px;margin-top: 25px;"
        ></textarea>
    </div>
    <form class="form" style="margin: 50px;">
  <input placeholder="输入算法标签1" class="tagInput" type="text" v-model="taginput1">
  <input placeholder="输入算法标签2" class="tagInput" type="text" v-model="taginput2">
    <input placeholder="输入算法标签3" class="tagInput" type="text" v-model="taginput3">
</form>
    <!-- <div class="form-tags">
        <label>算法标签:</label>
        <el-form-item label-width="auto">
            <ProblemTagSelect v-model="req.tagsId" ref="problemTagSelectRef" />
        </el-form-item>
      </div> -->
    <button class="uiverse"  @click="submitForm">
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
      <!-- <el-button type="primary" @click="submitForm">确定</el-button> -->
    </div>
    <div v-if="isLoading" class="loader-container">
      <div   class="loader" >
  <div >
    <ul>
      <li>
        <svg fill="currentColor" viewBox="0 0 90 120">
          <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
        </svg>
      </li>
      <li>
        <svg fill="currentColor" viewBox="0 0 90 120">
          <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
        </svg>
      </li>
      <li>
        <svg fill="currentColor" viewBox="0 0 90 120">
          <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
        </svg>
      </li>
      <li>
        <svg fill="currentColor" viewBox="0 0 90 120">
          <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
        </svg>
      </li>
      <li>
        <svg fill="currentColor" viewBox="0 0 90 120">
          <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
        </svg>
      </li>
      <li>
        <svg fill="currentColor" viewBox="0 0 90 120">
          <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
        </svg>
      </li>
    </ul>
  </div><span style="color: white;">AI生成中...</span></div>
    </div>
  
  </template>
  
  <script setup lang="ts">
  import '@/assets/aiprocess/proceedButton.css';
  import '@/assets/aiprocess/textInput.css'
    import '@/assets/aiprocess/loadingConponent.css'
    import '@/assets/aiprocess/tagInput.css'
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

  const req = ref<ProblemSubmit>({title:'',description:'',tagsId:[]});
  const aiProblemInfo = ref<ProblemInfo | null>(null);
  const {execute:submitInfo, state:curProblemInfo} = aiProcessApi();
  const {execute:submitProblem, state:curProblemid} = uploadProblemApi();
  const { token } = userStore();
  // 响应式变量，控制加载状态
const isLoading = ref(false);
//算法的标签输入
const taginput1 = ref('');
const taginput2 = ref('');
const taginput3 = ref('');
const stringArray = ref<string[]>([]);
  // 提交表单的方法
  const submitForm = async () => {
      // 开始加载
  isLoading.value = true;
  stringArray.value = [taginput1.value, taginput2.value, taginput3.value];
  // 控制台输出用户填写的文本区域和选择的算法标签
  console.log('标题:', req.value.title);
  console.log('算法情景描述:', req.value.description);
  console.log('输入的算法标签:', stringArray);
  console.log('输入:', req.value.input);
  console.log('输出:', req.value.output);
  await submitInfo({
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    data: {
      title: req.value.title,
      description: req.value.description,
      input: req.value.input,
      output: req.value.output,
      tags:req.value.tagsId,
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

if (!aiProblemInfo.value) {
  isLoading.value = false;
}
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
    width: 600px; 
    margin: auto;
  }
  
  /* .form-input, .form-tags {
    margin-bottom: 15px;
  }
  
  .el-button {
    align-self: center;
  }  */

  </style>