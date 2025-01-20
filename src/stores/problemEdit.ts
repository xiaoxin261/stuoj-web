import { deleteTestcaseApi, getProblemApi, getTestcaseApi, updateTestcaseApi, uploadTestcaseApi } from "@/apis/problem";
import type { Testcase } from "@/types/Problem";
import { generateRandomHash } from "@/utils/hash";
import { createGlobalState } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ref, toRaw, watch } from "vue";
import _ from 'lodash';

export interface TemTestcase {
    checked: boolean;
    deleted: boolean;
    data: Testcase;
};

export const problemEditStore = createGlobalState(() => {
    const { execute: getProblemExecute } = getProblemApi();
    const { execute: getTestcaseExecute } = getTestcaseApi();
    const { execute: uploadTestcaseExecute } = uploadTestcaseApi();
    const { execute: updateTestcaseExecute } = updateTestcaseApi();
    const { execute: deleteTestcaseExecute } = deleteTestcaseApi();

    const problemId = ref(0);

    const testcases = ref<TemTestcase[]>([]);

    const currentTestcase = ref<Testcase>({
        id: 0,
        problem_id: 0,
        serial: 0,
        test_input: '',
        test_output: '',
        hash: generateRandomHash(),
    });

    const resetTestcase = async (id: number) => {
        const index = testcases.value.findIndex((testcase) => testcase.data.id === id);
        if (index !== -1) {
            await getTestcaseExecute({
                id: id,
            }).then((res) => {
                if (res.value) {
                    testcases.value[index].data = {
                        ...res.value,
                        hash: testcases.value[index].data.hash,
                    };
                }
            });
            testcases.value[index].checked = false;
            if (currentTestcase.value.hash === testcases.value[index].data.hash) {
                currentTestcase.value = testcases.value[index].data;
            }
        }
    };

    const resetCurrentTestcase = async () => {
        if (!currentTestcase.value || !currentTestcase.value.id) return;

        const index = testcases.value.findIndex((testcase) =>
            testcase.data.id === currentTestcase.value.id
        );

        if (index !== -1) {
            await getTestcaseExecute({
                id: currentTestcase.value.id,
            }).then((res) => {
                if (res.value) {
                    testcases.value[index].data = {
                        ...res.value,
                        hash: testcases.value[index].data.hash,
                    };
                    currentTestcase.value = {
                        ...res.value,
                        hash: currentTestcase.value.hash,
                    };
                }
            });
            testcases.value[index].checked = false;
        }
    };

    const refreshTestcases = async () => {
        testcases.value = [];
        if (problemId.value === 0) {
            ElMessage.error('请先上传题目');
            return;
        }
        await getProblemExecute({
            id: problemId.value,
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

    const uploadTestcase = async () => {
        if (problemId.value === 0) {
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
                            problem_id: problemId.value ?? 0
                        }
                    });
                }
            }
        };
        await refreshTestcases();
    };

    watch(() => currentTestcase, (newTestcase) => {
        if (newTestcase) {
            const index = testcases.value.findIndex(tc => tc.data.hash === newTestcase.value.hash);
            if (index !== -1) {
                // 使用 Lodash 的 isEqual 进行深比较
                if (!_.isEqual(toRaw(testcases.value[index].data), toRaw(newTestcase.value))) {
                    testcases.value[index].data = newTestcase.value;
                    testcases.value[index].checked = true;
                }
            } else {
                testcases.value.push({
                    checked: true,
                    deleted: false,
                    data: newTestcase.value
                });
            }
        }
        console.log(testcases.value);
    }, { deep: true });

    return {
        problemId,
        testcases,
        currentTestcase,
        refreshTestcases,
        resetTestcase,
        resetCurrentTestcase,
        uploadTestcase,
    };
})