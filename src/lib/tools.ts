import { Grid2X2 } from '@lucide/vue'

export const toolCategories = ['全部', '教育'] as const

export const tools = [
  {
    name: '汉字字帖生成器',
    description: '输入汉字，生成带完整示字、逐笔描红和整行临写格的 A4 PDF 练字纸。',
    category: '教育',
    icon: Grid2X2,
    route: '/chinese-copybook',
    keywords: ['汉字', '字帖', '田字格', '米字格', '笔顺', '描红', '打印'],
  },
] as const
