import { createRouter, createWebHistory } from 'vue-router'
import { onMounted } from 'vue';
import { userStore } from '@/stores/user';
import { ROLE } from '@/types/User';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta:{
        permission: ROLE.Visitor,
        title: 'STUOJ',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta:{
        permission: ROLE.Visitor,
        title: '关于 - STUOJ',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta:{
        permission: ROLE.Visitor,
        title: '登录 - STUOJ',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta:{
        permission: ROLE.Visitor,
        title: '注册 - STUOJ',
      },
    },
    {
      path:'/user/:id',
      name:'user',
      component: () => import('../views/user/UserSpace.vue'),
      meta:{
        permission: ROLE.Visitor,
        title: '个人空间 - STUOJ',
      },
    },
    {
      path:'/problems',
      name:'problems',
      component: () => import('../views/problem/ProblemListView.vue'),
      meta:{
        permission: ROLE.Visitor,
        title: '题库 - STUOJ',
      },
    },
    {
      path:'/aiprocess',
      name:'aiprocess',
      component: () => import('../views/auth/AIProcess.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/problemdisplay',
      name:'problemdisplay',
      component: () => import('../views/auth/ProblemDisplay.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/writecode',
      name:'writecode',
      component: () => import('../views/auth/WriteCode.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/aiprocess',
      name:'aiprocess',
      component: () => import('../views/auth/AIProcess.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/problemdisplay',
      name:'problemdisplay',
      component: () => import('../views/auth/ProblemDisplay.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/writecode',
      name:'writecode',
      component: () => import('../views/auth/WriteCode.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/aiprocess',
      name:'aiprocess',
      component: () => import('../views/auth/AIProcess.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/problemdisplay',
      name:'problemdisplay',
      component: () => import('../views/auth/ProblemDisplay.vue'),
      meta:{permission: ROLE.Visitor, },
    },
    {
      path:'/problem/:id',
      name:'problem',
      component: () => import('../views/problem/ProblemView.vue'),
      meta:{
        permission: ROLE.Visitor,
        title: '题目 - STUOJ',
      },
    },
    {
      path:'/admin',
      name:'admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta:{
        title: '管理面板 - STUOJ',
        permission: ROLE.Admin,
      },
    },
    {
      path: '/admin/user',
      component: () => import('@/views/admin/AdminUserView.vue'),
      meta: {
        title: '用户管理 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/problem',
      component: () => import('@/views/admin/AdminProblemView.vue'),
      meta: {
        title: '题目管理 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/tag',
      component: () => import('@/views/admin/AdminTagView.vue'),
      meta: {
        title: '标签管理 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/record',
      component: () => import('@/views/admin/AdminRecordView.vue'),
      meta: {
        title: '记录管理 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/blog',
      component: () => import('@/views/admin/AdminBlogView.vue'),
      meta: {
        title: '博客管理 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/comment',
      component: () => import('@/views/admin/AdminCommentView.vue'),
      meta: {
        title: '评论管理 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/report',
      component: () => import('@/views/admin/AdminReportView.vue'),
      meta: {
        title: '处理举报 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/statistics',
      component: () => import('@/views/admin/AdminStatisticsView.vue'),
      meta: {
        title: '系统设置 - STUOJ',
        permission: ROLE.Admin,
      }
    },
    {
      path: '/admin/system',
      component: () => import('@/views/admin/AdminSystemView.vue'),
      meta: {
        title: '系统设置 - STUOJ',
        permission: ROLE.Admin,
      }
    }
  ],
})

router.beforeEach(async (to: any, from: any, next) => {
  const {info}=userStore();
  const permission = info.value?.role ?? -1;
  if (to.meta.permission > permission) {
    next("/403");
  }

  next();
});

export default router
