<template>
  <ElRow :gutter="20">
    <ElCol :span="12">
      <ElCard class="box-card">
        <div class="section">
          <h2>题目</h2>
          <ElInput v-model="problem.title"></ElInput>
        </div>
        <div class="section">
          <h2>题目描述</h2>
          <ElInput v-model="problem.description" type="textarea" resize="none" :autosize="{ minRows: 5, maxRows: 10 }">
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
          <h2>说明和提示</h2>
          <ElInput v-model="problem.hint" type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 6 }">
          </ElInput>
        </div>
      </ElCard>
    </ElCol>
    <ElCol :span="12">
      <div style="display: flex; justify-content: space-between; gap: 20px;">
        <ElCard class="box-card" style="width: 50%; height: 75px;">
          <ProblemDifficultySelect v-model:model-value="problem.difficulty" style="margin-right: 20%; width: 60%;" />
          <ProblemTagSelect v-model:model-value="problem.tags" />
        </ElCard>
        <ElCard class="box-card" style="width: 50%;">
          <TestTable v-model:testcase="testcase" v-bind:problem-id="problem.id" ref="testTableRef" />
        </ElCard>
      </div>
      <ElCard style="margin-top: 10px;">
        <TestcaseEdit v-model:testcase="testcase"/>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { ElRow } from 'element-plus';
import type { ProblemInfo,Testcase } from '@/types/Problem';
import { getProblemApi } from '@/apis/problem';
import { useRoute } from 'vue-router';
import TestTable from '@/components/problem/TestTable.vue';
import TestcaseEdit from '@/components/problem/TestCaseEdit.vue';

const { execute: getProblemExecute } = getProblemApi();
const problem = ref<ProblemInfo>({
  title: '',
  description: '',
  input: '',
  output: '',
  sample_input: '',
  sample_output: '',
  hint: '',
  tags: [],
});

const testTableRef = ref<InstanceType<typeof TestTable> | null>(null);
const testcase= ref<Testcase>();
const route = useRoute();
let problemId = ref<number | null>(null);

onBeforeMount(async () => {
  const idParam = route.query.id;
  if (typeof idParam === 'string') {
    const match = idParam.match(/\d+/);
    if (match) {
      problemId.value = parseInt(match[0], 10);
      await getProblemExecute({
        id: problemId.value
      }).then((res) => {
        if (res.value)
          problem.value = res.value.problem;
      });
      if(testTableRef.value){
        testTableRef.value.refreshTestcases();
      }
    }
  } else {
    problem.value.title = route.query.title as string;
    problem.value.description = route.query.description as string;
    problem.value.input = route.query.input as string;
    problem.value.output = route.query.output as string;
    problem.value.sample_input = route.query.sample_input as string;
    problem.value.sample_output = route.query.sample_output as string;
    problem.value.hint = route.query.hint as string;
  }
});

</script>

<style scoped></style>