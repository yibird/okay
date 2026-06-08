import { bench, run } from 'mitata'
import { asyncTo } from '../packages/core/src/async/asyncTo'
import { deferred } from '../packages/core/src/async/deferred'
import { parallel } from '../packages/core/src/async/parallel'
import { settleObject } from '../packages/core/src/async/settleObject'
import { raceObject } from '../packages/core/src/async/raceObject'
import { singleFlight } from '../packages/core/src/async/singleFlight'
import { batchSync } from '../packages/core/src/async/batchSync'
import { timeSlice } from '../packages/core/src/async/timeSlice'
import { diffArray } from '../packages/core/src/coll/array/diffArray'
import { fastIndexedMap } from '../packages/core/src/coll/array/fastIndexedMap'
import { fastStableSort } from '../packages/core/src/coll/array/fastStableSort'
import { diffTree } from '../packages/core/src/coll/tree/diffTree'
import { depth } from '../packages/core/src/coll/tree/depth'
import { leaves } from '../packages/core/src/coll/tree/leaves'
import { mapTree } from '../packages/core/src/coll/tree/mapTree'
import { treeToList } from '../packages/core/src/coll/tree/treeToList'
import { treeToSet } from '../packages/core/src/coll/tree/treeToSet'
import { businessDays } from '../packages/core/src/date/common/businessDays'
import { relativeTime } from '../packages/core/src/date/common/relativeTime'
import { isBusinessDay } from '../packages/core/src/date/common/isBusinessDay'
import { isSameDay } from '../packages/core/src/date/common/isSameDay'
import { formatBytes } from '../packages/core/src/file/formatBytes'
import { fileExt } from '../packages/core/src/file/fileExt'
import { matchMime } from '../packages/core/src/file/matchMime'
import { fileParts } from '../packages/core/src/file/fileParts'
import { checkFile } from '../packages/core/src/file/checkFile'
import { isArray } from '../packages/core/src/is/isArray'
import { isEmpty } from '../packages/core/src/is/isEmpty'
import { isNumber } from '../packages/core/src/is/isNumber'
import { isObject } from '../packages/core/src/is/isObject'
import { rawType } from '../packages/core/src/is/rawType'
import { createNumberFormatter } from '../packages/core/src/number/createNumberFormatter'
import { formatCompactNumber } from '../packages/core/src/number/formatCompactNumber'
import { formatCurrency } from '../packages/core/src/number/formatCurrency'
import { formatNumber } from '../packages/core/src/number/formatNumber'
import { formatPercent } from '../packages/core/src/number/formatPercent'
import {
  mask,
  maskBankCard,
  maskEmail,
  maskIdCard,
  maskName,
  maskPhone,
} from '../packages/core/src/string/index'

interface TreeNode {
  id: number
  children?: TreeNode[]
}

const asyncTasks = Array.from({ length: 100 }, (_, index) => () => Promise.resolve(index))
const indexedRows = Array.from({ length: 10_000 }, (_, index) => ({
  groupId: `group-${index % 100}`,
  id: index,
  priority: index % 3,
  value: index,
}))
const changedRows = indexedRows.slice()
const lastRowIndex = changedRows.length - 1
changedRows[100] = { ...changedRows[100], value: -1 }
changedRows[0] = indexedRows[lastRowIndex]
changedRows[lastRowIndex] = indexedRows[0]

const createTree = (levels: number, width: number): TreeNode[] => {
  let id = 0
  const createLevel = (level: number): TreeNode[] =>
    Array.from({ length: width }, () => {
      const node: TreeNode = { id: id++ }
      if (level < levels) {
        node.children = createLevel(level + 1)
      }
      return node
    })

  return createLevel(1)
}

const tree = createTree(5, 5)
const changedTree = mapTree(tree, (node) => ({ id: node.id }))
changedTree[0]?.children?.push({ id: 99_999 })
const values = [
  null,
  undefined,
  0,
  1,
  '',
  'okay',
  [],
  [1, 2, 3],
  {},
  { a: 1 },
  new Map(),
  new Set([1]),
]
const fileNames = [
  'avatar.PNG',
  '/assets/archive.tar.gz?download=1#top',
  'README',
  '.env',
  'C:\\temp\\report.PDF',
]
const numberValues = [0, 1, 12.34, 1234.567, -98765.4321, 1_000_000]
const dateValues = ['2024-01-01', '2024-02-29', '2024-06-15T12:00:00', '2024-12-31']
const sensitiveValues = {
  bankCard: '6222 8888 8888 8888',
  email: 'alice@example.com',
  idCard: '11010519491231002X',
  name: '\u5F20\u4E09',
  phone: '138-0013-8000',
  token: 'okay-access-token-2026',
}
const longSensitiveText =
  'okay-access-token-2026.'.repeat(16) + '\u{1F600}' + 'tail-sensitive-fragment'
const formattedPhones = Array.from(
  { length: 1000 },
  (_, index) =>
    `138-${String(index).padStart(4, '0')}-${String(8000 + (index % 1000)).padStart(4, '0')}`,
)
const reusableCurrencyFormatter = createNumberFormatter({
  currency: 'USD',
  locale: 'en-US',
  style: 'currency',
})

bench('async/asyncTo resolved promise', async () => {
  await asyncTo(Promise.resolve(1))
})

bench('async/parallel with concurrency 8', async () => {
  await parallel(asyncTasks, 8)
})

