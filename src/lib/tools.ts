import { Blocks, Calculator, Grid2X2 } from '@lucide/vue'

export const toolCategories = ['全部', '教育'] as const

export const tools = [
  {
    name: '幼升小数学游戏',
    description: '中文互动游戏、生活任务卡和进阶挑战，练习用数学解决问题。',
    category: '教育',
    icon: Blocks,
    route: '/early-math',
    keywords: ['数学思维', '幼小衔接', '大班', '学前', '生活数学', '找规律'],
  },

  {
    name: '小学口算练习册',
    description: '按范围和运算随机生成循序渐进的 A4 口算练习 PDF。',
    category: '教育',
    icon: Calculator,
    route: '/math-worksheet',
    keywords: ['数学', '口算', '练习册', '加减乘除', '打印'],
  },
  {
    name: '汉字字帖生成器',
    description: '输入汉字，生成带完整示字、逐笔描红和整行临写格的 A4 PDF 练字纸。',
    category: '教育',
    icon: Grid2X2,
    route: '/chinese-copybook',
    keywords: ['汉字', '字帖', '田字格', '米字格', '笔顺', '描红', '打印'],
  },
] as const
