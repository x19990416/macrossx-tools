<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

const cells = Array.from({ length: 9 }, (_, i) => i)
const rounds = [
  { first: [0, 3, 4], second: [1, 4, 7], overlap: 'keep' },
  { first: [1, 4, 5], second: [3, 4, 6], overlap: 'remove' },
] as const
const round = ref<0 | 1>(0)
const puzzle = computed(() => rounds[round.value])
const cards = computed(() => [
  { title: '第一张卡', filled: new Set<number>(puzzle.value.first) },
  { title: '第二张卡', filled: new Set<number>(puzzle.value.second) },
])
const answer = computed(() =>
  cells.filter((cell) => {
    const inFirst = (puzzle.value.first as readonly number[]).includes(cell)
    const inSecond = (puzzle.value.second as readonly number[]).includes(cell)
    return puzzle.value.overlap === 'keep' ? inFirst || inSecond : inFirst !== inSecond
  }),
)
const draft = ref<number[]>([])
const hint = ref(false)
const solved = ref(false)
const feedback = ref('')
const instructions = ref<HTMLElement>()

function cellName(cell: number) {
  return `第 ${Math.floor(cell / 3) + 1} 行第 ${(cell % 3) + 1} 列`
}

function reset() {
  draft.value = []
  hint.value = false
  solved.value = false
  feedback.value = ''
}

function toggle(cell: number) {
  draft.value = draft.value.includes(cell)
    ? draft.value.filter((item) => item !== cell)
    : [...draft.value, cell]
  solved.value = false
  feedback.value = ''
}

function check() {
  const missing = answer.value.filter((cell) => !draft.value.includes(cell)).length
  const extra = draft.value.filter((cell) => !answer.value.includes(cell)).length
  solved.value = !missing && !extra
  feedback.value = solved.value
    ? '拼对了！指一指，哪一格在两张卡上都有？为什么这一轮要这样处理它？'
    : [
        missing ? `还有 ${missing} 格没涂。` : '',
        extra ? `有 ${extra} 格涂多了。` : '',
        '把三张卡的同一位置对着看，可以再改。',
      ].join('')
}

async function changeRound() {
  round.value = round.value === 0 ? 1 : 0
  reset()
  await nextTick()
  instructions.value?.focus()
}
</script>

<template>
  <div class="mt-4 space-y-4">
    <div ref="instructions" tabindex="-1" class="space-y-2">
      <p class="text-sm font-semibold text-primary">
        {{ round === 0 ? '第一轮 · 有色就保留' : '第二轮 · 重叠要去掉' }}
      </p>
      <p class="leading-7">
        想象两张方格卡对齐叠起来。{{
          round === 0
            ? '只要有一张涂了颜色，结果就涂上。两张都涂的格子也保留。'
            : '只有一张涂了颜色的格子才保留。两张都涂的格子，这次要留白。'
        }}
      </p>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div v-for="card in cards" :key="card.title" class="space-y-2 rounded-xl border p-2 sm:p-3">
        <p class="text-sm font-semibold">{{ card.title }}</p>
        <div
          role="img"
          :aria-label="card.title + '涂色位置：' + [...card.filled].map(cellName).join('、')"
          class="grid max-w-48 grid-cols-3 gap-1"
        >
          <span
            v-for="cell in cells"
            :key="cell"
            class="aspect-square rounded-md border"
            :class="card.filled.has(cell) ? 'border-primary bg-primary' : 'bg-background'"
          />
        </div>
      </div>
      <div class="col-span-2 space-y-2 rounded-xl border p-2 sm:col-span-1 sm:p-3">
        <p id="puzzle-answer-title" class="text-sm font-semibold">我来拼 · 点格子涂色或擦掉</p>
        <div
          role="group"
          aria-labelledby="puzzle-answer-title"
          class="grid max-w-48 grid-cols-3 gap-1"
        >
          <button
            v-for="cell in cells"
            :key="cell"
            type="button"
            :aria-label="cellName(cell)"
            :aria-pressed="draft.includes(cell)"
            class="min-h-11 cursor-pointer rounded-md border bg-background aria-pressed:border-primary aria-pressed:bg-primary"
            @click="toggle(cell)"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="primary-button min-h-11" @click="check">检查一下</button>
      <button
        type="button"
        class="secondary-button min-h-11"
        aria-controls="puzzle-hint"
        :aria-expanded="hint"
        @click="hint = !hint"
      >
        {{ hint ? '收起提示' : '给个提示' }}
      </button>
      <button type="button" class="secondary-button min-h-11" @click="reset">重新拼</button>
    </div>
    <p v-show="hint" id="puzzle-hint" class="rounded-xl bg-primary-soft p-3 text-sm leading-6">
      先找正中间那格，两张卡上都涂了吗？{{
        round === 0 ? '想想这轮是不是要保留它。' : '这轮只保留恰好有一张涂色的格子。'
      }}
    </p>
    <div role="status">
      <p v-if="feedback" class="rounded-xl bg-primary-soft p-3 leading-7">{{ feedback }}</p>
    </div>
    <button
      v-if="solved || round === 1"
      type="button"
      class="secondary-button min-h-11"
      @click="changeRound"
    >
      {{ round === 0 ? '换个拼法再试' : '回到第一轮' }}
    </button>
  </div>
</template>
