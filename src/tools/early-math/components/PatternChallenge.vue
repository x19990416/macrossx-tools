<script setup lang="ts">
import { ref } from 'vue'
import ShapeToken from './ShapeToken.vue'

const shapes = ['circle', 'triangle'] as const
const tones = ['blue', 'amber'] as const
const shapeNames = { circle: '圆形', triangle: '三角形' }
const toneNames = { blue: '靛蓝', amber: '金黄' }
const example = Array.from({ length: 6 }, (_, index) => ({
  index,
  shape: shapes[index % 2]!,
  tone: tones[index % 3 === 2 ? 1 : 0]!,
}))
const options = shapes.flatMap((shape) =>
  tones.map((tone) => ({ shape, tone, id: `${shape}-${tone}` })),
)
const picked = ref<string>()
const hint = ref(false)
const notice = ref('')

function pick(id: string) {
  picked.value = id
  notice.value = ''
}

function reset() {
  picked.value = undefined
  notice.value = ''
  hint.value = false
}

function check() {
  const choice = options.find(({ id }) => id === picked.value)
  notice.value = !choice
    ? '先挑一颗珠子。'
    : choice.shape !== 'circle'
      ? '先只看形状。三角形后面轮到谁？'
      : choice.tone !== 'blue'
        ? '形状对了！再看看颜色，金黄后面轮到谁？'
        : '接对了！形状两颗一组，颜色三颗一组。你能分别说出两个规律吗？'
}
</script>

<template>
  <div class="mt-4 space-y-4">
    <h3 class="text-lg font-bold">两种规律一起找</h3>
    <p class="leading-7">形状和颜色各有自己的规律。先只看形状，再只看颜色，选出下一颗珠子。</p>
    <ol class="flex flex-wrap gap-2" aria-label="已经串好的六颗珠子">
      <li
        v-for="bead in example"
        :key="bead.index"
        class="grid min-w-12 justify-items-center rounded-lg border px-1.5 py-1"
      >
        <ShapeToken :shape="bead.shape" :tone="bead.tone" class="size-8" />
        <span class="text-xs">{{ toneNames[bead.tone] }}{{ shapeNames[bead.shape] }}</span>
      </li>
    </ol>
    <div role="group" aria-label="挑选下一颗珠子" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        :aria-pressed="picked === option.id"
        class="flex min-h-12 cursor-pointer items-center justify-center gap-1 rounded-lg border p-2 text-sm aria-pressed:border-primary aria-pressed:bg-primary-soft"
        @click="pick(option.id)"
      >
        <ShapeToken :shape="option.shape" :tone="option.tone" class="size-6" />
        {{ toneNames[option.tone] }}{{ shapeNames[option.shape] }}
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="primary-button min-h-11" @click="check">检查一下</button>
      <button
        type="button"
        class="secondary-button min-h-11"
        aria-controls="dual-pattern-hint"
        :aria-expanded="hint"
        @click="hint = !hint"
      >
        {{ hint ? '收起提示' : '给个提示' }}
      </button>
      <button type="button" class="secondary-button min-h-11" @click="reset">重新选</button>
    </div>
    <p v-show="hint" id="dual-pattern-hint" class="text-sm leading-6 text-muted">
      把颜色遮住看形状：圆、三角……再单独读颜色：靛蓝、靛蓝、金黄……
    </p>
    <div role="status">
      <p v-if="notice" class="rounded-xl bg-primary-soft p-3 leading-7">{{ notice }}</p>
    </div>
  </div>
</template>
