---
title: Markdown 测试
description: 原生 Markdown 组件最简测试
date: 2026-05-05
category: 测试
tags:
  - markdown
  - test
---

# 一级标题

## 二级标题

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
