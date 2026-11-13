<script setup lang="ts">
import { computed, ref } from 'vue'
import ShapeToken from './ShapeToken.vue'

const labels = { circle: '圆形', triangle: '三角形', square: '方形' }
const tiles = (['circle', 'triangle', 'square'] as const).flatMap((shape) =>
  [false, true].map((striped) => ({
    id: `${shape}-${striped}`,
    shape,
    striped,
    label: `${labels[shape]} · ${striped ? '有条纹' : '无条纹'}`,
  })),
)
const second = ref(false)
const picks = ref<string[]>([])
const notice = ref('')
const solved = ref(false)
const hint = ref(false)
const rule = computed(() => (second.value ? '带条纹' : '圆形'))
const targets = computed(() =>
  tiles.filter((tile) => (second.value ? tile.striped : tile.shape === 'circle')),
)

function reset() {
  picks.value = []
  notice.value = ''
  solved.value = false
  hint.value = false
}

function toggle(id: string) {
  picks.value = picks.value.includes(id)
    ? picks.value.filter((value) => value !== id)
    : [...picks.value, id]
  notice.value = ''
  solved.value = false
}

function check() {
  const missed = targets.value.filter((tile) => !picks.value.includes(tile.id)).length
  const extra = picks.value.filter((id) => !targets.value.some((tile) => tile.id === id)).length
  solved.value = missed === 0 && extra === 0
  notice.value = solved.value
    ? `正好！这次是按「${rule.value}」挑的。指一指，你为什么选了这几张？`
    : [
        extra ? `有 ${extra} 张不符合这次规则，再点一下可以拿出来。` : '',
        missed ? `还漏了 ${missed} 张，找找还有谁符合「${rule.value}」。` : '',
      ]
        .filter(Boolean)
        .join('')
}

function changeRule() {
  second.value = !second.value
  reset()
}
</script>

<template>
  <div class="mt-3 space-y-4">
    <p class="leading-7">
      把所有<strong class="text-primary">{{ rule }}</strong
      >的卡片放进篮子。再点一次可以拿出来。
    </p>
    <p class="rounded-xl bg-primary-soft px-3 py-2 text-sm leading-6">
      {{
        second
          ? '还是刚才那些卡片，这次不管形状，只看有没有条纹。'
          : '先看一个例子：有条纹的圆也是圆，所以它符合第一轮的规则。'
      }}
    </p>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="分类卡片">
      <button
        v-for="tile in tiles"
        :key="tile.id"
        type="button"
        :aria-pressed="picks.includes(tile.id)"
        class="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-2 aria-pressed:border-primary aria-pressed:bg-primary-soft"
        @click="toggle(tile.id)"
      >
        <ShapeToken :shape="tile.shape" :striped="tile.striped" class="size-10" />
        <span class="text-sm font-semibold">{{ tile.label }}</span>
        <span class="text-xs text-muted" aria-hidden="true">{{
          picks.includes(tile.id) ? '已放进篮子' : '还在桌上'
        }}</span>
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="primary-button min-h-11" @click="check">检查一下</button>
      <button
        type="button"
        class="secondary-button min-h-11"
        aria-controls="sorting-hint"
        :aria-expanded="hint"
        @click="hint = !hint"
      >
        {{ hint ? '收起提示' : '给个提示' }}
      </button>
      <button type="button" class="secondary-button min-h-11" @click="reset">重新分</button>
    </div>
    <p v-show="hint" id="sorting-hint" class="text-sm leading-6 text-muted">
      {{
        second
          ? '只找卡片中间的三条短线，不管外面是什么形状。'
          : '外面是圆的就算，里面有没有条纹都可以。'
      }}
    </p>
    <div role="status">
      <p v-if="notice" class="rounded-xl bg-primary-soft p-3 leading-7">{{ notice }}</p>
    </div>
    <button
      v-if="solved || second"
      type="button"
      class="secondary-button min-h-11"
      @click="changeRule"
    >
      {{ second ? '回到按形状分' : '换个规则再试' }}
    </button>
  </div>
</template>
