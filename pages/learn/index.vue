<script lang="ts" setup>
import type { LearnArticleCard } from '~/types/learn'
import type { BlogPostCard } from '~/types/blog'

const route = useRoute()
const { data: page, error } = await useAsyncData(route.path, () => queryContent(route.path).findOne())

if (error.value) {
  throw createError({
    statusCode: 404,
    message: 'Page not found',
    fatal: true,
  })
}

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})
defineOgImageComponent('OgImagePage', {
  illustration: '/assets/header/dark/learn.png',
})

const { data: latestBlog } = await useAsyncData('blog:latest', () => queryContent('/blog/').only(['_path', 'title', 'description', 'publishedAt', 'authors', 'packages', 'categories']).sort({ publishedAt: -1 }).limit(3).find(), { default: () => [] }) as { data: Ref<BlogPostCard[]> }

const { data: latestArticles } = await useAsyncData('learn:latest', () => queryContent('/learn/articles/').only(['_path', 'title', 'description', 'publishedAt', 'authors', 'category']).sort({ publishedAt: -1 }).limit(3).find(), { default: () => [] }) as { data: Ref<LearnArticleCard[]> }

const { data: randomArticle } = await useAsyncData('learn:random', () => queryContent('/learn/articles/').only(['_path']).find(), { transform: data => data[Math.floor(Math.random() * data.length)]._path }) as { data: Ref<LearnArticleCard> }

const categories = [{
  id: 'getting-started',
  label: 'Getting Started',
  description: 'Start by the basics of the UnJS ecosystem',
}, {
  id: 'building-blocks',
  label: 'Building Blocks',
  description: 'Assemble packages and tools to start creating an app',
}]
</script>

<template>
  <Main v-if="page">
    <template #header>
      <PageHeader :title="page.title" :description="page.description">
        <template #right>
          <div>
            <AppColorModeImage light="/assets/header/light/learn.png" dark="/assets/header/dark/learn.png" alt="Illustration" aria-hidden="true" class="absolute left-24 top-0 opacity-70 w-80" />
          </div>
        </template>
      </PageHeader>
    </template>

    <section class="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 lg:gap-16">
      <div class="flex flex-col gap-2">
        <h2 class="text-gray-950 dark:text-gray-50 text-xl lg:text-4xl font-bold">
          找到你需要的文章
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-lg">
          我们的文章分为不同的类别，以帮助您找到适合您需求的内容，从初学者到更高级的主题。
        </p>

        <div class="mt-6 flex ">
          <UButton to="/learn/articles" color="white" variant="solid" size="lg" trailing-icon="i-heroicons-chevron-right-20-solid">
            所有文章
          </UButton>
        </div>
      </div>
      <ol class="grid grid-cols-2 gap-4 lg:gap-8">
        <li v-for="category in categories" :key="category.label" class="relative p-4 rounded-lg ring-1 ring-gray-300 dark:ring-gray-700 shadow-sm hover:shadow-none hover:ring-primary dark:hover:ring-primary transition ease-in">
          <h3 class="md:text-xl font-semibold dark:text-gray-50">
            <NuxtLink class="absolute inset-0" :to="`/learn/articles?categories[]=${category.id}`" />
            {{ category.label }}
          </h3>
          <p class="mt-1 dark:text-zinc-400">
            {{ category.description }}
          </p>
        </li>
      </ol>
    </section>

    <section class="mt-8 lg:mt-16">
      <h2 class="text-gray-950 dark:text-gray-50 text-xl font-semibold">
        <NuxtLink class="flex items-center" to="/learn/articles?order=-1&orderBy=publishedAt">
          <span>
            最新文章
          </span>
          <span class="i-heroicons-chevron-right text-primary h-5 w-5" />
        </NuxtLink>
      </h2>

      <AppListGrid class="mt-3">
        <AppListGridItem v-for="item in latestArticles" :key="item._path">
          <LearnCard
            :path="item._path"
            :title="item.title"
            :description="item.description"
            :published-at="item.publishedAt"
            :category="item.category"
            :authors="item.authors"
          />
        </AppListGridItem>
      </AppListGrid>
    </section>

    <!-- Find by packages with list of most used packages -->

    <section class="mt-8 lg:mt-16">
      <h2 class="text-gray-950 dark:text-gray-50 text-xl font-semibold">
        <NuxtLink class="flex items-center" to="/blog?order=-1&orderBy=publishedAt">
          <span>
            保持最新状态
          </span>
          <span class="i-heroicons-chevron-right text-primary h-5 w-5" />
        </NuxtLink>
      </h2>
      <AppListGrid class="mt-3">
        <AppListGridItem v-for="item in latestBlog" :key="item._path">
          <BlogCard
            :path="`${item._path!}`"
            :title="item.title"
            :description="item.description"
            :published-at="item.publishedAt"
            :authors="item.authors"
          />
        </AppListGridItem>
      </AppListGrid>
    </section>

    <!-- TODO: testimonials (later) -->

    <section class="mt-8 lg:mt-16 py-16 flex flex-col items-center bg-gray-300/20 ring-gray-300 dark:bg-gray-700/20 rounded-lg ring-1 dark:ring-gray-700">
      <h2 class="text-gray-950 dark:text-gray-50 text-xl lg:text-4xl font-bold">
        立即开始
      </h2>
      <p class="mt-8 text-gray-500 dark:text-gray-400 max-w-lg text-center">
        开始学习，提高你的 JavaScript 技能，并组装包以构建更好的应用程序、网站和项目。
      </p>

      <div class="mt-12">
        <UButton :to="`${randomArticle}/`" color="primary" variant="solid" size="lg" :ui="{ variant: { solid: 'text-gray-950 dark:text-gray-50 bg-primary bg-opacity-40 dark:bg-opacity-30  hover:bg-primary/60 dark:hover:bg-primary/40' } }" trailing-icon="i-heroicons-chevron-right-20-solid">
          阅读一篇文章
        </UButton>
      </div>
    </section>
  </Main>
</template>
