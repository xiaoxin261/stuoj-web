<template>
  <el-table :data="problems" style="width: 100%" stripe>
    <el-table-column label="状态" prop="" width="80px" />
    <el-table-column label="ID" prop="id" width="80px" sortable />
    <el-table-column label="标题" show-overflow-tooltip>
      <template #default="scope">
        <router-link :to="'/problem/' + scope.row.id">
          {{ scope.row.title }}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column label="标签" width="300">
      <el-tag>tag</el-tag>&nbsp;
      <el-tag>tag</el-tag>&nbsp;
      <el-tag>tag</el-tag>&nbsp;
      <el-tag>tag</el-tag>&nbsp;
      <el-tag>tag</el-tag>&nbsp;
    </el-table-column>
    <el-table-column label="难度" width="100">
      <template #default="scope: Scope">
        <el-tag>
          {{ DifficultyMap[scope.row.difficulty as Difficulty] }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { Difficulty, ProblemInfo, ProblemStatusMap } from '@/types/Problem';
import { DifficultyMap } from '@/types/Problem';
const props = defineProps<{ problems: ProblemInfo[] }>();

interface Scope {
  row: {
    difficulty: keyof typeof DifficultyMap;
    status: keyof typeof ProblemStatusMap;
  };
}
</script>