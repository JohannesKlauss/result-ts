import { OkImpl } from './Result/OkImpl'
import { ErrImpl } from './Result/ErrImpl'

export type Result<T, E> = OkImpl<T> | ErrImpl<E>
export type AsyncResult<T, E> = Promise<Result<T, E>>
