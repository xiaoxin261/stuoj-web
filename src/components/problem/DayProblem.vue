<template>
  <div class="box">
    <div class="weekBox">
      <div href="" :class="{ active: index === 0 }" class="dayBox" v-for="(item, index) in daysInfo" :key="index">
        <div class="top" :class="{ textRed: item.week === 'SUN' || item.week === 'SAT' }">
          {{ item.week }}
        </div>
        <div class="bottom">
          {{ item.day }}
        </div>
      </div>
    </div>
    <a :href="problem.href" class="problemBox">
      <div class="title"><el-icon style="font-size: 0.7rem;;">
          <EditPen />
        </el-icon><span>每日一题</span></div>
      <div class="problem">No.{{ problem.id }} {{ problem.text }}</div>
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDailyProblemApi } from '@/apis/problem'

const problem = ref({
  id: 1,
  text: "加载中...",
  href: "/problem/1",
  difficulty: 0,
  source: ""
})
const daysInfo = ref([]);
const isLoading = ref(false);

function getDaysInfo() {
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const now = new Date();

  const result = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);

    const dayOfWeek = weekDays[date.getDay()];
    const dayOfMonth = date.getDate();

    result.push({ week: dayOfWeek, day: dayOfMonth });
  }

  return result;
}

const { execute } = getDailyProblemApi();

async function fetchDailyProblem() {
  isLoading.value = true;
  try {
    await execute({}).then((res) => {
      if (res.value) {
        problem.value.id = res.value.id;
        problem.value.text = res.value.title;
        problem.value.href = `/problem/${res.value.id}`;
        problem.value.difficulty = res.value.difficulty;
        problem.value.source = res.value.source;
      }
    });
  } catch (err) {
    console.error('获取每日一题失败:', err);
    problem.value.text = "获取题目失败";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  daysInfo.value = getDaysInfo();
  daysInfo.value[0].day = '今';
  fetchDailyProblem();
});
</script>

<style lang="less" scoped>
.box {
  margin: 0 auto;
  width: 20rem;

  .weekBox {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-bottom: 1.3rem;
    width: 100%;
    height: 4rem;

    .active {
      background-color: #f5f5f5;
      border-radius: 0.2rem;
    }

    .dayBox {
      width: 14%;
      color: #000;

      .top {
        padding: 0.6rem;
        height: 1.3rem;
        font-size: 0.7rem;
        text-align: center;

      }

      .textRed {
        color: rgb(239, 71, 67);
      }

      .bottom {
        height: 1.3rem;
        font-size: 0.8rem;
        text-align: center;
      }
    }

    .dayBox:hover {
      background-color: #f5f5f5;
      border-radius: 0.2rem;
    }
  }

  .problemBox {
    display: block;
    margin: 0 auto;
    padding: 0.6rem 0.9rem;
    width: 18rem;
    height: 2.5rem;
    background-color: #f5f5f5;
    border-radius: 0.2rem;

    .title {
      margin-bottom: 0.5rem;
      font-size: 0.7rem;
      font-weight: 200;
      color: rgb(27, 163, 255);
      display: flex;
      align-items: center;
      span {
        margin-left: 0.3rem;
      }
    }

    .problem {
      font-size: 0.9rem;

      font-weight: 200;
      color: #000;
    }
  }
}
</style>
