import { Button } from '@chakra-ui/react'

interface AccountDeactivateButtonProps {
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    onClick: () => Promise<void>
  }
}

// アカウント一覧の各行に表示する「停止」ボタン（見た目専用のコンポーネント）
// ボタンを出すかどうかの判断は呼び出し元(AccountsTable)が担当する
export const AccountDeactivateButton = ({ uiState, handlers }: AccountDeactivateButtonProps) => {
  return (
    <Button
      size={'xs'}
      w={'4xs'}
      borderRadius={'12px'}
      bg={'red.200'}
      color={'gray.500'}
      // 送信中の連打で二重に停止処理が走らないよう無効化する
      disabled={uiState.isSubmitting}
      _disabled={{ bg: 'gray.100', cursor: 'default', opacity: 1 }}
      onClick={() => {
        void handlers.onClick()
      }}
    >
      停止
    </Button>
  )
}
