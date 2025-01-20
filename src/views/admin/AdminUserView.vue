<script setup lang="ts">
import { getUserListApi } from '@/apis/user';
import {onMounted, ref, watch} from "vue";
import { UserRoleMap } from '@/types/User';
import { formatDateStr } from "@/utils/date";
import type { UserInfo, UserParams } from '@/types/User';
import { OrderBy, type Page } from '@/types/misc';
import UserRoleTag from '../../components/user/UserRoleTag.vue';

interface Scope {
  row: {
    role: keyof typeof UserRoleMap;
  };
}

const userPage = ref<Page<"users", UserInfo>>();
const users = ref<UserInfo[]>([]);
const { state, execute } = getUserListApi();
const params = ref<UserParams>({
  page: 1,
  size: 20,
  order_by: OrderBy.create_time,
  order: "desc",
});

const getList = async () => {
  await execute({
    params: params.value,
  });

  if (state.value) {
    userPage.value = state.value;
    users.value = userPage.value.users;
  }
};

const columnMap: { [key: string]: OrderBy } = {
  "ID": OrderBy.id,
  "用户名": OrderBy.username,
  "邮箱": OrderBy.email,
  "注册时间": OrderBy.create_time,
  "角色": OrderBy.role,
};

const sortChange = (data: { column: { label: keyof typeof columnMap }, order: string | null }) => {
  if (data.order && data.column.label in columnMap) {
    params.value.order = data.order === "ascending" ? "asc" : "desc";
    params.value.order_by = columnMap[data.column.label];
    getList();
  }
};

onMounted(() => {
  getList();
})

// 使用key在更新后让表格重新渲染，否则表格不会更新
const key = ref(0);
watch(() => users.value, () => {
  key.value++
});
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>用户管理</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" @click="" disabled>创建用户</el-button>
          <el-button type="danger" @click="" disabled>批量删除</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-card>
        <el-table :data="users" :key="key" style="width: 100%" @sort-change="sortChange" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80" />
          <el-table-column label="用户" width="200">
            <template #default="scope">
              <AvatarInfo :user="scope.row" name :name-size="16" />
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="250" prop="email" show-overflow-tooltip/>
          <el-table-column label="个性签名" show-overflow-tooltip>
            <template #default="scope">
                {{ scope.row.signature }}
            </template>
          </el-table-column>
          <el-table-column label="注册时间" width="120px">
            <template #default="scope">
              <span>
                {{ formatDateStr(scope.row.create_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="120">
            <template #default="scope">
              <span>
                {{ formatDateStr(scope.row.update_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="角色" width="80">
            <template #default="scope: Scope">
              <UserRoleTag :role="scope.row.role" />
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template #default="scope">
              <ToUserSettingButton :user-id="scope.row.id" />
            </template>
          </el-table-column>
        </el-table>
        <br />
        <el-pagination v-model:current-page="params.page" v-model:page-size="params.size"
          :page-sizes="[10, 20, 50, 100]" :size="'small'" :background="true"
          layout="total, sizes, prev, pager, next, jumper" :total="userPage?.total" @size-change="getList"
          @current-change="getList" />
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped></style>
