export const propertyIsEnumerable = Object.prototype.propertyIsEnumerable

export const isObjectLike = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === 'object' && value !== null

export const ownEnumerableKeys = (value: Record<PropertyKey, unknown>) =>
  Reflect.ownKeys(value).filter((key) => propertyIsEnumerable.call(value, key))

export const countOwnEnumerableKeys = (
  value: Record<PropertyKey, unknown>,
  ignoredKey?: PropertyKey,
) => {
  let count = 0
  for (const key of Reflect.ownKeys(value)) {
    if (key !== ignoredKey && propertyIsEnumerable.call(value, key)) {
      count++
    }
  }
  return count
}

interface DeepEqualState {
  leftToRight: WeakMap<object, object>
  rightToLeft: WeakMap<object, object>
}

const markCompared = (left: object, right: object, state: DeepEqualState): boolean | undefined => {
  const mappedRight = state.leftToRight.get(left)
  const mappedLeft = state.rightToLeft.get(right)

  if (mappedRight !== undefined || mappedLeft !== undefined) {
    return mappedRight === right && mappedLeft === left
  }

  state.leftToRight.set(left, right)
  state.rightToLeft.set(right, left)

  return undefined
}

const deepEqualInternal = (left: unknown, right: unknown, state: DeepEqualState): boolean => {
  if (Object.is(left, right)) return true
  if (!isObjectLike(left) || !isObjectLike(right)) return false

  const compared = markCompared(left, right, state)
  if (compared !== undefined) return compared

  if (left instanceof Date || right instanceof Date) {
    return (
      left instanceof Date && right instanceof Date && Object.is(left.getTime(), right.getTime())
    )
  }

  if (left instanceof RegExp || right instanceof RegExp) {
    return (
      left instanceof RegExp &&
      right instanceof RegExp &&
      left.source === right.source &&
      left.flags === right.flags
    )
  }

  if (left instanceof Map || right instanceof Map) {
    if (!(left instanceof Map) || !(right instanceof Map) || left.size !== right.size) return false
    // Note: Map keys are compared by reference (SameValueZero). Two distinct object keys with
    // identical content are treated as different keys. This matches native Map.has() semantics.
    for (const [key, val] of left) {
      if (!right.has(key) || !deepEqualInternal(val, right.get(key), state)) return false
    }
    return true
  }

  if (left instanceof Set || right instanceof Set) {
    if (!(left instanceof Set) || !(right instanceof Set) || left.size !== right.size) return false
    for (const val of left) {
      if (!right.has(val)) return false
    }
    return true
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false
    }
    for (let index = 0; index < left.length; index++) {
      if (!deepEqualInternal(left[index], right[index], state)) return false
    }
    return true
  }

  const leftKeys = ownEnumerableKeys(left)
  if (leftKeys.length !== countOwnEnumerableKeys(right)) return false
  for (const key of leftKeys) {
    if (
      !propertyIsEnumerable.call(right, key) ||
      !deepEqualInternal(left[key], right[key], state)
    ) {
      return false
    }
  }
  return true
}

export const deepEqual = (left: unknown, right: unknown): boolean =>
  deepEqualInternal(left, right, {
    leftToRight: new WeakMap(),
    rightToLeft: new WeakMap(),
  })
