<template>
    <div :class="['problem-tag', layoutClass]">
        <ProblemTagSelect v-model:tag-ids="tagIds" ref="problemTagSelectRef" />
        <ProblemTagShow class="tag-show" :size="tagsSize" :remove-flag="removeFlag" v-model:tag-ids="tagIds" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import ProblemTagSelect from "@/components/problem/ProblemTagSelect.vue";
import type { Tag } from "@/types/Problem";
import { problemTagStore } from "@/stores/problemTag";

const props = withDefaults(defineProps<{
    removeFlag?: boolean;
    tagIds: number[];
    tags?: Tag[];
    tagsSize?: 'small' | 'default' | 'large';
    layout?: 'horizontal' | 'vertical';
}>(), {
    removeFlag: false,
    tags: () => [],
    layout: 'horizontal',
    tagsSize: 'small',
});

const { getTagList } = problemTagStore();

const allTags = ref<Tag[]>([]);

const tagIds = ref<number[]>(props.tagIds);

const emit = defineEmits(['update:tagIds', 'update:tags']);

const problemTagSelectRef = ref<InstanceType<typeof ProblemTagSelect> | null>(null);

watchEffect(() => {
    emit('update:tags', allTags.value.filter(({ id }) => id !== undefined && tagIds.value.includes(id as number)));
    emit('update:tagIds', tagIds.value);
});


watchEffect(() => {
    tagIds.value = props.tagIds;
});

onMounted(async () => {
    await getTagList().then((res) => {
        allTags.value = res.value;
    });
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

    .tag-show {
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