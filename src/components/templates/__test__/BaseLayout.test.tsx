import { BaseLayout } from '../BaseLayout'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// 子コンポーネントをすべてモック化する
vi.mock('@/components/organisms/Header', () => ({
  Header: () => <div data-testid='mock-header' />,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    Outlet: () => <div data-testid='mock-outlet' />,
  }
})

vi.mock('../../ui/toaster', () => ({
  Toaster: () => <div data-testid='mock-toaster' />,
}))

// ------------------------------------------------------------------

// テスト内容
describe('BaseLayout', () => {
  describe('正常系', () => {
    it('Headerが表示されること', () => {
      customRender(<BaseLayout />)
      // 期待するものを書く
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    })

    it('Outletが表示されること', () => {
      customRender(<BaseLayout />)
      // 期待するものを書く
      expect(screen.getByTestId('mock-outlet')).toBeInTheDocument()
    })
  })

  it('Toasterが表示されること', () => {
    customRender(<BaseLayout />)
    // 期待するものを書く
    expect(screen.getByTestId('mock-toaster')).toBeInTheDocument()
  })
})
