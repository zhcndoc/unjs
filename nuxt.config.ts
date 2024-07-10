import type { NitroConfig } from 'nitropack'
import packagesRedirects from './config/packages-redirects'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // Use a flag to merge the PRs quickly without pushing it to the production
      learn: false,
    },
  },
  app: {
    head: {
      htmlAttrs: {
        dir: 'ltr',
        class: 'scroll-smooth',
      },
      meta: [
        { name: 'theme-color', content: '#ECDC5A' },
      ],
      templateParams: {
        separator: ' - ',
      },
    },
  },
  modules: [
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/plausible',
    'nuxt-payload-analyzer',
    '@nuxt/fonts',
  ],
  css: [
    '~/assets/app.css',
  ],
  ui: {
    icons: ['heroicons', 'simple-icons', 'vscode-icons', 'ph'],
  },
  nitro: {
    static: true,
    prerender: {
      failOnError: true,
      crawlLinks: true,
      routes: ['/', '/blog', '/packages', '/blog/categories', '/api/search.txt', '/api/content/packages.json', '/rss.xml', '/blog/rss.xml'],
      ignore: [
        '/packages/</span',
        '/packages/template',
        '/packages/src/runtime',
      ],
    },
    routeRules: {
      '/blog/2023-08-25-nitro-2.6': {
        redirect: {
          statusCode: 301,
          to: '/blog/2023-08-25-nitro-2-6',
        },
      },
      // TODO: Related to public.learn flag
      '/learn/**': { robots: false },
    },
  },
  content: {
    documentDriven: false,
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
    },
    experimental: {
      cacheContents: false,
    },
  },
  colorMode: {
    preference: 'dark',
  },
  ogImage: {
    fonts: [
      'Nunito:400',
      'Nunito:700',
    ],
  },
  site: {
    url: 'https://unjs.zhcndoc.com',
    name: 'UnJS 中文文档',
    description: '不可知论的卓越：JavaScript库、工具和实用程序，旨在提升您的编码旅程。',
  },
  schemaOrg: {
    identity: {
      name: 'UnJS 中文文档',
      type: 'Organization',
      logo: 'https://unjs.zhcndoc.com/favicon.svg',
      sameAs: [
        'https://github.com/unjs',
        'https://twitter.com/unjsio',
      ],
    },
  },
  seo: {
    splash: false,
  },
  linkChecker: {
    enabled: false,
  },
  plausible: {
    autoPageviews: false,
  },
  routeRules: {
    ...packagesRedirects as NitroConfig['routeRules'],
  },
  devtools: {
    enabled: true,
  },
  typescript: {
    tsConfig: {
      exclude: ['../bin/**/*'],
    },
  },
})
