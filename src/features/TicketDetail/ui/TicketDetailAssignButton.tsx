import { Button, HStack, Text } from '@chakra-ui/react'

interface TicketDetailAssignButtonProps {
  data: {
    buttonLabel: string | null
    supportUserName: string | null
  }
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    onClick: (() => Promise<void>) | undefined
  }
}

// チケットIDの横に表示する「担当者になる／担当解除」ボタンと担当者名（見た目専用のコンポーネント）
// ボタンを出す条件・ラベルの決定はuseAssignTicketHandlerが担当し、このコンポーネントは受け取った内容をそのまま表示するだけ
export const TicketDetailAssignButton = ({
  data,
  uiState,
  handlers,
}: TicketDetailAssignButtonProps) => {
  return (
    <HStack gap={2}>
      {data.buttonLabel && (
        <Button
          size={'sm'}
          w={'3xs'}
          borderRadius={'12px'}
          bg={'white'}
          borderWidth={'2px'}
          borderColor={'green.400'}
          color={'gray.700'}
          // 送信中の連打で二重登録されないよう無効化する
          disabled={uiState.isSubmitting}
          // disabled時は公開設定ボタンと同じく背景をグレー・枠線を透明にする
          _disabled={{ bg: 'gray.100', borderColor: 'transparent', cursor: 'default', opacity: 1 }}
          onClick={() => {
            void handlers.onClick?.()
          }}
        >
          {data.buttonLabel}
        </Button>
      )}
      {data.buttonLabel && data.supportUserName && <Text color={'gray.500'}>|</Text>}
      {data.supportUserName && <Text>{data.supportUserName}</Text>}
    </HStack>
  )
}
