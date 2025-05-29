<template>
  <div class="container-main">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card :body-style="{
          display: 'flex',
          width: '100 %',
          height: '19rem',
          justifyContent: 'space-between',
        }">
          <div class="carousel"><el-carousel height="19rem">
              <el-carousel-item v-for="(image, index) in banners" :key="index">
                <img :src="image" alt="banner" class="banner-img" />
              </el-carousel-item>
            </el-carousel></div>

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
            <div class="button"><el-button type="info" tag="a" href="/user/login" style="width: 100%;">登录/注册</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <DayProblem/>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <strong>题目推荐</strong>
            </div>
          </template>
          <ProblemRecommend />
        </el-card>
      </el-col>

    </el-row>



    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="margin-bottom: 20px; text-align: center">
          <strong>{{ slot }}好，{{ isLogin ? info.username : "访客" }}</strong><br />
          <span style="font-size: 16px">
            {{ year }} / {{ month }}
          </span><br />
          <span style="font-size: 72px">{{ day }}</span><br />
          <el-button type="success" disabled>签到题</el-button>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>题目传送</strong>
            </div>
          </template>
          <el-form :v-model="gotoForm">
            <el-form-item>
              <el-input v-model="gotoForm.problemId" placeholder="题目 ID" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="gotoProblem">传送</el-button>
              <el-button @click="gotoRandomProblem" disabled>随机传送</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>精选题单</strong>
            </div>
          </template>
          <EmptyPage></EmptyPage>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>近期比赛</strong>
            </div>
          </template>
          <EmptyPage></EmptyPage>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="margin-bottom: 20px">
          <el-carousel height="250px" type="card" class="carousel">
            <el-carousel-item v-for="(image, index) in (banners)" :key="index">
              <img :src="image" alt="banner" class="banner-img" />
            </el-carousel-item>
          </el-carousel>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>公告栏</strong>
            </div>
          </template>
          <NoticeList />
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>题目推荐</strong>
            </div>
          </template>
          <ProblemRecommend />
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>博客推荐</strong>
            </div>
          </template>
          <BlogRecommend />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import router from "@/router";
import { userStore } from "@/stores/user";
import ProblemRecommend from "@/components/problem/ProblemRecommend.vue";
import BlogRecommend from "@/components/blog/BlogRecommend.vue";
import Banner1 from "@/assets/images/banner/stuoj.jpg";
import Banner2 from "@/assets/images/banner/acm-icpc.jpg";
import Banner3 from "@/assets/images/banner/jf.jpg";
import NoticeList from "@/components/blog/NoticeList.vue";

const banners = ref([Banner1, Banner2, Banner3]);

const info = ref(userStore().info);
const isLogin = ref(userStore().isLogin);

onMounted(() => {
  console.log(`年${year} 月${month} 天${day}  ${week}`)
});

const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const months = [ "一月大", "二月小", "三月大", "四月小", "五月大", "六月小", "七月大", "八月大", "九月小", "十月大", "十一月","十二月"];
const date = new Date();
const year = date.getFullYear();
const month = months[date.getMonth() ];
const day = date.getDate();
const hour = date.getHours();
const week = weeks[date.getDay()];
const slot = hour < 12 ? "早上" : hour < 18 ? "下午" : "晚上";

const gotoForm = ref({
  problemId: "",
});

const gotoProblem = () => {
  if (gotoForm.value.problemId) {
    router.push(`/problem/${gotoForm.value.problemId}`);
  }
};
</script>

<style lang=less scoped>
.banner-img {
  width: 100%;
  height: 100%;
}

.carousel {
  width: 60%;
}

.el-row {
  margin-bottom: 1.2rem;
}

.el-row:last-child {
  margin-bottom: 0;
}

.dayBox {
  // background-color: pink;
  width: 40%;

  .day {
    padding: 0.6rem;
    display: flex;
    justify-content: space-between;
    width: 40%;
    margin: 2.4rem auto;
    margin-bottom: 1.2rem;

    // background-color: green;
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
}
</style>