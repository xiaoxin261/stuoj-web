<script setup lang="ts">
import {deleteCommentApi, getCommentListApi} from '@/apis/comment';
import {onMounted, ref} from "vue";
import { CommentStatusMap, CommentStatusColor } from '@/types/Comment';
import { formatDateStr } from "@/utils/date";
import type { CommentInfo } from '@/types/Comment';
import type { Page } from '@/types/misc';
import {ElNotification} from "element-plus";

interface Scope {
  row: {
    status: keyof typeof CommentStatusMap;
  };
}
interface CommentParams {
  page: number
  size: number
}

const commentPage = ref<Page<"comments", CommentInfo>>();
const comments = ref<CommentInfo[]>([]);
const { state, execute } = getCommentListApi();
const params = ref<CommentParams>({
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
    commentPage.value = state.value;
    comments.value = commentPage.value.comments;
    console.log(state.value);
  }
}

onMounted (() => {
  getList();
})

const { execute: executeDelete } = deleteCommentApi();
const handleDelete = (row: CommentInfo) => {
  executeDelete({
    id: row.id
  }).then(() => {
    getList();
    ElNotification({ type: 'success', message: '删除成功' });
  });
};
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>评论管理</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="danger" @click="" disabled>批量删除</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-card>
        <el-table :data="comments" style="width: 100%" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80px" />
          <el-table-column label="作者" width="150">
            <template #default="scope">
              <AvatarInfo :user="scope.row.user" name :name-size="16" />
            </template>
          </el-table-column>
          <el-table-column label="博客" show-overflow-tooltip>
            <template #default="scope">
              <router-link :to="'/blog/' + scope.row.blog.id">
                {{ scope.row.blog.title }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="内容" show-overflow-tooltip>
            <template #default="scope">
              <router-link :to="'/comment/' + scope.row.comment_id">
                {{ scope.row.content }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="120">
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
          <el-table-column label="状态" width="80">
            <template #default="scope: Scope">
              <el-tag :color="CommentStatusColor[scope.row.status]" style="color: #fff">
                {{ CommentStatusMap[scope.row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template #default="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
            :total="commentPage?.total"
            @size-change="getList"
            @current-change="getList"
        />
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}

</style>
