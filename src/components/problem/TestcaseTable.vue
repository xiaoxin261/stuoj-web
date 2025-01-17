<template>
    <div class="test-case-table">
        <div class="button-group">
            <ElButton type="info" @click="refreshTestcases" icon="Refresh" style="width: 80px;">刷新</ElButton>
            <ElButton type="primary" @click="addTestcase" icon="CirclePlus">添加测试数据</ElButton>
        </div>
        <ElTable :data="testcases" style="width: 100%;" @current-change="handleCurrentChange" highlight-current-row
            stripe>
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
                    @click="reset(scope.row.data.id)" style="width: 90%; height: 90%;" />
            </ElTableColumn>
            <ElTableColumn label="删除" width="60" #default="scope">
                <ElCheckbox v-model="scope.row.deleted" size="large" />
            </ElTableColumn>
        </ElTable>
        <ElButton type="primary" @click="uploadTestcase" :icon="Upload" style="width: 100px; margin-top: 10px;">更新
        </ElButton>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { CircleCloseFilled, Warning, CircleCheck, Upload } from '@element-plus/icons-vue';
import { ElMessage, ElTableColumn, ElTag } from 'element-plus';
import { getTestcaseApi, uploadTestcaseApi, updateTestcaseApi, deleteTestcaseApi, getProblemApi } from '@/apis/problem';
import type { Testcase } from '@/types/Problem';
import { generateRandomHash } from '@/utils/hash';

const { execute: getProblemExecute } = getProblemApi();
const { execute: getTestcaseExecute } = getTestcaseApi();
const { execute: uploadTestcaseExecute } = uploadTestcaseApi();
const { execute: updateTestcaseExecute } = updateTestcaseApi();
const { execute: deleteTestcaseExecute } = deleteTestcaseApi();

interface TemTestcase {
    checked: boolean;
    deleted: boolean;
    data: Testcase;
}

const props = withDefaults(defineProps<{
    testcase?: Testcase,
    problemId?: number,
}>(), {
    testcase: () => ({
        id: 0,
        serial: 0,
        problem_id: 0,
        test_input: '',
        test_output: '',
        hash: generateRandomHash(),
    }),
    problemId: 0,
});

const emit = defineEmits(['update:testcase']);
const testcases = ref<TemTestcase[]>([]);

const refreshTestcases = async () => {
    testcases.value = [];
    if (props.problemId === 0) {
        ElMessage.error('请先上传题目');
        return;
    }
    await getProblemExecute({
        id: props.problemId,
    }).then((res) => {
        if (res.value?.testcases) {
            testcases.value = res.value.testcases.map((testcase: Testcase) => {
                return {
                    checked: false,
                    deleted: false,
                    data: {
                        ...testcase,
                        hash: generateRandomHash(),
                    },
                };
            });
        }
    });
};

const reset = async (id: number) => {
    if (props.problemId === 0) {
        ElMessage.error('请先上传题目');
        return;
    }
    const index = testcases.value.findIndex((testcase) => testcase.data.id === id);
    if (index !== -1) {
        await getTestcaseExecute({
            id: id,
        }).then((res) => {
            if (res.value) {
                testcases.value[index].data = {
                    ...res.value,
                    hash: generateRandomHash(),
                };
            }
        });
        testcases.value[index].checked = false;
    }
};

const addTestcase = async () => {
    const maxSerial = Math.max(0, ...testcases.value.map(tc => tc.data.serial ?? 0));
    const newTestcase: TemTestcase = {
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

const handleCurrentChange = async (val: TemTestcase) => {
    if (val) {
        emit('update:testcase', val.data);
    }
}

const uploadTestcase = async () => {
    if (props.problemId === 0) {
        ElMessage.error('请先上传题目');
        return;
    }
    for (const testcase of testcases.value) {
        if (testcase.deleted) {
            if (testcase.data.id != undefined && testcase.data.id !== 0) {
                await deleteTestcaseExecute({
                    id: testcase.data.id
                });
            }
        } else if (testcase.checked) {
            if (testcase.data.id !== 0 && testcase.data.id !== undefined) {
                await updateTestcaseExecute({
                    data: testcase.data
                });
            } else {
                await uploadTestcaseExecute({
                    data: {
                        ...testcase.data,
                        problem_id: props.problemId ?? 0
                    }
                });
            }
        }
    };
    await refreshTestcases();
};

watch(() => props.testcase, (newTestcase) => {
    if (newTestcase) {
        const index = testcases.value.findIndex(tc => tc.data.hash === newTestcase.hash);
        if (index !== -1) {
            if (JSON.stringify(testcases.value[index].data) !== JSON.stringify(newTestcase)) {
                testcases.value[index].data = newTestcase;
                testcases.value[index].checked = true;
            }
        } else {
            testcases.value.push({
                checked: true,
                deleted: false,
                data: newTestcase
            });
        }
    }
});

watchEffect(() => {
    testcases.value.forEach(testcase => {
        testcase.data.problem_id = props.problemId ?? 0;
    });
});

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
})
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