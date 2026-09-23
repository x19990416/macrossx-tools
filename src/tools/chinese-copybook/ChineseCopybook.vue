<script setup lang="ts">
import {
  BookOpenText,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Printer,
  RotateCcw,
} from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import ToolLayout from '@/components/ToolLayout.vue'

import CharacterGrid from './components/CharacterGrid.vue'
import {
  gradeOneUpper,
  inkColors,
  strokePracticeItems,
  type GridType,
  type InkColor,
  type StrokeData,
} from './copybook-data'

const input = ref('一二三')
const gridType = ref<GridType>('field')
const gridColor = ref<InkColor>('indigo')
const inkColor = ref<InkColor>('black')
const traceOpacity = ref(0.22)
const pageTitle = ref('姓名：__________  日期：__________')
const gradeOpen = ref(true)
const strokeOpen = ref(false)
const selectedStrokeSymbols = ref<string[]>([])
const strokeData = ref<Record<string, StrokeData | null>>({})
const statusMessage = ref('')
const isExporting = ref(false)
const isPrinting = ref(false)
const cellsPerRow = 12
const rowsPerPage = 17
const strokePracticeMap = new Map(strokePracticeItems.map((item) => [item.symbol, item]))

function extractChineseCharacters(value: string) {
  return Array.from(value).filter((character) => /[\u3400-\u9fff]/u.test(character))
}

const characters = computed(() => [
  ...extractChineseCharacters(input.value),
  ...selectedStrokeSymbols.value,
])
const selectedCharacters = computed(() => new Set(characters.value))

function toggleCharacter(character: string) {
  if (strokePracticeMap.has(character)) {
    const current = [...selectedStrokeSymbols.value]
    const index = current.indexOf(character)
    if (index >= 0) current.splice(index, 1)
    else current.push(character)
    selectedStrokeSymbols.value = current
    return
  }

  const current = extractChineseCharacters(input.value)
  const index = current.indexOf(character)
  if (index >= 0) current.splice(index, 1)
  else current.push(character)
  input.value = current.join('')
}

function loadGradeCharacters() {
  input.value = gradeOneUpper
  selectedStrokeSymbols.value = []
  statusMessage.value = `已载入全部 ${gradeOneUpper.length} 个生字，点击单字仍可添加或移除。`
}

function loadStrokePractice() {
  input.value = ''
  selectedStrokeSymbols.value = strokePracticeItems.map((item) => item.symbol)
  statusMessage.value = `已载入全部 ${strokePracticeItems.length} 种常用笔画，可单独点选调整。`
}

function resetSettings() {
  input.value = '一二三'
  selectedStrokeSymbols.value = []
  gridType.value = 'field'
  gridColor.value = 'indigo'
  inkColor.value = 'black'
  traceOpacity.value = 0.22
  pageTitle.value = '姓名：__________  日期：__________'
  statusMessage.value = '已恢复默认设置。'
}

