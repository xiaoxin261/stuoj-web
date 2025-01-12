<template>
    <div class="container-main">
        <ElCard>
            <template #header>
                <div class="title">{{ record?.problem.title }}</div>
            </template>
            <div>
                <ElRow :gutter="20">
                    <ElCol :span="16">
                        <div class="record-info">
                            <JudgementsTable :judge_result="judgements" />
                            <TextView v-show="record?.source_code"
                                :content="'\`\`\`\n' + (record?.source_code || '') + '\n\n\`\`\`'" />
                        </div>
                    </ElCol>
                    <ElCol :span="6">
                        <div class="record-info">
                            <AvatarInfo :user-id="record?.user.id" :size="50" :name-size="20" name :popover="false" />
                            <div class="record-info-item">题目：
                                <ProblemName :problem="record?.problem" :size="18" />
                            </div>
                            <div class="record-info-item">语言：
                                <ElTooltip
                                    :content="languages.find((lang: Language) => lang.id === record?.language_id)?.name || 'Unknown'">
                                    {{ languages.find((lang: Language) => lang.id ===
                                        record?.language_id)?.name || 'Unknown' }}
                                </ElTooltip>
                            </div>
                            <div class="record-info-item">状态：
                                <RecordTag :status="record?.status || JudgeStatus.Unknown" />
                            </div>
                            <div class="record-info-item">得分：
                                <ScoreShow :score="record?.score" :status="record?.status" :size="18" />
                            </div>
                            <div class="record-info-item">耗时：
                                {{ record?.time }} s
                            </div>
                            <div class="record-info-item">内存：
                                {{ record?.memory }} KB
                            </div>
                            <div class="record-info-item">提交时间：
                                {{ formatDataTimeStr(record?.create_time) }}
                            </div>
                        </div>
                    </ElCol>
                </ElRow>
            </div>
        </ElCard>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getRecordInfoApi } from '@/apis/record';
import { onBeforeMount, ref } from 'vue';
import type { Judgement, Submission } from '@/types/Record';
import { langStore } from '@/stores/language';
import type { Language } from '@/types/Judge';
import { formatDataTimeStr } from '@/utils/date';
import { JudgeStatus } from '@/types/Judge';

const { execute } = getRecordInfoApi();

const { getLanguages } = langStore();
const languages = ref<Language[]>([]);

const route = useRoute();
const recordId = route.params.id as string;

const record = ref<Submission>();
const judgements = ref<Judgement[]>([]);

onBeforeMount(async () => {
    getLanguages().then((res) => {
        if (res.value) {
            languages.value = res.value;
        }
    });
    await execute({
        id: parseInt(recordId, 10),
    }).then((res) => {
        if (!res.value) {
            return;
        };
        record.value = res.value.submission;
        judgements.value = res.value.judgements;
    });
});
</script>

<style scoped>
.record-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* 添加间隙 */
}

.record-info-item {
    display: flex;
    flex-direction: row;
    font-size: 18px;
}
</style>