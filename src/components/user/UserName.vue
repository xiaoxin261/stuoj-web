<template>
    <a v-if="user_info && user_info.id" class="color-none" :href="`/user/${user_info.id}`">
        <span class="user-name" :style="{ fontSize: props.size + 'px', color: userColor }">{{ user_info.username
            }}</span>
    </a>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watchEffect, type PropType } from 'vue';
import type { UserInfo } from '@/types/User';
import { getUserInfoApi } from '@/apis/user';
import { UserRoleColor } from '@/types/User';

const { execute } = getUserInfoApi();

const props = defineProps({
    user: {
        type: Object as PropType<UserInfo>,
        default: () => ({})
    },
    id: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 16
    }
});

const user_info = ref<UserInfo>({ ...props.user });
const userColor = ref<string>('');

const load = async () => {
    if (props.id !== 0) {
        execute({ id: props.id }).then((res) => {
            if (res.value) {
                user_info.value = res.value;
            }
        });
    }
    if (user_info.value && user_info.value.role) {
        userColor.value = UserRoleColor[user_info.value.role] || '';
    }
};

onBeforeMount(async () => {
    load();
});

watchEffect(() => {
    user_info.value = props.user;
    load();
});
</script>

<style scoped>
.user-name {
    font-weight: bold;
}
</style>