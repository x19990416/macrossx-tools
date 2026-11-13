<script setup lang="ts">
import { ArrowLeft, ArrowRight, Rabbit } from '@lucide/vue'
import { computed, ref } from 'vue'

const reverse = ref(false)
const example = ref(false)
const start = computed(() => (reverse.value ? 6 : 2))
const target = computed(() => (reverse.value ? 3 : 5))
const position = ref(start.value)
const moves = ref<number[]>([])
const notice = ref('')
const solved = ref(false)
const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8]

function reset() {
  position.value = start.value
  moves.value = []
  notice.value = ''
  solved.value = false
}

function step(delta: -1 | 1) {
  const next = position.value + delta
  if (next < 0 || next > 8) return
  position.value = next
  moves.value.push(delta)
  notice.value = ''
  solved.value = false
}

function undo() {
  const move = moves.value.pop()
  if (move === undefined) return
  position.value -= move
  notice.value = ''
  solved.value = false
}

function check() {
  const direction = reverse.value ? -1 : 1
  solved.value = false
  if (!moves.value.length) notice.value = '小兔还在起点，先让它走一格。'
  else if (moves.value.some((move) => move !== direction)) {
    notice.value = `有一步走反了。这次只往${reverse.value ? '左' : '右'}走，可以撤回或重走。`
  } else if (position.value !== target.value) {
    notice.value = moves.value.length < 3 ? '还没走够，试着再走。' : '走过头了，可以撤回一步。'
  } else {
    solved.value = true
    notice.value = `到了！从 ${start.value} 到 ${target.value}，向${reverse.value ? '左' : '右'}走了 3 格。起点不算一步。`
  }
}

function changeTask() {
  reverse.value = !reverse.value
  example.value = false
  reset()
}
</script>

<template>
  <div class="mt-3 space-y-4">
    <p class="leading-7">
      {{
        reverse
          ? '小兔从 6 出发，要到 3。该向哪边走？走几格？'
          : '小兔从 2 出发，向右跳 3 格。它会到哪儿？'
      }}
    </p>
    <button
      type="button"
      class="secondary-button min-h-11"
      aria-controls="trail-example"
      :aria-expanded="example"
      @click="example = !example"
    >
      {{ example ? '收起示范' : '看个示范' }}
    </button>
    <p v-show="example" id="trail-example" class="rounded-xl bg-primary-soft p-3 leading-7">
      从 0 到 1 是第 1 格，再从 1 到 2 是第 2 格：<strong>0 → 1 → 2</strong>。站在 0 不算走了一格。
    </p>
    <div class="grid grid-cols-9 gap-0.5 sm:gap-2" aria-label="从 0 到 8 的等距格子">
      <div
        v-for="cell in cells"
        :key="cell"
        class="flex min-w-0 flex-col items-center justify-end gap-1 rounded-lg border py-2"
        :class="{ 'border-primary bg-primary-soft': cell === position }"
      >
        <Rabbit v-if="cell === position" aria-hidden="true" class="size-4 text-primary sm:size-6" />
        <span v-else class="h-4 sm:h-6" aria-hidden="true"></span>
        <span class="text-sm font-semibold">{{ cell }}</span>
      </div>
    </div>
    <p role="status" class="text-sm text-muted">
      小兔在 {{ position }}，走了 {{ moves.length }} 步。
    </p>
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="secondary-button min-h-11"
        :disabled="position === 0"
        @click="step(-1)"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />向左一格
      </button>
      <button
        type="button"
        class="secondary-button min-h-11"
        :disabled="position === 8"
        @click="step(1)"
      >
        向右一格<ArrowRight class="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="secondary-button min-h-11"
        :disabled="moves.length === 0"
        @click="undo"
      >
        撤回一步
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="primary-button min-h-11" @click="check">检查一下</button>
      <button type="button" class="secondary-button min-h-11" @click="reset">重新走</button>
    </div>
    <div role="status">
      <p v-if="notice" class="rounded-xl bg-primary-soft p-3 leading-7">{{ notice }}</p>
    </div>
    <button
      v-if="solved || reverse"
      type="button"
      class="secondary-button min-h-11"
      @click="changeTask"
    >
      {{ reverse ? '回到第一轮' : '换个方向再试' }}
    </button>
  </div>
</template>
