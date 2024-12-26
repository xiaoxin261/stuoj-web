<template>
  <div class="container-main">
    <el-card>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/problem' }">题单</el-breadcrumb-item>
        <el-breadcrumb-item>{{ problemInfo?.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <br />
    <ElRow :gutter="20">
      <ElCol :span="18">
        <ElCard shadow="always">
          <div class="problem-title">
            <h1>{{ problemInfo.id }} {{ problemInfo.title }}</h1>
            <div>
              <el-icon>
                <View />
              </el-icon>&nbsp;0
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <StarFilled />
              </el-icon>&nbsp;0
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Share />
              </el-icon>&nbsp;0
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Notebook />
              </el-icon>&nbsp;0
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <List />
              </el-icon>&nbsp;0
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Checked />
              </el-icon>&nbsp;0
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Failed />
              </el-icon>&nbsp;0
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Timer />
              </el-icon>&nbsp;{{ formatDateStr(problemInfo?.create_time ?? "") }}
              <el-divider direction="vertical"></el-divider>
              <el-icon>
                <Stopwatch />
              </el-icon>&nbsp;{{ formatDateStr(problemInfo?.update_time ?? "") }}
              <el-divider direction="vertical"></el-divider>
            </div>
            <el-divider></el-divider>
          </div>
          <div class="problem-content custom-font-size">
            <h3 class="weight">描述</h3>
            <div v-html="renderMarkAndLaTeX(problemInfo.description || '')"></div>
          </div>
          <div class="problem-input custom-font-size">
            <h3 class="weight">输入格式</h3>
            <div v-html="renderMarkAndLaTeX(problemInfo.input || '')"></div>
          </div>
          <div class="problem-output custom-font-size">
            <h3 class="weight">输出格式</h3>
            <div v-html="renderMarkAndLaTeX(problemInfo.output || '')"></div>
          </div>
          <div class="problem-sample custom-font-size">
            <h3 class="weight">输入样例</h3>
            <div class="problem-sample-input sample-box">
              {{ problemInfo.sample_input }}
            </div>
            <h3 class="weight">输出样例</h3>
            <div class="problem-sample-output sample-box custom-font-size">
              {{ problemInfo.sample_output }}
            </div>
          </div>
          <div class="problem-hint custom-font-size">
            <h3 class="weight">提示</h3>
            <div v-html="renderMarkAndLaTeX(problemInfo.hint || '')"></div>
          </div>
        </ElCard>
        <br />
        <el-card>
          <CodeRun :problem="problemId" :input_text="problemInfo.sample_input" />
        </el-card>
      </ElCol>
      <ElCol :span="6">
        <ElCard shadow="always">
          <div class="problem-info custom-font-size">
            <h3>题目信息</h3>
            <div class="problem-info-item">
              <h4 class="weight">来源</h4>
              <el-tag>{{ problemInfo.source }}</el-tag>
            </div>
            <div class="problem-info-item">
              <h4 class="weight">难度</h4>
              <el-tag :color="DifficultyColor[problemInfo.difficulty as Difficulty]" style="color: white">
                {{ DifficultyMap[problemInfo.difficulty as Difficulty] }}
              </el-tag>
            </div>
            <div class="problem-info-item custom-font-size">
              <h4 class="weight">时间限制</h4>
              <span>{{ problemInfo.time_limit }} s</span>
            </div>
            <div class="problem-info-item custom-font-size">
              <h4 class="weight">内存限制</h4>
              <span>{{ problemInfo.memory_limit ?? 0 / 1024 }} MB</span>
            </div>
            <div class="problem-info-item custom-font-size">
              <div class="problem-info-item-title">
              <h4 class="weight">标签</h4>
              <ElButton style="margin-top: 20px;margin-left: 10px;" size="small" @click="toggleTagsVisibility" :icon="tagsFlag ? 'View' : 'Hide'" />
            </div>
              <ProblemTag v-if="tagsFlag" :tags="tags" />
            </div>
          </div>
          <div>
            <el-button><el-icon>
                <View />
              </el-icon>&nbsp;0</el-button>
            <el-button><el-icon>
                <StarFilled />
              </el-icon>&nbsp;0</el-button>
            <el-button><el-icon>
                <Share />
              </el-icon>&nbsp;0</el-button>
          </div>
        </ElCard>
        <ElCard shadow="always" style="margin-top: 20px;">
          <div class="problem-info custom-font-size">
            <h3>相关博客</h3>
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
import { userStore } from "@/stores/user";
import { renderMarkAndLaTeX } from "@/utils/renderMarkAndLaTeX";
import { DifficultyMap } from "@/types/Problem";
import { formatDateStr } from "@/utils/date";
import { Notebook, StarFilled } from "@element-plus/icons-vue";

const { token } = userStore();

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
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    id: problemId.value,
  });
  if (state.value) {
    problemInfo.value = state.value.problem;
    tags.value = state.value?.tags || [];
  }
});
</script>

<style scoped>
.problem-title,
.problem-content,
.problem-input,
.problem-output,
.problem-sample,
.problem-hint,
.problem-info {
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

.custom-font-size {
  font-size: 17px;
}
.problem-info-item-title{
  display: flex;
}
</style>