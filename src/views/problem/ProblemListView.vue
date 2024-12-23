<template>
  <div class="padding-enable">
    <el-card>
      <ElForm :model="params">
        <el-form-item label="题名" label-position="right">
          <el-input v-model="params.title" />
        </el-form-item>
        <el-form-item label="难度" label-position="right">
          <ProblemDifficultySelect v-model="params.difficulty" ref="difficultySelectRef" />
        </el-form-item>
        <el-form-item label-width="auto">
          <ProblemTagSelect v-model="params.tag" ref="problemTagSelectRef" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
      </ElForm>
    </el-card>
    <br/>
    <el-card>
      <el-table :data="problems" style="width: 100%" stripe>
        <el-table-column label="状态" prop="" width="80px"/>
        <el-table-column label="ID" prop="id" width="80px" sortable/>
        <el-table-column label="标题" width="300px" show-overflow-tooltip>
          <template #default="scope">
            <router-link :to="'/problem/' + scope.row.id">
              {{ scope.row.title }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="300px">
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
        </el-table-column>
        <el-table-column label="难度" width="100px">
          <template #default="scope: Scope">
            <el-tag>
              {{ DifficultyMap[scope.row.difficulty] }}
            </el-tag>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getProblemListApi } from '@/apis/problem';
import {DifficultyMap, type ProblemInfo, ProblemStatusMap} from '@/types/Problem';
import type { Page } from '@/types/misc';
import ProblemTagSelect from '@/components/problem/ProblemTagSelect.vue';
import ProblemDifficultySelect from '@/components/problem/ProblemDifficultySelect.vue';
import {formatDateStr} from "@/utils/date";

interface Scope {
  row: {
    difficulty: keyof typeof DifficultyMap;
    status: keyof typeof ProblemStatusMap;
  };
}

const problemPage = ref<Page<"problems", ProblemInfo>>();
const problems = ref<ProblemInfo[]>([]);
const { state, execute } = getProblemListApi()
interface ProblemParams {
    page: number
    size: number
    title?: string
    difficulty?: number
    tag?: number[]
    status?: number
}
const params = ref<ProblemParams>({
    page: 1,
    size: 20
});

const getList = async () => {
    await execute({
        params: {
            ...params.value,
            tag: params.value.tag?.join(',') // 将数组转换为字符串
        }
    })
    if (state.value) {
        problemPage.value = state.value;
        problems.value = problemPage.value.problems;
    }
}

onMounted (() => {
    getList();
});

const problemTagSelectRef = ref<InstanceType<typeof ProblemTagSelect> | null>(null);
const difficultySelectRef = ref<InstanceType<typeof ProblemDifficultySelect> | null>(null);
const handleReset = () => {
    if (difficultySelectRef.value)
        difficultySelectRef.value.reset();

    if (problemTagSelectRef.value)
        problemTagSelectRef.value.resetAndConfirm();

    params.value.title = '';
};

</script>