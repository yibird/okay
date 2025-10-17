# okay
okay 是一个基于Typescript工具函数库,提供了一些常用的函数,okay包含如下模块:
- @okay/core: 提供了一些常用的函数,包含is、日期、数据结构转换(list转tree等等)、异步等常用函数。
- @okay/vue: 提供了一些vue相关的函数和组合式Api。
- @okay/react: 提供了一些react相关的函数和hook。


## 安装
- 安装core模块:
```bash
npm install @okay/core
```
- 安装vue模块:
```bash
npm install @okay/vue
```
- 安装react模块:
```bash
npm install @okay/react
```


## @okay/core
@okay/core 提供了一些常用的函数,包含is、日期、数据结构转换(list转tree等等)、异步等常用函数。

### is相关函数
- `rawType(target: unknown)`: 获取目标元素原始类型。库中的大多数is函数都是基于rawType。
- `isObject(target: unknown)`: 判断目标元素是否为对象。
- `isArray(target: unknown)`: 判断目标元素是否为数组。
- `isString(target: unknown)`: 判断目标元素是否为字符串。
- `isNumber(target: unknown)`: 判断目标元素是否为数字。
- `isBool(target: unknown)`: 判断目标元素是否为布尔值。
- `isFunction(target: unknown)`: 判断目标元素是否为函数。
- `isPromise(target: unknown)`: 判断目标元素是否为Promise。
- `isSymbol(target: unknown)`: 判断目标元素是否为Symbol。
- `isBigint(target: unknown)`: 判断目标元素是否为Bigint。
- `isObject(target: unknown)`: 判断目标元素是否为对象。
- `isArray(target: unknown)`: 判断目标元素是否为数组。
- `isDate(target: unknown)`: 判断目标元素是否为日期。
- `isRegExp(target: unknown)`: 判断目标元素是否为正则表达式。
- `isMap(target: unknown)`: 判断目标元素是否为Map。
- `isSet(target: unknown)`: 判断目标元素是否为Set。
- `isWeakMap(target: unknown)`: 判断目标元素是否为WeakMap。
- `isWeakSet(target: unknown)`: 判断目标元素是否为WeakSet。
- `isNaN(target: unknown)`: 判断目标元素是否为NaN。
- `isFinite(target: unknown)`: 判断目标元素是否为有限数。
- `isNaNOrFinite(target: unknown)`: 判断目标元素是否为NaN或有限数。
- `isNull(target: unknown)`: 判断目标元素是否为null。
- `isNotNull(target: unknown)`: 判断目标元素是否不为null。
- `isEmpty(target: unknown)`: 判断目标元素是否为空。
- `isDef(target: unknown)`:判断目标元素是否定义(不为undefined)。
- `isUnDef(target: unknown)`:判断目标元素是否未定义(为undefined)。
- `isNil(target: unknown)`: 判断目标元素是否为null且undefined,函数内容跟isNullAndUndef相同。
- `isNullAndUndef(target: unknown)`: 判断目标元素是否为null且undefined。
- `isNotNullAndUndef(target: unknown)`: 判断目标元素是否不为null且不为undefined。
- `isNullOrUndef(target: unknown)`: 判断目标元素是否为null或undefined。
- `isWindow(target: unknown)`: 判断目标元素是否为window对象。
- `isElement(target: unknown)`: 判断目标元素是否为DOM元素。
- `isNaN(target: unknown)`: 判断目标元素是否为NaN。
- `isFinite(target: unknown)`: 判断目标元素是否为有限数。
- `isNaNOrFinite(target: unknown)`: 判断目标元素是否为NaN或有限数。

### 异步相关函数

- `asyncTo<T, E = Error>(promise: Promise<T>,callback?: () => void)`: Promise<[E, null] | [null, T]>: 异步函数转换为Promise<[E, null] | [null, T]>,Promise返回数组中第一项为错误信息,第二项为结果,异步函数执行成功时,返回[null, T],异步函数执行失败时,返回[E, null]。
- `abortablePromise<T>(promise: Promise<T>)`:取消Promise的函数。返回一个可取消的Promise和取消函数。
- `parallelTasks<T>(tasks: Array<() => Promise<T>>,concurrency: number): Promise<T[]>`:并行执行任务(tasks),并限制并发数(concurrency)。泛型T表示Promise的返回值类型。
- `promiseWithTimeout<T>(promise: Promise<T>,timeoutMs: number,timeoutError: Error = new Error('Promise timeout')): Promise<T>`:为 Promise 添加超时控制。当 Promise 执行时间超过指定的超时时间（timeoutMs,单位毫秒）时,会抛出指定的超时错误(timeoutError)。
- `retryPromise<T>(func: () => Promise<T>,maxRetryCount = 3,delay = 100,shouldRetry: (error: any) => boolean = () => true): Promise<T>`:重试Promise。当 Promise 执行失败时,会根据指定的重试次数(maxRetryCount)和重试间隔时间(delay)进行重试,直到 Promise 执行成功或重试次数用完。shouldRetry表示重试条件函数,默认所有错误都重试。
- `singleFlight<T extends (...args: any[]) => Promise<any>>(func: T): T`:确保同一时间只有一个相同请求在执行,避免重复调用(竞态条件保护)。类似于go中的singleFlight。
- `withAbortSignal<T>(promise: Promise<T>,signal?: AbortSignal): Promise<T>`:具有AbortSignal的可取消Promise。

