<script setup lang="ts">

</script>

<template>
  <div class="container-main">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>搜索博客</strong>
            </div>
          </template>
          <el-form>
            <el-form-item>
              <el-input type="text" placeholder="博客标题" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>博客热榜</strong>
            </div>
          </template>
          <ul>
            <li>1. 今天天气真好</li>
            <li>2. 今天天气真好</li>
            <li>3. 今天天气真好</li>
            <li>4. 今天天气真坏</li>
            <li>5. 今天天气真好</li>
          </ul>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>标签分类</strong>
            </div>
          </template>
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="card-header">
              <strong>快速发布</strong>
            </div>
          </template>
          <FastPost />
        </el-card>
        <el-divider></el-divider>
        <Blogs/>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>