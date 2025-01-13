<template>
    <el-tooltip class="box-item" effect="dark" :content="JudgeStatusMap[status]" placement="top">
        <el-tag :color="JudgeStatusColor[status]" style="color: #fff">
            {{ JudgeStatusAbbr[status] }}
        </el-tag>
    </el-tooltip>
</template>

<script setup lang="ts">
import { JudgeStatusMap,JudgeStatusColor,JudgeStatusAbbr, JudgeStatus } from '@/types/Judge';

const props = defineProps<{
  status: JudgeStatus
  score?: number
}>();
</script>