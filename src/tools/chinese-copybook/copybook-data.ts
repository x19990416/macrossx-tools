export const gradeOneUpper =
  '一二三十木禾上下土个八入大天人火文六七儿九无口日中了子门月不开四五目耳头米见白田电也长山出飞马鸟云公车牛羊小少巾牙尺毛卜又心风力手水广升足走方半巴业本平书自已东西回片皮生里果几用鱼今正雨两瓜衣来年左右'

export interface StrokePracticeItem {
  symbol: string
  name: string
  path: string
}

export const strokePracticeItems: StrokePracticeItem[] = [
  { symbol: '㇐', name: '横', path: 'M180 500 L820 500' },
  { symbol: '㇑', name: '竖', path: 'M500 180 L500 820' },
  { symbol: '㇒', name: '撇', path: 'M720 180 C650 440 500 650 250 820' },
  { symbol: '㇏', name: '捺', path: 'M300 200 C420 350 540 600 790 820' },
  { symbol: '㇔', name: '点', path: 'M430 250 C520 320 590 410 620 520' },
  { symbol: '㇀', name: '提', path: 'M230 680 L760 430' },
  { symbol: '㇕', name: '横折', path: 'M220 260 L760 260 L760 800' },
  { symbol: '㇇', name: '横撇', path: 'M220 280 L760 280 C700 500 520 700 250 820' },
  { symbol: '㇖', name: '横钩', path: 'M180 280 L780 280 L690 410' },
  { symbol: '㇆', name: '横折钩', path: 'M200 240 L760 240 L760 760 Q760 840 650 780' },
  { symbol: '㇊', name: '横折提', path: 'M200 220 L700 220 L700 700 L820 580' },
  { symbol: '㇍', name: '横折弯', path: 'M200 220 L700 220 L700 620 Q700 780 820 780' },
  { symbol: '㇅', name: '横折折', path: 'M180 220 L700 220 L700 500 L300 500 L300 800' },
  { symbol: '㇠', name: '横斜钩', path: 'M180 260 L650 260 Q600 550 760 800 Q800 840 850 720' },
  {
    symbol: '㇈',
    name: '横折弯钩',
    path: 'M180 220 L650 220 L650 600 Q650 780 800 780 Q860 780 820 680',
  },
  {
    symbol: '㇌',
    name: '横撇弯钩',
    path: 'M180 220 L650 220 Q580 400 430 500 Q300 600 420 720 L760 720 Q820 720 780 620',
  },
  { symbol: '㇋', name: '横折折撇', path: 'M180 220 L650 220 L650 450 L350 450 Q500 600 250 820' },
  {
    symbol: '㇡',
    name: '横折折折钩',
    path: 'M180 180 L650 180 L650 400 L350 400 L350 620 L720 620 L720 820 Q720 860 650 800',
  },
  {
    symbol: '㇎',
    name: '横折折折',
    path: 'M180 180 L650 180 L650 400 L350 400 L350 620 L720 620 L720 820',
  },
  { symbol: '㇙', name: '竖提', path: 'M420 180 L420 780 L760 580' },
  { symbol: '㇗', name: '竖折', path: 'M350 180 L350 750 L780 750' },
  { symbol: '㇚', name: '竖钩', path: 'M500 180 L500 760 Q500 850 380 780' },
  { symbol: '㇄', name: '竖弯', path: 'M400 180 L400 650 Q400 780 600 780 L820 780' },
  {
    symbol: '㇟',
    name: '竖弯钩',
    path: 'M400 180 L400 650 Q400 780 600 780 L820 780 Q870 780 820 680',
  },
  { symbol: '㇥', name: '竖折撇', path: 'M350 180 L350 500 L650 500 Q560 680 280 820' },
  { symbol: '㇞', name: '竖折折', path: 'M300 180 L300 480 L700 480 L700 800' },
  { symbol: '㇉', name: '竖折折钩', path: 'M300 180 L300 450 L720 450 L720 800 Q720 850 630 780' },
  { symbol: '㇛', name: '撇点', path: 'M650 180 Q540 420 340 560 Q520 650 760 820' },
  { symbol: '㇜', name: '撇折', path: 'M650 180 Q520 450 300 560 L700 800' },
  { symbol: '㇂', name: '斜钩', path: 'M320 180 Q420 550 700 800 Q760 850 800 700' },
  { symbol: '㇁', name: '弯钩', path: 'M420 180 Q300 500 470 760 Q560 850 650 700' },
  { symbol: '㇃', name: '卧钩', path: 'M220 500 Q350 780 700 700 Q800 680 760 560' },
]

export interface StrokeData {
  strokes: string[]
  medians: number[][][]
}

export type GridType = 'field' | 'rice'
export type InkColor = 'indigo' | 'black' | 'green' | 'red'

export const inkColors: Record<InkColor, string> = {
  indigo: '#4f46e5',
  black: '#111827',
  green: '#15803d',
  red: '#dc2626',
}
