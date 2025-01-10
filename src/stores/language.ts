import { createGlobalState, useStorage } from "@vueuse/core";
import { GetLanguages } from "@/apis/judge";
import { ref } from "vue";
import type { Language } from "@/types/Judge";


export const langStore = createGlobalState(() => {
    const { execute: getLanguagesExecute } = GetLanguages();
    const languages = ref<Language[]>([]);

    const getLanguages = async () => {
        if (languages.value.length > 0) {
            return languages;
        };
        await getLanguagesExecute().then((res) => {
            if (res.value) {
                languages.value = res.value;
            };
        });
        return languages;
    };
    return { getLanguages };
});