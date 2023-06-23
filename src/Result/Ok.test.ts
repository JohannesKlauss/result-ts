import { describe, expect, it } from 'vitest'
import { Ok } from './OkImpl'

describe('Ok', () => {
  it('should instantiate Ok without new', () => {
    expect(() => new Ok(1)).not.toThrow()
  })

  it('should unwrap value',async () => {
    expect(await (new Ok(1).unwrap())).toBe(1)
  })

  it('should unwrapOr value', async () => {
    expect(await (new Ok(1).unwrapOr(2))).toBe(1)
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

  it('should map synchronously', async () => {
    expect(await (new Ok(1).map(async (value) => value + 1).unwrap())).toBe(2)
  })

  it.skip('should should return Err if result throws Error', async () => {
    expect(
      await (new Ok(1)
        .map(() => {
          throw new Error('Error')
        })
        .isErr()),
    ).toBe(true)
  })

  it('should map asynchronously', async () => {
    async function adder(value: number): Promise<number> {
      return value + 1
    }

    const result = await new Ok(1).map(adder)

    expect(await result.unwrap()).toBe(2)
  })

  it('should map asynchronously inline', async () => {
    const result = await new Ok(1).map(async (value) => value + 1)

    expect(await result.unwrap()).toBe(2)
  })

  it('should chain asynchronous methods', async function () {
    const result = new Ok(1)

    expect(
      await result
        .map(async (val) => val + 1)
        .map(async (val) => val + 1)
        .map(async (val) => val + 1)
        .unwrap(),
    ).toBe(4)
  })

  it('should chain methods ', async () => {
    async function multi(value: number): Promise<number> {
      return value * 2
    }

    const result = new Ok(1)

    const value = await result
      .map(async (val: number) => {
        const multiplier: number = await multi(val) // returns 2

        return multiplier * val
      })
      .map(async (val: number) => {
        const multiplier: number = await multi(val) // returns 4

        return multiplier * val
      })
      .unwrap()

    expect(value).toBe(8)
  })
})
