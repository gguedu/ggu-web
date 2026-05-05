---
title: Markdown 与 MDC 测试
description: 原生 Markdown 与本项目可用 MDC 组件最简测试
date: 2026-05-05
category: 测试
tags:
  - markdown
  - mdc
  - test
---

# Markdown

## 标题

### 三级标题

正文段落，包含换行。  
这是同一段中的第二行。

**粗体**、__下划线粗体__、*斜体*、_下划线斜体_、***粗斜体***、___下划线粗斜体___、~~删除线~~。

[链接](https://example.com) 与 <https://example.com>

![图片](https://file.vacu.top/file/1.png)

> 引用内容
>
> - 引用内列表
> - 第二项

- 无序列表
- 第二项
  - 嵌套项

1. 有序列表
2. 第二项
   1. 嵌套项

- [x] 已完成任务
- [ ] 未完成任务

行内代码：`console.log('hello')`

```ts
const message: string = 'Hello Markdown'
console.log(message)
```

| 名称 | 类型 | 状态 |
| --- | --- | --- |
| 标题 | 文本 | 正常 |
| 代码 | 组件 | 正常 |
| 表格 | 组件 | 正常 |

---

脚注示例[^1]

[^1]: 这是脚注内容。

# MDC

## 基础语法

行内组件：:badge[Badge]{color="primary" variant="soft"}

::u-alert{title="Leaf 组件" description="这是不含正文插槽的 MDC 组件。" color="primary" variant="soft"}
::

::u-card
这是块级组件正文。
::

## Callout

::note
Note 内容。
::

::tip
Tip 内容。
::

::warning
Warning 内容。
::

::caution
Caution 内容。
::

::callout{icon="i-lucide-info" color="primary"}
Callout 内容。
::

## Card

::card{title="单张卡片" icon="i-lucide-book-open" to="/post"}
卡片正文。
::

::card-group
:::card{title="卡片 A" icon="i-lucide-file-text"}
正文 A。
:::

:::card{title="卡片 B" icon="i-lucide-link"}
正文 B。
:::
::

## Accordion

::accordion
:::accordion-item{label="第一项" icon="i-lucide-info"}
折叠内容一。
:::

:::accordion-item{label="第二项" icon="i-lucide-settings"}
折叠内容二。
:::
::

## Collapsible

::collapsible{name="内容"}
可折叠正文。
::

## Tabs

::tabs
:::tabs-item{label="预览" icon="i-lucide-eye"}
预览内容。
:::

:::tabs-item{label="代码" icon="i-lucide-code"}
代码内容。
:::
::

## Steps

::steps
### 第一步

准备内容。

### 第二步

完成内容。
::

## Field

::field{name="title" type="string" required}
文章标题。
::

::field-group
:::field{name="date" type="string" required}
文章日期。
:::

:::field{name="tags" type="string[]"}
文章标签。
:::
::

## Code

::code-group
```ts [app.ts]
export const app = 'ggu'
```

```vue [App.vue]
<template>
  <div>GGU</div>
</template>
```
::

::code-collapse{name="示例代码"}
```ts
const hidden = true
console.log(hidden)
```
::

## Inline Prose

:badge[Primary]{color="primary"}
:badge[Neutral]{color="neutral"}
:icon{name="i-lucide-star"}
:kbd[Ctrl]
:kbd[K]

## 常用 U 组件

:u-button[按钮]{color="primary" variant="soft" to="/post"}

::u-alert{title="UAlert" description="普通 Nuxt UI 组件也可以通过 MDC 调用。" color="success" variant="soft"}
::

::u-separator
::
