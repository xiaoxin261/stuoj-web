<script setup lang="ts">
import router from '@/router';
const handleCreate = () => {
  router.push("/problem/edit");
}

</script>

<template>
  <div class="container-full">
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>题目管理</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" @click="handleCreate">创建题目</el-button>
          <el-button type="danger" @click="" disabled>批量删除</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
        <ProblemsComp :admin="true"/>
    </el-main>
  </el-container>
  </div>
</template>

<style scoped>
</style>