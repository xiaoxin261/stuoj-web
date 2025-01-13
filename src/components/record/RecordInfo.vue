<template>
    <div v-if="show">
        <ElDescriptions border class="record-info" :column="4">
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Cpu /></el-icon>
                        状态
                    </div>
                </template>
                <RecordTag :status="result?.status || 0" />
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                      <el-icon><GoldMedal /></el-icon>
                        分数
                    </div>
                </template>
                {{ result.score ?? 0 }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Timer /></el-icon>
                        耗时
                    </div>
                </template>
                {{ result.time ?? 0 }}s
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                      <el-icon><Coin /></el-icon>
                        内存
                    </div>
                </template>
                {{ result.memory ?? 0 }}kb
            </el-descriptions-item>
        </ElDescriptions>
        <JudgementsTable :judge_result="judge_result" />
    </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/user';
import { getRecordInfoApi } from '@/apis/record';
import type { Judgement, Submission } from '@/types/Record';
import { ref, watch } from 'vue';

const { execute, state } = getRecordInfoApi();
const show = ref(false);
let judge_result: Judgement[];
let result: Submission;

const { token } = userStore();

const props = withDefaults(defineProps<{
    id?: number;
}>(), {
    id: 0,
});

const fetchData = async () => {
    clear(); // 清空子组件内容
    if (props.id === 0) return;
    await execute({
        headers: {
            Authorization: token.value
        },
        id: props.id
    });
    if (state.value) {
        judge_result = state.value.judgements;
        result = state.value.submission;
        show.value = true;
    }
};

const clear = () => {
    show.value = false;
    judge_result = [];
    result = {} as Submission;
};

defineExpose({
    clear
});

// 在组件挂载时首次获取数据
fetchData();

// 监听 id 变化并重新获取数据
watch(() => props.id, fetchData);

</script>

<style scoped>
.cell-item {
    display: flex;
    align-items: center;
}
</style>