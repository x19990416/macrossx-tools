export type Operation = 'add' | 'subtract' | 'multiply' | 'divide'
export type Range = 20 | 100
export interface Problem {
  left: number
  right: number
  operation: Operation
  answer: number
}
export interface WorksheetPage {
  title: string
  problems: Problem[]
}
export interface WorksheetOptions {
  ranges: Range[]
  operations: Operation[]
  pageCount: number
}

const symbols: Record<Operation, string> = { add: '+', subtract: '−', multiply: '×', divide: '÷' }
export function problemText(problem: Problem) {
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
  kind: 'plain' | 'carry' | 'table'
  operations: Operation[]
}
function stagesFor(options: WorksheetOptions): Stage[] {
  const stages: Stage[] = []
  const arithmetic = options.operations.filter((op) => op === 'add' || op === 'subtract')
  const tables = options.operations.filter((op) => op === 'multiply' || op === 'divide')
  for (const range of [20, 100] as const) {
    if (!options.ranges.includes(range)) continue
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
    if (options.ranges.includes(range) && tables.length)
      stages.push({ title: `${range} 以内 · 表内乘除`, range, kind: 'table', operations: tables })
  }
  return stages
}
function candidates(stage: Stage): Problem[] {
  const result: Problem[] = []
  for (const operation of stage.operations) {
    if (operation === 'add' || operation === 'subtract') {
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
    !options.ranges.length ||
    !options.operations.length ||
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
    let problem = pool.find((item) => !seen.has(`${item.operation}:${item.left}:${item.right}`))
    if (!problem) problem = pool[i % pool.length]!
    seen.add(`${problem.operation}:${problem.left}:${problem.right}`)
    all.push(problem)
  }
  for (let i = 0; i < options.pageCount; i++) {
    const midpoint = (i * 24 + 12) / total
    const stage = stages[Math.min(stages.length - 1, Math.floor(midpoint * stages.length))]!
    pages.push({
      title: stages.length > 1 && total / stages.length < 24 ? '综合递进练习' : stage.title,
      problems: all.slice(i * 24, (i + 1) * 24),
    })
  }
  return pages
}
