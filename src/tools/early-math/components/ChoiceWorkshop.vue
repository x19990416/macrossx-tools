<script setup lang="ts">
import { ArrowUp } from '@lucide/vue'
import { computed, nextTick, ref } from 'vue'
import { questions, type NewGameId } from '../spatial-questions'

const props = defineProps<{ game: NewGameId }>()
const round = ref(0)
const question = computed(() => questions[props.game][round.value]!)
const choice = ref<number>()
const hint = ref(false)
const result = ref('')
const solved = ref(false)
const heading = ref<HTMLElement>()
const rows = [
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
]
const pencils = [
  { name: '甲', start: 1, length: 3 },
  { name: '乙', start: 0, length: 5 },
  { name: '丙', start: 1, length: 4 },
]

function reset() {
  choice.value = undefined
  hint.value = false
  result.value = ''
  solved.value = false
}

function select(index: number) {
  choice.value = index
  result.value = ''
  solved.value = false
}

function check() {
  solved.value = choice.value === question.value.answer
  result.value =
    choice.value === undefined
      ? '先选一个答案。'
      : solved.value
        ? '答对了！' + question.value.explanation
        : '还不对。可以看看提示，再试一次。'
}

async function changeRound() {
  round.value = round.value === 0 ? 1 : 0
  reset()
  await nextTick()
  heading.value?.focus()
}
</script>

<template>
  <div class="mt-4 space-y-4">
    <h3 ref="heading" tabindex="-1" class="text-lg font-bold">{{ question.title }}</h3>
    <p class="leading-7">{{ question.prompt }}</p>
    <p v-if="question.example" class="rounded-xl bg-primary-soft p-3 leading-7">
      {{ question.example }}
    </p>
    <div
      v-if="question.diagram === 'rotation'"
      role="img"
      aria-label="两行两列的格子，左上角有一个向上的箭头"
      class="grid w-32 grid-cols-2 gap-1"
    >
      <span
        v-for="cell in 4"
        :key="cell"
        class="grid aspect-square place-items-center rounded-lg border bg-primary-soft"
      >
        <ArrowUp v-if="cell === 1" aria-hidden="true" class="size-7 text-primary" />
      </span>
    </div>
    <div
      v-if="question.diagram === 'stacks'"
      role="img"
      aria-label="从左到右三摞积木，分别高一层、两层、三层"
      class="grid w-36 gap-1"
    >
      <div v-for="(row, index) in rows" :key="index" class="grid grid-cols-3 gap-1">
        <span
          v-for="height in row"
          :key="height"
          class="aspect-square rounded-md border"
          :class="height >= 3 - index ? 'border-primary bg-primary-soft shadow-sm' : 'invisible'"
        />
      </div>
    </div>
    <div
      v-if="question.diagram === 'lines'"
      role="img"
      aria-label="同样大小的方格中，甲尺跨三格，乙跨五格，丙跨四格"
      class="max-w-xs space-y-2"
    >
      <div v-for="pencil in pencils" :key="pencil.name" class="flex items-center gap-2">
        <span>{{ pencil.name }}</span>
        <div class="grid flex-1 grid-cols-6 rounded border">
          <span
            v-for="cell in 6"
            :key="cell"
            class="h-7 border-r last:border-r-0"
            :class="
              cell > pencil.start && cell <= pencil.start + pencil.length
                ? 'bg-primary'
                : 'bg-background'
            "
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2" role="group" aria-label="选择答案">
      <button
        v-for="(option, index) in question.options"
        :key="option"
        type="button"
        :aria-pressed="choice === index"
        class="min-h-11 cursor-pointer rounded-xl border p-2 text-sm font-semibold aria-pressed:border-primary aria-pressed:bg-primary-soft"
        @click="select(index)"
      >
        {{ option }}
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="primary-button min-h-11" @click="check">检查一下</button>
      <button
        type="button"
        class="secondary-button min-h-11"
        aria-controls="workshop-hint"
        :aria-expanded="hint"
        @click="hint = !hint"
      >
        {{ hint ? '收起提示' : '给个提示' }}
      </button>
      <button type="button" class="secondary-button min-h-11" @click="reset">重新选</button>
    </div>
    <p v-show="hint" id="workshop-hint" class="rounded-xl bg-primary-soft p-3 text-sm leading-6">
      {{ question.hint }}
    </p>
    <div role="status">
      <p v-if="result" class="rounded-xl bg-primary-soft p-3 leading-7">{{ result }}</p>
    </div>
    <button
      v-if="solved || round === 1"
      type="button"
      class="secondary-button min-h-11"
      @click="changeRound"
    >
      {{ round === 0 ? '换一题再试' : '回到第一题' }}
    </button>
  </div>
</template>
