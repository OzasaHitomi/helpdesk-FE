import { useLoginHandler } from '../useLoginHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import { type LoginForm } from '../../../types/LoginForm'

// mutateAsync/navigateのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseLoginMutation.test.tsが担保するのでここではモックする)
const mockMutateAsync = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../mutations/useLoginMutation', () => ({
  useLoginMutation: () => ({ mutateAsync: mockMutateAsync }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockForm: LoginForm = { email: 'test@example.com', password: 'Password123' }

describe('useLoginHandler', () => {
  afterEach(() => {
    vi.clearAllMocks() // 各テスト後に呼び出し記録をリセット
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('loginFormの初期値がemail・passwordともに空文字であること', () => {
      const { result } = customRenderHook(() => useLoginHandler())

      expect(result.current.data.loginForm).toEqual({ email: '', password: '' })
    })

    it('setLoginFormを呼ぶとloginFormが更新されること', () => {
      const { result } = customRenderHook(() => useLoginHandler())

      act(() => {
        result.current.handlers.setLoginForm(mockForm)
      })

      expect(result.current.data.loginForm).toEqual(mockForm)
    })

    it('ログインに成功した場合、mutateAsyncが正しい引数で呼ばれ、トップページに遷移すること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin(mockForm)
      })

      expect(mockMutateAsync).toHaveBeenCalledWith(mockForm)
      expect(mockNavigate).toHaveBeenCalledWith('/')
      expect(result.current.data.errorMessage).toBeNull()
    })

    it('前回ログインに失敗していても、再度ログインに成功した場合はerrorMessageがクリアされること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: '前回のエラー' } },
      })
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin(mockForm)
      })
      expect(result.current.data.errorMessage).toBe('前回のエラー')

      mockMutateAsync.mockResolvedValueOnce(undefined)

      await act(async () => {
        await result.current.handlers.onSubmitLogin(mockForm)
      })

      expect(result.current.data.errorMessage).toBeNull()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('BEがdetail(文字列)を返すエラーの場合、その文言がerrorMessageに設定され、遷移しないこと', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: 'メールアドレスまたはパスワードが正しくありません' } },
      })
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin(mockForm)
      })

      expect(result.current.data.errorMessage).toBe(
        'メールアドレスまたはパスワードが正しくありません',
      )
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('BEがdetail(配列)を返すバリデーションエラーの場合、汎用メッセージがerrorMessageに設定されること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: [{ msg: 'invalid' }] } },
      })
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin(mockForm)
      })

      expect(result.current.data.errorMessage).toBe('ログインに失敗しました')
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('axios以外のエラーの場合、汎用メッセージがerrorMessageに設定されること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin(mockForm)
      })

      expect(result.current.data.errorMessage).toBe('ログインに失敗しました')
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  // ── FEバリデーション ────────────────────────────────────────────────────
  describe('FEバリデーション', () => {
    it('メールアドレスが未入力の場合、専用メッセージが設定されmutateAsyncが呼ばれないこと', async () => {
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin({ email: '', password: 'Password123' })
      })

      expect(result.current.data.errorMessage).toBe('メールアドレスを入力してください')
      expect(mockMutateAsync).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('メールアドレスの形式が不正な場合、専用メッセージが設定されmutateAsyncが呼ばれないこと', async () => {
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin({
          email: 'invalid-email',
          password: 'Password123',
        })
      })

      expect(result.current.data.errorMessage).toBe('メールアドレスの形式が正しくありません')
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })

    it('パスワードが未入力の場合、専用メッセージが設定されmutateAsyncが呼ばれないこと', async () => {
      const { result } = customRenderHook(() => useLoginHandler())

      await act(async () => {
        await result.current.handlers.onSubmitLogin({ email: 'test@example.com', password: '' })
      })

      expect(result.current.data.errorMessage).toBe('パスワードを入力してください')
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })
  })
})
