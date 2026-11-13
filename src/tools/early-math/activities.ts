export type ActivityId = 'sharing' | 'packing' | 'pattern'

interface Activity {
  id: ActivityId
  name: string
  skill: string
  source: { label: string; url: string }
  offline: string
}

export const activities: readonly Activity[] = [
  {
    id: 'sharing',
    name: '野餐分点心',
    skill: '公平分配',
    source: {
      label: '澳大利亚课程官网 · 野餐活动',
      url: 'https://www.australiancurriculum.edu.au/resources/work-samples/mathematics/foundation/ws04-lets-pack-a-picnic/',
    },
    offline:
      '下次准备水果时，请孩子给家里的人分一分，不提醒屏幕里用过的方法。看看他会不会主动检查每份是不是一样多。',
  },
  {
    id: 'packing',
    name: '积木找回家',
    skill: '一一对应',
    source: {
      label: '剑桥大学 NRICH · Tidying',
      url: 'https://nrich.maths.org/eyfs-activities/tidying',
    },
    offline: '收彩笔时，试着在纸上画出每支笔的位置，请孩子查一查哪支笔还没回来。',
  },
  {
    id: 'pattern',
    name: '给小熊串手链',
    skill: '发现规律',
    source: {
      label: '剑桥大学 NRICH · Pattern Making',
      url: 'https://nrich.maths.org/eyfs-activities/pattern-making',
    },
    offline: '用拍手和跺脚做出同样的规律，请孩子接下去，或让孩子设计规律给你猜。',
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
