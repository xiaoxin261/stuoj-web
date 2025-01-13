<template>
  <div class="score-show">
    <RecordTag v-if="statusShow" :status="status" :score="score" />
    <div class="score-row">
      <el-icon><GoldMedal /></el-icon>
      <span class="ellipsis score" :style="{ fontSize: props.size, color: color }">{{ score }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, type PropType } from 'vue';
import { JudgeStatusColor, JudgeStatus } from '@/types/Judge';
import { getRecordInfoApi } from '@/apis/record';

const { execute } = getRecordInfoApi();

const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 8
  },
  status: {
    type: Number as PropType<JudgeStatus>,
    default: JudgeStatus.Unknown
  },
  statusShow: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number,
    default: 0
  }
});

const score = ref(props.score);
const status = ref(props.status);
const color = ref(JudgeStatusColor[status.value]);

onMounted(async () => {
  if (props.id !== 0) {
    await execute({ id: props.id }).then((res) => {
      if (!res.value) {
        return;
      };
      score.value = res.value.submission.score ?? 0;
      status.value = res.value.submission.status;
    });
  };
  color.value = JudgeStatusColor[status.value];
});

watchEffect(() => {
  score.value = props.score;
  status.value = props.status;
  color.value = JudgeStatusColor[status.value];
});

</script>

<style scoped>
.score {
  font-weight: bold;
}

.score-show {
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-row {
  display: flex;
  align-items: center;
}
</style>