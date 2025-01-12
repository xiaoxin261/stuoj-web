<template>
    <a class="color-none" :href="`/user/${user_info.id}`">
        <span class="user-name" :style="{ fontSize: props.size + 'px', color: userColor }">{{ user_info.username
            }}</span>
    </a>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import type { UserInfo } from '@/types/User';
import { GetUserInfo } from '@/apis/user';
import { UserRoleColor } from '@/types/User';

const { execute } = GetUserInfo();

const props = defineProps({
    user: {
        type: Object as PropType<UserInfo>,
        default: () => { }
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

const user_info = ref<UserInfo>(props.user);
const userColor = ref<string>(UserRoleColor[user_info.value.role]);

onMounted(async () => {
    if (props.id !== 0) {
        await execute({ id: props.id }).then((res) => {
            if (!res.value) {
                return;
            };
            user_info.value = res.value;
            userColor.value = UserRoleColor[user_info.value.role];
        });
    }
});
</script>

<style scoped>
.user-name {
    font-weight: bold;
}
</style>