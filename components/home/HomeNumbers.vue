<script lang="ts" setup>
defineProps<{
  title?: string
}>()

const { data: packages } = await useAsyncData('home:numbers', () => {
  return Promise.all([
    $fetch('/api/content/packages.json'),
    $fetch('/api/github/followers'),
  ])
}, {
  transform: ([data, followers]) => {
    const packages: number = data.length
    const stars: number = data.reduce((acc, curr) => acc + curr.stars, 0)
    const monthlyDownloads: number = data.reduce((acc, curr) => acc + (curr.monthlyDownloads ?? 0), 0)

    return {
      packages,
      stars,
      monthlyDownloads,
      followers,
    }
  },
})
</script>

<template>
  <section class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center justify-center">
    <h2 class="max-w-sm lg:max-w-none text-center lg:text-left text-2xl md:text-3xl lg:text-4xl text-gray-950 dark:text-gray-50 font-bold tracking-wide lg:leading-[3rem]">
      {{ title }}
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <HomeNumbersItem v-if="packages" label="软件包" :value="packages?.packages" />
      <HomeNumbersItem v-if="packages" label="GitHub 上的 Stars" :value="packages?.stars" />
      <HomeNumbersItem v-if="packages" label="每月下载量" :value="packages?.monthlyDownloads" />
      <HomeNumbersItem v-if="packages" label="GitHub 上的关注者" :value="packages?.followers" />
    </div>
  </section>
</template>
