import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import { getTagListApi } from "@/apis/tag";
import type { Tag } from "@/types/Problem";

export const problemTagStore = createGlobalState(() => {
    const { execute: getTagListExecute } = getTagListApi();
    const tags = ref<Tag[]>([]);

    const getTagList = async () => {
        if (tags.value.length > 0) {
            return tags;
        };
        await getTagListExecute({
            params: {
                page: 1,
                size: 1000
            },
        }).then((res) => {
            if (res.value) {
                tags.value = res.value.tags;
            }
        });
        return tags;
    };

    return { getTagList };
})