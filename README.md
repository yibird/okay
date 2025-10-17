# okay

Okay is a Typescript tool library that provides some commonly used functions. Okay includes the following modules:

- @okay/core: Provides some commonly used functions, including is, date, data structure conversion (list to tree, etc.), asynchronous, and other commonly used functions.
- @okay/vue: Provides some vue related functions and composite APIs.
- @okay/react: Provides some React related functions and hooks.

<p align="center">English | <a href="README.zh-CN.md">中文</a></p>

## Installation

-Install the core module:

```bash
npm install @okay/core
```

-Install the Vue module:

```bash
npm install @okay/vue
```

-Install React module:

```bash
npm install @okay/react
```

## @okay/core

@Okay/Core provides some commonly used functions, including is, date, data structure conversion (list to tree, etc.), asynchronous, and other commonly used functions. ###Is related function

- `rawType (target: unknown): Get the primitive type of the target element. Most of the is functions in the library are based on rawType.`
- `isObject (target: unknown): Determine whether the target element is an object.`
- `isArray (target: unknown): Determine whether the target element is an array.`
- `isString (target: unknown): Determine whether the target element is a string.`
- `isNumber (target: unknown): Determine whether the target element is a number.`
- `isBool (target: unknown): Determine whether the target element is a Boolean value.`
- `isFunction (target: unknown): Determine whether the target element is a function.`
- `isPromise (target: unknown): Determine whether the target element is a Promise.`
- `isSymbol (target: unknown): Determine whether the target element is a Symbol.`
- `isBigint (target: unknown): Determine whether the target element is Bigint.`
- `isObject (target: unknown): Determine whether the target element is an object.`
- `isArray (target: unknown): Determine whether the target element is an array.`
- `isDate (target: unknown): Determine whether the target element is a date.`
- `isRegExp (target: unknown): Determine whether the target element is a regular expression.`
- `isMap (target: unknown): Determine whether the target element is a Map.`
- `isSet (target: unknown): Determine whether the target element is a Set.`
- `isWeakMap (target: unknown): Determine whether the target element is a WeakMap.`
- `isWeakSet (target: unknown): Determine whether the target element is a WeakSet.`
- `isNaN (target: unknown): Determine whether the target element is NaN.`
- `isFinite (target: unknown): Determine whether the target element is a finite number.`
- `isNaNRFinite (target: unknown): Determine whether the target element is NaN or a finite number.`
- `isnull (target: unknown): Determine if the target element is null.`
- `isNotNull (target: unknown): Determine if the target element is not null.`
- `isEmpty (target: unknown): Determine if the target element is empty.`
- `isDef (target: unknown): Determine whether the target element is defined (not undefined).`
- `isUnDef (target: unknown): Determine if the target element is undefined.`
- `isNil (target: unknown): Determine whether the target element is null and undefined. The function content is the same as isNullAndUndef.`
- `isNullAndUndef (target: unknown): Determine whether the target element is null and undefined.`
- `isNotNullAndUndef (target: unknown): Determine whether the target element is not null or undefined.`
- `isNullOrUndef (target: unknown): Determine whether the target element is null or undefined.`
- `isWindow (target: unknown): Determine whether the target element is a window object.`
- `isElement (target: unknown): Determine whether the target element is a DOM element.`
- `isNaN (target: unknown): Determine whether the target element is NaN.`
- `isFinite (target: unknown): Determine whether the target element is a finite number.`
- `isNaNRFinite (target: unknown): Determine whether the target element is NaN or a finite number.`

### Asynchronous correlation function

- `asyncTo<T, E = Error>(promise: Promise<T>,callback?: () => void)`: Promise<[E, null] | [null, T]>: Asynchronous functions are converted to Promise<[E, null] | [null, T]>. Promise returns the first item in the array as an error message and the second item as the result. When the asynchronous function executes successfully, it returns [null, T], and when it fails, it returns [E, null]. -AbortablePromise<T>(promise: Promise<T>): The function to cancel a promise. Return a revocable promise and cancel function.
- `parallelTasks<T>(tasks: Array<() => Promise<T>>,concurrency: number): Promise<T[]>`: Execute tasks in parallel and limit concurrency. Generic T represents the return value type of Promise.
- `promiseWithTimeout<T>(promise: Promise<T>,timeoutMs: number,timeoutError: Error = new Error('Promise timeout')): Promise<T>`: Add timeout control for Promise. When the execution time of a Promise exceeds the specified timeout (timeoutMs, in milliseconds), a specified timeout error (timeoutError) will be thrown.
- `retryPromise<T>(func: () => Promise<T>,maxRetryCount = 3,delay = 100,shouldRetry: (error: any) => boolean = () => true): Promise<T>`: Try the Promise again. When a Promise fails to execute, it will be retried based on the specified retry count (maxRetryCount) and retry interval (delay) until the Promise is successfully executed or the retry count is exhausted. Should retry "represents the retry condition function, which defaults to retry all errors.
- `singleFlight<T extends (...args: any[]) => Promise<any>>(func: T): T`: Ensure that only one identical request is being executed at a time to avoid duplicate calls (race condition protection). Similar to singleFlight in Go. -` withAbortSignal<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T>`: A revocable promise with an AbortSignal.

