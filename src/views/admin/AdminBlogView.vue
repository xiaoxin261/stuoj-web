<script setup lang="ts">
import {deleteBlogApi, getBlogListApi} from '@/apis/blog';
import {onMounted, ref, watch} from "vue";
import { BlogStatusMap, BlogStatusColor } from '@/types/Blog';
import { formatDateStr } from "@/utils/date";
import type { BlogInfo } from '@/types/Blog';
import type { Page } from '@/types/misc';
import router from "@/router";
import {ElNotification} from "element-plus";

interface Scope {
  row: {
    status: keyof typeof BlogStatusMap;
  };
}
interface BlogParams {
  page: number
  size: number
}

const blogPage = ref<Page<"blogs", BlogInfo>>();
const blogs = ref<BlogInfo[]>([]);
const { state, execute } = getBlogListApi();
const params = ref<BlogParams>({
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
    blogPage.value = state.value;
    blogs.value = blogPage.value.blogs;
  }
}

onMounted (() => {
  getList();
})

const handleCreate = () => {
  router.push("/blog/edit");
}

const handleEdit = (row: BlogInfo) => {
  router.push(`/blog/edit?id=${row.id}`);
}

const { execute: deleteBlogExecute } = deleteBlogApi();
const handleDelete = async (row: BlogInfo) => {
  await deleteBlogExecute({
    id: row.id
  }).then(() => {
    getList();
    ElNotification({ type: 'success', message: '删除成功' });
  });
};

// 使用key在更新后让表格重新渲染，否则表格不会更新
const key = ref(0);
watch(() => blogs.value, () => {
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
          <strong>博客管理</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" @click="handleCreate">发表博客</el-button>
          <el-button type="danger" @click="" disabled>批量删除</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-card>
        <el-table :data="blogs" :key="key" style="width: 100%" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80px" />
          <el-table-column label="作者" width="150">
            <template #default="scope">
              <AvatarInfo :user="scope.row.user" name :name-size="16" />
            </template>
          </el-table-column>
          <el-table-column label="标题" show-overflow-tooltip>
            <template #default="scope">
              <router-link :to="'/blog/' + scope.row.id">
                {{ scope.row.title }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="关联题目" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.problem.id">
                <router-link :to="'/problem/' + scope.row.problem.id">
                  [P{{ scope.row.problem.id }}] {{ scope.row.problem.title }}
                </router-link>
              </div>
              <div v-else>
                无
              </div>
            </template>
          </el-table-column>
          <el-table-column label="评论数" width="100">
            <template #default="scope">
              ?
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
              <el-tag :color="BlogStatusColor[scope.row.status]" style="color: #fff">
                {{ BlogStatusMap[scope.row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right" width="150">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
            :total="blogPage?.total"
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
