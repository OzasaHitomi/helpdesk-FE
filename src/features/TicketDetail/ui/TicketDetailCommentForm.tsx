import { Box, Button, Field, Heading, Stack, Textarea } from '@chakra-ui/react'
import { type TicketCommentFieldErrors } from '../types/TicketCommentFieldErrors'

interface TicketDetailCommentFormProps {
  data: {
    content: string
    fieldErrors: TicketCommentFieldErrors
  }
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    setContent: (content: string) => void
    onSubmit: () => Promise<void>
  }
}

// 質疑応答（対応履歴への投稿）用の入力フォーム（見た目専用のコンポーネント）
// このコンポーネント自体はロジックを持たず、受け取ったdata/uiState/handlersを表示・呼び出しするだけ
// （実際の状態管理・API呼び出しはuseCreateTicketCommentHandlerが担当している）
export const TicketDetailCommentForm = ({
  data,
  uiState,
  handlers,
}: TicketDetailCommentFormProps) => {
  return (
    <Stack gap={2}>
      <Heading size={'md'}>質疑応答</Heading>
      <Box borderWidth={'1px'} borderRadius={'12px'} p={4}>
        <Stack gap={3}>
          <Field.Root invalid={!!data.fieldErrors.content}>
            {/* rows={3}: スクロールなしで3行まで表示できるようにする */}
            <Textarea
              rows={3}
              resize={'none'}
              border={'none'}
              px={0}
              _focusVisible={{ boxShadow: 'none' }}
              value={data.content}
              onChange={(e) => {
                handlers.setContent(e.target.value)
              }}
            />
            <Field.ErrorText>{data.fieldErrors.content}</Field.ErrorText>
          </Field.Root>
          <Box borderTopWidth={'1px'} pt={3} display={'flex'} justifyContent={'flex-end'}>
            <Button
              w={'140px'}
              borderRadius={'12px'}
              bg={'green.400'}
              color={'white'}
              // 送信中の連打で二重登録されないよう無効化する
              disabled={uiState.isSubmitting}
              onClick={() => {
                // onClickは同期関数のため、非同期関数(onSubmit)の戻り値(Promise)をvoidで受け止め、
                // 「待たずに実行するだけ」であることを明示している
                void handlers.onSubmit()
              }}
            >
              送信
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