bench('async/singleFlight shared call', async () => {
  const request = singleFlight(() => Promise.resolve(1))
  await Promise.all([request(), request(), request()])
})

bench('async/deferred resolve', async () => {
  const task = deferred<number>()
  task.resolve(1)
  await task.promise
})

bench('async/settleObject', async () => {
  await settleObject({
    a: Promise.resolve(1),
    b: Promise.resolve('okay'),
    c: Promise.resolve(true),
  })
})

bench('async/raceObject', async () => {
  await raceObject({
    a: Promise.resolve(1),
    b: Promise.resolve('okay'),
    c: Promise.resolve(true),
  })
})

bench('async/batchSync microtask batch', async () => {
  let count = 0
  const sync = batchSync<{ id: number }>(
    (items) => {
      count += items.length
    },
    {
      key: (item) => item.id,
    },
  )

  for (let index = 0; index < 100; index++) {
    sync({ id: index % 10 })
  }

  await Promise.resolve()
  count = 0
})

bench('async/timeSlice small generator', async () => {
  await timeSlice(function* () {
    let count = 0
    for (let index = 0; index < 100; index++) {
      count += index
      yield
    }

    return count
  }, 4)
})

bench('file/name helpers', () => {
  for (const fileName of fileNames) {
    fileExt(fileName)
    fileParts(fileName)
  }
})

bench('file/formatBytes', () => {
  formatBytes(512)
  formatBytes(1536)
  formatBytes(1_500_000, { base: 1000 })
})

bench('file/mime and validation helpers', () => {
  matchMime('image/png', ['image/*', 'application/pdf'])
  checkFile(
    {
      name: 'avatar.png',
      size: 1024,
      type: 'image/png',
    },
    {
      maxSize: 2048,
      extensions: ['png', 'jpg'],
      mimeTypes: 'image/*',
    },
  )
})

bench('number/formatNumber cached Intl', () => {
  for (const value of numberValues) {
    formatNumber(value, {
      locale: 'en-US',
      maximumFractionDigits: 2,
    })
  }
})

bench('number/formatCurrency cached Intl', () => {
  for (const value of numberValues) {
    formatCurrency(value, 'USD', {
      locale: 'en-US',
    })
  }
})

bench('number/formatPercent ratio', () => {
  for (const value of numberValues) {
    formatPercent(value / 100, {
      locale: 'en-US',
      maximumFractionDigits: 2,
    })
  }
})

bench('number/formatCompactNumber', () => {
  for (const value of numberValues) {
    formatCompactNumber(value, {
      locale: 'en-US',
    })
  }
})

bench('number/createNumberFormatter hot path', () => {
  for (const value of numberValues) {
    reusableCurrencyFormatter(value)
  }
})

bench('list/fastIndexedMap build and lookups', () => {
  const indexed = fastIndexedMap(indexedRows, 'id')

  indexed.get(500)
  indexed.getGroup('group-20')
  indexed.update(500, { value: 501 })
})

bench('list/fastStableSort low-cardinality key', () => {
  fastStableSort(indexedRows, (row) => row.priority, {
    maxKey: 2,
  })
})

bench('array/diffArray', () => {
  diffArray(indexedRows, changedRows)
})

bench('string/mask helpers', () => {
  mask(sensitiveValues.token, { keepStart: 4, keepEnd: 4 })
  maskEmail(sensitiveValues.email)
  maskPhone(sensitiveValues.phone)
  maskIdCard(sensitiveValues.idCard)
  maskBankCard(sensitiveValues.bankCard)
  maskName(sensitiveValues.name)
})

bench('string/mask long unicode text', () => {
  mask(longSensitiveText, {
    keepEnd: 8,
    keepStart: 8,
  })
})

bench('string/maskPhone preserve format batch', () => {
  for (const phone of formattedPhones) {
    maskPhone(phone)
  }
})

bench('date/relativeTime', () => {
  for (const value of dateValues) {
    relativeTime(value, {
      baseDate: '2024-06-01T12:00:00',
      locale: 'en-US',
    })
  }
})

bench('date/isSameDay and isBusinessDay', () => {
  for (const value of dateValues) {
    isSameDay(value, '2024-06-15T18:00:00')
    isBusinessDay(value)
  }
})

bench('date/businessDays large range', () => {
  businessDays('2024-01-01', '2026-12-31', {
    holidays: ['2024-01-01', '2024-12-25', '2025-01-01', '2025-12-25', '2026-01-01'],
  })
})

bench('tree/depth', () => {
  depth(tree)
})

bench('tree/leaves', () => {
  leaves(tree)
})

bench('tree/treeToList', () => {
  treeToList(tree)
})

bench('tree/treeToSet', () => {
  treeToSet(tree)
})

bench('tree/mapTree', () => {
  mapTree(tree, (node) => ({ id: node.id }))
})

bench('tree/diffTree', () => {
  diffTree(tree, changedTree)
})

bench('is/rawType over mixed values', () => {
  for (const value of values) {
    rawType(value)
  }
})

bench('is/type guards over mixed values', () => {
  for (const value of values) {
    isArray(value)
    isNumber(value)
    isObject(value)
  }
})

bench('is/isEmpty over mixed values', () => {
  for (const value of values) {
    isEmpty(value)
  }
})

await run({
  colors: true,
  format: 'mitata',
})
