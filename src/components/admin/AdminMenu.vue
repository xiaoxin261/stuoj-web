<script setup lang="ts">
import {
  Collection,
  Flag,
  HomeFilled,
  List,
  Notebook,
  PriceTag,
  Reading,
  UserFilled,
  WarnTriangleFilled,
  Comment,
  Histogram,
  Tools,
  Postcard
} from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import { userStore } from '@/stores/user';
import { Role } from "@/types/User";
const isCollapse = ref(false);

const { info } = userStore();

const menuLinks = computed(() => {
  const basicLinks = [
    { index: '/admin', icon: HomeFilled, text: '面板首页', role: Role.Editor },
    { index: '/admin/user', icon: UserFilled, text: '用户管理', role: Role.Admin },
    { index: '/admin/problem', icon: Reading, text: '题目管理', role: Role.Editor },
    { index: '/admin/tag', icon: PriceTag, text: '标签管理', role: Role.Editor },
    { index: '/admin/language', icon: Postcard, text: '语言管理', role: Role.Editor },
    { index: '/admin/record', icon: List, text: '记录管理', role: Role.Admin },
    { index: '/admin/collection', icon: Collection, text: '题单管理', role: Role.Admin },
    { index: '/admin/contest', icon: Flag, text: '比赛管理', role: Role.Admin },
    { index: '/admin/blog', icon: Notebook, text: '博客管理', role: Role.Admin },
    { index: '/admin/comment', icon: Comment, text: '评论管理', role: Role.Admin },
    { index: '/admin/report', icon: WarnTriangleFilled, text: '处理举报', role: Role.Admin },
    { index: '/admin/statistics', icon: Histogram, text: '统计数据', role: Role.Admin },
    { index: '/admin/system', icon: Tools, text: '系统设置', role: Role.Root },
  ];
  return basicLinks.filter(link => info.value?.role >= link.role);
})

</script>

<template>
  <el-menu default-active="1" :collapse="isCollapse" router>
    <!--
    <el-menu-item>
      <el-switch
          v-model="isCollapse"
          size="small"
      />
    </el-menu-item>
-->
    <el-menu-item v-for="link in menuLinks" :key="link.index" :index="link.index">
      <el-icon>
        <component :is="link.icon" />
      </el-icon>
      <span>{{ link.text }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.el-menu {
  border-right: none;
}

.el-menu-item {
  transition: all 0.3s;
  color: var(--el-text-color-regular);
}

:deep(.el-menu-item.is-active) {
  color: #fff !important;
  background-color: #409EFF !important;
  font-weight: bold;
  border-radius: 4px;
  margin: 4px;
}

.el-menu-item:hover {
  background-color: var(--el-color-primary-light-8);
  color: var(--el-color-primary) !important;
}
</style>
