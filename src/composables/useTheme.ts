import { onMounted, ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'macrossx-tools-theme'
const theme = ref<Theme>('system')

function applyTheme(value: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle(
    'dark',
    value === 'dark' || (value === 'system' && prefersDark),
  )
}

export function useTheme() {
  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    theme.value = stored ?? 'system'
    applyTheme(theme.value)
  })

  function setTheme(value: Theme) {
    theme.value = value
    localStorage.setItem(STORAGE_KEY, value)
    applyTheme(value)
  }

  function toggleTheme() {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}
