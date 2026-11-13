<script setup lang="ts">
import { computed, ref } from 'vue'

const tokens = ['○ 圆形', '△ 三角形', '□ 方形'] as const
const sequences = [
  [0, 2, 1],
  [1, 0, 2, 0],
] as const
const round = ref<0 | 1>(0)
const sequence = computed(() => sequences[round.value])
const hidden = ref(false)
const picks = ref<number[]>([])
const result = ref('')
const solved = ref(false)

function restart() {
  hidden.value = false
  picks.value = []
  result.value = ''
  solved.value = false
}

function pick(index: number) {
  if (picks.value.length >= sequence.value.length) return
  picks.value.push(index)
  result.value = ''
  solved.value = false
}

function undo() {
  picks.value.pop()
  result.value = ''
  solved.value = false
}

function check() {
  solved.value =
    picks.value.length === sequence.value.length &&
    sequence.value.every((item, index) => picks.value[index] === item)
  result.value = solved.value
    ? '顺序一样！你是怎么记住的？'
    : picks.value.length < sequence.value.length
      ? '还没有摆完，可以继续摆。'
      : '有位置不一样。可以撤回，也可以重看，不用抢时间。'
}

function changeRound() {
  round.value = round.value === 0 ? 1 : 0
  restart()
}
</script>

<template>
  <div class="mt-4 space-y-4">
    <p class="leading-7">
      这是一项可选的记忆游戏。先读一遍图形顺序，准备好了再遮住；随时可以重看。
    </p>
    <p v-if="!hidden" class="flex flex-wrap gap-2 rounded-xl bg-primary-soft p-3">
      <span
        v-for="(item, index) in sequence"
        :key="index"
        class="rounded-md border bg-card px-2 py-1"
        >{{ tokens[item] }}</span
      >
    </p>
    <p v-else class="text-sm text-muted">原图已遮住（共 {{ sequence.length }} 个）。</p>
    <div v-if="hidden" class="space-y-3">
      <p role="status">
        你的顺序：{{ picks.map((item) => tokens[item]).join('、') || '还没有摆' }}
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(token, index) in tokens"
          :key="token"
          type="button"
          class="secondary-button min-h-11"
          :disabled="picks.length === sequence.length"
          @click="pick(index)"
        >
          {{ token }}
        </button>
        <button
          type="button"
          class="secondary-button min-h-11"
          :disabled="!picks.length"
          @click="undo"
        >
          撤回一个
        </button>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button v-if="hidden" type="button" class="primary-button min-h-11" @click="check">
        检查一下
      </button>
      <button v-else type="button" class="primary-button min-h-11" @click="hidden = true">
        准备好了，遮住
      </button>
      <button v-if="hidden" type="button" class="secondary-button min-h-11" @click="restart">
        重看并重新摆
      </button>
      <button type="button" class="secondary-button min-h-11" @click="changeRound">
        {{ round === 0 ? '试试更长的顺序' : '回到短顺序' }}
      </button>
    </div>
    <div role="status">
      <p v-if="result" class="rounded-xl bg-primary-soft p-3 leading-7">{{ result }}</p>
    </div>
  </div>
</template>
