import { LoginPresentational } from './LoginPresentational'
import { useLoginHandler } from './hooks/handlers/useLoginHandler'

export const LoginContainer = () => {
  const { data, handlers } = useLoginHandler()

  return (
    <LoginPresentational
      data={{ loginForm: data.loginForm, errorMessage: data.errorMessage }}
      handlers={{ onSubmitLogin: handlers.onSubmitLogin, setLoginForm: handlers.setLoginForm }}
    />
  )
}
