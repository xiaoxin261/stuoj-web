<script setup lang="ts">
import { getProblemListApi } from '@/apis/problem';
import {onMounted, ref} from "vue";
import { ProblemStatusMap, DifficultyMap } from '@/types/Problem';
import { formatDateStr } from "@/utils/date";
import type { ProblemInfo } from '@/types/Problem';
import type { Page } from '@/types/misc';

interface Scope {
  row: {
    difficulty: keyof typeof DifficultyMap;
    status: keyof typeof ProblemStatusMap;
  };
}
interface ProblemParams {
  page: number
  size: number
}

const problemPage = ref<Page<"problems", ProblemInfo>>();
const problems = ref<ProblemInfo[]>([]);
const { state, execute } = getProblemListApi();
const params = ref<ProblemParams>({
  page: 1,
  size: 10
});

const getList = async () => {
  await execute({
    params: {
      ...params.value,
    }
  });

  if (state.value) {
    problemPage.value = state.value;
    problems.value = problemPage.value.problems;
  }
}

onMounted (() => {
  getList();
})


</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>题目管理</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" @click="handleCreate">创建题目</el-button>
          <el-button type=""><router-link to="/fps">导入 FPS 题目</router-link></el-button>
          <el-button type=""><router-link to="/ai/problem">AI 生成题目</router-link></el-button>
          <el-button type=""><router-link to="/ai/problem">AI 生成测试用例</router-link></el-button>
          <el-button type=""><router-link to="/ai/problem">AI 生成题解</router-link></el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-card>
        <el-table :data="problems" style="width: 100%" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80px" sortable/>
          <el-table-column label="标题" show-overflow-tooltip>
            <template #default="scope">
              <router-link :to="'/problem/' + scope.row.problem_id">
                {{ scope.row.title }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="120">
            <template #default="scope">
              <span>
                {{ formatDateStr(scope.row.create_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="120">
            <template #default="scope">
              <span>
                {{ formatDateStr(scope.row.create_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="难度" width="100">
            <template #default="scope: Scope">
              <el-tag>
                {{ DifficultyMap[scope.row.difficulty] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="scope: Scope">
              <el-tag>
                {{ ProblemStatusMap[scope.row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right" width="200">
            <template #header>
              <el-input v-model="search" size="small" placeholder="题目ID" />
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br/>
        <el-pagination
            v-model:current-page="params.page"
            v-model:page-size="params.size"
            :page-sizes="[10, 20, 50, 100]"
            :size="'small'"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="problemPage?.total"
            @size-change="getList"
            @current-change="getList"
        />
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}

</style>