<script lang="ts" setup>
defineProps<{
  filename?: string
}>()
</script>

<template>
  <ProseNavGroup icon="i-heroicons-user-group-solid">
    <template #title>
      社区
    </template>
    <template #links>
      <slot name="before" />
      <ProseNavGroupLink
        to="https://github.com/unjs/website" target="_blank"
        icon="i-simple-icons-github"
      >
        在 GitHub 上 Star
      </ProseNavGroupLink>
      <ProseNavGroupLink v-if="filename" :to="toEditPage(filename)" target="_blank" icon="i-heroicons-pencil-square-20-solid">
        编辑此页面
      </ProseNavGroupLink>
    </template>
  </ProseNavGroup>
</template>
