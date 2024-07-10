---
title: 介绍 UnJS 关系
description: 以一种视觉化的方式来理解 UnJS 生态系统及其依赖关系。
authors:
  - name: Estéban S
    picture: https://github.com/barbapapazes.png
    twitter: soubiran_
categories:
  - website
packages:
publishedAt: 2024-02-07
modifiedAt: 2024-02-07
---

今天，UnJS 由**超过 50 个包**组成。每个月，都有新的包被添加到生态系统中。

<!-- 不包含任何链接的每个包的图像 -->
![UnJS Packages](/assets/images/blog/2024-02-07-introducing-unjs-relations/unjs-packages.webp)

如果你是**新来者**，你很有可能在这个包的海洋中迷失方向。你应该使用哪个包？这个包和这个包有什么不同？这些包之间有没有共同点？Nuxt 使用 UnJS 吗？

如果你正在**学习 UnJS**，你可能会想要提高对生态系统的理解。

如果你已经**熟悉** UnJS，你可能很难理解不同的包是如何相互关联的。

但不管你是谁，你能区分[Nitro](/packages/nitro)和[H3](/packages/h3)之间的差异吗？你知道 Nitro 和 H3 之间的关系吗？

有了 UnJS 关系，**从来没有比这更简单**地回答这些问题，无论是你是初学者、专家还是向别人解释 UnJS。

让我们来看看这个新工具。

## UnJS 关系

视觉化可以帮助理解复杂的系统，当系统的每个部分都相互连接时，这一点尤其重要。这就是我们创造UnJS关系的原因。

UnJS 关系是一个视觉工具，绘制了一个旨在帮助你理解 UnJS 生态系统及其关系的图表。

你可以选择任何 UnJS 包、任何 npm 包或两者的任何组合。图表将实时更新。你还可以隐藏或显示依赖项和开发依赖。

有一个选项可以显示使用所选包的孩子的包。

你可以双击一个包来打开一个抽屉，其中包含包的描述和其依赖项的列表。这样，你可以轻松地访问包页面或绘制一个包的关系。

![UnJS Relations](/assets/images/blog/2024-02-07-introducing-unjs-relations/unjs-relations.webp)

回到 [Nitro](/packages/nitro) 和 [H3](/packages/h3) 的例子。你可能已经注意到这两个包彼此相关。但它们是如何关联的？这是关系图表：

![Nitro and H3 relationship](/assets/images/blog/2024-02-07-introducing-unjs-relations/nitro-h3-relations.webp)

如何理解这个图表？

首先，让我们看看 [H3](/packages/h3) 的依赖项。我们可以看到 [radix3](/packages/radix3)，这是一个路由器，[unenv](/packages/unenv)，是一个使环境无关的 JavaScript 工具，以及 [listhen](/packages/listhen)，一个 HTTP 监听器。有了这些信息，我们可以说 [H3](/packages/h3) 是一个用来构建运行时无关的 web 服务器的工具。

现在，让我们看看 [Nitro](/packages/nitro) 的依赖项。它有许多与 [H3](/packages/h3) 共有的依赖项。Nitro 将 [H3](/packages/h3) 作为一个依赖。这是一个重要的信息，它告诉我们 [Nitro](/packages/nitro) 是在它之上构建的。其他一些依赖项包括 [citty](/packages/citty)：一个 CLI 构建器、[c12](/packages/c12)：一个配置读取器、[unstorage](/packages/unstorage)：一个键值存储 API、[hookable](/packages/hookable)：一个钩子工具、以及 [ofetch](/packages/ofetch)：一个更好的 fetch API。

有了这些信息，我们可以说 [Nitro](/packages/nitro) 是一个框架，用于构建具有比 [H3](/packages/h3) 更多功能和更广泛范围的 web 服务器。因为它是在 [H3](/packages/h3) 的基础上构建的，所以学习 [H3](/packages/h3) 将帮助你理解 [Nitro](/packages/nitro)。

### 添加npm包

使用 `npm Packages` 按钮，你可以将任何 npm 包添加到图表中。

> [!IMPORTANT]
> 请记住，我们只向您显示作为外部包依赖项的 UnJS 包。

例如，让我们使用 npm 源将 `Nuxt` 添加到图表中。不要忘记一旦包出现在列表中就选择它。

![Nuxt with UnJS relations](/assets/images/blog/2024-02-07-introducing-unjs-relations/nuxt-unjs-relations.webp)

是的，Nuxt 是建立在许多 UnJS 包之上的，包括 [Nitro](/packages/nitro) 和 [H3](/packages/h3)。

:read-more{to="https://nuxt.com/docs/getting-started/server" title="Server Engine of Nuxt"}

你可以尝试任何你想要的 npm 包！

## 最终话语

我们真的希望这个工具能帮助你理解 UnJS 生态系统以及不同的包是如何相互关联的。通过对生态系统的更好理解，你将能够做出更好的决策并构建更好的应用程序。

[现在尝试](/relations)，并在 [X](https://x.com/unjsio) 上与我们分享你最好的关系！