### Set related functions

At present, set functions include basic functions such as list, tree, queue, etc.

#### List function

- `arrayToObject<T>(arr: T[],keyMapper: (item: T) => string | number | symbol,valMapper: (item: T) => any)`: Convert an array to an object, the keyMapper function is used to map array elements to the key of the object, and the valMapper function is used to map array elements to the value of the object.
- `average (arr: number []): number`: Calculate the average value of the array.
- `averageBy<T>(arr: T [], func: (item: T)=>number): number`: calculates the average value of an array, and the func function is used to map array elements to numerical values.
- `listToTree<T extends TreeNode>(list: T [], config: TreeConfig<T>={}) `: Convert the array into a tree structure.

#### Tree related functions

- `eachPostOrder<T extends Record<string, any>>(tree: T[],visitor: (node: T, level: number, parent: T | null) => void,childrenKey = 'children')`: Postorder traversal of the tree structure, the visitor function is used to process each node, childrenKey represents the child node key name, and the default value is' children '.
- `eachPreOrder<T extends Record<string, any>>(tree: T[],visitor: (node: T, level: number, parent: T | null) => void,childrenKey = 'children')`: Traverse the tree structure in sequence, the visitor function is used to process each node, childrenKey represents the key name of the child node, and the default value is' children '.
- `findNodeById<T extends Record<string, any>>(tree: T[],targetId: string | number,config: TreeConfig<T> = {}): T | null`: Search for nodes in the tree structure based on their node IDs (return null if not found). The config parameter is used to configure the search behavior and defaults to an empty object.
- `findParentNode<T extends Record<string, any>>(tree: T[],targetId: string | number,config: TreeConfig<T> = {}): T | null`: Search for the parent node in the tree structure based on the node ID (return null if not found), the config parameter is used to configure the search behavior, and the default value is an empty object.
- `getDepth<T extends Record<string, any>>(tree: T[],childrenKey = 'children')`: Get the depth of the tree, childrenKey represents the key name of the child node, and the default value is' children '.
- `getHeight<T extends Record<string, any>>(tree: T[],childrenKey = 'children')`: Get the height of the tree, childrenKey represents the child node key name, default value is' children '.
- `getFirstBranch<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`: Get the first branch of the tree, childrenKey represents the key name of the child node, and the default value is' children '.
- `getLastBranch<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`: Get the last branch of the tree, childrenKey represents the key name of the child node, and the default value is' children '.
- `getLeafNodes<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`: Get the leaf nodes of the tree, childrenKey represents the key name of the child node, and the default value is' children '.
- `getParentNodes<T extends Record<string, any>>(tree: T[],targetId: string | number,config: TreeConfig<T> = {})`: Retrieve the parent node of the tree, childrenKey represents the key name of the child node, and the default value is' children '.
- `treeMap<T extends Record<string, any>,U extends Record<string, any>,K extends keyof T = 'children',>(tree: T[],mapperFunc: (item: T) => U |null,config: TreeMapConfig<T, K> = {},): U[]`: Map and transform the tree structure, and return the transformed tree structure. - `tree`: source tree array - `mapperFunc`: a mapping function that receives T and returns U or null (null indicates filtering the current node) - `config`: Optional, childrenKey specifies the child node field name (default is `children`) - return value: Transform the mapped tree structure
- `treeToList<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`:tree The structure is flattened into a list based on the children attribute, and the generic T is a node type.
- `treeToSet<T extends Record<string, any>>(tree: T[],childrenKey = 'children'): Set<T>`: Convert the tree structure to a Set collection, with generic T being a node type.

#### Queue related functions

- AsyncQueue: A simple implementation of asynchronous queues.

## Date related functions

### Format related functions

