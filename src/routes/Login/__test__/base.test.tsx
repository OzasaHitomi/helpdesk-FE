import { LoginRoute } from '../base'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'

// LoginRouteが担う「/login配下でのルーティング」のみをテストする
// （LoginContainerの表示内容はLoginContainer.test.tsxが担保するためモック化する）
vi.mock('@/features/Login/Root/LoginContainer', () => ({
  LoginContainer: () => <div data-testid='mocked-login-container' />,
}))

// リダイレクト先のURLを画面上で確認できるようにするための表示専用コンポーネント
const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid='location-display'>{location.pathname}</div>
}

// 本番ではrouter.tsxにより"/login/*"配下にマウントされるため、テストでも同じ条件で検証する
const renderLoginRoute = (initialEntry: string) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationDisplay />
      <Routes>
        <Route path='/login/*' element={<LoginRoute />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginRoute', () => {
  describe('正常系', () => {
    it('/loginにアクセスした場合、LoginContainerが表示されること', () => {
      renderLoginRoute('/login')
      expect(screen.getByTestId('mocked-login-container')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('/login配下の未定義パスにアクセスした場合、/loginへリダイレクトされること', () => {
      renderLoginRoute('/login/unknown')
      expect(screen.getByTestId('location-display')).toHaveTextContent('/login')
    })
  })
})
