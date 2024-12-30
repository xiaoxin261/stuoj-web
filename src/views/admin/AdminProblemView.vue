<script setup lang="ts">
import { getProblemListApi } from '@/apis/problem';
import {onMounted, ref} from "vue";
import type { ProblemInfo } from '@/types/Problem';
import type { Page } from '@/types/misc';
import router from '@/router';

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

const handleCreate = () => {
  router.push("/problem/edit");
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
        </el-col>
      </el-row>
      <el-divider></el-divider>
        <Problems :admin="true"/>
    </el-main>
  </el-container>
</template>

<style scoped>
</style>