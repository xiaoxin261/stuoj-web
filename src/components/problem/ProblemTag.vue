<template>
    <div :class="['problem-tag', layoutClass]">
        <ProblemTagSelect v-model:tags="tags" ref="problemTagSelectRef" />
        <ProblemTagShow class="tag-show" :size="tagsSize" :remove-flag="removeFlag" v-model:tags="tags" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import type { Tag } from "@/types/Problem";
import ProblemTagSelect from "@/components/problem/ProblemTagSelect.vue";

const props = withDefaults(defineProps<{
    removeFlag?: boolean;
    tags: Tag[];
    tagsSize?:'small'|'default'|'large';
    layout?: 'horizontal' | 'vertical';
}>(), {
    removeFlag: false,
    layout: 'horizontal',
    tagsSize:'small',
});

const tags = ref<Tag[]>(props.tags);

const emit = defineEmits(['update:tags']);

const problemTagSelectRef = ref<InstanceType<typeof ProblemTagSelect> | null>(null);

watchEffect(() => {
    emit('update:tags', tags.value);
});

watchEffect(() => {
    tags.value = props.tags;
});
const reset = () => {
    if (problemTagSelectRef.value)
        problemTagSelectRef.value.resetAndConfirm();
};
defineExpose({
    reset,
});

const layoutClass = computed(() => props.layout === 'horizontal' ? 'horizontal-layout' : 'vertical-layout');

</script>

<style scoped>
.horizontal-layout {
    display: flex;
    flex-direction: row;
    
    .tag-show{
        margin-left: 10px;
    }
}
.vertical-layout {
    display: flex;
    flex-direction: column;
    .tag-show {
        margin-top: 10px;
    }
}
</style>