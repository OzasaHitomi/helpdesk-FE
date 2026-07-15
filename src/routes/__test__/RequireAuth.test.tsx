import { RequireAuth } from '../RequireAuth'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// 現時点のRequireAuthは認証判定を行わず、Outlet(子ルート)をそのまま表示するだけであることをテストする
// （実際のログイン要否判定ロジックは未実装のため、実装され次第テストを追加する）
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    Outlet: () => <div data-testid='mock-outlet' />,
  }
})

describe('RequireAuth', () => {
  describe('正常系', () => {
    it('Outlet(子ルート)が表示されること', () => {
      customRender(<RequireAuth />)
      expect(screen.getByTestId('mock-outlet')).toBeInTheDocument()
    })
  })
})
