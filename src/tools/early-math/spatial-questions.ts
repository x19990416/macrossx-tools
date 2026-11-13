export type NewGameId = 'rotate' | 'cubes' | 'measure' | 'weight' | 'code' | 'clues'
export interface ChoiceQuestion {
  title: string
  prompt: string
  diagram?: 'rotation' | 'stacks' | 'lines'
  example?: string
  options: readonly string[]
  answer: number
  hint: string
  explanation: string
}

export const questions: Record<NewGameId, readonly ChoiceQuestion[]> = {
  rotate: [
    {
      title: '位置变了',
      prompt: '把标记沿方格移动：先向右一格，再向下一格。它最后在哪？不转动箭头。',
      diagram: 'rotation',
      options: ['左上', '右上', '左下', '右下'],
      answer: 3,
      hint: '从左上角出发，用手指走两次，每次只跨一条格线。',
      explanation: '先到右上，再到右下。移动了位置，不等于改变了朝向。',
    },
    {
      title: '朝向变了',
      prompt: '标记留在原地，箭头像钟表指针一样转四分之一圈，最后朝哪里？',
      diagram: 'rotation',
      options: ['上', '右', '下', '左'],
      answer: 1,
      hint: '想象指针从钟面的 12 转到 3。',
      explanation: '箭头从朝上转为朝右，标记仍在左上角。',
    },
  ],
  cubes: [
    {
      title: '数每一层',
      prompt: '这是三摞积木，一摞紧挨一摞。每个盒格是一块，层与层间没有空隙。一共有几块？',
      diagram: 'stacks',
      options: ['3 块', '5 块', '6 块', '7 块'],
      answer: 2,
      hint: '别只数最上面的三块，看看每层分别有几块。',
      explanation: '下面 3 块，中间 2 块，上面 1 块，共 6 块。',
    },
    {
      title: '数被盖住的积木',
      prompt:
        '有两摞积木，左边高 3 块，右边高 2 块，都从桌面开始紧紧叠放。从正上方只看见两块顶面，总共有几块？',
      example: '左摞：3 层　｜　右摞：2 层',
      options: ['2 块', '3 块', '4 块', '5 块'],
      answer: 3,
      hint: '每个顶面下面都有积木，把两摞分别数完再合起来。',
      explanation: '顶面只是每摞的最上面一块。左 3 加右 2，共 5 块。',
    },
  ],
  measure: [
    {
      title: '铅笔排队',
      prompt: '用相同大小的格子量三支铅笔。从长到短怎么排？',
      diagram: 'lines',
      options: ['甲、乙、丙', '乙、丙、甲', '丙、甲、乙'],
      answer: 1,
      hint: '数铅笔跨过几格，不看它从哪格开始。',
      explanation: '乙跨 5 格，丙跨 4 格，甲跨 3 格。',
    },
    {
      title: '弯路也要数',
      prompt:
        '同样大的格子上，甲路线向右走 4 格；乙路线向右 2 格、向上 1 格、再向右 2 格。哪条路走得更远？',
      options: ['甲更远', '乙更远', '一样远'],
      answer: 1,
      hint: '每向相邻格走一步都算，拐弯也不例外。',
      explanation: '乙走了 5 格，甲走了 4 格。不能只比向右走了多少。',
    },
  ],
  weight: [
    {
      title: '看懂天平',
      prompt: '天平低的一端更重：苹果那边比梨低，梨那边又比桃低。谁最重？',
      example: '苹果比梨重；梨比桃重。',
      options: ['苹果', '梨', '桃'],
      answer: 0,
      hint: '先找到两个比较里都出现的水果。',
      explanation: '梨是中间的参照物。苹果比梨重，梨比桃重，所以苹果最重。',
    },
    {
      title: '同重也能推理',
      prompt: '橙子和梨放在天平两端，刚好平衡。梨比桃重。那么橙子和桃比呢？',
      options: ['橙子更重', '桃更重', '一样重'],
      answer: 0,
      hint: '天平平衡说明橙子和梨一样重。',
      explanation: '橙子和梨同重，都比桃重。',
    },
  ],
  code: [
    {
      title: '图形密码',
      prompt: '每个图形表示一位数字，从左到右读，不把它们加起来。三角、圆、方的密码是什么？',
      example: '圆 ○ → 2　方 □ → 1　三角 △ → 4',
      options: ['124', '421', '7', '412'],
      answer: 1,
      hint: '三角在最左边，所以密码先写 4。',
      explanation: '三角读 4，圆读 2，方读 1，连起来是 421。',
    },
    {
      title: '这次是等式',
      prompt: '两个相同的方块加起来是 4。一个方块加一颗星星是 5。一颗星星是多少？',
      example: '□ + □ = 4　　□ + ☆ = 5',
      options: ['1', '2', '3', '4'],
      answer: 2,
      hint: '先把 4 平分给两个方块，再看 5 里还差多少。',
      explanation: '每个方块是 2，星星是 5 减 2，也就是 3。这次有加号，所以不是把数字连读。',
    },
  ],
  clues: [
    {
      title: '同时符合两条线索',
      prompt: '小熊要找一个带条纹的圆形。哪张卡同时符合？',
      options: ['无条纹圆形', '带条纹方形', '带条纹圆形', '无条纹三角形'],
      answer: 2,
      hint: '先只找圆形，再看看找到的圆形里谁有条纹。',
      explanation: '先留下两个圆形，再排除没有条纹的那个。',
    },
    {
      title: '线索不够怎么办',
      prompt: '桌上有红色圆形、蓝色圆形和蓝色方形。现在只知道要找的是蓝色，能确定是哪一个吗？',
      options: ['蓝色圆形', '蓝色方形', '还不能确定'],
      answer: 2,
      hint: '把所有蓝色的都留下，数数还剩几个。',
      explanation: '有两个都符合「蓝色」。还需要一条与形状有关的线索。',
    },
  ],
}
