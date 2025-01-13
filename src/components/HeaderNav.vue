<template>
  <el-menu class="menu" mode="horizontal" :ellipsis="false" router>
    <div class="logo">
      <img src="@/assets/images/logo/icon.png" alt="Logo" />
      <div class="logo-text">
        <span style="font-weight: bolder">STUOJ</span>
        <span style="font-size: 12px;">stuoj.com</span>
      </div>
    </div>
    <el-menu-item v-for="link in menuLinks" :key="link.index" :index="link.index">
      <el-icon>
        <component :is="link.icon" />
      </el-icon>
      <span>{{ link.text }}</span>
    </el-menu-item>
    <div class="menu-space"><!-- 占位 --></div>
    <el-menu-item>
      <AvatarInfo />
    </el-menu-item>
  </el-menu>

</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { userStore } from '@/stores/user';
import { Collection, Flag, FolderOpened, HomeFilled, List, Notebook, Reading, Setting } from "@element-plus/icons-vue";
import { Role } from "@/types/User";

const { info, isLogin, id } = userStore();
const username = ref(info?.value?.username || '未登录')

const menuLinks = computed(() => {
  const basicLinks = [
    { index: '/', icon: HomeFilled, text: '首页' },
    { index: '/problem', icon: FolderOpened, text: '题库' },
    { index: '/record', icon: List, text: '记录' },
    { index: '/collection', icon: Collection, text: '题单' },
    { index: '/contest', icon: Flag, text: '比赛' },
    { index: '/blog', icon: Notebook, text: '博客' },
  ];
  let links = [
    ...basicLinks
  ];
  if (info.value?.role >= Role.Editor) {
    links.push({ index: '/admin', icon: Setting, text: '管理' });
  }
  return links;
});

watchEffect(() => {
  username.value = info.value?.username || '未登录';
});
</script>

<style scoped>
.menu {
  width: 80%;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 5px 20px;
}

.logo img {
  width: 80px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
}

.menu-space {
  margin-right: auto;
}
</style>
