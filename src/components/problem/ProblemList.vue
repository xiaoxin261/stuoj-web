<template>
  <div style="text-align: right;">
    <ElCheckbox v-model="tagFlag" label="标签" />
    <ElCheckbox v-model="timeFlag" label="时间" />
  </div>
  <el-table :data="problems" style="width: 100%" stripe>
    <el-table-column label="状态" width="80px">
      <template #default="scope: Scope">
        <span v-if="scope.row.id % 3 == 0"><el-icon>
            <SemiSelect />
          </el-icon></span>
        <span v-else-if="scope.row.id % 3 == 1"><el-icon color="#67C23A"><Select /></el-icon></span>
        <span v-else><el-icon color="#F56C6C">
            <CloseBold />
          </el-icon></span>
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
    <el-table-column v-if="tagFlag" label="标签" width="300">
      <template #default="scope">
        <ProblemTag :tags="scope.row.tags" />
      </template>
    </el-table-column>
    <el-table-column v-if="timeFlag" label="创建时间" width="120">
      <template #default="scope">
        <span>
          {{ formatDateStr(scope.row.create_time) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="timeFlag" label="更新时间" width="120">
      <template #default="scope">
        <span>
          {{ formatDateStr(scope.row.create_time) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="难度" width="100">
      <template #default="scope: Scope">
        <el-tag :color="DifficultyColor[scope.row.difficulty]" style="color: #fff">
          {{ DifficultyMap[scope.row.difficulty] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column v-if="admin" label="状态" width="80">
      <template #default="scope: Scope">
        <el-tag :color="ProblemStatusColor[scope.row.status]" style="color: #fff">
          {{ ProblemStatusMap[scope.row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column v-if="admin" align="right" width="200">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import { type ProblemInfo, ProblemStatusMap, ProblemStatusColor } from '@/types/Problem';
import { DifficultyMap, DifficultyColor } from '@/types/Problem';
import { formatDateStr } from "@/utils/date";
import { getProblemApi } from '@/apis/problem';
import router from '@/router';
import ProblemTag from './ProblemTag.vue';

const { execute } = getProblemApi();

const props = withDefaults(defineProps<{
  problems: ProblemInfo[];
  admin?: boolean;
}>(), {
  problems: () => [] as ProblemInfo[],
  admin: false,
});
const tagReady = ref(false);
const tagFlag = ref(false);
const timeFlag = ref(false);

watchEffect(() => {
  if (tagReady.value) return;
  if (tagFlag.value) {
    props.problems.forEach(problem => {
      if (problem.id) {
        execute({
          id: problem.id
        }).then(res => {
          problem.tags = res.value?.tags || [];
        });
      };
    });
    tagReady.value = true;
  }
});

watch(() => props.problems.map(problem => problem.id), () => {
  tagReady.value = false;
});

const handleEdit = async (row: ProblemInfo) => {
  await router.push(`/problem/edit?id=${row.id}`);
}

const handleDelete = async (row: ProblemInfo) => {

}

interface Scope {
  row: {
    id: number;
    difficulty: keyof typeof DifficultyMap;
    status: keyof typeof ProblemStatusMap;
  };
}
</script>