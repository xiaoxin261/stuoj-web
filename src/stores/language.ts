import { createGlobalState } from "@vueuse/core";
import { getLanguageListApi } from "@/apis/language";
import { ref } from "vue";
import { LanguageStatus, type Language } from "@/types/Judge";


export const langStore = createGlobalState(() => {
    const { execute: getLanguagesExecute } = getLanguageListApi();
    const languages = ref<Language[]>([]);

    const getLanguages = async () => {
        if (languages.value.length > 0) {
            return languages;
        };
        await getLanguagesExecute().then((res) => {
            if (res.value) {
                languages.value = res.value;
                languages.value.push(({
                    id: 0,
                    name: '请选择语言',
                    disabled: true,
                    serial: 10000,
                }));
            };
        });
        languages.value.sort((a, b) => a.serial - b.serial);
        return languages;
    };

    const refreshLanguages = async () => {
        languages.value = [];
        return await getLanguages();
    }

    return { getLanguages, refreshLanguages };
});