async function loadStrokeData(character: string) {
  if (character in strokeData.value) return
  if (strokePracticeMap.has(character)) {
    strokeData.value[character] = null
    return
  }
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}strokes/${encodeURIComponent(character)}.json`,
    )
    if (!response.ok) throw new Error('not found')
    strokeData.value[character] = (await response.json()) as StrokeData
  } catch {
    strokeData.value[character] = null
  }
}

interface ExportLine {
  character: string
  continuation: boolean
  data: StrokeData | null
  cellOffset: number
}

function createExportLines(): ExportLine[] {
  return characters.value.flatMap((character) => {
    const data = strokeData.value[character] ?? null
    const usedCells = 1 + progressionCellCount(character)
    const lineCount = Math.ceil(usedCells / cellsPerRow)
    return Array.from({ length: lineCount }, (_, index) => ({
      character,
      continuation: index > 0,
      data,
      cellOffset: index * cellsPerRow,
    }))
  })
}

function drawGrid(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const color = inkColors[gridColor.value]
  context.save()
  context.fillStyle = '#ffffff'
  context.fillRect(x, y, size, size)
  context.strokeStyle = color
  context.lineWidth = 2
  context.setLineDash([])
  context.strokeRect(x, y, size, size)

  context.globalAlpha = 0.45
  context.lineWidth = 1.2
  context.setLineDash([5, 5])
  context.beginPath()
  context.moveTo(x + size / 2, y)
  context.lineTo(x + size / 2, y + size)
  context.moveTo(x, y + size / 2)
  context.lineTo(x + size, y + size / 2)
  if (gridType.value === 'rice') {
    context.moveTo(x, y)
    context.lineTo(x + size, y + size)
    context.moveTo(x + size, y)
    context.lineTo(x, y + size)
  }
  context.stroke()
  context.restore()
}

function drawPracticeStroke(
  context: CanvasRenderingContext2D,
  path: string,
  x: number,
  y: number,
  size: number,
  opacity: number,
) {
  const padding = size * 0.08
  const scale = (size - padding * 2) / 1000
  context.save()
  context.globalAlpha = opacity
  context.strokeStyle = inkColors[inkColor.value]
  context.lineWidth = 72
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.translate(x + padding, y + padding)
  context.scale(scale, scale)
  context.stroke(new Path2D(path))
  context.restore()
}

function drawCharacter(
  context: CanvasRenderingContext2D,
  character: string,
  data: StrokeData | null,
  visibleStrokes: number | undefined,
  x: number,
  y: number,
  size: number,
  opacity: number,
) {
  const practiceItem = strokePracticeMap.get(character)
  if (practiceItem) {
    drawPracticeStroke(context, practiceItem.path, x, y, size, opacity)
    return
  }

  context.save()
  context.globalAlpha = opacity
  context.fillStyle = inkColors[inkColor.value]

  if (data) {
    const padding = size * 0.07
    const scale = (size - padding * 2) / 1024
    context.translate(x + padding, y + padding + 900 * scale)
    context.scale(scale, -scale)
    const strokes =
      visibleStrokes === undefined ? data.strokes : data.strokes.slice(0, visibleStrokes)
    strokes.forEach((stroke) => context.fill(new Path2D(stroke)))
  } else {
    context.font = `${Math.round(size * 0.72)}px KaiTi, STKaiti, serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(character, x + size / 2, y + size / 2)
  }
  context.restore()
}

function drawPdfPage(
  lines: ExportLine[],
  pageNumber: number,
  totalPages: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 2100
  canvas.height = 2970
  const context = canvas.getContext('2d')
  if (!context) throw new Error('无法创建 PDF 画布')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#4f46e5'
  context.font = '700 24px system-ui, sans-serif'
  context.fillText('汉字规范书写练习', 100, 84)
  context.fillStyle = '#111827'
  context.font = '700 54px system-ui, sans-serif'
  context.fillText('示字 · 笔顺描红 · 临写', 100, 150)
  context.font = '28px system-ui, sans-serif'
  context.textAlign = 'right'
  context.fillText(pageTitle.value, 2000, 146)
  context.strokeStyle = '#111827'
  context.lineWidth = 5
  context.beginPath()
  context.moveTo(100, 190)
  context.lineTo(2000, 190)
  context.stroke()

  const labelX = 70
  const gridX = 260
  const gridSize = 145
  const rowGap = 4
  const startY = 270

  lines.forEach((line, rowIndex) => {
    const y = startY + rowIndex * (gridSize + rowGap)
    context.fillStyle = '#111827'
    context.textAlign = 'center'
    if (!line.continuation) {
      context.font = '54px KaiTi, STKaiti, serif'
      const practiceItem = strokePracticeMap.get(line.character)
      if (practiceItem) {
        drawPracticeStroke(context, practiceItem.path, labelX + 16, y + 2, 58, 1)
      } else {
        context.fillText(line.character, labelX + 45, y + 54)
      }
      context.fillStyle = '#64748b'
      context.font = '20px system-ui, sans-serif'
      context.fillText(
        strokePracticeMap.get(line.character)?.name ??
          (line.data ? `${line.data.strokes.length} 画` : '描红'),
        labelX + 45,
        y + 82,
      )
    } else {
      context.fillStyle = '#64748b'
      context.font = '20px system-ui, sans-serif'
      context.fillText('续', labelX + 45, y + 54)
    }

    for (let cellIndex = 0; cellIndex < cellsPerRow; cellIndex += 1) {
      const x = gridX + cellIndex * gridSize
      drawGrid(context, x, y, gridSize)
      const globalCellIndex = line.cellOffset + cellIndex
      if (globalCellIndex === 0) {
        drawCharacter(context, line.character, line.data, undefined, x, y, gridSize, 1)
      } else if (globalCellIndex <= progressionCellCount(line.character)) {
        drawCharacter(
          context,
          line.character,
          line.data,
          line.data ? globalCellIndex : undefined,
          x,
          y,
          gridSize,
          traceOpacity.value,
        )
      }
    }
  })

  context.fillStyle = '#64748b'
  context.font = '20px system-ui, sans-serif'
  context.textAlign = 'right'
  context.fillText(`第 ${pageNumber} / ${totalPages} 页 · A4 竖向`, 2000, 2900)
  return canvas
}

