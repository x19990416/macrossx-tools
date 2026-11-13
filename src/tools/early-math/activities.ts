import type { NewGameId } from './spatial-questions'

export type ActivityId =
  'sharing' | 'packing' | 'pattern' | 'sorting' | 'trail' | 'puzzle' | NewGameId | 'memory'

export const abilityDomains = {
  quantity: '数感与数量关系',
  pattern: '模式与规律',
  classification: '分类与推理',
  spatial: '空间方向与数感',
  composition: '图形与空间构成',
  measurement: '测量与比较',
  symbols: '符号与数量关系',
  memory: '顺序记忆（可选）',
} as const

interface AbilityTarget {
  id: string
  domain: keyof typeof abilityDomains
  goal: string
  observation: string
}

interface Activity {
  id: ActivityId
  name: string
  skill: string
  ability: AbilityTarget
  offline: string
}

export const activities: readonly Activity[] = [
  {
    id: 'sharing',
    name: '野餐分点心',
    skill: '公平分配',
    ability: {
      id: 'equal-sharing',
      domain: 'quantity',
      goal: '理解「公平」意味着每份一样多，并能判断剩余物品够不够再分一轮。',
      observation:
        '不提示分法时，孩子能不能自己分出一样多的几份，并检查每份数量？换成有剩余的一轮，能不能说明为什么不能继续每人分一块？',
    },
    offline:
      '下次准备水果时，请孩子给家里的人分一分，不提醒屏幕里用过的方法。看看他会不会主动检查每份是不是一样多。',
  },
  {
    id: 'packing',
    name: '积木找回家',
    skill: '一一对应',
    ability: {
      id: 'one-to-one',
      domain: 'quantity',
      goal: '理解一个物品对应一个位置，用一一配对发现缺少的数量。',
      observation: '孩子能不能逐个检查空位，并在收彩笔或摆餐具时，用同样的方法找出还缺几个？',
    },
    offline: '收彩笔时，试着在纸上画出每支笔的位置，请孩子查一查哪支笔还没回来。',
  },
  {
    id: 'pattern',
    name: '给小熊串手链',
    skill: '发现规律',
    ability: {
      id: 'pattern-extension',
      domain: 'pattern',
      goal: '找出重复的一组并接下去；进阶时能分别跟踪形状和颜色的规律。',
      observation:
        '基础关看孩子能不能指出重复的是哪一组，并用不同材料接出同样的规律；双规律关另看能不能分别说出形状和颜色怎么变。',
    },
    offline: '用拍手和跺脚做出同样的规律，请孩子接下去，或让孩子设计规律给你猜。',
  },
  {
    id: 'sorting',
    name: '分类小侦探',
    skill: '按属性分类',
    ability: {
      id: 'attribute-sorting',
      domain: 'classification',
      goal: '按指定属性分类，并在条件变化时排除上一轮规则的干扰。',
      observation:
        '同一组卡片从按形状改成按条纹后，孩子能不能独立重新选择，并说出一张卡片这次为什么选或不选？',
    },
    offline:
      '同一堆玩具，先按种类分一次，再按能不能放进小盒子分一次。问孩子：为什么有的玩具换组了？',
  },
  {
    id: 'trail',
    name: '跳格子地图',
    skill: '方向与步数',
    ability: {
      id: 'position-and-distance',
      domain: 'spatial',
      goal: '建立位置、方向和步数之间的关系，区分站在起点与走过一格。',
      observation:
        '给出方向和步数时，孩子能不能找到终点？换成只给起点和终点时，能不能独立说对方向和步数？',
    },
    offline:
      '用纸在地上摆出等距格子。请孩子给你发指令，再交换角色：从这里到那里，往哪边走、走几格？',
  },
  {
    id: 'puzzle',
    name: '拼图工坊',
    skill: '图形叠合与规则切换',
    ability: {
      id: 'grid-overlay',
      domain: 'composition',
      goal: '把两张图的同一位置对应起来，区分只在一张图出现和在两张图都出现的部分。',
      observation:
        '孩子能不能指出哪一格重叠，并解释为什么同样是重叠，第一轮要留着、第二轮却要去掉？换一组不同位置的方格，看看能不能沿用这个判断。',
    },
    offline:
      '画两张相同的九宫格，用纸片标记不同格子。请孩子在第三张空格纸拼出结果，再交换角色，让孩子定规则。',
  },
  {
    id: 'rotate',
    name: '格子转转',
    skill: '位置与朝向',
    ability: {
      id: 'position-vs-orientation',
      domain: 'composition',
      goal: '区分移动位置和旋转朝向。',
      observation: '孩子能否分别指出标记在哪里、箭头朝哪里，而不把两件事混在一起？',
    },
    offline: '用带箭头的纸片做一次平移，再原地转动，请孩子解释区别。',
  },
  {
    id: 'cubes',
    name: '积木楼梯',
    skill: '分层计数',
    ability: {
      id: 'count-by-layer',
      domain: 'composition',
      goal: '按层或按摞清点立体物体，知道只看顶面会漏掉下面的积木。',
      observation: '孩子能否说出每层有几块，再把各层合起来？',
    },
    offline: '搭两座高度不同的小积木塔，先俯视，再拆开逐层验证。',
  },
  {
    id: 'measure',
    name: '铅笔排队',
    skill: '长度与单位',
    ability: {
      id: 'unit-length',
      domain: 'measurement',
      goal: '用同一个单位比较不同起点的长度，知道拐弯后的每一段也要计入。',
      observation: '不把铅笔对齐时，孩子能否用跨过的格数比较，而不是只看末端？',
    },
    offline: '用同样大小的纸片量两件物品，也可以用线绳量弯路线。',
  },
  {
    id: 'weight',
    name: '天平比轻重',
    skill: '传递比较',
    ability: {
      id: 'weight-order',
      domain: 'measurement',
      goal: '用共同的参照物推断轻重，能理解平衡代表一样重。',
      observation: '不直接比较两件物品时，孩子能否借第三件解释轻重？',
    },
    offline: '用玩具天平做两次比较，问孩子哪两件东西其实不用再比。',
  },
  {
    id: 'code',
    name: '图形密码',
    skill: '编码与等量代换',
    ability: {
      id: 'symbol-mapping',
      domain: 'symbols',
      goal: '按图例逐位换成数字，并区分连读密码和代入算式。',
      observation: '换一套符号后，孩子能否先查图例再按顺序读？遇到加号会不会改为计算？',
    },
    offline: '画三种符号当玩具箱标签，让孩子设计编码表给家长解读。',
  },
  {
    id: 'clues',
    name: '线索找物品',
    skill: '多条件与排除',
    ability: {
      id: 'constraint-filter',
      domain: 'classification',
      goal: '筛出同时符合多个条件的物品，知道信息不足时不能唯一确定。',
      observation: '孩子能否解释为什么某物只符合一条还不够？能否主动提出需要再问一条线索？',
    },
    offline: '用家里的玩具玩猜物：先只给颜色，再补一个形状或大小线索。',
  },
  {
    id: 'memory',
    name: '记住图形顺序',
    skill: '顺序记忆 · 可选',
    ability: {
      id: 'sequence-recall',
      domain: 'memory',
      goal: '有意识地记住图形顺序并复现；不把记忆成绩当作数学推理能力。',
      observation: '孩子是否尝试念出、分组或用手指指过一遍？允许重看，不比较速度。',
    },
    offline: '先摆三件物品，请孩子看够后挡住，再在另一处摆出同样的顺序。',
  },
]

export const guests = ['小熊', '小兔', '小猫'] as const
export const beadSets = [
  [
    { mark: '●', name: '圆形' },
    { mark: '▲', name: '三角形' },
  ],
  [
    { mark: '★', name: '星形' },
    { mark: '■', name: '方形' },
  ],
] as const
export const pattern = [0, 1, 1] as const
