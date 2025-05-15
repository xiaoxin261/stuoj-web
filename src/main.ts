// import './assets/main.css'
import './assets/style.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'

import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'

import { userStore } from './stores/user'

const app = createApp(App)

const { getSelfUserInfo, isLogin } = userStore();

const initApp = async () => {
    try {
        isLogin.value && (await getSelfUserInfo());
        app.use(router);
        app.use(ElementPlus, {
            locale: zhCn,
        });
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component);
        }
        app.use(hljsVuePlugin);
    } catch (err: any) {
        console.error(err);
    } finally {
        app.mount("#app");
    }
};

initApp();