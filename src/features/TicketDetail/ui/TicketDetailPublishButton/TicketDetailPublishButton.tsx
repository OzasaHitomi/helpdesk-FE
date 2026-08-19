import { Button } from '@chakra-ui/react'

interface TicketDetailPublishButtonProps {
  isSelected: boolean
  isEditable: boolean
  disabled: boolean
  handlers: {
    onClick: () => Promise<void>
  }
}

// 公開設定の「公開」ボタン（見た目専用のコンポーネント。非公開への切り替えはTicketDetailUnpublishButtonが担当）
export const TicketDetailPublishButton = ({
  isSelected,
  isEditable,
  disabled,
  handlers,
}: TicketDetailPublishButtonProps) => {
  return (
    <Button
      size={'sm'}
      w={'3xs'}
      borderRadius={'12px'}
      // aria-pressed: このボタンがON/OFFのどちらの状態かを示すHTML属性（見た目には影響しない）
      aria-pressed={isSelected}
      // 変更する権限が無い(または送信中の)場合は背景をグレーにする（枠線の色はそのまま）
      bg={isEditable ? 'white' : 'gray.100'}
      borderWidth={'2px'}
      // transparent: 色を「透明」にする指定。枠線の太さは保ったまま見えなくできる
      borderColor={isSelected ? 'green.400' : 'transparent'}
      color={'gray.700'}
      disabled={disabled}
      // disabled自体は維持しつつ、hover時の禁止カーソル(not-allowed)だけを打ち消す
      _disabled={{ cursor: 'default', opacity: 1 }}
      onClick={() => {
        void handlers.onClick()
      }}
    >
      公開
    </Button>
  )
}
