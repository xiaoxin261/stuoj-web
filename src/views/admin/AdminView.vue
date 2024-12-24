<script setup lang="ts">

</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>控制面板</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
<!--          <el-button type="primary" @click="handleCreate">创建用户</el-button>-->
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <p>
        STUOJ 是汕头大学疾风算法协会的 ACM-ICPC 在线代码评测系统，也是首款支持 AI 大模型自动出题的 OJ 系统。用户可以提交代码到代码沙箱进行评测，管理员可以自动生成算法题目、测试用例和题解代码。
      </p>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
