<template>
  <div class="container-main">
    <el-card>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/problem' }">题库</el-breadcrumb-item>
        <el-breadcrumb-item>{{ problemInfo?.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <br />
    <ElRow :gutter="20">
      <ElCol :span="18">
        <ElCard shadow="always">
          <div class="problem-title">
            <h1>[{{ problemInfo.id }}] {{ problemInfo.title }}</h1>
            <div>
              <el-icon>
                <View />
              </el-icon>&nbsp;?
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <StarFilled />
              </el-icon>&nbsp;?
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Notebook />
              </el-icon>&nbsp;?
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <List />
              </el-icon>&nbsp;?
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Checked />
              </el-icon>&nbsp;?
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Failed />
              </el-icon>&nbsp;?
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Timer />
              </el-icon>&nbsp;{{ formatDateStr(problemInfo?.create_time ?? "") }}
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Timer />
              </el-icon>&nbsp;{{ formatDateStr(problemInfo?.update_time ?? "") }}
              <el-divider direction="vertical"></el-divider>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="problem-content">
            <h3 class="weight">描述</h3>
            <TextView :content="problemInfo.description ?? ''" />
          </div>
          <div class="problem-input">
            <h3 class="weight">输入格式</h3>
            <TextView :content="problemInfo.input ?? ''" />
          </div>
          <div class="problem-output">
            <h3 class="weight">输出格式</h3>
            <TextView :content="problemInfo.output ?? ''" />
          </div>
          <div class="problem-sample">
            <h3 class="weight">输入样例</h3>
            <div class="problem-sample-input sample-box">
              {{ problemInfo.sample_input }}
            </div>
            <h3 class="weight">输出样例</h3>
            <div class="problem-sample-output sample-box">
              {{ problemInfo.sample_output }}
            </div>
          </div>
          <div class="problem-hint">
            <h3 class="weight">提示</h3>
            <TextView :content="problemInfo.hint ?? ''" />
          </div>
        </ElCard>
        <br />
        <el-card>
          <CodeRun :problem="problemId" :input_text="problemInfo.sample_input" />
        </el-card>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="always">
          <template #header>
            <strong>题目信息</strong>
          </template>
          <div class="problem-info">
            <div class="problem-info-item">
              <span>题目来源</span>
              <span>{{ problemInfo.source }}</span>
            </div>
            <div class="problem-info-item">
              <span>题目难度</span>
              <el-tag :color="DifficultyColor[problemInfo.difficulty as Difficulty]" style="color: white">
                {{ DifficultyMap[problemInfo.difficulty as Difficulty] }}
              </el-tag>
            </div>
            <div class="problem-info-item">
              <span>时间限制</span>
              <span>{{ problemInfo.time_limit }} s</span>
            </div>
            <div class="problem-info-item">
              <span>内存限制</span>
              <span>{{ ((problemInfo.memory_limit ?? 0) / 1024).toFixed(2) }} MB</span>
            </div>
            <div class="problem-info-item">
                <span>题目标签</span>
                <span><ElButton size="small" @click="toggleTagsVisibility" :icon="tagsFlag ? 'View' : 'Hide'" /></span>
            </div>
            <div class="problem-info-item" v-if="tagsFlag">
              <ProblemTagShow :tags="tags"/>
            </div>
          </div>
          <br/>
          <div>
            <el-button>
              <a :href="`/record?problem=${problemInfo.id}`">
                <el-icon><List /></el-icon>&nbsp;提交记录
              </a>
            </el-button>
            <el-button disabled><el-icon><StarFilled /></el-icon>&nbsp;收藏</el-button>
          </div>
        </ElCard>
        <ElCard shadow="always" style="margin-top: 20px;">
          <template #header>
            <strong>相关博客</strong>
          </template>
          <div class="problem-info">
            <ul>
              <li>博客1</li>
              <li>博客2</li>
              <li>博客3</li>
            </ul>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Difficulty, DifficultyColor, type ProblemInfo, type Solution, type Tag } from "@/types/Problem";
import { useRouteParams } from "@vueuse/router";
import { getProblemApi } from "@/apis/problem";
import { DifficultyMap } from "@/types/Problem";
import { formatDateStr } from "@/utils/date";
import { Notebook, StarFilled } from "@element-plus/icons-vue";

const problemId = useRouteParams<number>("id");

const { state, execute } = getProblemApi();

const problemInfo = ref<ProblemInfo>({} as ProblemInfo);

const tagsFlag = ref<boolean>(false);
const tags = ref<Tag[]>([]);

const toggleTagsVisibility = () => {
  tagsFlag.value = !tagsFlag.value;
};

onMounted(async () => {
  await execute({
    id: problemId.value,
  });
  if (state.value) {
    problemInfo.value = state.value.problem;
    tags.value = state.value?.tags || [];
    document.title = `[${problemInfo.value.id}] ${problemInfo.value.title} - 题目 - STUOJ`;
  }
});
</script>

<style scoped>
.problem-title,
.problem-content,
.problem-input,
.problem-output,
.problem-sample,
.problem-hint {
  text-align: left;
  margin-bottom: 20px;
}

.weight {
  font-weight: bold;
}

.problem-sample-input,
.problem-sample-output {
  display: block;
  font-size: 13px;
}

.sample-box {
  border: 1px solid #ccc;
  /* 边框颜色 */
  padding: 10px;
  /* 内边距 */
  border-radius: 5px;
  /* 圆角 */
  background-color: #f9f9f9;
  /* 背景颜色 */
  margin-bottom: 20px;
  /* 底部外边距 */
}

.problem-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.problem-info-item {
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  font-size: 16px;
}
</style>