### 集合相关函数

目前集合函数包含list、tree、queue等基础函数。

#### list函数
- `arrayToObject<T>(arr: T[],keyMapper: (item: T) => string | number | symbol,valMapper: (item: T) => any)`:将数组转换为对象,keyMapper函数用于映射数组元素为对象的key,valMapper函数用于映射数组元素为对象的value。
- `average(arr: number[])`:计算数组平均值。
- `averageBy<T>(arr: T[], func: (item: T) => number)`:计算数组平均值,func函数用于映射数组元素为数值。
- `listToTree<T extends TreeNode>(list: T[],config: TreeConfig<T> = {})`:将数组转换为树结构。

- `sumBy<T>(arr: T[], func: (item: T) => number)`:计算数组总和,func函数用于映射数组元素为数值。
- `maxBy<T>(arr: T[], func: (item: T) => number)`:计算数组最大值,func函数用于映射数组元素为数值。
- `minBy<T>(arr: T[], func: (item: T) => number)`:计算数组最小值,func函数用于映射数组元素为数值。
- `countBy<T>(arr: T[], func: (item: T) => number)`:计算数组元素出现次数,func函数用于映射数组元素为数值。
- `groupBy<T>(arr: T[], func: (item: T) => number)`:将数组元素分组,func函数用于映射数组元素为数值。
- `partitionBy<T>(arr: T[], func: (item: T) => number)`:将数组元素分区,func函数用于映射数组元素为数值。
 
#### tree相关函数
- `eachPostOrder<T extends Record<string, any>>(tree: T[],visitor: (node: T, level: number, parent: T | null) => void,childrenKey = 'children')`:后序遍历树结构,visitor函数用于处理每个节点,childrenKey表示子节点键名,默认值为'children'。
- `eachPreOrder<T extends Record<string, any>>(tree: T[],visitor: (node: T, level: number, parent: T | null) => void,childrenKey = 'children')`:前序遍历树结构,visitor函数用于处理每个节点,childrenKey表示子节点键名,默认值为'children'。
- `findNodeById<T extends Record<string, any>>(tree: T[],targetId: string | number,config: TreeConfig<T> = {}): T | null`:根据节点ID查找树结构中的节点(如果找不到就返回null),config参数用于配置查找行为,默认值为空对象。
- `findParentNode<T extends Record<string, any>>(tree: T[],targetId: string | number,config: TreeConfig<T> = {}): T | null`:根据节点ID查找树结构中的父节点(如果找不到就返回null),config参数用于配置查找行为,默认值为空对象。
- `getDepth<T extends Record<string, any>>(tree: T[],childrenKey = 'children')`:获取树的深度,childrenKey表示子节点键名,默认值为'children'。
- `getHeight<T extends Record<string, any>>(tree: T[],childrenKey = 'children')`:获取树的高度,childrenKey表示子节点键名,默认值为'children'。
- `getFirstBranch<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`:获取树的第一分支,childrenKey表示子节点键名,默认值为'children'。
- `getLastBranch<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`:获取树的最后分支,childrenKey表示子节点键名,默认值为'children'。
- `getLeafNodes<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`:获取树的叶子节点,childrenKey表示子节点键名,默认值为'children'。
- `getParentNodes<T extends Record<string, any>>(tree: T[],targetId: string | number,config: TreeConfig<T> = {})`:获取树的父节点,childrenKey表示子节点键名,默认值为'children'。
- `treeMap<T extends Record<string, any>,U extends Record<string, any>,K extends keyof T = 'children',>(tree: T[],mapperFunc: (item: T) => U |null,config: TreeMapConfig<T, K> = {},): U[]`:
  对树结构进行映射转换,返回转换后的树结构。
  - tree: 源树数组
  - mapperFunc: 映射函数,接收 T,返回 U 或 null（null 表示过滤当前节点）
  - config: 可选,childrenKey 指定子节点字段名（默认为 'children'）
  - 返回值: 转换映射后的树结构
- `treeToList<T extends Record<string, any>>(tree: T[],childrenKey: string = 'children'): T[]`:tree结构根据children属性扁平化为list,泛型T为节点类型。
- `treeToSet<T extends Record<string, any>>(tree: T[],childrenKey = 'children'): Set<T>`:将树结构转换为Set集合,泛型T为节点类型。

#### queue相关函数
- AsyncQueue:简单异步队列实现。

