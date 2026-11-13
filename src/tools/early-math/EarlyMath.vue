<script setup lang="ts">
import {
  Blocks,
  Box,
  Brain,
  Cookie,
  Gem,
  KeyRound,
  Puzzle,
  RotateCw,
  Route,
  Ruler,
  Scale,
  Search,
  Shapes,
} from '@lucide/vue'
import { computed, nextTick, ref } from 'vue'

import ToolLayout from '@/components/ToolLayout.vue'

import {
  abilityDomains,
  activities,
  beadSets,
  guests,
  pattern,
  type ActivityId,
} from './activities'
import { challengeTasks, familyTasks } from './task-cards'
import { questions, type NewGameId } from './spatial-questions'
import ChoiceWorkshop from './components/ChoiceWorkshop.vue'
import MemoryWorkshop from './components/MemoryWorkshop.vue'
import NumberTrail from './components/NumberTrail.vue'
import PatternChallenge from './components/PatternChallenge.vue'
import PuzzleWorkshop from './components/PuzzleWorkshop.vue'
import SortingGame from './components/SortingGame.vue'
import TaskCards from './TaskCards.vue'

const sections = [
  { id: 'games', label: '动手小游戏' },
  { id: 'family', label: '生活任务卡' },
  { id: 'challenge', label: '进阶挑战' },
] as const
const section = ref<(typeof sections)[number]['id']>('games')

const icons = {
  sharing: Cookie,
  packing: Blocks,
  pattern: Gem,
  sorting: Shapes,
  trail: Route,
  puzzle: Puzzle,
  rotate: RotateCw,
  cubes: Box,
  measure: Ruler,
  weight: Scale,
  code: KeyRound,
  clues: Search,
  memory: Brain,
}
const selected = ref<ActivityId>('sharing')
const round = ref<0 | 1>(0)
const advancedPattern = ref(false)
const plates = ref([0, 0, 0])
const blocks = ref<boolean[]>([])
const beads = ref<(0 | 1)[]>([])
const checked = ref(false)
const solved = ref(false)
const feedback = ref('')
const hint = ref(false)
const heading = ref<HTMLElement | null>(null)

const workshop = computed(() => {
  const id = selected.value
  return Object.hasOwn(questions, id) ? (id as NewGameId) : undefined
})

const activity = computed(() => activities.find(({ id }) => id === selected.value)!)
const total = computed(() => (round.value === 0 ? 6 : 8))
const remaining = computed(() => total.value - plates.value.reduce((sum, count) => sum + count, 0))
const blockCount = computed(() => (round.value === 0 ? 5 : 6))
const initialBlocks = 3
const pieces = computed(() => beadSets[round.value])
const prompt = computed(() => {
  switch (selected.value) {
    case 'sharing':
      return round.value === 0
        ? '把 6 块饼干分给 3 位朋友，让每位朋友拿到的一样多。'
        : '这次有 8 块饼干。不能掰开，尽量多分，每位朋友还是要一样多。'
    case 'packing':
      return `积木盒有 ${blockCount.value} 个位置，已经放了 ${initialBlocks} 块。点空格，让没回家的积木都回来。`
    default:
      return round.value === 0
        ? '小熊串了一半手链。看看前面的规律，再接上 3 颗珠子。'
        : '小熊换了两种珠子。看一看，能用刚才的规律继续串吗？'
  }
})
const hintText = computed(() => {
  if (selected.value === 'sharing') return '试试每个盘子轮流放一块，再看看还够不够分下一轮。'
  if (selected.value === 'packing') return '一块积木住一个格子。指一指，哪些格子还是空的？'
  return '从左边开始，三个一组。看看第一组和第二组哪里一样。'
})

function clearFeedback() {
  checked.value = false
  solved.value = false
  feedback.value = ''
}

function reset() {
  plates.value = [0, 0, 0]
  blocks.value = Array.from({ length: blockCount.value }, (_, i) => i < initialBlocks)
  beads.value = []
  hint.value = false
  clearFeedback()
}

async function choose(id: ActivityId, nextRound: 0 | 1 = 0) {
  selected.value = id
  round.value = nextRound
  advancedPattern.value = false
  reset()
  await nextTick()
  heading.value?.focus()
}

function changePlate(index: number, delta: 1 | -1) {
  const count = plates.value[index] ?? 0
  if ((delta === 1 && remaining.value === 0) || (delta === -1 && count === 0)) return
  plates.value[index] = count + delta
  clearFeedback()
}

function toggleBlock(index: number) {
  blocks.value[index] = !blocks.value[index]
  clearFeedback()
}

function addBead(index: 0 | 1) {
  if (beads.value.length >= pattern.length) return
  beads.value.push(index)
  clearFeedback()
}

function undoBead() {
  beads.value.pop()
  clearFeedback()
}

