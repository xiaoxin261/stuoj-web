<script setup lang="ts">
import { ref } from "vue";
import { userStore } from "@/stores/user";

const props = defineProps<{
  banners: string[]
}>();

const info = ref(userStore().info);
const isLogin = ref(userStore().isLogin);

const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const months = ["一月大", "二月小", "三月大", "四月小", "五月大", "六月小", "七月大", "八月大", "九月小", "十月大", "十一月", "十二月"];
const date = new Date();
const year = date.getFullYear();
const month = months[date.getMonth()];
const day = date.getDate();
const hour = date.getHours();
const week = weeks[date.getDay()];
const slot = hour < 12 ? "早上" : hour < 18 ? "下午" : "晚上";

const emit = defineEmits(['goToLogin']);

const handleLogin = () => {
  emit('goToLogin');
};
</script>

<template>
  <el-card :body-style="{
    display: 'flex',
    width: '100%',
    height: '19rem',
    justifyContent: 'space-between',
  }">
    <div class="carousel">
      <el-carousel height="19rem">
        <el-carousel-item v-for="(image, index) in banners" :key="index">
          <img :src="image" alt="banner" class="banner-img" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="dayBox">
      <div class="day">
        <div class="left">{{ month }}</div>
        <div class="center">{{ day }}</div>
        <div class="right">{{ week }}</div>
      </div>
      <div class="rise">
        距 <strong>CSP-J/S 2025 第一轮</strong> 还剩 <strong>154 天</strong><br>
        距 <strong>CSP-J/S 2025 第二轮</strong> 还剩 <strong>189 天</strong><br>
      </div>
      <div class="welcome">欢迎来到STUOJ</div>
      <div class="button" v-if="!isLogin">
        <el-button type="info" @click="handleLogin" style="width: 100%;">登录/注册</el-button>
      </div>
      <div class="greeting" v-else>
        {{ slot }}好，{{ info.username }}
        <el-button type="info" tag="a" href="/problem" style="margin: 0.5rem auto; display: block; width: 10rem;">去做题</el-button>
      </div>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.banner-img {
  width: 100%;
  height: 100%;
}

.carousel {
  width: 60%;
}

.dayBox {
  width: 40%;

  .day {
    padding: 0.6rem;
    display: flex;
    justify-content: space-between;
    width: 40%;
    margin: 2.4rem auto;
    margin-bottom: 1.2rem;

    .left {
      width: 1.2rem;
      color: rgba(5, 67, 16, 0.79);
      vertical-align: top;
      line-height: 1rem;
      margin: 0.8rem 0.6rem;
      font-weight: bolder;
    }

    .center {
      font-size: 5rem;
      color: rgba(5, 67, 16, 0.79);
      vertical-align: top;
      line-height: 5.2rem;
      font-weight: bolder;
    }

    .right {
      width: 1.2rem;
      color: rgba(5, 67, 16, 0.79);
      vertical-align: top;
      line-height: 1rem;
      margin: 0.8rem 0.6rem;
      font-weight: bold;
    }
  }

  .rise {
    font-size: 0.6rem;
    width: 60%;
    color: #7f7f7f;
    margin: 0 auto;
    padding-bottom: 0.6rem;
    text-align: center;
    border-bottom: 1px solid #7f7f7f;

    strong {
      font-weight: 700;
      color: #606060;
    }
  }

  .welcome {
    margin: 0.6rem auto;
    text-align: center;
    font-size: 0.9rem;
  }

  .button {
    width: 50%;
    margin: 0 auto;
    text-align: center;
  }

  .greeting {
    text-align: center;
    font-weight: 700;
  }
}
</style>
