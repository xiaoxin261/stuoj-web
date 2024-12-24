<template>
  <el-table :data="problems" style="width: 100%" stripe>
    <el-table-column label="状态" width="80px" >
      <template #default="scope: Scope">
        <span v-if="scope.row.id % 3 == 0"><el-icon><SemiSelect /></el-icon></span>
        <span v-else-if="scope.row.id % 3 == 1"><el-icon color="#67C23A"><Select /></el-icon></span>
        <span v-else><el-icon color="#F56C6C"><CloseBold /></el-icon></span>
      </template>
    </el-table-column>
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
        <el-tag :color="DifficultyColor[scope.row.difficulty]" style="color: #fff">
          {{ DifficultyMap[scope.row.difficulty] }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { Difficulty, ProblemInfo, ProblemStatusMap } from '@/types/Problem';
import { DifficultyMap, DifficultyColor } from '@/types/Problem';
const props = defineProps<{ problems: ProblemInfo[] }>();

interface Scope {
  row: {
    id: number;
    difficulty: keyof typeof DifficultyMap;
    status: keyof typeof ProblemStatusMap;
  };
}
</script>