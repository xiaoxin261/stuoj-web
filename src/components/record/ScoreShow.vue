<template>
    <div>
        <RecordTag v-if="statusShow" :status="status" />
        <span class="ellipsis score" :style="{ fontSize: props.size + 'px', color: color }">{{ score }}</span>
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
        default: 16
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
.scorp {
    font-weight: bold;
}

div {
    width: 40px;
    display: flex;
    flex-direction: column;
}
</style>