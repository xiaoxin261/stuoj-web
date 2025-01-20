import { createGlobalState, useStorage } from "@vueuse/core";

export const miscStore = createGlobalState(() => {
    const testEditAutoSumit = useStorage<boolean>("testEditAutoSumit", false);

    return {
        testEditAutoSumit
    };
})