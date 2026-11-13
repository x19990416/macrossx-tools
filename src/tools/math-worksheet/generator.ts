export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'mixed'
export type Range = 20 | 100
export interface Problem {
  left: number
  right: number
  operation: Operation
  answer: number
  third?: number
  firstOperation?: 'add' | 'subtract' | 'multiply' | 'divide'
  secondOperation?: 'add' | 'subtract'
}
export interface WorksheetPage {
  title: string
  problems: Problem[]
}
export interface WorksheetOptions {
  selections: { range: Range; operation: Operation }[]
  pageCount: number
  order: 'progressive' | 'random'
}

const symbols: Record<Exclude<Operation, 'mixed'>, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
}
export function problemText(problem: Problem) {
  if (problem.operation === 'mixed')
    return `${problem.left} ${symbols[problem.firstOperation!]} ${problem.right} ${symbols[problem.secondOperation!]} ${problem.third} =`
  return `${problem.left} ${symbols[problem.operation]} ${problem.right} =`
}
function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}
interface Stage {
  title: string
  range: Range
  kind: 'plain' | 'carry' | 'table' | 'mixed'
  operations: Operation[]
}
function stagesFor(options: WorksheetOptions): Stage[] {
  const stages: Stage[] = []
  const selected = (range: Range, operation: Operation) =>
    options.selections.some((item) => item.range === range && item.operation === operation)
  for (const range of [20, 100] as const) {
    const arithmetic = (['add', 'subtract'] as const).filter((op) => selected(range, op))
    if (arithmetic.length) {
      stages.push({
        title: `${range} 以内 · 基础加减`,
        range,
        kind: 'plain',
        operations: arithmetic,
      })
      stages.push({ title: `${range} 以内 · 进退位`, range, kind: 'carry', operations: arithmetic })
    }
  }
  for (const range of [20, 100] as const) {
    const tables = (['multiply', 'divide'] as const).filter((op) => selected(range, op))
    if (tables.length)
      stages.push({ title: `${range} 以内 · 表内乘除`, range, kind: 'table', operations: tables })
  }
  for (const range of [20, 100] as const) {
    if (selected(range, 'mixed'))
      stages.push({
        title: `${range} 以内 · 两步混合运算`,
        range,
        kind: 'mixed',
        operations: ['mixed'],
      })
  }
  return stages
}
function candidates(stage: Stage): Problem[] {
  const result: Problem[] = []
  for (const operation of stage.operations) {
    if (operation === 'mixed') {
      for (let a = 2; a <= 9; a++)
        for (let b = 2; b <= 9; b++)
          for (let c = 1; c <= (stage.range === 20 ? 12 : 30); c++) {
            const product = a * b
            for (const secondOperation of ['add', 'subtract'] as const) {
              const answer = secondOperation === 'add' ? product + c : product - c
              if (
                answer < 0 ||
                answer > stage.range ||
                product > stage.range ||
                (stage.range === 100 && answer <= 20)
              )
                continue
              result.push({
                left: a,
                right: b,
                third: c,
                operation,
                firstOperation: 'multiply',
                secondOperation,
                answer,
              })
              const divisionAnswer = secondOperation === 'add' ? b + c : b - c
              if (
                divisionAnswer >= 0 &&
                divisionAnswer <= stage.range &&
                (stage.range === 20 || divisionAnswer > 20)
              )
                result.push({
                  left: product,
                  right: a,
                  third: c,
                  operation,
                  firstOperation: 'divide',
                  secondOperation,
                  answer: divisionAnswer,
                })
            }
            const addThenSubtract = a + b - c
            if (
              addThenSubtract >= 0 &&
              addThenSubtract <= stage.range &&
              (stage.range === 20 || addThenSubtract > 20)
            )
              result.push({
                left: a,
                right: b,
                third: c,
                operation,
                firstOperation: 'add',
                secondOperation: 'subtract',
                answer: addThenSubtract,
              })
          }
    } else if (operation === 'add' || operation === 'subtract') {
      const min = stage.range === 20 ? 1 : 21
      for (let left = min; left <= stage.range; left++) {
        for (let right = 1; right <= stage.range; right++) {
          const answer = operation === 'add' ? left + right : left - right
          if (answer < 0 || answer > stage.range) continue
          const carry =
            operation === 'add' ? (left % 10) + (right % 10) >= 10 : left % 10 < right % 10
          if (carry !== (stage.kind === 'carry')) continue
          result.push({ left, right, operation, answer })
        }
      }
    } else {
      for (let factor = 2; factor <= 9; factor++) {
        for (let other = 2; other <= 9; other++) {
          const product = factor * other
          if (product > stage.range || (stage.range === 100 && product <= 20)) continue
          result.push(
            operation === 'multiply'
              ? { left: factor, right: other, operation, answer: product }
              : { left: product, right: factor, operation, answer: other },
          )
        }
      }
    }
  }
  return result
}
export function generateWorksheets(options: WorksheetOptions): WorksheetPage[] {
  if (
    !options.selections.length ||
    !['progressive', 'random'].includes(options.order) ||
    !Number.isInteger(options.pageCount) ||
    options.pageCount < 1 ||
    options.pageCount > 20
  )
    throw new Error('请选择范围、运算和 1–20 页。')
  const stages = stagesFor(options)
  const pools = stages.map((stage) => shuffle(candidates(stage)))
  if (pools.some((pool) => !pool.length))
    throw new Error('当前条件无法生成题目，请调整范围或运算。')
  const pages: WorksheetPage[] = []
  const total = options.pageCount * 24
  const seen = new Set<string>()
  const all: Problem[] = []
  for (let i = 0; i < total; i++) {
    const stageIndex = Math.min(stages.length - 1, Math.floor((i * stages.length) / total))
    const pool = pools[stageIndex]!
    let problem = pool.find(
      (item) =>
        !seen.has(
          `${item.operation}:${item.firstOperation}:${item.left}:${item.right}:${item.secondOperation}:${item.third}`,
        ),
    )
    if (!problem) problem = pool[i % pool.length]!
    seen.add(
      `${problem.operation}:${problem.firstOperation}:${problem.left}:${problem.right}:${problem.secondOperation}:${problem.third}`,
    )
    all.push(problem)
  }
  const ordered = options.order === 'random' ? shuffle(all) : all
  for (let i = 0; i < options.pageCount; i++) {
    const midpoint = (i * 24 + 12) / total
    const stage = stages[Math.min(stages.length - 1, Math.floor(midpoint * stages.length))]!
    pages.push({
      title:
        options.order === 'random'
          ? '随机混排练习'
          : stages.length > 1 && total / stages.length < 24
            ? '综合递进练习'
            : stage.title,
      problems: ordered.slice(i * 24, (i + 1) * 24),
    })
  }
  return pages
}
