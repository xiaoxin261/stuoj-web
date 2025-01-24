<template>
  <ElTable :data="submissions" :key="key" style="width: 100%" @sort-change="sortChange" lazy>
    <ElTableColumn type="expand" width="50">
      <template #default="scope">
        <div class="judgements-table-container">
          <JudgementsTable :id="scope.row.id" style="width: 95%;" />
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn label="用户" width="150">
      <template #default="scope">
        <AvatarInfo :user="scope.row.user" name :name-size="16" @click="handelUserClick(scope.row.user)" />
      </template>
    </ElTableColumn>
    <ElTableColumn label="分数" width="100" sortable="custom">
      <template #default="scope">
        <a :href="`/record/${scope.row.id}`">
          <ScoreShow :score="scope.row.score" :size="16" :status="scope.row.status" status-show />
        </a>
      </template>
    </ElTableColumn>
    <ElTableColumn label="题目" show-overflow-tooltip >
      <template #default="scope">
        <ProblemName :problem="scope.row.problem" :size="16" />
      </template>
    </ElTableColumn>
    <ElTableColumn label="代码长度" width="110" sortable="custom">
      <template #default="scope">
        <el-icon>
          <Document />
        </el-icon>
        {{ scope.row.length }}B
      </template>
    </ElTableColumn>
    <ElTableColumn label="耗时" width="100" sortable="custom">
      <template #default="scope">
        <el-icon><Timer /></el-icon>
        {{ scope.row.time }}s
      </template>
    </ElTableColumn>
    <ElTableColumn label="内存" width="100" sortable="custom">
      <template #default="scope">
        <el-icon>
          <Coin />
        </el-icon>
        {{ scope.row.memory }}KB
      </template>
    </ElTableColumn>
    <ElTableColumn label="语言" width="150">
      <template #default="scope">
        <ElTooltip :content="languages.find((lang: Language) => lang.id === scope.row.language_id)?.name || 'Unknown'">
          <span class="ellipsis">{{ languages.find((lang: Language) => lang.id === scope.row.language_id)?.name ||
            'Unknown' }}</span>
        </ElTooltip>
      </template>
    </ElTableColumn>
    <ElTableColumn label="提交时间" width="150" sortable="custom">
      <template #default="scope">
        {{ formatDateTimeStr(scope.row.create_time) }}
      </template>
    </ElTableColumn>
    <ElTableColumn v-if="admin" align="right" width="60">
      <template #default="scope">
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType, watch } from 'vue';
import type { Submission } from '@/types/Record';
import type { UserInfo } from '@/types/User';
import router from '@/router';
import { langStore } from '@/stores/language';
import type { Language } from '@/types/Judge';
import { formatDateTimeStr } from '@/utils/date';
import { deleteRecordApi } from '@/apis/record';
import { ElNotification } from 'element-plus';
import type { OrderBy } from '@/types/misc';
import {Timer} from "@element-plus/icons-vue";


const { execute } = deleteRecordApi();

const { getLanguages } = langStore();

const emit = defineEmits(['update', 'update:order', 'update:order-by']);

const props = defineProps({
  submissions: {
    type: Array as PropType<Submission[]>,
    default: () => []
  },
  admin: {
    type: Boolean,
    default: false
  },
  orderBy: {
    type: String as PropType<OrderBy>,
    default: () => ''
  },
  order: {
    type: String as PropType<string>,
    default: () => null
  }
});

const languages = ref<Language[]>([]);

onMounted(async () => {
  getLanguages().then((res) => {
    if (res.value) {
      languages.value = res.value;
    }
  });
});

const handelUserClick = (user: UserInfo) => {
  router.push(`/user/${user.id}`);
};

const handleDelete = (id: number) => {
  execute({
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
  "分数": "score",
  "题目": "problem_id",
  "代码长度": "length",
  "耗时": "time",
  "内存": "memory",
  "提交时间": "create_time",
};

const sortChange = (data: { column: { label: keyof typeof columnMap }, order: string | null }) => {
  if (data.order && data.column.label in columnMap) {
    emit('update:order', data.order === "ascending" ? "asc" : "desc");
    emit('update:order-by', columnMap[data.column.label]);
    emit('update');
  }
};

// 使用key在更新后让表格重新渲染，否则表格不会更新
const key = ref(0);
watch(() => props.submissions, () => {
  key.value++
});
</script>

<style scoped>
.judgements-table-container {
  display: flex;
  justify-content: center;
}
</style>