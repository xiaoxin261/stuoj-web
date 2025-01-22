<template>
    <div class="solution-table">
        <div class="button-group">
            <ElButton type="info" :disabled="loading" @click="handleRefresh" icon="Refresh" style="width: 80px;">刷新</ElButton>
        </div>
        <ElTable :data="solutions" style="width: 100%;" :height="300" @current-change="handleCurrentChange"
            highlight-current-row stripe>
            <ElTableColumn label="语言">
                <template #default="scope">
                    <ElTooltip
                        :content="languages.find((lang: Language) => lang.id === scope.row.data.language_id)?.name || 'Unknown'">
                        <span class="ellipsis">{{ languages.find((lang: Language) => lang.id ===
                            scope.row.data.language_id)?.name || 'Unknown' }}</span>
                    </ElTooltip>
                </template>
            </ElTableColumn>
            <ElTableColumn label="脏位" prop="checked" width="65">
                <template #default="scope">
                    <ElTag style="margin-bottom: 10px;" size="large" :type="scope.row.checked ? 'warning' : 'info'">
                        <ElIcon v-if="scope.row.checked">
                            <Warning />
                        </ElIcon>
                        <ElIcon v-else>
                            <CircleCheck />
                        </ElIcon>
                    </ElTag>
                </template>
            </ElTableColumn>
            <ElTableColumn label="重置" width="60" #default="scope">
                <ElButton v-if="scope.row.data.id !== 0" type="danger" :icon="CircleCloseFilled"
                    @click="resetSolution(scope.row.data.id)" style="width: 90%; height: 90%;" />
            </ElTableColumn>
            <ElTableColumn label="删除" width="60" #default="scope">
                <ElCheckbox v-model="scope.row.deleted" size="large" />
            </ElTableColumn>
        </ElTable>
        <div class="button-group">
            <ElButton :disabled="loading" @click="addSolution" icon="CirclePlus">添加题解</ElButton>
            <ElButton type="primary" :disabled="loading" @click="handleConfirm" :icon="Upload">更新</ElButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { ElMessageBox, ElTableColumn, ElTag } from 'element-plus';
import { CircleCloseFilled, Warning, CircleCheck, Upload } from '@element-plus/icons-vue';
import type { Solution } from '@/types/Problem';
import type { Language } from '@/types/Judge';
import { langStore } from '@/stores/language';
import { generateRandomHash } from '@/utils/hash';
import { onBeforeRouteLeave, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { problemEditStore, type TemData } from '@/stores/problemEdit';

const { problemId, solutions, currentSolution, refreshSolutions, resetSolution, uploadSolution } = problemEditStore();

const { getLanguages } = langStore();

const props = withDefaults(defineProps<{
    problemId?: number,
}>(), {
    problemId: 0,
});

const languages = ref<Language[]>([]);

const loading = ref(false);

onMounted(async () => {
    getLanguages().then((res) => {
        if (res.value) {
            languages.value = res.value;
        }
    });
});

const addSolution = async () => {
    const newSolution: TemData<Solution> = {
        checked: true,
        deleted: false,
        data: {
            id: 0,
            problem_id: props.problemId ?? 0,
            language_id: 1,
            source_code: '',
            hash: generateRandomHash(),
        }
    };
    solutions.value.push(newSolution);
};

const handleCurrentChange = async (val: TemData<Solution>) => {
    currentSolution.value = { ...val.data };
};

watch(() => props.problemId, () => {
    problemId.value = props.problemId ?? 0;
}, { immediate: true });

const addExistingSolution = (solution: Solution) => {
    solutions.value.push({
        checked: true,
        deleted: false,
        data: {
            hash: generateRandomHash(),
            ...solution,
        },
    });
};

defineExpose({
    refreshSolutions,
    addExistingSolution,
});

const showLeaveConfirmation = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const hasUnsavedChanges = solutions.value.some(solutions => solutions.checked);
    if (hasUnsavedChanges) {
        ElMessageBox.confirm(
            '题解列表中有未保存的数据，是否离开？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            next(); // 用户确认离开
        }).catch(() => {
            next(false); // 用户取消离开
        });
    } else {
        next(); // 没有未保存的更改，直接允许离开
    }
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const hasUnsavedChanges = solutions.value.some(solutions => solutions.checked);
    if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // 兼容旧版浏览器
    }
};

onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
});

onBeforeRouteLeave(showLeaveConfirmation);

const handleRefresh = async () => {
    loading.value = true;
    await refreshSolutions();
    loading.value = false;
};

const handleConfirm = async () => {
    loading.value = true;
    await uploadSolution();
    loading.value = false;
};
</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: space-between;
}

.solution-table {
    display: flex;
    flex-direction: column;
}

.solution-table .el-button {
    width: 120px;
    margin-bottom: 10px;
    align-self: flex-end;
}
</style>