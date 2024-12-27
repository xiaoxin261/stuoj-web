<template>
  <div class="container-main">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="margin-bottom: 20px; text-align: center">
          <strong>{{ slot }}好，{{ isLogin ? info.username : "访客" }}</strong><br/>
          <span style="font-size: 16px">
            {{ year }} / {{ month }}
          </span><br/>
          <span style="font-size: 72px">{{ day }}</span><br/>
          <el-button type="success">签到题</el-button>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>题目传送门</strong>
            </div>
          </template>
          <el-form :v-model="gotoForm">
            <el-form-item>
              <el-input v-model="gotoForm.problemId" placeholder="题目 ID" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="gotoProblem">传送</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>网站公告</strong>
            </div>
          </template>
          <div>
            <ul>
              <li>1. 今天天气真好</li>
              <li>2. 今天天气真好</li>
              <li>3. 今天天气真好</li>
              <li>4. 今天天气真坏</li>
              <li>5. 今天天气真好</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="margin-bottom: 20px">
          <el-carousel height="100" motion-blur>
            <el-carousel-item v-for="item in 4" :key="item">
              <h3 class="small justify-center" text="2xl">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>好题推荐</strong>
            </div>
          </template>
          推荐题目...
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>精选题单</strong>
            </div>
          </template>
          推荐题单...
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>近期比赛</strong>
            </div>
          </template>
          推荐比赛...
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>优秀博客</strong>
            </div>
          </template>
          推荐博客...
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import router from "@/router";
import { userStore } from "@/stores/user";

const info = ref(userStore().info)
const isLogin = ref(userStore().isLogin);


onMounted(() => {
});

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const hour = date.getHours();
const slot = hour < 12 ? '早上' : hour < 18 ? '下午' : '晚上';

const gotoForm = ref({
  problemId: ""
});

const gotoProblem = () => {
  if (gotoForm.value.problemId) {
    router.push(`/problem/${gotoForm.value.problemId}`);
  }
}
</script>

<style>
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>