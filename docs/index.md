---
layout: home

hero:
  name: Okay
  text: 类型安全的工具方法手册
  tagline: 面向 TypeScript、Vue 和 React 的轻量工具库。每个 API 都保持小而可组合，优先照顾类型推断、运行时性能、tree-shaking 和长期维护。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 Core API
      link: /core/string

features:
  - title: 明确的 API 边界
    details: 通用能力放在 @zhouchengfeng/okay，Vue 和 React 子路径只保留框架适配层，避免重复逻辑和隐藏依赖。
  - title: TypeScript 优先
    details: 文档提供方法签名、关键类型、返回值和可复制示例，帮助你在 IDE 中获得稳定推断。
  - title: 性能可验证
    details: 差异比较、树遍历、格式化等热点方法配有 benchmark 入口，避免只凭直觉优化。
  - title: 适合生产使用
    details: 关注边界行为、错误处理、bundle size 和 tree-shaking，文档按实际业务场景组织。
---

<div class="api-grid">
  <a class="api-card" href="/core/string">
    <strong>字符串脱敏</strong>
    <span>手机号、邮箱、银行卡、身份证、姓名和通用文本脱敏。</span>
  </a>
  <a class="api-card" href="/core/collection">
    <strong>集合与树</strong>
    <span>数组 diff、稳定排序、索引 Map、树遍历、路径查找和树 diff。</span>
  </a>
  <a class="api-card" href="/core/async">
    <strong>异步控制</strong>
    <span>并发、重试、超时、取消、single flight、批处理和任务切片。</span>
  </a>
  <a class="api-card" href="/core/date">
    <strong>日期工具</strong>
    <span>格式化、范围、工作日、周/月/季度/年份计算。</span>
  </a>
</div>
