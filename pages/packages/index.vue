<script lang="ts" setup>
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
useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
  }),
])
useTrackPageview()

const {
  fetchPackages,
  updateQuery,
  reset,
  packages,
  q,
  order,
  orderBy,
  orderByOptions,
  numberOfPackages,
  monthlyDownloads,
} = usePackages()

await fetchPackages()

defineOgImageComponent('OgImagePackages', {
  packages: packages.value?.length,
  monthlyDownloads: monthlyDownloads.value,
})

// Track search to analytics
watchDebounced(q, () => {
  if (!q.value)
    return

  useTrackEvent('Packages Search', { props: { query: q.value } })
}, { debounce: 500 })
</script>

<template>
  <Main v-if="page">
    <template #header>
      <PageHeader :title="page.title" :description="page.description">
        <template #right>
          <div class="flex justify-end gap-12 text-gray-500 dark:text-gray-400 font-medium text-xl">
            <div class="flex flex-col gap-2">
              <span class="text-gray-950 dark:text-gray-50 text-8xl font-extrabold">
                {{ numberOfPackages }}
              </span>
              <span>
                软件包
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-gray-950 dark:text-gray-50 text-8xl font-extrabold">
                {{ formatNumber(monthlyDownloads, 0) }}
              </span>
              <span>
                每月下载量
              </span>
            </div>
          </div>
        </template>
      </PageHeader>
    </template>

    <section>
      <h2 class="sr-only">
        软件包列表
      </h2>

      <AppListTopBar
        :search="q" :order="order" :order-by="orderBy" search-placeholder="搜索软件包" :order-by-options="orderByOptions" @reset="reset"
        @update:search="updateQuery({ q: $event })" @update:order="updateQuery({ order: $event })" @update:order-by="updateQuery({ orderBy: $event })"
      />

      <AppListGrid class="mt-8">
        <AppListGridItem v-for="item in packages" :key="item.title">
          <PackagesCard
            :title="item.title"
            :description="item.description"
            :path="item.path"
            :stars="item.stars"
            :monthly-downloads="item.monthlyDownloads"
            :contributors="item.contributors"
          />
        </AppListGridItem>
        <AppListGridEmpty v-if="packages && packages.length === 0">
          未找到任何软件包
        </AppListGridEmpty>
      </AppListGrid>
    </section>
  </Main>
</template>
