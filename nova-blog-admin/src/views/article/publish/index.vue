<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import server from '@/utils/server'
import { createArticle, getArticleDetail, updateArticle } from '@/api/article'

const route = useRoute()

interface ArticleForm {
  title: string
  slug: string
  category: string
  tags: string
  content: string
  id?: number
}

const form = reactive<ArticleForm>({
  title: '新文章',
  slug: '',
  category: '',
  tags: '',
  content: ''
})

const categories = ref([
  { label: '技术', value: 'tech' },
  { label: '生活', value: 'life' },
  { label: '随笔', value: 'essay' }
])

const loading = ref(false)

onMounted(async () => {
  const id = route.query.id
  if (id) {
    try {
      const res = await getArticleDetail(Number(id)) as any
      if (res.data) {
        form.id = res.data.id
        form.title = res.data.title
        form.slug = res.data.slug || ''
        form.content = res.data.content || ''
      }
    } catch (e) {
      console.error('获取文章详情失败:', e)
    }
  }
})

const handlePublish = async () => {
  if (!form.title.trim()) {
    ;(window as any).$message.warning('请输入文章标题')
    return
  }
  if (!form.content.trim()) {
    ;(window as any).$message.warning('请输入文章内容')
    return
  }
  
  loading.value = true
  try {
    if (form.id) {
      await updateArticle({
        id: form.id,
        title: form.title,
        content: form.content,
        slug: form.slug
      } as any)
      ;(window as any).$message.success('更新成功')
    } else {
      await createArticle({
        title: form.title,
        content: form.content,
        slug: form.slug
      } as any)
      ;(window as any).$message.success('发布成功')
    }
  } catch (e) {
    console.error('发布失败:', e)
    ;(window as any).$message.error('发布失败')
  } finally {
    loading.value = false
  }
}

const handleSave = () => {
  if (!form.title.trim()) {
    ;(window as any).$message.warning('请输入文章标题')
    return
  }
  if (!form.content.trim()) {
    ;(window as any).$message.warning('请输入文章内容')
    return
  }
  
  ;(window as any).$message.info('已保存为草稿')
}

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const urls: string[] = await Promise.all(
    files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const res = await server.post('/api/v1/blog/uploadImage', formData) as any
        return res.data?.resourceUrl
      } catch (e) {
        console.error('图片上传失败:', e)
        return URL.createObjectURL(file)
      }
    })
  )
  callback(urls)
}
</script>

<template>
  <div class="publish-container w-full h-full bg-white rounded-lg px-4 py-4">
    <div class="form-header mb-4">
      <el-input
        v-model="form.title"
        placeholder="请输入文章标题"
        size="large"
      />
      <div class="form-options flex gap-2 mt-2">
        <el-input
          v-model="form.slug"
          placeholder="自定义路由（如 my-first-post，留空自动生成）"
          style="width: 260px"
        />
        <el-select v-model="form.category" placeholder="选择分类" style="width: 120px">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="form.tags"
          placeholder="标签，用逗号分隔"
          style="width: 200px"
        />
      </div>
    </div>
    
    <div class="editor-wrapper flex-1 min-h-0">
      <MdEditor
        v-model="form.content"
        language="zh-CN"
        :toolbars="[
          'bold', 'italic', 'strikeThrough', '-',
          'title', 'quote', 'unorderedList', 'orderedList', '-',
          'code', 'codeRow', 'link', 'image', '-',
          'revoke', 'next', '=',
          'pageFullscreen', 'preview', 'catalog'
        ]"
        style="height: 100%"
        @on-upload-img="onUploadImg"
      />
    </div>
    
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t">
      <el-button @click="handleSave">保存草稿</el-button>
      <el-button type="primary" :loading="loading" @click="handlePublish">发布</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.publish-container {
  display: flex;
  flex-direction: column;
  
  :deep(.md-editor) {
    --md-bk-color: #ffffff;
    --md-border-color: #e5e7eb;
  }
}
</style>