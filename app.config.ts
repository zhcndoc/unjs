export default defineAppConfig({
  ui: {
    primary: 'yellow',
    gray: 'cool',
    button: {
      base: 'transition ease-in',
      color: {
        gray: {
          solid: 'shadow-none bg-gray-300/20 hover:bg-gray-300/40 dark:bg-gray-700/40 dark:hover:bg-gray-700/50',
        },
      },
      variant: {
        solid: 'shadow-none',
      },
    },
    select: {
      base: 'transition ease-in',
      color: {
        gray: { outline: 'shadow-none bg-gray-300/20 hover:bg-gray-300/40 dark:bg-gray-700/40 dark:hover:bg-gray-700/50' },
      },
    },
    buttonGroup: {
      shadow: 'shadow-none',
    },
    card: {
      base: 'transition ease-in duration-150',

    },
    input: {
      base: 'transition ease-in',
      color: {
        gray: {
          outline: 'shadow-none bg-gray-300/20 hover:bg-gray-300/40 dark:bg-gray-700/40 dark:hover:bg-gray-700/50',
        },
      },
    },
    selectMenu: {
      option: {
        base: 'cursor-pointer',
      },
    },
  },
  website: {
    search: {
      groups: [
        /**
         * End / is very important since we use startsWith
         * Without, page /blog will be in the wrong group
         */
        {
          name: 'Articles',
          path: '/resources/',
        },
        {
          name: 'Blog',
          path: '/blog/',
        },
        {
          name: 'Packages',
          path: '/packages/',
        },
      ],
    },
    rss: {
      webMaster: {
        name: 'UnJS Team',
        email: 'hi@unjs.io',
      },
      docs: 'https://validator.w3.org/feed/docs/rss2.html',
    },
    footer: {
      quote: '使用 UnJS 释放您的 Web 开发旅程的潜能 - 创新与简单相遇，可能性变得无限。',
      menu: [
        {
          title: '社区',
          items: [
            {
              title: '贡献',
              url: 'https://github.com/unjs/governance',
              rel: 'noopener',
              target: '_blank',
            },
            {
              title: '讨论',
              url: 'https://github.com/unjs/community/discussions',
              rel: 'noopener',
              target: '_blank',
            },
            // {
            //   title: 'FAQ',
            //   url: '/faq',
            //   rel: null,
            //   target: null,
            // },
            {
              title: '联系我们',
              url: 'mailto:hi@unjs.io',
              rel: null,
              target: null,
            },
          ],
        },
        {
          title: '内容',
          items: [
          //   {
          //     title: 'Learn',
          //     url: '/learn',
          //     rel: null,
          //     target: null,
          //   },
          //   {
          //     title: 'Build',
          //     url: '/build',
          //     rel: null,
          //     target: null,
          //   },
          //   {
          //     title: 'Explore',
          //     url: '/explore',
          //     rel: null,
          //     target: null,
          //   },
            {
              title: '搜索',
              url: '/search',
              rel: null,
              target: null,
            },
          ],
        },
        {
          title: 'UnJS',
          items: [
            {
              title: '中文文档',
              url: 'https://unjs.zhcndoc.com',
              rel: 'noopener',
              target: '_blank',
            },
            {
              title: '设计套件',
              url: '/design-kit',
            },
            {
              title: 'GitHub',
              url: 'https://github.com/unjs',
              rel: 'noopener',
              target: '_blank',
            },
          ],
        },
      ],
    },
    socials: {
      github: {
        url: 'https://github.com/unjs',
        rel: 'noopener',
        target: '_blank',
        icon: 'i-simple-icons-github',
        name: 'GitHub',
      },
      x: {
        url: 'https://x.com/unjsio',
        icon: 'i-simple-icons-x',
        rel: 'noopener',
        target: '_blank',
        name: 'X',
      },
      rss: {
        url: '/rss',
        icon: 'i-heroicons-rss',
        name: 'RSS',
        target: null,
        rel: null,
      },
    },
  },
})
