import { LoginContainer } from '../LoginContainer'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type LoginForm } from '../types/LoginForm'

// ContainerがuseLoginHandlerの結果をPresentationalに正しく橋渡しできているかのみをテストする
// （フォームの見た目や入力イベントの中身はLoginPresentational.test.tsx、
//   ログイン処理・エラーメッセージ生成のロジックはuseLoginHandler.test.tsが担保する）

const mockLoginForm: LoginForm = { email: 'test@example.com', password: 'password123' }
const mockOnSubmitLogin = vi.fn()
const mockSetLoginForm = vi.fn()

vi.mock('../hooks/handlers/useLoginHandler', () => ({
  useLoginHandler: () => ({
    data: { loginForm: mockLoginForm, errorMessage: 'テストエラー' },
    handlers: { onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm },
  }),
}))

// Presentational自体の見た目はテスト対象外のため、受け取ったPropsをそのまま画面に出すダミーにする
vi.mock('../LoginPresentational', () => ({
  LoginPresentational: ({
    data,
    handlers,
  }: {
    data: { loginForm: LoginForm; errorMessage: string | null }
    handlers: {
      onSubmitLogin: (data: LoginForm) => Promise<void>
      setLoginForm: (data: LoginForm) => void
    }
  }) => (
    <div data-testid='mocked-login-presentational'>
      <span data-testid='email'>{data.loginForm.email}</span>
      <span data-testid='error-message'>{data.errorMessage}</span>
      <button
        onClick={() => {
          void handlers.onSubmitLogin(data.loginForm)
        }}
      >
        submit
      </button>
      <button
        onClick={() => {
          handlers.setLoginForm({ email: 'changed@example.com', password: 'changedPassword' })
        }}
      >
        change
      </button>
    </div>
  ),
}))

describe('LoginContainer', () => {
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<LoginContainer />)
      expect(screen.getByTestId('mocked-login-presentational')).toBeInTheDocument()
    })

    it('ContainerがuseLoginHandlerのdataをPresentationalにそのまま渡すこと', () => {
      customRender(<LoginContainer />)
      expect(screen.getByTestId('email')).toHaveTextContent('test@example.com')
      expect(screen.getByTestId('error-message')).toHaveTextContent('テストエラー')
    })

    it('ContainerがuseLoginHandlerのonSubmitLoginをPresentationalにそのまま渡すこと', () => {
      customRender(<LoginContainer />)
      fireEvent.click(screen.getByText('submit'))
      expect(mockOnSubmitLogin).toHaveBeenCalledWith(mockLoginForm)
    })

    it('ContainerがuseLoginHandlerのsetLoginFormをPresentationalにそのまま渡すこと', () => {
      customRender(<LoginContainer />)
      fireEvent.click(screen.getByText('change'))
      expect(mockSetLoginForm).toHaveBeenCalledWith({
        email: 'changed@example.com',
        password: 'changedPassword',
      })
    })
  })
})
