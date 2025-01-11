<template>
    <a class="color-none" href="#">
        <span class="user-name" :style="{ fontSize: props.size + 'px', color: userColor }" @click="handelUserClick">{{ user_info.username }}</span>
    </a>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import type { UserInfo } from '@/types/User';
import { GetUserInfo } from '@/apis/user';
import router from '@/router';
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
    size:{
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

const handelUserClick = () => {
    router.push(`/user/${user_info.value.id}`);
};
</script>

<style scoped>
.user-name {
    font-weight: bold;
}
</style>