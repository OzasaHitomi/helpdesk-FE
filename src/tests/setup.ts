import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import ResizeObserver from 'resize-observer-polyfill'

window.ResizeObserver = ResizeObserver

// jsdomには無いwindow.matchMediaをテスト用のモックで用意する
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// jsdomには無いelement.scrollTo(...) をテスト用のモックで用意する
Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})
