<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { BlogInfo } from "@/types/Blog";
import { useRouteParams } from "@vueuse/router";
import { getBlogApi } from "@/apis/blog";
import type { ApiResponse } from "@/types/ApiResponse";
import { renderMarkAndLaTeX } from "@/utils/renderMarkAndLaTeX";
import { BlogStatusMap } from "@/types/Blog";
import {StarFilled} from "@element-plus/icons-vue";

const blogId = useRouteParams<number>("id");

const { state, execute } = getBlogApi();

const blog = ref<BlogInfo>({} as BlogInfo);

onMounted(async () => {
  await execute({
    id: blogId.value,
  });
  if (state.value) {
    blog.value = state.value
  }
});
</script>

<template>
  <div class="container-main">
    <el-card>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/blog' }">博客</el-breadcrumb-item>
        <el-breadcrumb-item>{{ blog?.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <br/>
    <el-card>
      <h1>{{ blog?.title }}</h1>
      <br/>
      <span>
                  <el-icon><UserFilled/></el-icon>&nbsp;{{ blog?.authorId }}
                  <el-divider direction="vertical"></el-divider>
                  <el-icon><Timer/></el-icon>&nbsp;{{ blog?.createTime }}
                  <el-divider direction="vertical"></el-divider>
                  <el-icon><Stopwatch /></el-icon>&nbsp;{{ blog?.updateTime }}
              </span>
      <el-divider></el-divider>
      {{ blog?.content }}
      <el-divider></el-divider>
      <span>
                  <el-button><el-icon><View /></el-icon>&nbsp;0</el-button>
                  <el-button><el-icon><StarFilled /></el-icon>&nbsp;0</el-button>
                  <el-button><el-icon><Share /></el-icon>&nbsp;0</el-button>
                </span>
    </el-card>
    <br/>
    <el-card>
      评论区
    </el-card>

  </div>
</template>

<style scoped>

</style>