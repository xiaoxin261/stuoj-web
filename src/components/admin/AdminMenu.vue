<script setup lang="ts">

</script>

<template>
  <el-menu
      default-active="1"
      router
  >
    <el-menu-item index="/admin">
      <el-icon>
        <HomeFilled/>
      </el-icon>
      <span>面板首页</span>
    </el-menu-item>
    <el-menu-item index="/admin/user">
      <el-icon>
        <UserFilled/>
      </el-icon>
      <span>用户管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/problem">
      <el-icon>
        <el-icon><Reading /></el-icon>
      </el-icon>
      <span>题目管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/tag">
      <el-icon>
        <PriceTag/>
      </el-icon>
      <span>标签管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/collection">
      <el-icon>
        <el-icon><Collection /></el-icon>
      </el-icon>
      <span>题单管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/record">
      <el-icon>
        <el-icon><List /></el-icon>
      </el-icon>
      <span>记录管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/blog">
      <el-icon>
        <el-icon><Notebook /></el-icon>
      </el-icon>
      <span>博客管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/comment">
      <el-icon>
        <Comment/>
      </el-icon>
      <span>评论管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/report">
      <el-icon>
        <WarnTriangleFilled/>
      </el-icon>
      <span>处理举报</span>
    </el-menu-item>
    <el-menu-item index="/admin/statistics">
      <el-icon>
        <el-icon><Histogram /></el-icon>
      </el-icon>
      <span>统计数据</span>
    </el-menu-item>
    <el-menu-item index="/admin/system">
      <el-icon>
        <Tools/>
      </el-icon>
      <span>系统设置</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>

</style>
