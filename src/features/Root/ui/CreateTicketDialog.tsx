import {
  Button,
  Circle,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { TicketVisibilityList } from '@/share/constants/business/ticketVisibilityType'
import { transformTicketVisibilityToJa } from '@/share/logic/transform/transformTicketVisibilityToJa'
import { type TicketFieldErrors } from '@/features/Root/types/TicketFieldErrors'
import { type CreateTicketForm } from '../types/CreateTicketForm'

interface CreateTicketDialogProps {
  data: {
    ticketForm: CreateTicketForm
    isDialogOpen: boolean
    fieldErrors: TicketFieldErrors
  }
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    onSubmitTicket: (data: CreateTicketForm) => Promise<void>
    setTicketForm: (data: CreateTicketForm) => void
    onOpenDialog: () => void
    onCloseDialog: () => void
  }
}

// チケット新規登録用のダイアログ（見た目専用のコンポーネント）
// このコンポーネント自体はロジックを持たず、受け取ったdata/uiState/handlersを表示・呼び出しするだけ
// （実際の状態管理・API呼び出しはuseCreateTicketHandlerが担当している）
export const CreateTicketDialog = ({ data, uiState, handlers }: CreateTicketDialogProps) => {
  return (
    // Dialog.Root: このダイアログ全体の開閉を管理するChakra UIのコンポーネント
    // openにdata.isDialogOpen（true/false）を渡すことで、状態に応じて表示・非表示が切り替わる
    <Dialog.Root
      open={data.isDialogOpen}
      // ダイアログの外側（背景）をクリックした時も閉じる
      onInteractOutside={() => {
        handlers.onCloseDialog()
      }}
    >
      {/* ── ダイアログを開くためのADDボタン ───────────────────────── */}
      <Dialog.Trigger asChild>
        <Button
          variant={'plain'}
          onClick={() => {
            handlers.onOpenDialog()
          }}
        >
          <Circle size={'24px'} bg={'green.400'} color={'white'} fontWeight={'bold'}>
            +
          </Circle>
          ADD
        </Button>
      </Dialog.Trigger>
      {/* Portal: ダイアログの中身を、親要素の外（documentのルート付近）に描画する仕組み
          こうしないと、親要素のCSS(overflow:hiddenなど)の影響を受けて正しく表示されないことがある */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW={'760px'} borderRadius={'32px'}>
            <Dialog.Header px={8}>
              <Dialog.Title>Ticket新規登録</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body px={8} py={6}>
              <Stack gap={5}>
                {/* ── 公開設定（公開/非公開）を選ぶボタン ───────────────────── */}
                <Field.Root
                  orientation={'horizontal'}
                  gap={6}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  invalid={!!data.fieldErrors.visibility}
                >
                  <Field.Label fontWeight={'bold'} justifyContent={'center'}>
                    公開設定
                  </Field.Label>
                  <Stack gap={1} flex={1}>
                    <HStack justifyContent={'flex-start'}>
                      {/* TicketVisibilityList（['public', 'private']）をmapでボタンとして並べる
                          こうしておくと、公開設定の種類が増えてもボタンを1つずつ書き足す必要がない */}
                      {TicketVisibilityList.map((visibility) => {
                        const isSelected = data.ticketForm.visibility === visibility
                        return (
                          <Button
                            key={visibility}
                            size={'sm'}
                            w={'88px'}
                            borderRadius={'12px'}
                            aria-pressed={isSelected}
                            bg={isSelected ? 'white' : 'gray.100'}
                            borderWidth={'2px'}
                            borderColor={isSelected ? 'green.400' : 'transparent'}
                            color={'gray.700'}
                            onClick={() => {
                              // ...data.ticketFormで今の入力内容を維持しつつ、visibilityだけ書き換える
                              handlers.setTicketForm({ ...data.ticketForm, visibility })
                            }}
                          >
                            {transformTicketVisibilityToJa(visibility)}
                          </Button>
                        )
                      })}
                    </HStack>
                    <Field.ErrorText>{data.fieldErrors.visibility}</Field.ErrorText>
                  </Stack>
                </Field.Root>

                {/* ── 要件（タイトル）の入力欄 ───────────────────────────── */}
                <Field.Root
                  orientation={'horizontal'}
                  gap={6}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  invalid={!!data.fieldErrors.title}
                >
                  <Field.Label fontWeight={'bold'} justifyContent={'center'}>
                    要件
                  </Field.Label>
                  <Stack gap={1} flex={1}>
                    <Input
                      borderRadius={'12px'}
                      value={data.ticketForm.title}
                      onChange={(e) => {
                        handlers.setTicketForm({ ...data.ticketForm, title: e.target.value })
                      }}
                    />
                    <Field.ErrorText>{data.fieldErrors.title}</Field.ErrorText>
                  </Stack>
                </Field.Root>

                {/* ── 詳細の入力欄 ─────────────────────────────────────── */}
                <Field.Root
                  orientation={'horizontal'}
                  gap={6}
                  alignItems={'flex-start'}
                  justifyContent={'flex-start'}
                  invalid={!!data.fieldErrors.detail}
                >
                  <Field.Label fontWeight={'bold'} justifyContent={'center'} pt={2}>
                    詳細
                  </Field.Label>
                  <Stack gap={1} flex={1}>
                    <Textarea
                      rows={3}
                      borderRadius={'12px'}
                      value={data.ticketForm.detail}
                      onChange={(e) => {
                        handlers.setTicketForm({ ...data.ticketForm, detail: e.target.value })
                      }}
                    />
                    <Field.ErrorText>{data.fieldErrors.detail}</Field.ErrorText>
                  </Stack>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            {/* ── フッターのCancel/送信ボタン ─────────────────────────── */}
            <Dialog.Footer px={8} pb={6} justifyContent={'center'}>
              <Button
                w={'140px'}
                borderRadius={'12px'}
                bg={'gray.200'}
                color={'black'}
                onClick={() => {
                  handlers.onCloseDialog()
                }}
              >
                Cancel
              </Button>
              <Button
                w={'140px'}
                borderRadius={'12px'}
                bg={'green.400'}
                color={'white'}
                // 送信中の連打で二重登録されないよう無効化する
                disabled={uiState.isSubmitting}
                onClick={() => {
                  // onClickは同期関数のため、非同期関数(onSubmitTicket)の戻り値(Promise)を
                  // voidで受け止め、「待たずに実行するだけ」であることを明示している
                  void handlers.onSubmitTicket(data.ticketForm)
                }}
              >
                送信
              </Button>
            </Dialog.Footer>

            {/* 右上の×ボタン */}
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size={'sm'}
                onClick={() => {
                  handlers.onCloseDialog()
                }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
