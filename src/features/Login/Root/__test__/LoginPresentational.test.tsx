import { LoginPresentational } from '../LoginPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type LoginForm } from '../../types/LoginForm'

// LoginPresentationalの表示内容と、ユーザー操作時にhandlersが正しい引数で呼ばれるかのみをテストする
// （ログイン成功/失敗時の挙動やエラーメッセージの生成ロジックはuseLoginHandler.test.tsが担保する）

const mockLoginForm: LoginForm = { email: 'test@example.com', password: 'password123' }
const mockOnSubmitLogin = vi.fn()
const mockSetLoginForm = vi.fn()

describe('LoginPresentational', () => {
  describe('正常系', () => {
    it('タイトルが表示されること', () => {
      customRender(
        <LoginPresentational
          data={{ loginForm: mockLoginForm, errorMessage: null }}
          handlers={{ onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm }}
        />,
      )
      expect(screen.getByText('Novel HELPDESK')).toBeInTheDocument()
    })

    it('渡されたloginFormの値がEmail/Passwordの入力欄に表示されること', () => {
      customRender(
        <LoginPresentational
          data={{ loginForm: mockLoginForm, errorMessage: null }}
          handlers={{ onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm }}
        />,
      )
      expect(screen.getByPlaceholderText('sample@example.com')).toHaveValue('test@example.com')
      expect(screen.getByPlaceholderText('8文字以上（数字・大文字を含む）')).toHaveValue(
        'password123',
      )
    })

    it('Emailの入力欄を変更するとsetLoginFormがpasswordを保持したまま呼ばれること', () => {
      customRender(
        <LoginPresentational
          data={{ loginForm: mockLoginForm, errorMessage: null }}
          handlers={{ onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm }}
        />,
      )
      fireEvent.change(screen.getByPlaceholderText('sample@example.com'), {
        target: { value: 'new@example.com' },
      })
      expect(mockSetLoginForm).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
      })
    })

    it('Passwordの入力欄を変更するとsetLoginFormがemailを保持したまま呼ばれること', () => {
      customRender(
        <LoginPresentational
          data={{ loginForm: mockLoginForm, errorMessage: null }}
          handlers={{ onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm }}
        />,
      )
      fireEvent.change(screen.getByPlaceholderText('8文字以上（数字・大文字を含む）'), {
        target: { value: 'newPassword456' },
      })
      expect(mockSetLoginForm).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'newPassword456',
      })
    })

    it('ログインボタンを押すとonSubmitLoginがloginFormを引数に呼ばれること', () => {
      customRender(
        <LoginPresentational
          data={{ loginForm: mockLoginForm, errorMessage: null }}
          handlers={{ onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm }}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))
      expect(mockOnSubmitLogin).toHaveBeenCalledWith(mockLoginForm)
    })

    it('errorMessageがnullの場合、エラーメッセージが表示されないこと', () => {
      customRender(
        <LoginPresentational
          data={{ loginForm: mockLoginForm, errorMessage: null }}
          handlers={{ onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm }}
        />,
      )
      expect(screen.queryByText('ログインに失敗しました')).not.toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('errorMessageが存在する場合、その内容が表示されること', () => {
      customRender(
        <LoginPresentational
          data={{ loginForm: mockLoginForm, errorMessage: 'ログインに失敗しました' }}
          handlers={{ onSubmitLogin: mockOnSubmitLogin, setLoginForm: mockSetLoginForm }}
        />,
      )
      expect(screen.getByText('ログインに失敗しました')).toBeInTheDocument()
    })
  })
})