function check() {
  checked.value = true
  if (selected.value === 'sharing') {
    const equal = plates.value.every((count) => count === plates.value[0])
    solved.value = equal && remaining.value < guests.length
    feedback.value = !equal
      ? '盘子里的饼干还不一样多。看看哪位朋友多了，哪位少了。'
      : solved.value
        ? round.value === 0
          ? '每位朋友都有 2 块，刚刚分完！'
          : '每位朋友都有 2 块，剩下 2 块不够再分一轮。'
        : '每份一样多了！看看桌上剩下的饼干，还够不够再分一轮？'
  } else if (selected.value === 'packing') {
    const missing = blocks.value.filter((filled) => !filled).length
    solved.value = missing === 0
    feedback.value = solved.value
      ? '每个格子里都有一块积木，全部回家了！'
      : `还有 ${missing} 个空格。再看看，哪些积木还没回家？`
  } else {
    solved.value =
      beads.value.length === pattern.length && pattern.every((bead, i) => beads.value[i] === bead)
    feedback.value = solved.value
      ? '接上了！每一组珠子的顺序都一样。'
      : beads.value.length < pattern.length
        ? '这组还没串完，接着试试。'
        : '比一比前面的一组。哪里不一样？可以撤回再试。'
  }
}

reset()
</script>

