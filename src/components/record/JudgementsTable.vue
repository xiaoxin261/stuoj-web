<template>
    <ElTable :data="judge_result" border class="judge-result" stripe>
        <ElTableColumn prop="testcase_id" label="测试点" width="80" />
        <ElTableColumn prop="status" label="状态" width="100">
            <template #default="scope">
                <RecordTag :status="scope.row.status" />
            </template>
        </ElTableColumn>
        <ElTableColumn prop="time" label="时间" width="100">
            <template #default="scope">
                {{ scope.row.time }}s
            </template>
        </ElTableColumn>
        <ElTableColumn prop="memory" label="内存" width="100">
            <template #default="scope">
                {{ scope.row.memory }}kb
            </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="信息">
            <template #default="scope">
                {{ JudgeStatusMap[scope.row.status as JudgeStatus] }}
            </template>
        </ElTableColumn>
    </ElTable>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import type { Judgement } from '@/types/Record';
import { JudgeStatusMap, type JudgeStatus } from '@/types/Judge';
import { getRecordInfo } from '@/apis/record';

const { execute } = getRecordInfo();

const props = defineProps({
    judge_result: {
        type: Array as PropType<Judgement[]>,
        default: () => []
    },
    id: {
        type: Number as PropType<number>,
        default: null
    }
});

const judge_result = ref<Judgement[]>(props.judge_result);

onMounted(async () => {
    if (props.id) {
        const res = await execute({
            id: props.id
        }).then((res) => {
            if (!res.value) {
                return;
            };
            judge_result.value = res.value.judgements;
        });
    };
});



</script>

<style scoped>
.judge-result {
    width: 100%;
    margin-top: 10px;
}

.judge-result>.ElTableColumn {
    width: 100%;
}
</style>