## 接口文档

### 博客相关
- 创建
```yaml
url: '/v1/blog/create'
method: POST
params: 
  title: string
  content: string
response: 
  data: 'ok'
  message: '博客创建成功'
  error: null
  code: 200
failure: 
  data: ''
  err: null
  message: '博客创建失败'
  code: 10002
```
- 更新
```yaml
url: '/v1/blog/updata'
method: POST
params:
  title: string
  content: string
  status: string
response:
  data: 'ok'
  message: '博客更新成功'
  error: null
  code: 200
failure: 
  data: ''
  err: null
  message: '博客更新失败'
  code: 10002
```
- 查询
```yaml
url: '/v1/blog/list'
method: POST
params: 
  pageSize: number
  pageIndex: number
response:
  data:
    result: array
    total: number
    currentPage: number
    pageSize: number
failure:
  data: null
  message: '查询博客列表失败'
  error: Error
  code: 10001
```
- 删除
```yaml
url: '/v1/blog/delete'
method: POST
params:
  id: number
response:
  data: 'ok'
  message: '博客删除成功'
  error: null
  code: 200
failure:
  data: ''
  err: '博客删除失败'
  message: null
  code: 10003
```
- 上传markdown
```yaml
url: '/v1/blog/upload'
method: POST
body: Binary
response:
  data: 'ok'
  message: '上传成功'
  error: null
  code: 200
```
- 上传博客图片
```yaml
url: '/v1/blog//uploadImage'
method: POST
body: Binary
response:
  data:
    sourceUrl: string
  message: '上传成功'
  error: null
  code: 200
```
