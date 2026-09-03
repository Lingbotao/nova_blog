import fetch from "@/utils/server";
import type { IAuthToken } from "@/types/auth";
import type { IResult } from '@/types/common'

export async function login(userInfo: any):Promise<IResult<IAuthToken>> {
  return fetch.post('/api/v1/login', userInfo)
}

export async function getPubKey():Promise<IResult<{ pub_key: string }>> {
  return fetch.get('/api/v1/getPubKey')
}