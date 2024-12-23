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
      <h1>题目管理</h1>
      <el-divider></el-divider>
      <el-card>
        <el-button type="primary" @click="handleCreate">创建题目</el-button>
        <el-button type="primary" @click="handleImportFps">导入 FPS</el-button>
        <el-button type="primary" @click="handleGenerate">AI 生成</el-button>
        <el-divider></el-divider>
        <el-table :data="problems" style="width: 100%" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80px" sortable/>
          <el-table-column label="标题" prop="title" width="150px" show-overflow-tooltip/>
          <el-table-column label="创建时间" width="120px">
            <template #default="scope">
              <span>
                {{ formatDateStr(scope.row.create_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="120px">
            <template #default="scope">
              <span>
                {{ formatDateStr(scope.row.create_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="难度" width="100px">
            <template #default="scope: Scope">
              <el-tag>
                {{ DifficultyMap[scope.row.difficulty] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80px">
            <template #default="scope: Scope">
              <el-tag>
                {{ ProblemStatusMap[scope.row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right">
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

</style>