## 日期相关函数

### 格式化相关函数
- `format(input?: dayjs.ConfigType,format?: string)`:格式化日期,input 为日期对象或日期字符串,format 为格式化字符串,默认值为'YYYY-MM-DD'。
- `formatDate(input?: dayjs.ConfigType)`:格式化日期,input 为日期对象或日期字符串。
- `formatTime(input?: dayjs.ConfigType)`:格式化时间,input 为日期对象或日期字符串。
- `formatDateTime(input?: dayjs.ConfigType)`:格式化日期时间,input 为日期对象或日期字符串。
- `formatRange(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType },format?: string)`:格式化日期范围(返回一个包含startDate和endDate的对象),inputs 为日期对象或日期字符串,format 为格式化字符串,默认值为`YYYY-MM-DD HH:mm:ss`。
- `formatRangeWithDateTime(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType })`:格式化日期时间范围(返回一个包含startDate和endDate的对象),inputs 为日期对象或日期字符串(格式为`YYYY-MM-DD HH:mm:ss`)。
- `formatRangeWithDate(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType })`:格式化日期范围(返回一个包含startDate和endDate的对象),inputs 为日期对象或日期字符串(格式为`YYYY-MM-DD`)。
- `formatRangeWithTime(inputs?: dayjs.ConfigType | [dayjs.ConfigType, dayjs.ConfigType] | { start: dayjs.ConfigType; end: dayjs.ConfigType },format?: string)`:格式化时间范围(返回一个包含startDate和endDate的对象),inputs 为日期对象或日期字符串(格式为`HH:mm:ss`)。


### day相关函数
- `getCurrentDay()`:获取当前日期,返回当前日期的 Dayjs 对象。
- `getDayName(day?: dayjs.ConfigType)`:获取星期几的名称,day 为 0 表示星期日,1 表示星期一,以此类推。
- `getDayZhName(day?: dayjs.ConfigType)`:获取星期几的中文名称,day 为 0 表示星期日,1 表示星期一,以此类推。

### week相关函数
- `getFirstDayOfWeek(date?: dayjs.ConfigType,options: { weekStartDay?: number } = {}): Dayjs`:获取当前周的第一天。
- `getLastDayOfWeek(date?: dayjs.ConfigType,options: { weekStartDay?: number } = {}): Dayjs`:获取当前周的最后一天。
- `getCurrentWeekRange(date?: date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1 } = {}): { firstDay: Dayjs; lastDay: Dayjs }`:获取当前星期范围。
- `getDayIndexInWeek(date?: dayjs.ConfigType)`:获取指定日期是本周第几天。
- `getDayOfWeek(date?: dayjs.ConfigType,locale: 'en' | 'zh' = 'zh',style: 'full' | 'short' = 'full')`:获取指定日期的星期。
- `getNextWeek(date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1 } = {}): [Dayjs, Dayjs]`:获取下一周的日期范围。
- `getPrevWeek(date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1 } = {}): [Dayjs, Dayjs]`:获取上一周的日期范围。
- `getWeekDays(date?: dayjs.ConfigType)`:获取指定日期所在周的所有日期(周一到周日)。
- `getWeekOfYear(date?: dayjs.ConfigType)`:获取日期所在年份的周数。
- `getWeek(input?: dayjs.ConfigType)`:返回 ISO 周序号（1..53）。、
- `getWeekdaysInWeek(date?: dayjs.ConfigType,options: { weekStartDay?: 0 | 1; weekdays?: number[] } = {})`:获取一周中的工作日。
- `isDateInWeek(dateToCheck: dayjs.ConfigType,referenceDate?: dayjs.ConfigType)`:检查给定日期是否在指定日期的同一周内。
- `isWeekend(date?: dayjs.ConfigType)`:检查日期是否为周末。


### month相关函数
- `getAllDaysInMonth(year: number, month: number)`:获取指定月份的所有日期。
- `getCurrentMonth()`:获取当前月份。
- `getDaysInMonth(year: number, month: number)`:获取指定月份的天数。
- `getFirstDayOfMonth(year: number, month: number)`:获取指定月份的第一天。
- `getLastDayOfMonth(year: number, month: number)`:获取指定月份的最后一天。
- `getMonthDiff(date1: dayjs.Dayjs, date2: dayjs.Dayjs)`:获取两个日期之间的月份差。
- `getMonthName(month: number, locale = 'en')`:获取月份名称。
- `getWeekdaysInMonth(year: number, month: number)`:获取某月的所有工作日(周一至周五)。
- `getWeeksInMonth(year: number, month: number, startOfWeek = 0)`:获取月份的周数。
- `isDateInMonth(date: dayjs.ConfigType, month: number)`:检查日期是否在指定的月份内。

### quarter相关函数
- `getCurrentQuarter()`:获取当前季度,返回一个包含起始季度的数组。
...

### year相关函数
...