async function exportPdf() {
  if (characters.value.length === 0) {
    statusMessage.value = '请先输入至少一个汉字。'
    return
  }

  isExporting.value = true
  statusMessage.value = '正在生成 PDF，请稍候……'
  try {
    await Promise.all(characters.value.map((character) => loadStrokeData(character)))
    await document.fonts.ready
    const lines = createExportLines()
    const totalPages = Math.ceil(lines.length / rowsPerPage)
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
      if (pageIndex > 0) pdf.addPage('a4', 'portrait')
      const canvas = drawPdfPage(
        lines.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage),
        pageIndex + 1,
        totalPages,
      )
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.96), 'JPEG', 0, 0, 210, 297, undefined, 'FAST')
    }

    const date = new Date().toISOString().slice(0, 10)
    pdf.save(`汉字字帖-${date}.pdf`)
    statusMessage.value = `PDF 已生成，共 ${totalPages} 页。`
  } catch (error: unknown) {
    statusMessage.value =
      error instanceof Error ? `生成失败：${error.message}` : '生成 PDF 失败，请重试。'
  } finally {
    isExporting.value = false
  }
}

async function printCopybook() {
  if (characters.value.length === 0) {
    statusMessage.value = '请先输入至少一个汉字。'
    return
  }

  isPrinting.value = true
  statusMessage.value = '正在准备打印内容……'
  try {
    await Promise.all(characters.value.map((character) => loadStrokeData(character)))
    await document.fonts.ready
    statusMessage.value = '打印内容已准备完成。'
    window.print()
  } catch (error: unknown) {
    statusMessage.value =
      error instanceof Error ? `打印失败：${error.message}` : '打印失败，请重试。'
  } finally {
    isPrinting.value = false
  }
}

function progressionCellCount(character: string) {
  return strokeData.value[character]?.strokes.length ?? (strokePracticeMap.has(character) ? 5 : 1)
}

function blankCellCount(character: string) {
  const usedCells = 1 + progressionCellCount(character)
  return Math.ceil(usedCells / cellsPerRow) * cellsPerRow - usedCells
}

watch(characters, (items) => items.forEach((character) => void loadStrokeData(character)), {
  immediate: true,
})
</script>

