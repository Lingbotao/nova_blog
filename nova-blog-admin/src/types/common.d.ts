export interface IResult<T> {
  data: T,
  code: number,
  error: string | null,
  message?: string
}