import { describe, expect, it } from 'vitest'
import { Ok } from './OkImpl'

describe('Ok', () => {
  it('should instantiate Ok without new', () => {
    expect(() => new Ok(1)).not.toThrow()
  })

  it('should unwrap value', () => {
    expect(new Ok(1).unwrap()).toBe(1)
  })

  it('should unwrapOr value', () => {
    expect(new Ok(1).unwrapOr(2)).toBe(1)
  })

  it('should return ok true', () => {
    expect(new Ok(1).ok).toBe(true)
  })

  it('should return err false', () => {
    expect(new Ok(1).err).toBe(false)
  })

  it('should return kind Ok', () => {
    expect(new Ok(1).kind).toBe('Ok')
  })

  it('should return isOk true', () => {
    expect(new Ok(1).isOk()).toBe(true)
  })

  it('should return isErr false', () => {
    expect(new Ok(1).isErr()).toBe(false)
  })

  it('should map synchronously', () => {
    expect(new Ok(1).map((value) => value + 1).unwrap()).toBe(2)
  })

  it('should should return Err if result throws Error', function () {
    expect(
      new Ok(1)
        .map(() => {
          throw new Error('Error')
        })
        .isErr(),
    ).toBe(true)
  })

  it('should map asynchronously', async () => {
    async function adder(value: number): Promise<number> {
      return value + 1
    }

    const result = await new Ok(1).mapAsync(adder)

    expect(result.unwrap()).toBe(2)
  })

  it('should map asynchronously inline', async () => {
    const result = await new Ok(1).mapAsync(async (value) => value + 1)

    expect(result.unwrap()).toBe(2)
  })

  it('should chain synchronous methods', async () => {
    const result = new Ok(1)

    expect(
      result
        .map((val) => val + 1)
        .map((val) => val + 1)
        .map((val) => val + 1)
        .unwrap(),
    ).toBe(4)
  })

  it('should chain asynchronous methods', async function () {
    const result = new Ok(1)

    expect(
      await result
        .mapAsync(async (val) => val + 1)
        .mapAsync(async (val) => (await val) + 1)
        .mapAsync(async (val) => (await val) + 1)
        .unwrap(),
    ).toBe(4)

    expect(
      await result
        .map(async (val) => val + 1)
        .map(async (val) => (await val) + 1)
        .map(async (val) => (await val) + 1)
        .unwrap(),
    ).toBe(4)
  })
})
