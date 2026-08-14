import { Button } from '@chakra-ui/react'

interface TicketDetailUnassignButtonProps {
  data: {
    isUnassignableByMe: boolean
  }
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    onClick: () => Promise<void>
  }
}

// チケットIDの横に表示する「担当解除」ボタン（見た目専用のコンポーネント）
// ボタンを出す条件の決定はuseUnassignTicketHandlerが担当し、このコンポーネントは受け取った内容をそのまま表示するだけ
export const TicketDetailUnassignButton = ({
  data,
  uiState,
  handlers,
}: TicketDetailUnassignButtonProps) => {
  if (!data.isUnassignableByMe) {
    return null
  }

  return (
    <Button
      size={'sm'}
      w={'3xs'}
      borderRadius={'12px'}
      bg={'white'}
      borderWidth={'2px'}
      borderColor={'red.400'}
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
