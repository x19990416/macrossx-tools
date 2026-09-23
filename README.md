# MacrossX Tools

一些简单、实用、打开即用的在线小工具。所有数据优先在浏览器本地处理。

在线地址：[https://x19990416.github.io/macrossx-tools/](https://x19990416.github.io/macrossx-tools/)

## 技术栈

- Vue 3 + TypeScript
- Vite
- Vue Router
- Tailwind CSS 4
- shadcn-vue / Reka UI
- Lucide Vue

## 本地开发

```bash
pnpm install
pnpm dev
```

## 检查与构建

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

## 工具列表

| 工具           | 用途                                                           | 访问地址             |
| -------------- | -------------------------------------------------------------- | -------------------- |
| 汉字字帖生成器 | 生成带完整示字、逐笔描红、基础笔画和整行田字格的 A4 PDF 练字纸 | `#/chinese-copybook` |

## 第三方数据

汉字字帖工具内置的一年级上册笔顺数据来自
[Hanzi Writer Data](https://github.com/chanind/hanzi-writer-data)，数据遵循 Arphic Public License；
许可文本随文件保存在 `public/strokes/ARPHICPL.TXT`。
