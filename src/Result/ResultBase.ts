import { OkImpl } from './OkImpl'
import { ErrImpl } from './ErrImpl'

export type Result<T, E> = OkImpl<T> | ErrImpl<E>
export type AsyncResult<T, E> = Promise<Result<T, E>>

export type OrResolver<T, E> =
  | Result<T, E>
  | (() => Result<T, E>)

export type FlatMapResolver<T, U, F> = (value: T) => Result<U, F>

export type MapResolver<T, U> = (value: T) => Promise<U>

export type MapErrResolver<E, F> = (err: E) => Promise<F>

export type MapOrResolver<T, U> = (value: T) => Promise<U>

export abstract class ResultBase<T, E> {
  abstract readonly kind: 'Ok' | 'Err'

  abstract readonly ok: boolean

  abstract readonly err: boolean

  abstract isOk(): this is OkImpl<T>

  abstract isErr(): this is ErrImpl<E>

  abstract unwrap(): Promise<T>

  abstract unwrapErr(): Promise<E>

  abstract unwrapOr(defaultValue: T): Promise<T>

  abstract map<U>(fn: MapResolver<T, U>): Result<U, E>

  abstract mapErr<F>(fn: MapErrResolver<E, F>): Result<T, F>

  abstract mapOr<U>(fn: MapOrResolver<T, U>, defaultValue: U): Result<U, E>

  abstract or(alternative: OrResolver<T, E>): Result<T, E>

  abstract flatMap<U, F>(fn: FlatMapResolver<T, U, F>): Result<U, F>
}
