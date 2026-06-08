import { defineConfig } from 'vitepress'

const repo = 'https://github.com/yibird/okay'
const base = process.env.VITEPRESS_BASE ?? '/okay/'

export default defineConfig({
  base,
  cleanUrls: true,
  description: '面向 TypeScript、Vue 和 React 的类型安全工具库。',
  head: [
    ['link', { href: `${base}logo.svg`, rel: 'icon', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#183b2a' }],
    ['meta', { property: 'og:title', content: 'Okay' }],
    ['meta', { property: 'og:description', content: '类型安全、可组合、可验证的工具方法集合。' }],
  ],
  lang: 'zh-CN',
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  sitemap: {
    hostname: 'https://yibird.github.io/okay/',
  },
  themeConfig: {
    editLink: {
      pattern: `${repo}/edit/master/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      copyright: 'Released under the MIT License.',
      message: '以类型安全、运行时性能和长期可维护性为核心设计。',
    },
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'Core', link: '/core/string' },
      { text: 'Vue', link: '/vue/' },
      { text: 'React', link: '/react/' },
      { text: 'GitHub', link: repo },
    ],
    outline: {
      label: '本页目录',
      level: [2, 3],
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '没有找到结果',
                resetButtonTitle: '清除搜索',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '开发与发布', link: '/guide/development' },
        ],
      },
      {
        collapsed: false,
        text: 'okay-core',
        items: [
          { text: '字符串', link: '/core/string' },
          { text: '数字', link: '/core/number' },
          { text: '类型判断', link: '/core/is' },
          { text: '异步控制', link: '/core/async' },
          { text: '集合与树', link: '/core/collection' },
          { text: '日期', link: '/core/date' },
          { text: '文件', link: '/core/file' },
        ],
      },
      {
        text: '框架工具',
        items: [
          { text: 'Vue', link: '/vue/' },
          { text: 'React', link: '/react/' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: repo }],
  },
  title: 'Okay',
})
