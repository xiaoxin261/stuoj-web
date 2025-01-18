<template>
  <div style="text-align: right;">
    <ElCheckbox v-model="tagFlag" label="标签" />
    <ElCheckbox v-model="timeFlag" label="时间" />
  </div>
  <el-table :data="problems" style="width: 100%" @selection-change="handleSelectionChange" stripe
    @sort-change="sortChange">
    <el-table-column v-if="admin" type="selection" width="55" />
    <!--
    <el-table-column v-if="!admin" label="状态" width="80px">
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
-->
    <el-table-column label="ID" prop="id" width="80px" sortable="custom" />
    <el-table-column label="标题" show-overflow-tooltip sortable="custom">
      <template #default="scope">
        <router-link :to="'/problem/' + scope.row.id">
          {{ scope.row.title }}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column v-if="tagFlag" label="标签" width="300">
      <template #default="scope">
        <ProblemTagShow :tag-ids="scope.row.tag_ids" />
      </template>
    </el-table-column>
    <el-table-column v-if="timeFlag" label="创建时间" width="120" sortable="custom">
      <template #default="scope">
        <span>
          {{ formatDateStr(scope.row.create_time) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="timeFlag" label="更新时间" width="120" sortable="custom">
      <template #default="scope">
        <span>
          {{ formatDateStr(scope.row.update_time) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="难度" width="100" sortable="custom">
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
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { type ProblemInfo, ProblemStatusMap, ProblemStatusColor } from '@/types/Problem';
import { DifficultyMap, DifficultyColor } from '@/types/Problem';
import { formatDateStr } from "@/utils/date";
import { deleteProblemApi } from '@/apis/problem';
import router from '@/router';
import ProblemTagShow from './ProblemTagShow.vue';
import { ElNotification } from "element-plus";
import type { OrderBy } from '@/types/misc';

const props = withDefaults(defineProps<{
  problems: ProblemInfo[];
  admin?: boolean;
  orderBy?: OrderBy;
  order?: string;
}>(), {
  problems: () => [] as ProblemInfo[],
  admin: false,
});
const tagReady = ref(false);
const tagFlag = ref(false);
const timeFlag = ref(false);

const selections = ref<ProblemInfo[]>([]);
const handleSelectionChange = (val: ProblemInfo[]) => {
  selections.value = val;
};

watch(() => props.problems.map(problem => problem.id), () => {
  tagReady.value = false;
});

const handleEdit = async (row: ProblemInfo) => {
  await router.push(`/problem/edit?id=${row.id}`);
}

interface Scope {
  row: {
    id: number;
    difficulty: keyof typeof DifficultyMap;
    status: keyof typeof ProblemStatusMap;
  };
}

const emit = defineEmits(['update', 'update:order', 'update:order-by']);
const { execute: deleteExecute } = deleteProblemApi();
const handleDelete = (id: number) => {
  deleteExecute({
    id: id
  }).then(() => {
    emit('update');
    ElNotification.success({
      title: '删除成功',
      type: 'success'
    });
  });
};

const columnMap: { [key: string]: string } = {
  "ID": "id",
  "标题": "title",
  "难度": "difficulty",
  "创建时间": "create_time",
};

const sortChange = (data: { column: { label: keyof typeof columnMap }, order: string | null }) => {
  if (data.order && data.column.label in columnMap) {
    emit('update:order', data.order === "ascending" ? "asc" : "desc");
    emit('update:order-by', columnMap[data.column.label]);
    emit('update');
    console.log(columnMap[data.column.label],data.column.label);
  }
};
</script>