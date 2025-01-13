<template>
  <el-menu
      class="menu"
      mode="horizontal"
      :ellipsis="false"
      router
  >
    <div class="logo">
      <img src="@/assets/appIcons/icon.png" alt="Logo"/>
      <div class="logo-text">
        <span style="font-weight: bolder">STUOJ</span>
        <span style="font-size: 12px;">stuoj.com</span>
      </div>
    </div>
      <el-menu-item index="/">
        <el-icon>
          <HomeFilled/>
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/problem">
        <el-icon>
          <el-icon><FolderOpened /></el-icon>
        </el-icon>
        <span>题库</span>
      </el-menu-item>
      <el-menu-item index="/record">
        <el-icon>
          <el-icon><List /></el-icon>
        </el-icon>
        <span>记录</span>
      </el-menu-item>
      <el-menu-item index="/collection">
        <el-icon>
          <el-icon><Collection /></el-icon>
        </el-icon>
        <span>题单</span>
      </el-menu-item>
      <el-menu-item index="/contest">
        <el-icon><Flag /></el-icon>
        <span>比赛</span>
      </el-menu-item>
      <el-menu-item index="/blog">
        <el-icon>
          <el-icon><Notebook /></el-icon>
        </el-icon>
        <span>博客</span>
      </el-menu-item>
      <el-menu-item index="/admin" v-if="isLogin && info.role >= Role.Admin">
        <el-icon><Setting /></el-icon>
        <span>管理</span>
      </el-menu-item>
    <div class="menu-space"><!-- 占位 --></div>
    <el-menu-item><AvatarInfo /></el-menu-item>
  </el-menu>

</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { userStore } from '@/stores/user';
import {Collection, Flag, FolderOpened, HomeFilled, List, Notebook, Reading, Setting} from "@element-plus/icons-vue";
import {Role} from "@/types/User";

const { info, isLogin, id } = userStore();
const username = ref(info?.value?.username || '未登录')

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
