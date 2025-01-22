<template>
    <div class="test-case-table">
        <div class="button-group">
            <ElButton type="info" :disabled="loading" @click="handleRefresh" icon="Refresh" style="width: 80px;">刷新</ElButton>
        </div>
        <ElTable v-loading="loading" :data="testcases" style="width: 100%;" :height="300"
            @current-change="handleCurrentChange" highlight-current-row stripe>
            <ElTableColumn label="编号" prop="data.serial" />
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
                    @click="resetTestcase(scope.row.data.id)" style="width: 90%; height: 90%;" />
            </ElTableColumn>
            <ElTableColumn label="删除" width="60" #default="scope">
                <ElCheckbox v-model="scope.row.deleted" size="large" />
            </ElTableColumn>
        </ElTable>
        <div class="button-group">
            <ElButton :disabled="loading" @click="addTestcase" icon="CirclePlus">添加测试数据</ElButton>
            <ElButton type="primary" :disabled="loading" @click="handleConfirm" :icon="Upload" style="width: 100px; margin-top: 10px;">更新
            </ElButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { CircleCloseFilled, Warning, CircleCheck, Upload } from '@element-plus/icons-vue';
import { ElTableColumn, ElTag, ElMessageBox } from 'element-plus';
import { problemEditStore, type TemData } from '@/stores/problemEdit';
import type { Testcase } from '@/types/Problem';
import { generateRandomHash } from '@/utils/hash';
import { onBeforeRouteLeave, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';

const { problemId, testcases, currentTestcase, refreshTestcases, resetTestcase, uploadTestcase } = problemEditStore();

const props = withDefaults(defineProps<{
    problemId?: number,
}>(), {
    problemId: 0,
});

const loading = ref(false);

const addTestcase = async () => {
    const maxSerial = Math.max(0, ...testcases.value.map(tc => tc.data.serial ?? 0));
    const newTestcase: TemData<Testcase> = {
        checked: true,
        deleted: false,
        data: {
            id: 0,
            problem_id: props.problemId ?? 0,
            serial: maxSerial + 1,
            test_input: '',
            test_output: '',
            hash: generateRandomHash(),
        }
    };
    testcases.value.push(newTestcase);
};

const handleCurrentChange = async (val: TemData<Testcase>) => {
    currentTestcase.value = { ...val.data };
};

watch(() => props.problemId, () => {
    problemId.value = props.problemId ?? 0;
}, { immediate: true });

const addExistingTestcase = async (testcase: Testcase) => {
    const maxSerial = Math.max(0, ...testcases.value.map(tc => tc.data.serial ?? 0));
    testcases.value.push({
        checked: true,
        deleted: false,
        data: {
            hash: generateRandomHash(),
            ...testcase,
            serial: maxSerial + 1,
        }
    });
};

defineExpose({
    refreshTestcases,
    addExistingTestcase,
});

const showLeaveConfirmation = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const hasUnsavedChanges = testcases.value.some(testcase => testcase.checked);
    if (hasUnsavedChanges) {
        ElMessageBox.confirm(
            '测试数据列表中有未保存的数据，是否离开？',
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

const handleRefresh = async () => {
    loading.value = true;
    await refreshTestcases();
    loading.value = false;
}

const handleConfirm = async () => {
    loading.value = true;
    await uploadTestcase();
    loading.value = false;
}

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const hasUnsavedChanges = testcases.value.some(testcase => testcase.checked);
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
</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: space-between;
}

.test-case-table {
    display: flex;
    flex-direction: column;
}

.test-case-table .el-button {
    width: 120px;
    margin-bottom: 10px;
    align-self: flex-end;
}
</style>