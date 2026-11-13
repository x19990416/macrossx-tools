<script setup lang="ts">
import { Download, Printer, RotateCcw, Sparkles } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import ToolLayout from '@/components/ToolLayout.vue'
import {
  generateWorksheets,
  problemText,
  type Operation,
  type Range,
  type WorksheetPage,
} from './generator'

const allSelections = ([20, 100] as const).flatMap((range) =>
  (['add', 'subtract', 'multiply', 'divide', 'mixed'] as const).map(
    (operation) => `${range}:${operation}`,
  ),
)
const selectedKeys = ref<string[]>([...allSelections])
const order = ref<'progressive' | 'random'>('progressive')
const pageCount = ref(1)
const includeAnswers = ref(false)
const pages = ref<WorksheetPage[]>([])
const status = ref('选择条件后生成练习册。')
const busy = ref(false)
const rangeOptions: Range[] = [20, 100]
const operationOptions: { value: Operation; label: string }[] = [
  { value: 'add', label: '加法 +' },
  { value: 'subtract', label: '减法 −' },
  { value: 'multiply', label: '乘法 ×' },
  { value: 'divide', label: '除法 ÷' },
  { value: 'mixed', label: '两步混合运算' },
]
const valid = computed(
  () =>
    selectedKeys.value.length > 0 &&
    Number.isInteger(pageCount.value) &&
    pageCount.value >= 1 &&
    pageCount.value <= 20,
)
watch(
  [selectedKeys, order, pageCount],
  () => {
    pages.value = []
    status.value = '条件已更改，请重新生成练习册。'
  },
  { deep: true },
)
function generate() {
  try {
    pages.value = generateWorksheets({
      selections: selectedKeys.value.map((key) => {
        const [range, operation] = key.split(':')
        return { range: Number(range) as Range, operation: operation as Operation }
      }),
      order: order.value,
      pageCount: pageCount.value,
    })
    status.value = `已生成 ${pages.value.length} 页、${pages.value.length * 24} 道题。`
  } catch (error) {
    status.value = error instanceof Error ? error.message : '生成失败，请调整条件。'
  }
}
function reset() {
  selectedKeys.value = [...allSelections]
  order.value = 'progressive'
  pageCount.value = 1
  includeAnswers.value = false
  pages.value = []
  status.value = '已恢复默认设置。'
}
function drawPage(page: WorksheetPage, index: number, answerPage: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 1240
  canvas.height = 1754
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('浏览器无法创建打印画布。')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 42px system-ui, sans-serif'
  ctx.fillText(answerPage ? '口算练习 · 答案' : '口算练习', 72, 105)
  ctx.font = '24px system-ui, sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText(`${page.title}  ·  第 ${index + 1} / ${pages.value.length} 页`, 72, 155)
  ctx.fillStyle = '#0f172a'
  ctx.font = '26px system-ui, sans-serif'
  ctx.fillText('姓名：________________    日期：________________    用时：________', 72, 226)
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(72, 260)
  ctx.lineTo(1168, 260)
  ctx.stroke()
  page.problems.forEach((problem, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 72 + col * 548
    const y = 345 + row * 110
    ctx.fillStyle = '#94a3b8'
    ctx.font = '22px system-ui, sans-serif'
    ctx.fillText(`${index * 24 + i + 1}.`, x, y)
    ctx.fillStyle = '#0f172a'
    ctx.font = `${problem.operation === 'mixed' ? 30 : 34}px system-ui, sans-serif`
    ctx.fillText(problemText(problem), x + 38, y)
    if (answerPage) ctx.fillText(String(problem.answer), x + 38, y + 43)
    else {
      ctx.strokeStyle = '#cbd5e1'
      ctx.beginPath()
      ctx.moveTo(x + 315, y + 14)
      ctx.lineTo(x + 435, y + 14)
      ctx.stroke()
    }
  })
  ctx.fillStyle = '#94a3b8'
  ctx.font = '20px system-ui, sans-serif'
  ctx.fillText('MacrossX Tools · 浏览器本地生成', 72, 1685)
  return canvas
}
async function exportPdf(print = false) {
  if (!pages.value.length || busy.value) return
  busy.value = true
  try {
    await document.fonts.ready
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
    let first = true
    for (const answerPage of [false, ...(includeAnswers.value ? [true] : [])]) {
      for (const [index, page] of pages.value.entries()) {
        if (!first) pdf.addPage('a4', 'portrait')
        first = false
        const canvas = drawPage(page, index, answerPage)
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.88), 'JPEG', 0, 0, 210, 297)
      }
    }
    if (print) {
      const blob = pdf.output('blob')
      const url = URL.createObjectURL(blob)
      const windowRef = window.open(url, '_blank')
      if (!windowRef) throw new Error('浏览器拦截了打印窗口，请允许弹窗或改用下载 PDF。')
      windowRef.opener = null
      setTimeout(() => URL.revokeObjectURL(url), 60000)
      status.value = '已打开 PDF，请在新窗口中打印。'
    } else {
      pdf.save('口算练习册.pdf')
      status.value = 'PDF 已下载。'
    }
  } catch (error) {
    status.value = error instanceof Error ? error.message : '导出失败，请重试。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <ToolLayout
    title="小学口算练习册"
    description="按学习阶段生成 A4 口算练习纸。按范围与运算自由组合，每页 24 题，可选循序渐进或随机混排。"
    privacy-text="题目生成与 PDF 导出均在当前浏览器中完成"
  >
    <div class="page-shell math-workspace pb-20">
      <section class="settings-panel" aria-labelledby="math-settings-title">
        <div class="panel-heading"><h2 id="math-settings-title">练习设置</h2></div>
        <fieldset class="math-field">
          <legend>选择练习组合（可多选）</legend>
          <div class="math-combination-grid">
            <div v-for="range in rangeOptions" :key="range" class="math-combination-group">
              <strong>{{ range }} 以内</strong>
              <div class="math-choice-row">
                <label v-for="option in operationOptions" :key="option.value" class="math-choice">
                  <input
                    v-model="selectedKeys"
                    type="checkbox"
                    :value="`${range}:${option.value}`"
                  />
                  {{ option.label }}
                </label>
              </div>
            </div>
          </div>
          <small>例如只勾选「20 以内加、减」与「100 以内乘、除」。</small>
        </fieldset>
        <fieldset class="math-field">
          <legend>题目排列</legend>
          <div class="math-choice-row">
            <label class="math-choice"
              ><input v-model="order" type="radio" value="progressive" /> 循序渐进</label
            >
            <label class="math-choice"
              ><input v-model="order" type="radio" value="random" /> 随机混排</label
            >
          </div>
        </fieldset>
        <label class="math-field" for="page-count"
          ><span>生成页数</span
          ><input
            id="page-count"
            v-model.number="pageCount"
            type="number"
            min="1"
            max="20"
            step="1"
          /><small>每页 24 题，最多 20 页；答案可附在末尾。</small></label
        >
        <label class="math-choice"
          ><input v-model="includeAnswers" type="checkbox" /> PDF 末尾附答案页</label
        >
        <p class="text-sm text-muted leading-6">
          默认综合练习含两步混合运算；一年级专项建议仅选加减。减法不出负数，除法只出表内整除题。
        </p>
        <div class="math-actions">
          <button class="math-primary" type="button" :disabled="!valid || busy" @click="generate">
            <Sparkles class="size-4" /> 生成练习册</button
          ><button class="math-secondary" type="button" :disabled="busy" @click="reset">
            <RotateCcw class="size-4" /> 重置
          </button>
        </div>
        <p role="status" aria-live="polite" class="text-sm text-muted">{{ status }}</p>
      </section>
      <section class="math-results" aria-labelledby="math-results-title">
        <div class="math-result-header">
          <h2 id="math-results-title">A4 页面预览</h2>
          <div class="math-actions">
            <button
              class="math-secondary"
              type="button"
              :disabled="!pages.length || busy"
              @click="exportPdf(false)"
            >
              <Download class="size-4" /> 下载 PDF</button
            ><button
              class="math-secondary"
              type="button"
              :disabled="!pages.length || busy"
              @click="exportPdf(true)"
            >
              <Printer class="size-4" /> 打印
            </button>
          </div>
        </div>
        <div v-if="!pages.length" class="empty-card">
          选择范围与运算，点击“生成练习册”查看预览。
        </div>
        <article v-for="(page, pageIndex) in pages" :key="pageIndex" class="math-sheet">
          <header>
            <h3>口算练习</h3>
            <p>{{ page.title }} · 第 {{ pageIndex + 1 }} / {{ pages.length }} 页</p>
            <div class="math-meta">姓名：__________ 日期：__________ 用时：______</div>
          </header>
          <ol class="math-problems" :start="pageIndex * 24 + 1">
            <li v-for="(problem, problemIndex) in page.problems" :key="problemIndex">
              <span>{{ pageIndex * 24 + problemIndex + 1 }}.</span> {{ problemText(problem) }}
              <span class="math-answer-line"></span>
            </li>
          </ol>
        </article>
      </section>
    </div>
  </ToolLayout>
</template>
<style scoped>
.math-workspace {
  display: grid;
  grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}
.math-field {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  border: 0;
  padding: 0;
  margin: 0;
}
.math-field legend,
.math-field > span {
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.65rem;
}
.math-combination-grid {
  display: grid;
  gap: 0.75rem;
}
.math-combination-group {
  display: grid;
  gap: 0.5rem;
}
.math-combination-group strong {
  font-size: 0.875rem;
}
.math-choice-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.math-choice {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
}
.math-choice input {
  accent-color: var(--primary);
}
.math-field input[type='number'] {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--background);
}
small {
  color: var(--muted);
}
.math-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.math-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  cursor: pointer;
}
.math-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.math-primary {
  background: var(--primary);
  color: white;
}
.math-secondary {
  background: var(--card);
  color: var(--foreground);
}
.math-results {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.math-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.math-result-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
}
.math-sheet {
  aspect-ratio: 210/297;
  background: #fff;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  box-shadow: 0 10px 35px #0f172a12;
  padding: 7%;
}
.math-sheet h3 {
  font-size: clamp(1rem, 2.5vw, 1.7rem);
  font-weight: 700;
}
.math-sheet p {
  color: #64748b;
  font-size: 0.8rem;
}
.math-meta {
  border-bottom: 1px solid #cbd5e1;
  padding: 1rem 0;
  font-size: 0.8rem;
}
.math-problems {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(12, 1fr);
  height: 78%;
  padding: 2rem 0 0;
  margin: 0;
  gap: 0.5rem;
}
.math-problems li {
  white-space: nowrap;
  font-size: clamp(0.65rem, 1.8vw, 1rem);
}
.math-problems li > span:first-child {
  color: #94a3b8;
}
.math-answer-line {
  display: inline-block;
  width: 20%;
  border-bottom: 1px solid #cbd5e1;
}
@media (max-width: 800px) {
  .math-workspace {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 420px) {
  .math-sheet {
    padding: 5%;
  }
  .math-problems {
    gap: 0.15rem;
  }
  .math-meta {
    font-size: 0.65rem;
  }
}
</style>
