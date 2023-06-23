import { AsyncResult, Result } from '../types'
import { OkImpl } from './OkImpl'
import { ErrImpl } from './ErrImpl'

export type OrResolver<T, E> = Result<T, E> | (() => Result<T, E>)
export type AsyncOrResolver<T, E> =
  | AsyncResult<T, E>
  | (() => AsyncResult<T, E>)

export type AndThenResolver<T, U, E> = (value: T) => Result<U, E>
export type AsyncAndThenResolver<T, U, E> = (value: T) => AsyncResult<U, E>

export type MapResolver<T, U> = (value: T) => U
export type AsyncMapResolver<T, U> = (value: T) => Promise<U>

export type MapOrResolver<T, U> = (value: T) => U
export type AsyncMapOrResolver<T, U> = (value: T) => Promise<U>

export abstract class ResultBase<T, E> {
  abstract readonly kind: 'Ok' | 'Err'

  abstract readonly ok: boolean

  abstract readonly err: boolean

  abstract isOk(): this is OkImpl<T>

  abstract isErr(): this is ErrImpl<E>

  abstract unwrap(): T | E

  abstract unwrapOr(defaultValue: T): T

  abstract map<U>(fn: MapResolver<T, U>): Result<U, E>

  abstract mapAsync<U>(fn: AsyncMapResolver<T, U>): Promise<Result<U, E>>

  abstract mapOr<U>(fn: MapOrResolver<T, U>, defaultValue: U): Result<U, E>

  abstract mapOrAsync<U>(
    fn: AsyncMapOrResolver<T, U>,
    defaultValue: U,
  ): AsyncResult<U, E>

  abstract or(alternative: OrResolver<T, E>): Result<T, E>

  abstract orAsync(alternative: AsyncOrResolver<T, E>): AsyncResult<T, E>

  abstract andThen<U>(fn: AndThenResolver<T, U, E>): Result<U, E>

  abstract andThenAsync<U>(fn: AsyncAndThenResolver<T, U, E>): AsyncResult<U, E>
}
