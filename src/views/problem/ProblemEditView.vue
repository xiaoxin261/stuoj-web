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
      <ElCard style="margin-top: 10px; display: flex; justify-content: flex-end;">
        <ElButton type="primary" @click="handleUpload">创建</ElButton>
        <ElButton v-if="isNumber(problemId)" type="primary" @click="handleUpdate">更新</ElButton>
      </ElCard>
    </ElCol>
    <ElCol :span="12">
      <div style="display: flex; justify-content: space-between; gap:20px;">
        <ElCard class="box-card" style="width: 50%;">
          <div style="display: flex; flex-direction: column; gap:10px">
            <div style="display: flex; justify-content: space-between;">
              <ProblemDifficultySelect v-model:model-value="problem.difficulty" style="width: 40%;" />
              <ProblemStatusSelect v-model:model-value="problem.status" style="width: 40%;" />
            </div>
            <ElDivider />
            <ProblemTag tags-size="default" layout="vertical" :remove-flag="true" v-model:tags="tags" />
            <div style="display: flex; justify-content: flex-end;">
              <ElButton type="primary" @click="handleUpdateTag">更新标签</ElButton>
            </div>
          </div>
        </ElCard>
        <ElCard class="box-card" style="width: 50%;">
          <ElTabs v-model="activeName" @tab-change="handleTabChange">
            <ElTabPane label="测试数据" name="testcase">
              <TestTable v-model:testcase="testcase" v-bind:problem-id="problem.id" ref="testTableRef" />
            </ElTabPane>
            <ElTabPane label="题解" name="solution">
              <ProblemSolutionTable v-model:solution="solution" v-bind:problem-id="problem.id" ref="solutionTableRef" />
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </div>
      <ElCard v-if="activeName==='testcase'" style="margin-top: 10px;">
        <TestcaseEdit v-model:testcase="testcase" />
      </ElCard>
      <ElCard v-if="activeName==='testcase'" style="margin-top: 10px;">
        <DataMake v-bind:global="global" />
      </ElCard>
      <ElCard v-if="activeName==='solution'" style="margin-top: 10px;">
        <ProblemSolutionEdit v-model:solution="solution" />
      </ElCard>
      <ElCard style="margin-top: 10px;">
        <div class="debug-title">
          <h4>调试器</h4>
          <ElButton type="primary" @click="handleDebugFlag">{{ debugFlag ? '收起' : '展开' }}</ElButton>
        </div>
        <CodeRun v-if="debugFlag" :problem="problemId ?? ''" />
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, h } from 'vue';
import { ElLink, ElNotification, ElRow, ElTabPane, type TabPaneName } from 'element-plus';
import { type ProblemInfo, type Testcase, type Global, type Tag,type Solution } from '@/types/Problem';
import { getProblemApi, uploadProblemApi, updateProblemApi, problemRemoveTagApi, problemAddTagApi } from '@/apis/problem';
import { useRoute } from 'vue-router';
import TestTable from '@/components/problem/TestTable.vue';
import TestcaseEdit from '@/components/problem/TestCaseEdit.vue';
import ProblemSolutionTable from '@/components/problem/ProblemSolutionTable.vue';
import { isNumber } from 'element-plus/es/utils/types.mjs';

const { execute: getProblemExecute } = getProblemApi();
const { execute: updateProblemExecute } = updateProblemApi();
const { execute: uploadProblemExecute } = uploadProblemApi();
const { execute: problemRemoveTagExecute } = problemRemoveTagApi();
const { execute: problemAddTagExecute } = problemAddTagApi();
const problem = ref<ProblemInfo>({
  title: '',
  description: '',
  input: '',
  output: '',
  sample_input: '',
  sample_output: '',
  hint: '',
  difficulty: 0,
  memory_limit: 0,
});

const testTableRef = ref<InstanceType<typeof TestTable> | null>(null);
const solutionTableRef = ref<InstanceType<typeof ProblemSolutionTable> | null>(null);
const testcase = ref<Testcase>();
const solution=ref<Solution>();
const global = ref<Global>({
  rows: []
});
const route = useRoute();
let problemId = ref<number | null>(null);

const tags = ref<Tag[]>([]);
const oldTags = ref<Tag[]>([]);

const activeName = ref<string>('testcase');

const handleTabChange= (name: TabPaneName) => {
};

onBeforeMount(async () => {
  const idParam = route.query.id;
  if (typeof idParam === 'string') {
    const match = idParam.match(/\d+/);
    if (match) {
      problemId.value = parseInt(match[0], 10);
      await getProblemExecute({
        id: problemId.value
      }).then((res) => {
        if (res.value) {
          problem.value = res.value.problem;
          oldTags.value = res.value.tags || [];
          tags.value = oldTags.value;
        }
      });
      if (testTableRef.value) {
        testTableRef.value.refreshTestcases();
      }
      if (solutionTableRef.value) {
        solutionTableRef.value.refreshSolutions();
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

const debugFlag = ref(false);

const handleDebugFlag = () => {
  debugFlag.value = !debugFlag.value;
};

const handleUpdateTag = async () => {
  if (problemId.value) {
    const tagsToRemove = oldTags.value.filter(oldTag => !tags.value.some(tag => tag.id === oldTag.id));
    const tagsToAdd = tags.value.filter(tag => !oldTags.value.some(oldTag => oldTag.id === tag.id));

    for (const tag of tagsToRemove) {
      await problemRemoveTagExecute({
        data: {
          problem_id: problemId.value,
          tag_id: tag.id
        }
      });
    }

    for (const tag of tagsToAdd) {
      await problemAddTagExecute({
        data: {
          problem_id: problemId.value,
          tag_id: tag.id
        }
      });
    }

    oldTags.value = [...tags.value];
    ElNotification.success({
      title: '标签更新成功',
      message: '标签已成功更新'
    });
  }
};

const handleUpload = async () => {
  uploadProblemExecute({
    data: problem.value
  }).then((res) => {
    if (res.value) {
      problemId.value = res.value;
      ElNotification.success({
        title: '创建成功',
        message: h(ElLink, {
          href: `/problem/${problemId.value}`,
          target: 'primary',
          type: 'primary'
        }, '点击前往查看')
      })
    }
  });
}

const handleUpdate = async () => {
  updateProblemExecute({
    data: problem.value
  }).then(() => {
    ElNotification.success({
      title: '更新成功',
      message: h(ElLink, {
        href: `/problem/${problemId.value}`,
        target: 'primary',
        type: 'primary'
      }, '点击前往查看')
    })
  });
};

</script>

<style scoped>
.debug-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>