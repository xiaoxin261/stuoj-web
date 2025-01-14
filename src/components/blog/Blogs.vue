<script setup lang="ts">
import { getBlogListApi, createBlogApi } from '@/apis/blog';
import { onMounted, ref } from "vue";
import { BlogStatusMap, BlogStatusColor, BlogStatus } from '@/types/Blog';
import { formatDateStr } from "@/utils/date";
import type { BlogInfo } from '@/types/Blog';
import { Album, type Page } from '@/types/misc';

interface BlogParams {
  page: number
  size: number
}

const blogPage = ref<Page<"blogs", BlogInfo>>();
const blogs = ref<BlogInfo[]>([]);
const { state, execute: getBlogListExecute } = getBlogListApi();
const params = ref<BlogParams>({
  page: 1,
  size: 10
});

const getList = async () => {
  await getBlogListExecute({
    params: {
      ...params.value,
    }
  });

  if (state.value) {
    blogPage.value = state.value;
    blogs.value = blogPage.value.blogs;
  }
}

onMounted(() => {
  getList();
})
</script>

<template>
  <div v-for="blog in blogs" :key="blog.id">
    <router-link :to="'/blog/' + blog.id">
      <el-card class="blogCard">
        <div style="width: 100%; display: flex; flex-direction: row;">
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
            <div>
              <el-tag :color="BlogStatusColor[blog.status as BlogStatus]" style="color: #ffffff">
                {{ BlogStatusMap[blog.status as BlogStatus] }}
              </el-tag>&nbsp;
              <b>{{ blog.title }}</b>
            </div>
            <div style="display: flex; align-items: center;">
              <AvatarInfo :user="blog.user" name :name-size="16" />
            </div>
          </div>
          <br />
        </div>
        <br />
        <div>
          <el-icon>
            <View />
          </el-icon>&nbsp;?
          <el-divider direction="vertical"></el-divider>
          <el-icon>
            <Comment />
          </el-icon>&nbsp;?
          <el-divider direction="vertical"></el-divider>
          <el-icon>
            <Timer />
          </el-icon>&nbsp;{{ formatDateStr(blog.create_time) }}
          <el-divider direction="vertical"></el-divider>
          <el-icon>
            <Timer />
          </el-icon>&nbsp;{{ formatDateStr(blog.update_time) }}
          <el-divider direction="vertical"></el-divider>
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
        </div>
        <el-divider></el-divider>
        <span>{{ blog.content }}</span>
      </el-card>
    </router-link>
    <br />
  </div>
  <br />
  <el-pagination v-model:current-page="params.page" v-model:page-size="params.size" :page-sizes="[10, 20, 50, 100]"
    :size="'small'" :background="true" layout="total, sizes, prev, pager, next, jumper" :total="blogPage?.total"
    @size-change="getList" @current-change="getList" />
</template>

<style scoped></style>