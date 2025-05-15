import { computed, ref, watchEffect } from "vue";
import { Role, type UserInfo } from "@/types/User";
import { getUserInfoApi, GetId } from "@/apis/user";
import { createGlobalState, useStorage } from "@vueuse/core";

export const userStore = createGlobalState(() => {
  const { execute: getIdExecute } = GetId();
  const { execute } = getUserInfoApi();

  const token = useStorage("token", "");

  const userMap = new Map<number, UserInfo>();
  // 在 userStore 内部添加
  const pendingRequests = new Map<number, Promise<UserInfo | undefined>>();

  const getUserInfoByUserId = async (userId: number) => {
    if (!userId) return;

    // 1. 尝试从缓存获取
    let userInfo = userMap.get(userId);
    if (userInfo) return userInfo;

    // 2. 检查是否已有进行中的请求
    if (pendingRequests.has(userId)) {
      return pendingRequests.get(userId)!; // 复用已有请求
    }

    // 3. 创建新请求并加锁
    const promise = new Promise<UserInfo | undefined>((resolve) => {
      execute({ id: userId }).then((state) => {
        if (state.value) {
          userInfo = state.value;
          userMap.set(userId, userInfo); // 缓存结果
          resolve(userInfo);
        } else {
          resolve(undefined);
        }
        pendingRequests.delete(userId); // 请求完成后释放锁
      });
    });

    pendingRequests.set(userId, promise);
    return promise;
  };

  const updateToken = (_token: string) => {
    token.value = _token;
  };
  const clearToken = () => {
    token.value = "";
  };

  const id = ref(0);
  const isLogin = computed(() => token.value !== "");
  const info = ref<UserInfo>({
    avatar: "",
    create_time: "",
    email: "",
    id: 0,
    role: Role.Visitor,
    update_time: "",
    username: "访客",
    signature: "",
  });

  const getId = async () => {
    if (!isLogin.value)
      return;
    const state = await getIdExecute(
      {}
    )
    if (state.value) {
      id.value = state.value;
    }
  };


  const getSelfUserInfo = async (userInfo?: UserInfo) => {
    if (!isLogin.value)
      return;
    if (userInfo) {
      info.value = userInfo;
    } else {
      if (id.value === 0) {
        await getId();
      }
      const state = await execute({
        id: id.value
      });
      if (state.value) {
        info.value = state.value;
      }
    };
  };

  return {
    getId,
    getSelfUserInfo,
    id,
    info,
    token,
    updateToken,
    isLogin,
    clearToken,
    getUserInfoByUserId,
  };
});
