import { useDefineApi } from '@/stores/useDefineApi';
import type { ProblemSimpleData } from '@/types/Problem';
import type { UserSimpleData } from '@/types/User';

// 题单数据结构
export interface CollectionData {
  id: number;
  title: string;
  description: string;
  status: number;
  create_time: string;
  update_time: string;
  user: UserSimpleData;
  problems: (ProblemSimpleData & {
    user_score: number;
    has_user_submission: boolean;
  })[];
  collaborator: UserSimpleData[];
}

// 题单列表响应
export interface CollectionListResponse {
  collections: {
    id: number;
    title: string;
    status: number;
    create_time: string;
    update_time: string;
    user: UserSimpleData;
  }[];
  page: number;
  size: number;
  total: number;
}

// 获取题单列表
export const getCollectionListApi = useDefineApi<
  {
    page?: number;
    size?: number;
    title?: string;
    user?: string;
    problem?: string;
    'start-time'?: string;
    'end-time'?: string;
    status?: string;
    order_by?: string;
    order?: string;
  },
  CollectionListResponse
>({
  url: '/collection',
  method: 'GET'
});

// 创建题单
export const createCollectionApi = useDefineApi<
  {
    title: string;
    description: string;
    status: number;
  },
  { data: number }
>({
  url: '/collection',
  method: 'POST'
});

// 修改题单
export const updateCollectionApi = useDefineApi<
  {
    id: number;
    title: string;
    description: string;
    status: number;
  },
  unknown
>({
  url: '/collection',
  method: 'PUT'
});

// 获取单个题单
export const getCollectionApi = useDefineApi<
  { id: string },
  { data: CollectionData }
>({
  url: '/collection/{id}',
  method: 'GET'
});

// 删除题单
export const deleteCollectionApi = useDefineApi<
  { id: number },
  unknown
>({
  url: '/collection/{id}',
  method: 'DELETE'
});

// 修改题单题目
export const updateCollectionProblemsApi = useDefineApi<
  {
    collection_id: number;
    problem: Array<{
      problem_id: number;
      serial: number;
    }>;
  },
  unknown
>({
  url: '/collection/problem',
  method: 'PUT'
});

// 修改题单协作者
export const updateCollectionCollaboratorsApi = useDefineApi<
  {
    collection_id: number;
    user_ids: number[];
  },
  unknown
>({
  url: '/collection/user',
  method: 'PUT'
});
