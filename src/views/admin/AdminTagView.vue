<script setup lang="ts">
import {onMounted, ref} from "vue";
import type { Tag } from '@/types/Problem';
import type { Page } from '@/types/misc';
import {userStore} from "@/stores/user";
import {getTagListApi} from "@/apis/tag";

interface TagParams {
  page: number
  size: number
}

const tagPage = ref<Page<"tags", Tag>>();
const tags = ref<Tag[]>([]);
const { state, execute } = getTagListApi();
const params = ref<TagParams>({
  page: 1,
  size: 10
});
const { token } = userStore();

const getList = async () => {
  await execute({
    params: {
      ...params.value,
    }
  });

  if (state.value) {
    tagPage.value = state.value;
    tags.value = tagPage.value.tags;
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
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>标签管理</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" @click="handleCreate">创建标签</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-card>
        <el-table :data="tags" style="width: 100%" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80" sortable/>
          <el-table-column label="标签" prop="name" />
          <el-table-column label="关联题目数" >
            <template #default="scope">
              ?
            </template>
          </el-table-column>
          <el-table-column label="关联博客数" >
            <template #default="scope">
              ?
            </template>
          </el-table-column>
          <el-table-column align="right" width="300">
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
            :total="tagPage?.total"
            @size-change="getList"
            @current-change="getList"
        />
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
