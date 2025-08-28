export function arrayToObject<T>(
  arr: T[],
  keyMapper: (item: T) => string | number | symbol,
  valMapper: (item: T) => any,
) {
  return arr.reduce((acc, item) => {
    ;(acc as Record<string | number | symbol, any>)[keyMapper(item)] =
      valMapper(item)
    return acc
  }, {})
}
