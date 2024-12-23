<template>
    <div class="test-case-table">
        <div class="button-group">
            <ElButton type="info" @click="refreshTestCases" icon="Refresh" style="width: 80px;">刷新</ElButton>
            <ElButton type="primary" @click="addTestCase" icon="CirclePlus">添加测试数据</ElButton>
        </div>
        <ElTable :data="testCases" style="width: 100%;" @current-change="handleCurrentChange" highlight-current-row
            stripe>
            <ElTableColumn label="ID" prop="data.id" width="40" />
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
                <ElButton type="danger" :icon="CircleCloseFilled" @click="reset(scope.row.data.id)"
                    style="width: 90%; height: 90%;" />
            </ElTableColumn>
            <ElTableColumn label="删除" width="60" #default="scope">
                <ElCheckbox v-model="scope.row.deleted" size="large" />
            </ElTableColumn>
        </ElTable>
        <ElButton type="primary" @click="uploadTestCase" :icon="Upload" style="width: 100px; margin-top: 10px;">更新
        </ElButton>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getTestCaseApi, uploadTestCaseApi, updateTestCaseApi, deleteTestCaseApi, getProblemApi } from '@/apis/problem';
import type { Testcase } from '@/types/Problem';
import { userStore } from '@/stores/user';
import { ElMessage, ElTableColumn, ElTag } from 'element-plus';
import { CircleCloseFilled, Warning, CircleCheck, Upload } from '@element-plus/icons-vue';

const { execute: getProblemExecute } = getProblemApi();
const { execute: getTestCaseExecute } = getTestCaseApi();
const { execute: uploadTestCaseExecute } = uploadTestCaseApi();
const { execute: updateTestCaseExecute } = updateTestCaseApi();
const { execute: deleteTestCaseExecute } = deleteTestCaseApi();

const { token } = userStore();

interface TemTestCase {
    checked: boolean;
    deleted: boolean;
    data: Testcase;
}

const props = defineProps({
    problemId: {
        type: Number,
        required: false,
    },
    testCase: {
        type: Object as () => Testcase,
        required: false,
    }
});

const emit = defineEmits(['update:testCase']);


const testCases = ref<TemTestCase[]>([]);

const refreshTestCases = async () => {
    testCases.value = [];
    if (props.problemId !== undefined && props.problemId !== 0) {
        await getProblemExecute({
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            id: props.problemId,
        }).then((res) => {
            if (res.value?.testcases) {
                testCases.value = res.value.testcases.map((testcase: Testcase) => {
                    return {
                        checked: false,
                        deleted: false,
                        data: testcase,
                    };
                });
            }
        });
    }
};

const reset = async (id: number) => {
    const index = testCases.value.findIndex((testcase) => testcase.data.id === id);
    if (index !== -1) {
        await getTestCaseExecute({
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            id: id,
        }).then((res) => {
            if (res.value) {
                testCases.value[index].data = res.value;
            }
        });
        testCases.value[index].checked = false;
    }
};

const addTestCase = async () => {
    const maxSerial = Math.max(0, ...testCases.value.map(tc => tc.data.serial));
    const newTestCase: TemTestCase = {
        checked: true,
        deleted: false,
        data: {
            id: 0,
            problem_id: props.problemId ?? 0,
            serial: maxSerial + 1,
            test_input: '',
            test_output: '',
        }
    };
    testCases.value.push(newTestCase);
};

const handleCurrentChange = async (val: TemTestCase | undefined) => {
    if (val) {
        emit('update:testCase', val.data);
    }
}

const uploadTestCase = async () => {
    if (props.problemId === 0) {
        ElMessage.error('请先上传题目');
        return;
    }
    for (const testCase of testCases.value) {
        if (testCase.deleted) {
            if (testCase.data.id != undefined && testCase.data.id !== 0) {
                await deleteTestCaseExecute({
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    }, id: testCase.data.id
                });
            }
        } else if (testCase.checked) {
            if (testCase.data.id !== 0) {
                await updateTestCaseExecute({
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    }, data: testCase.data
                });
            } else {
                await uploadTestCaseExecute({
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    }, data: testCase.data
                });
            }
        }
    };
    await refreshTestCases();
};

defineExpose({
    refreshTestCases,
})
</script>

<style scoped>
.button-group{
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