<template>
  <ToolLayout
    title="汉字字帖生成器"
    description="先展示完整示字，再按笔顺逐格增加浅色笔画，留给练习者描红；每行自动补满田字格。"
  >
    <section class="page-shell no-print pb-8 sm:pb-12">
      <div class="copybook-workspace">
        <form class="settings-panel" @submit.prevent>
          <div class="panel-heading">
            <div>
              <p class="section-kicker">生成设置</p>
              <h2>定制练字内容</h2>
            </div>
            <button class="secondary-button" type="button" @click="resetSettings">
              <RotateCcw class="size-4" aria-hidden="true" /> 重置
            </button>
          </div>

          <div class="form-field">
            <div class="flex items-end justify-between gap-4">
              <label for="copybook-characters">输入汉字</label
              ><span>已载入 {{ characters.length }} 个</span>
            </div>
            <textarea
              id="copybook-characters"
              v-model="input"
              rows="3"
              placeholder="例如：春风花草"
            />
            <p>支持汉字和基础笔画；超过一页时按每页最多 17 行自动分页。</p>
          </div>

          <div class="setting-grid">
            <fieldset>
              <legend>格子类型</legend>
              <label class="option-card" :class="{ selected: gridType === 'field' }">
                <input v-model="gridType" type="radio" value="field" /><span>田字格</span
                ><Check v-if="gridType === 'field'" class="size-4" />
              </label>
              <label class="option-card" :class="{ selected: gridType === 'rice' }">
                <input v-model="gridType" type="radio" value="rice" /><span>米字格</span
                ><Check v-if="gridType === 'rice'" class="size-4" />
              </label>
            </fieldset>

            <fieldset>
              <legend>格线颜色</legend>
              <div class="color-options">
                <label
                  v-for="color in ['indigo', 'black', 'green', 'red'] as InkColor[]"
                  :key="color"
                >
                  <input v-model="gridColor" type="radio" :value="color" /><span
                    :style="{ background: inkColors[color] }"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>文字颜色</legend>
              <div class="color-options">
                <label
                  v-for="color in ['black', 'indigo', 'green', 'red'] as InkColor[]"
                  :key="color"
                >
                  <input v-model="inkColor" type="radio" :value="color" /><span
                    :style="{ background: inkColors[color] }"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset class="range-setting">
              <legend>描红深浅</legend>
              <input
                v-model.number="traceOpacity"
                aria-label="描红深浅"
                type="range"
                min="0.08"
                max="0.45"
                step="0.01"
              />
              <div class="range-labels"><span>浅</span><span>深</span></div>
            </fieldset>
          </div>

          <div class="form-field">
            <label for="copybook-title">自定义页头</label>
            <input id="copybook-title" v-model="pageTitle" type="text" maxlength="40" />
          </div>

          <div class="action-row">
            <a class="primary-button" href="#copybook-preview"
              ><Eye class="size-4" aria-hidden="true" /> 预览字帖</a
            >
            <button class="print-button" type="button" :disabled="isExporting" @click="exportPdf">
              <Download class="size-4" aria-hidden="true" />
              {{ isExporting ? '正在生成 PDF…' : '下载 PDF 文件' }}
            </button>
            <button
              class="secondary-button"
              type="button"
              :disabled="isPrinting"
              @click="printCopybook"
            >
              <Printer class="size-4" aria-hidden="true" />
              {{ isPrinting ? '正在准备…' : '打印字帖' }}
            </button>
          </div>
          <p v-if="statusMessage" class="status-message" role="status">{{ statusMessage }}</p>
        </form>

        <aside class="grade-panel">
          <button
            class="grade-panel-heading"
            type="button"
            :aria-expanded="gradeOpen"
            @click="gradeOpen = !gradeOpen"
          >
            <span><BookOpenText class="size-5" aria-hidden="true" /> 一年级上册常用字</span>
            <ChevronDown class="size-5 transition-transform" :class="{ 'rotate-180': gradeOpen }" />
          </button>
          <div v-show="gradeOpen" class="grade-content">
            <p>点击单个汉字即可添加或移除，也可以一键载入本册全部生字。</p>
            <div class="character-picker">
              <button
                v-for="character in gradeOneUpper"
                :key="character"
                type="button"
                :class="{ selected: selectedCharacters.has(character) }"
                :aria-pressed="selectedCharacters.has(character)"
                @click="toggleCharacter(character)"
              >
                {{ character }}
              </button>
            </div>
            <button
              class="secondary-button w-full justify-center"
              type="button"
              @click="loadGradeCharacters"
            >
              载入全部生字
            </button>
          </div>

          <div class="stroke-section">
            <button
              class="grade-panel-heading"
              type="button"
              :aria-expanded="strokeOpen"
              @click="strokeOpen = !strokeOpen"
            >
              <span><BookOpenText class="size-5" aria-hidden="true" /> 基础笔画练习</span>
              <ChevronDown
                class="size-5 transition-transform"
                :class="{ 'rotate-180': strokeOpen }"
              />
            </button>
            <div v-show="strokeOpen" class="grade-content">
              <p>共 32 种常用笔画，点击单个笔画即可添加或移除。</p>
              <div class="stroke-picker">
                <button
                  v-for="item in strokePracticeItems"
                  :key="item.symbol"
                  type="button"
                  :class="{ selected: selectedCharacters.has(item.symbol) }"
                  :aria-pressed="selectedCharacters.has(item.symbol)"
                  :title="item.name"
                  @click="toggleCharacter(item.symbol)"
                >
                  <svg viewBox="0 0 1000 1000" aria-hidden="true">
                    <path
                      :d="item.path"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="72"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ item.name }}</span>
                </button>
              </div>
              <button
                class="secondary-button w-full justify-center"
                type="button"
                @click="loadStrokePractice"
              >
                载入全部 32 种笔画
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section id="copybook-preview" class="preview-section" aria-labelledby="preview-heading">
      <div class="page-shell">
        <div class="preview-toolbar no-print">
          <div>
            <p class="section-kicker">实时预览</p>
            <h2 id="preview-heading">A4 竖向字帖</h2>
          </div>
          <p><FileText class="size-4" aria-hidden="true" /> 支持下载 PDF，也可调用系统打印机</p>
        </div>

        <div class="paper-wrap">
          <article class="copybook-paper">
            <header>
              <div>
                <span class="paper-brand">汉字规范书写练习</span>
                <h2>示字 · 笔顺描红 · 临写</h2>
              </div>
              <p>{{ pageTitle }}</p>
            </header>

            <div v-if="characters.length" class="practice-list">
              <section
                v-for="(character, rowIndex) in characters"
                :key="`${character}-${rowIndex}`"
                class="practice-row"
              >
                <div class="character-label">
                  <svg
                    v-if="strokePracticeMap.has(character)"
                    viewBox="0 0 1000 1000"
                    aria-hidden="true"
                  >
                    <path
                      :d="strokePracticeMap.get(character)?.path"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="72"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <strong v-else>{{ character }}</strong>
                  <span v-if="strokePracticeMap.has(character)">{{
                    strokePracticeMap.get(character)?.name
                  }}</span>
                  <span v-else-if="strokeData[character]"
                    >{{ strokeData[character]?.strokes.length }} 画</span
                  >
                  <span v-else>描红</span>
                </div>
                <div class="practice-cells">
                  <CharacterGrid
                    :character="character"
                    :data="strokeData[character] ?? undefined"
                    :practice-path="strokePracticeMap.get(character)?.path"
                    :grid-type="gridType"
                    :grid-color="inkColors[gridColor]"
                    :ink-color="inkColors[inkColor]"
                  />
                  <template v-if="strokeData[character]">
                    <CharacterGrid
                      v-for="step in strokeData[character]?.strokes.length"
                      :key="`step-${step}`"
                      :character="character"
                      :data="strokeData[character] ?? undefined"
                      :practice-path="strokePracticeMap.get(character)?.path"
                      :visible-strokes="step"
                      :grid-type="gridType"
                      :grid-color="inkColors[gridColor]"
                      :ink-color="inkColors[inkColor]"
                      :opacity="traceOpacity"
                    />
                  </template>
                  <template v-else>
                    <CharacterGrid
                      v-for="index in progressionCellCount(character)"
                      :key="`trace-${index}`"
                      :character="character"
                      :practice-path="strokePracticeMap.get(character)?.path"
                      :grid-type="gridType"
                      :grid-color="inkColors[gridColor]"
                      :ink-color="inkColors[inkColor]"
                      :opacity="traceOpacity"
                    />
                  </template>
                  <CharacterGrid
                    v-for="index in blankCellCount(character)"
                    :key="`blank-${index}`"
                    character=""
                    :grid-type="gridType"
                    :grid-color="inkColors[gridColor]"
                    :ink-color="inkColors[inkColor]"
                  />
                </div>
              </section>
            </div>
            <div v-else class="paper-empty">
              <BookOpenText class="size-8" aria-hidden="true" />
              <p>输入汉字后，这里会生成可直接下载为 PDF 的练字内容。</p>
            </div>
            <footer>A4 竖向 · 210 × 297 mm · 每页最多 17 行</footer>
          </article>
        </div>
      </div>
    </section>
  </ToolLayout>
</template>
