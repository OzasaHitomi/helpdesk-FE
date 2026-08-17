import { Button } from '@chakra-ui/react'

interface TicketDetailUnassignButtonProps {
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    onClick: () => Promise<void>
  }
}

// チケットIDの横に表示する「担当解除」ボタン（見た目専用のコンポーネント）
// ボタンを出すかどうかの判断は呼び出し元(TicketDetailPresentational)のShowが担当する
export const TicketDetailUnassignButton = ({
  uiState,
  handlers,
}: TicketDetailUnassignButtonProps) => {
  return (
    <Button
      size={'sm'}
      w={'3xs'}
      borderRadius={'12px'}
      bg={'white'}
      borderWidth={'2px'}
      borderColor={'green.400'}
      color={'gray.700'}
      // 送信中の連打で二重解除されないよう無効化する
      disabled={uiState.isSubmitting}
      // disabled時は他のボタンと同じく背景をグレー・枠線を透明にする
      _disabled={{ bg: 'gray.100', borderColor: 'transparent', cursor: 'default', opacity: 1 }}
      onClick={() => {
        void handlers.onClick()
      }}
    >
      担当解除
    </Button>
  )
}
