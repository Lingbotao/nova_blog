import fetch from "@/utils/server";
import type { IResult } from '@/types/common'

export interface ArticleListItem {
  id: number
  title: string
  category?: string
  tags?: string
  content?: string
  cover?: string
  summary?: string
  isTop?: boolean
  isPublished?: boolean
  createTime?: string
  updateTime?: string
}

export interface ArticleQuery {
  pageSize: number
  pageIndex: number
}

export interface ArticleListResult {
  result: ArticleListItem[]
  total: number
  currentPage: number
  pageSize: number
}

export async function getArticleList(params: ArticleQuery): Promise<IResult<ArticleListResult>> {
  return fetch.post('/api/v1/blog/list', params)
}

export async function deleteArticle(id: number): Promise<IResult<any>> {
  return fetch.post('/api/v1/blog/delete', { id })
}

export async function createArticle(data: Partial<ArticleListItem>): Promise<IResult<any>> {
  return fetch.post('/api/v1/blog/create', data)
}

export async function updateArticle(data: Partial<ArticleListItem> & { id: number }): Promise<IResult<any>> {
  return fetch.post('/api/v1/blog/update', data)
}

export async function getArticleDetail(id: number): Promise<IResult<ArticleListItem>> {
  // :todo 获取文章详情 API
  return fetch.post('/api/v1/blog/detail', { id })
}