<template>
  <ToolLayout
    title="幼升小数学游戏"
    description="分点心、接规律、给图形分类，或带小兔跳格子。先动手，再说理由，还能把玩法带回生活。"
    privacy-text="全部游戏在当前浏览器中运行，无需登录，不上传作答"
  >
    <div class="page-shell no-print space-y-5 pb-12">
      <nav aria-label="练习类型" class="grid grid-cols-3 gap-2">
        <button
          v-for="item in sections"
          :key="item.id"
          type="button"
          :aria-pressed="section === item.id"
          class="min-h-12 cursor-pointer rounded-xl border bg-card px-2 text-sm font-semibold aria-pressed:border-primary aria-pressed:bg-primary-soft aria-pressed:text-primary sm:text-base"
          @click="section = item.id"
        >
          {{ item.label }}
        </button>
      </nav>

      <section v-if="section === 'family'" aria-labelledby="family-title" class="space-y-4">
        <h2 id="family-title" class="text-2xl font-bold">把数学带进生活</h2>
        <p class="leading-7 text-muted">适合幼升小。请家长读题，拿家里的东西摆一摆，不用写算式。</p>
        <TaskCards :tasks="familyTasks" />
      </section>

      <section
        v-else-if="section === 'challenge'"
        aria-labelledby="challenge-title"
        class="space-y-4"
      >
        <h2 id="challenge-title" class="text-2xl font-bold">想一想，再说理由</h2>
        <p class="leading-7 text-muted">
          这些题有两位数、逆推和证明，比幼升小入门活动难。可以家长陪着挑一题，也可以留到以后，不用整套做。
        </p>
        <TaskCards :tasks="challengeTasks" />
      </section>

      <div v-show="section === 'games'" class="space-y-5">
        <nav aria-label="选择数学游戏" class="grid gap-2 sm:grid-cols-3">
          <button
            v-for="item in activities"
            :key="item.id"
            type="button"
            :aria-pressed="selected === item.id"
            class="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-2 text-left aria-pressed:border-primary aria-pressed:bg-primary-soft"
            @click="choose(item.id)"
          >
            <component
              :is="icons[item.id]"
              class="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              <span class="block font-semibold">{{ item.name }}</span>
              <span class="block text-sm text-muted">{{ item.skill }}</span>
            </span>
          </button>
        </nav>

        <section
          aria-labelledby="game-title"
          class="rounded-2xl border bg-card p-4 shadow-sm sm:p-7"
        >
          <p class="mb-2 text-sm font-semibold text-primary">
            {{
              selected === 'sorting' || selected === 'trail' || advancedPattern || round === 0
                ? '动手试一试'
                : '换个条件再试'
            }}
          </p>
          <h2 id="game-title" ref="heading" tabindex="-1" class="text-2xl font-bold">
            {{ activity.name }}
          </h2>
          <SortingGame v-if="selected === 'sorting'" />
          <NumberTrail v-else-if="selected === 'trail'" />
          <PuzzleWorkshop v-else-if="selected === 'puzzle'" />
          <ChoiceWorkshop v-else-if="workshop" :key="workshop" :game="workshop" />
          <MemoryWorkshop v-else-if="selected === 'memory'" />
          <template v-else>
            <button
              v-if="selected === 'pattern'"
              type="button"
              class="secondary-button mt-3 min-h-11"
              :aria-pressed="advancedPattern"
              @click="advancedPattern = !advancedPattern"
            >
              {{ advancedPattern ? '回到基础串手链' : '试试双规律挑战' }}
            </button>
            <PatternChallenge v-if="advancedPattern" />
            <template v-else>
              <p class="mt-2 leading-7 text-muted">{{ prompt }}</p>

              <div v-if="selected === 'sharing'" class="mt-5">
                <div class="rounded-xl bg-primary-soft p-3">
                  <p role="status">
                    桌上还有 <strong>{{ remaining }}</strong> 块饼干
                  </p>
                  <span aria-hidden="true" class="block break-all text-xl tracking-wider">{{
                    '🍪'.repeat(remaining)
                  }}</span>
                </div>
                <div class="mt-3 grid gap-2 sm:grid-cols-3">
                  <div v-for="(guest, i) in guests" :key="guest" class="rounded-xl border p-3">
                    <p class="font-semibold">{{ guest }}的盘子 · {{ plates[i] }} 块</p>
                    <p aria-hidden="true" class="min-h-7 break-all">
                      {{ '🍪'.repeat(plates[i] ?? 0) }}
                    </p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="secondary-button min-h-11"
                        :aria-label="`给${guest}放一块`"
                        :disabled="remaining === 0"
                        @click="changePlate(i, 1)"
                      >
                        放一块
                      </button>
                      <button
                        type="button"
                        class="secondary-button min-h-11"
                        :aria-label="`从${guest}盘里拿回一块`"
                        :disabled="plates[i] === 0"
                        @click="changePlate(i, -1)"
                      >
                        拿回
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else-if="selected === 'packing'"
                class="mt-5 grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3"
              >
                <button
                  v-for="(filled, i) in blocks"
                  :key="i"
                  type="button"
                  class="flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed aria-pressed:border-solid aria-pressed:bg-primary-soft"
                  :aria-label="`位置 ${i + 1}`"
                  :aria-pressed="filled"
                  :disabled="i < initialBlocks"
                  @click="toggleBlock(i)"
                >
                  <Blocks v-if="filled" class="size-5 text-primary" aria-hidden="true" />
                  <span class="text-sm">{{ filled ? '有积木' : '空格' }}</span>
                </button>
              </div>

              <div v-else class="mt-5 space-y-3">
                <div role="group" class="flex flex-wrap gap-2" aria-label="手链上的珠子">
                  <div
                    v-for="group in 3"
                    :key="group"
                    class="flex gap-1 rounded-lg border p-1.5"
                    :class="{ 'border-dashed': group === 3 }"
                  >
                    <span
                      v-for="(bead, i) in pattern"
                      :key="i"
                      class="grid size-8 place-items-center rounded bg-primary-soft text-xl font-bold text-primary"
                    >
                      <template v-if="group < 3"
                        >{{ pieces[bead].mark
                        }}<span class="sr-only">{{ pieces[bead].name }}</span></template
                      >
                      <template v-else>{{
                        beads[i] === undefined ? '·' : pieces[beads[i]].mark
                      }}</template>
                    </span>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="choice in [0, 1] as const"
                    :key="choice"
                    type="button"
                    class="secondary-button min-h-11"
                    :disabled="beads.length === pattern.length"
                    @click="addBead(choice)"
                  >
                    <span aria-hidden="true">{{ pieces[choice].mark }}</span>
                    {{ pieces[choice].name }}
                  </button>
                  <button
                    type="button"
                    class="secondary-button min-h-11"
                    :disabled="beads.length === 0"
                    @click="undoBead"
                  >
                    撤回一颗
                  </button>
                </div>
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <button type="button" class="primary-button min-h-11" @click="check">
                  检查一下
                </button>
                <button
                  type="button"
                  class="secondary-button min-h-11"
                  aria-controls="game-hint"
                  :aria-expanded="hint"
                  @click="hint = !hint"
                >
                  {{ hint ? '收起提示' : '给个提示' }}
                </button>
                <button type="button" class="secondary-button min-h-11" @click="reset">
                  重新摆
                </button>
              </div>
              <p v-show="hint" id="game-hint" class="mt-3 text-sm leading-6 text-muted">
                {{ hintText }}
              </p>
              <div role="status">
                <p v-if="checked" class="mt-4 rounded-xl bg-primary-soft p-3 leading-7">
                  {{ feedback }}
                </p>
              </div>
              <button
                v-if="solved && round === 0"
                type="button"
                class="secondary-button mt-3 min-h-11"
                @click="choose(selected, 1)"
              >
                换个条件再试
              </button>
              <button
                v-if="round === 1"
                type="button"
                class="secondary-button mt-3 min-h-11"
                @click="choose(selected)"
              >
                回到第一轮
              </button>
            </template>
          </template>
        </section>

        <details class="rounded-xl border bg-card p-4">
          <summary
            class="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-primary"
          >
            家长观察：培养目标与生活练习
          </summary>
          <dl class="mt-3 space-y-3 text-sm leading-6">
            <div>
              <dt class="font-semibold">
                培养目标 · {{ abilityDomains[activity.ability.domain] }}
              </dt>
              <dd class="mt-1 text-muted">{{ activity.ability.goal }}</dd>
            </div>
            <div>
              <dt class="font-semibold">家长可以观察</dt>
              <dd class="mt-1 text-muted">{{ activity.ability.observation }}</dd>
            </div>
            <div>
              <dt class="font-semibold">带回生活</dt>
              <dd class="mt-1 text-muted">{{ activity.offline }}</dd>
            </div>
          </dl>
          <p class="mt-3 text-sm leading-6 text-muted">
            可以记下孩子是「提示后做到」「独立做到」还是「换个情境也能做到」。一次答对不等于已经掌握。
          </p>
        </details>
      </div>
    </div>
  </ToolLayout>
</template>
