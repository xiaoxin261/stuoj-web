<template>
  <ElForm :model="form" label-width="120px">
    <ElFormItem label="题单名称" required>
      <ElInput v-model="form.title" placeholder="请输入题单名称" />
    </ElFormItem>
    <ElFormItem label="题单描述">
      <ElInput 
        v-model="form.description" 
        type="textarea" 
        :rows="3"
        placeholder="请输入题单描述"
      />
    </ElFormItem>
    <ElFormItem label="状态">
      <ElSelect v-model="form.status" placeholder="请选择状态">
        <ElOption label="公开" :value="1" />
        <ElOption label="私有" :value="0" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem>
      <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      <ElButton @click="handleCancel">取消</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createCollectionApi, updateCollectionApi } from '@/apis/collection'

export default defineComponent({
  name: 'CollectionForm',
  props: {
    id: {
      type: Number,
      required: false
    }
  },
  emits: ['success', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      title: '',
      description: '',
      status: 1
    })

    const handleSubmit = async () => {
      try {
        if (props.id) {
          await updateCollectionApi().execute({
            id: props.id,
            ...form.value
          })
        } else {
          const res = await createCollectionApi().execute(form.value)
          if (res.value?.data) {
            ElMessage.success('创建成功')
          }
        }
        emit('success')
      } catch (error) {
        ElMessage.error('操作失败，请重试')
      }
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      form,
      handleSubmit,
      handleCancel
    }
  }
})
</script>