- `format (input?: dayjs. Config Type, format?: string) `: Format date, input is a date object or date string, format is a format string, default value is`YYYY-MM-DD`.
- `formatDate (input?: dayjs. DefigType) `: Format the date, with the input being a date object or date string.
- `formatTime (input?: dayjs. DefigType) `: Format the time, with the input being a date object or date string.
- `formatFHIR (input?: dayjs. Config Type) `: Format the date and time, with the input being a date object or date string.
- `formatRange(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType },format?: string)`: Format date range (returns an object containing startDate and endDate), inputs are date objects or date strings, format is a formatted string, default value is`YYYY-MM-DD HH: mm: ss`.
- `formatRangeWithDateTime(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType })`: Format the date and time range (return an object containing startDate and endDate), with inputs being date objects or date strings (in the format of `YYYY-MM-DD HH: mm: ss`).
- `formatRangeWithDate(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType })`: Format the date range (return an object containing startDate and endDate), with inputs being date objects or date strings (in the format of `YYYY-MM-DD`).
- `formatRangeWithTime(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType },format?: string)`: Format time range (returns an object containing startDate and endDate), with inputs being date objects or date strings (formatted as`HH: mm: ss`).

### Day related functions

- `getCurrentDay()`: Get the current date and return the Dayjs object of the current date.
- `getDayName (day?: dayjs.ConfigType)`: Get the name of the day of the week, where day 0 represents Sunday, 1 represents Monday, and so on.
- `getDayZhName (day?: dayjs.ConfigType)`: Get the Chinese name of the day of the week, where day 0 represents Sunday, 1 represents Monday, and so on.

### Week related functions

- `getFirstDayOfWeek(date?: dayjs.ConfigType,options: { weekStartDay?: number } = {}): Dayjs`: Get the first day of the current week.
- `getLastDayOfWeek(date?: dayjs.ConfigType,options: { weekStartDay?: number } = {}): Dayjs`: Get the last day of the current week.
- `getCurrentWeekRange(date?: date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1 } = {}): { firstDay: Dayjs; lastDay: Dayjs }`: Get the current week range. -`getDayIndexInWeek (date?: dayjs.DefigType)`: Gets the specified date as the day of the week.
- `getDayOfWeek(date?: dayjs.ConfigType,locale: 'en' | 'zh' = 'zh',style: 'full' | 'short' = 'full')`: Retrieve the week of the specified date.
- `getNextWeek(date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1 } = {}): [Dayjs, Dayjs]`: Get the date range for the next week.
- `getPrevWeek(date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1 } = {}): [Dayjs, Dayjs]`: Get the date range of the previous week.
- `getWeekDays (date?: dayjs.ConfigType)`: Gets all dates (Monday to Sunday) of the week in which the specified date is located.
- `getWeekOfYear (date?: dayjs.DefigType)`: Gets the number of weeks in the year where the date is located.
- `getWeek (input?: dayjs.ConfigType)`: Returns the ISO week sequence number (1.. 53). 、
- `getWeekdaysInWeek(date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1; weekdays?: number[] } = {})`: Get the working days of the week.
- `isDateInWeek(dateToCheck: dayjs.ConfigType,referenceDate?: dayjs.ConfigType)`: Check if the given date falls within the same week as the specified date. -`IsWeekend (date?: dayjs.ConfigType)`: Check if the date is a weekend.

### Month related functions

- `getAllDaysInMonth(year: number, month: number)`: Gets all dates for the specified month.
- `getCurrentMonth()`: Get the current month.
- `getDaysInMonth (year: number, month: number)`: Gets the number of days in a specified month.
- `getFirstDayOfMonth (year: number, month: number)`: Gets the first day of the specified month.
- `getLastDayOfMonth (year: number, month: number)`: Gets the last day of the specified month.
- `getMonthDiff (date1: dayjs.ConfigType, date2: dayjs.ConfigType)`: Gets the month difference between two dates.
- `getMonthName (month: number, local='en')`: Get the name of the month.
- `getWeekdaysInMonth (year: number, month: number)`: Get all working days of a month (Monday to Friday).
- `getWeeksInMonth (year: number, month: number, startOfWeek=0)`: Gets the number of weeks in a month.
- `isDateInMonth (date: dayjs.ConfigType, month: number)`: Check if the date falls within the specified month.

### Quarter related functions

- `getCurrentQuarter()`: Get the current quarter and return an array containing the starting quarter. ...

### Year related functions

...
