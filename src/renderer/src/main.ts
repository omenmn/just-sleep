import { mount } from 'svelte'

import App from './App.svelte'
import './app.css'

const app = mount(App, {
  target: document.getElementById('app')!
})

async function applyWalColors(): Promise<void> {
  const colors = await window.api.getColors()
  if (!colors) return

  const root = document.documentElement

  // Map all colors 0–15 from darkest to lightest
  for (let i = 0; i <= 15; i++) {
    root.style.setProperty(`--color-${i}`, colors[`color${i}`])
  }

  // Also set background and foreground
  root.style.setProperty('--color-bg', colors.background || colors.color0)
  root.style.setProperty('--color-fg', colors.foreground || colors.color15)
}

applyWalColors()

export default app
