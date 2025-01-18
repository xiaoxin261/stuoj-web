<script setup lang="ts">
import { getUserListApi } from '@/apis/user';
import { onMounted, ref } from "vue";
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
        <el-table :data="users" style="width: 100%" @sort-change="sortChange" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80" sortable="custom" />
          <el-table-column label="头像" width="80">
            <template #default="scope">
              <Avatar :src="scope.row.avatar" />
            </template>
          </el-table-column>
          <el-table-column label="用户名" sortable="custom">
            <template #default="scope">
              <router-link :to="'/user/' + scope.row.id">
                {{ scope.row.username }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="200" prop="email" show-overflow-tooltip sortable="custom" />
          <el-table-column label="注册时间" width="120px" sortable="custom">
            <template #default="scope">
              <span>
                {{ formatDateStr(scope.row.create_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="角色" width="80" sortable="custom">
            <template #default="scope: Scope">
              <UserRoleTag :role="scope.row.role" />
            </template>
          </el-table-column>
          <el-table-column align="right" width="300">
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
