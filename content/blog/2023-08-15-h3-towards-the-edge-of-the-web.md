---
title: H3 v1.8 - 走向网络边缘
description: 新版 H3 发布，支持 Web 和 Plain 适配器，Web 流支持，对象语法事件处理器，类型化事件处理器请求等更多功能！
authors:
  - name: Pooya Parsa
    picture: https://github.com/pi0.png
    twitter: _pi0_
categories:
  - h3
  - release
packages:
  - h3
publishedAt: 2023-08-15
modifiedAt: 2023-08-15
---

> [H3](/packages/h3) 是一个用 TypeScript 编写的多功能 H(TTP) 框架，它今天为 [Nitro](https://nitro.unjs.io/) 和 [Nuxt](https://nuxt.com/) 提供动力。

[大约两年前](https://github.com/unjs/h3/tree/cbc8909b2003d6d5df694ab7a36aa067cc990c74)，我们带着使 H3 成为 [Nuxt 3](https://nuxt.com/) 上最小的 HTTP 框架的雄心壮志，确保了与 [Node.js](https://nodejs.org/en) 的兼容性，并提供了一个优雅的开发者体验。它还旨在具有前瞻性的设计，能够适应边缘和 Web Worker 运行时，这是一个当时相对较新的概念。

在同一时期，我们还开发了 [unjs/unenv](https://github.com/unjs/unenv/tree/main)，这是一个薄层，它允许在边缘兼容的运行时中利用 Node.js 库和 HTTP 中间件，而不需要 Node.js。这一创新在很大程度上使我们能够无需从头开始为 Web 兼容性而重新开始，就能利用 NPM 和 Node.js 生态系统的力量。H3 和 unenv 的协同作用使 [Nitro](https://nitro.unjs.io) 成为完全兼容边缘运行时的开创性 Web 框架之一。

这个最新版本使 H3 更接近于提供开箱即用的原生Web API兼容性。

> 🚀 这个版本立即可用，适用于包括 [Nitro](https://nitro.unjs.io/) 和 [Nuxt 3](https://nuxt.com/) 在内的所有生态系统包。请记得刷新您的 `lockfile` 和 `node_modules` 以接收更新。

## Web 和 Plain 适配器

我们引入了一个新的内置适配器，它具有 [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 兼容的签名，以 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 为输入和 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 为返回值。

这意味着你现在可以无缝地将 H3 应用程序部署到像 [Cloudflare Workers](https://workers.cloudflare.com/)、[Deno Deploy](https://deno.com/deploy)、[Bun](https://bun.sh/) 和 [Lagon](https://lagon.app/) 这样的运行时上。

对于实际示例和演示，请查看 [h3-on-edge](https://github.com/pi0/h3-on-edge)仓库。

```ts
// import { createApp, eventHandler, toWebHandler } from 'h3'
import { createApp, eventHandler, toWebHandler } from 'https://esm.sh/h3@1.8.0'

const app = createApp()

app.use(
  '/',
  eventHandler(event => 'H3 works on edge!'),
)

const webHandler = toWebHandler(app) // (Request) => Promise<Response>
```

除了 Web 处理器外，我们还引入了一个新的 Plain 适配器格式，使用 `toPlainHandler(app)` 语法。这使得 H3 能够与任何无服务器平台顺畅集成，使用纯输入和响应对象。

所有这些功能都是由于实现了新的流功能和 [unjs/unenv](https://unenv.unjs.io)，后者提供了一个轻量级的 Node.js 兼容层。在此之前，这种集成只能在 [Nitro 预设](https://nitro.unjs.io/deploy)中实现。

此外，我们还引入了一组新的 Web 帮助器：

- `toWebRequest(event)`：将 H3 事件对象转换为 Web [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)。
- `getRequestWebStream(event)`：从当前 H3 事件请求检索可读流。
- `fromPlainHandler(plainHandler)`：将纯对象处理器转换为 H3 兼容的事件处理器。
- `fromWebHandler(webHandler)`：将 Web Request/Response 处理器转换为 H3 兼容的事件处理器。

## Web 流支持

H3 现在支持原生 [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) 响应支持。这本身就带来了与像 [Vercel/AI](https://github.com/vercel/ai) 这样的库的兼容性，它们依赖于流响应([演示](https://github.com/Hebilicious/nuxt-openai-vercel-edge-demo))。

利用这个功能很简单——只需从您的 event 处理器返回 [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) 或 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象。

```ts
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/html')
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (const token of 'Streaming is so cool with H3!'.split(' ')) {
        controller.enqueue(encoder.encode(token))
        await new Promise((resolve) => {
          setTimeout(resolve, 300)
        })
      }
    },
  })
  return stream
})
```

对于更高级的场景，您可能选择使用 `sendStream(event, stream)` 和 `sendWebResponse(event, stream)` 实用程序来代替直接返回流。

## 对象语法事件处理器

H3 引入了使用对象语法的定义事件处理器功能。通过这种方法，您可以定义在每个处理器的运行前或运行后运行的钩子，例如认证或压缩中间件。

```ts
const auth = defineRequestMiddleware((event) => {
  event.context.auth = { name: 'admin' }
})

const compression = defineResponseMiddleware((event) => {
  // Example: https://stackblitz.com/edit/github-mb6bz3
})

export default eventHandler({
  onRequest: [auth],
  onBeforeResponse: [compression],
  async handler(event) {
    return `Hello ${event.context.auth?.name || 'Guest'}`
  },
})
```

## 类型化的事件处理器请求

H3 现在支持使用新的泛型类型支持来定义事件类型。

当您定义类型时，请求实用程序将知道事件输入类型。这一增强还允许我们提高 `$fetch` 处理器在上游框架如 [Nitro](https://nitro.unjs.io/) 和 [Nuxt](https://nuxt.com/) 中的类型安全。

```ts
export default eventHandler<{ body: { name: string }, query: { id: string } }>(
  async (event) => {
    const query = getQuery(event) // Query is typed as { id: string }
    const body = await readBody(event) // Body is typed as { name: string }
  },
)
```

## 运行时 + 类型安全的请求实用程序

我们引入了两项新实用程序，`getValidatedQuery(event, validator)` 和 `readValidatedBody(event, validator)`，它们支持与如 [zod](https://zod.dev/) 这样的模式验证器集成，以实现运行时和类型安全。

```ts
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().default('Guest'),
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => userSchema.safeParse(body)) // or `.parse` to directly throw an error

  if (!result.success)
    throw result.error.issues

  // User object is validated and typed!
  return result.data
})
```

## 其他实用程序

我们引入了其他一些实用程序，进一步增强了 Web 应用开发体验：

- `getRequestIP(event, { xForwardedFor? })`: 检索传入请求的 IP。
- `readFormData(event)`: 将请求体读取为 [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)。
- `clearResponseHeaders(event)`: 清除所有响应头。
- `removeResponseHeader(event, name)`: 移除特定响应头。
- `serveStatic(event, options)`: 平台无关的静态资产服务器。查看 [listhen 源](https://github.com/unjs/listhen/blob/af6ea3af3fec4289c00b0ba589ca6f63c6a5dbbd/src/server/dev.ts#L66)以了解如何与 Node.js 一起使用。

## 使用 HMR 轻松进行 TypeScript 开发

我们还发布了 [unjs/listhen](https://listhen.unjs.io) 的更新版本，它无缝集成了 H3 应用。

你所需要做的就是在 `index.ts` 文件中创建：

```ts
import { createApp, eventHandler } from 'h3'

export const app = createApp()

app.use('/', () => 'Hello world!')
```

运行 `npx listhen@latest -w ./index.ts` 来启动具有 TypeScript 支持、热模块替换 (HMR) 和静态资产服务器的开发服务器。

[在线沙箱](https://stackblitz.com/github/unjs/h3/tree/main/playground?startScript=dev)

![listhen 截图](https://raw.githubusercontent.com/unjs/listhen/main/.assets/screenshot.png){withoutBorder}

## 完整变更日志

为了查看全面的变更列表，请参考[发布说明](https://github.com/unjs/h3/releases/tag/v1.8.0)。
