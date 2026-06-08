export const assertValidYearMonth = (year: number, month: number): void => {
  if (!Number.isInteger(year)) {
    throw new RangeError('year must be an integer')
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('month must be between 1 and 12')
  }
}
