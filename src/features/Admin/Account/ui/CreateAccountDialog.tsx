import {
  Button,
  Circle,
  CloseButton,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  Stack,
} from '@chakra-ui/react'
import { CreatableUserRoleList } from '@/share/constants/business/creatableUserRole'
import { transformUserRoleToJa } from '@/share/logic/transform/transformUserRoleToJa'
import { type AccountFieldErrors } from '../types/AccountFieldErrors'
import { type CreateAccountFormInput } from '../types/CreateAccountForm'

interface CreateAccountDialogProps {
  data: {
    accountForm: CreateAccountFormInput
    isDialogOpen: boolean
    fieldErrors: AccountFieldErrors
  }
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    onSubmitAccount: (data: CreateAccountFormInput) => Promise<void>
    setAccountForm: (data: CreateAccountFormInput) => void
    onOpenDialog: () => void
    onCloseDialog: () => void
  }
}

// アカウント新規登録用のダイアログ（見た目専用のコンポーネント）
// このコンポーネント自体はロジックを持たず、受け取ったdata/uiState/handlersを表示・呼び出しするだけ
// （実際の状態管理・API呼び出しはuseCreateAccountHandlerが担当している）
export const CreateAccountDialog = ({ data, uiState, handlers }: CreateAccountDialogProps) => {
  return (
    <Dialog.Root
      open={data.isDialogOpen}
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
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW={'760px'} borderRadius={'32px'}>
            <Dialog.Header px={8}>
              <Dialog.Title>Account新規登録</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body px={8} py={6}>
              <Stack gap={5}>
                {/* ── 名前の入力欄 ─────────────────────────────────────── */}
                <Field.Root
                  orientation={'horizontal'}
                  gap={6}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  invalid={!!data.fieldErrors.name}
                >
                  <Field.Label fontWeight={'bold'} justifyContent={'center'}>
                    名前
                  </Field.Label>
                  <Stack gap={1} flex={1}>
                    <Input
                      borderRadius={'12px'}
                      placeholder={'Taro.Tanaka'}
                      value={data.accountForm.name}
                      onChange={(e) => {
                        handlers.setAccountForm({ ...data.accountForm, name: e.target.value })
                      }}
                    />
                    <Field.ErrorText>{data.fieldErrors.name}</Field.ErrorText>
                  </Stack>
                </Field.Root>

                {/* ── Emailの入力欄 ───────────────────────────────────── */}
                <Field.Root
                  orientation={'horizontal'}
                  gap={6}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  invalid={!!data.fieldErrors.email}
                >
                  <Field.Label fontWeight={'bold'} justifyContent={'center'}>
                    Email
                  </Field.Label>
                  <Stack gap={1} flex={1}>
                    <Input
                      borderRadius={'12px'}
                      placeholder={'account@example.com'}
                      value={data.accountForm.email}
                      onChange={(e) => {
                        handlers.setAccountForm({ ...data.accountForm, email: e.target.value })
                      }}
                    />
                    <Field.ErrorText>{data.fieldErrors.email}</Field.ErrorText>
                  </Stack>
                </Field.Root>

                {/* ── Passの入力欄 ────────────────────────────────────── */}
                <Field.Root
                  orientation={'horizontal'}
                  gap={6}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  invalid={!!data.fieldErrors.password}
                >
                  <Field.Label fontWeight={'bold'} justifyContent={'center'}>
                    Pass
                  </Field.Label>
                  <Stack gap={1} flex={1}>
                    <Input
                      type={'password'}
                      borderRadius={'12px'}
                      value={data.accountForm.password}
                      onChange={(e) => {
                        handlers.setAccountForm({ ...data.accountForm, password: e.target.value })
                      }}
                    />
                    <Field.ErrorText>{data.fieldErrors.password}</Field.ErrorText>
                  </Stack>
                </Field.Root>

                {/* ── 種別のプルダウン ─────────────────────────────────── */}
                <Field.Root
                  orientation={'horizontal'}
                  gap={6}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  invalid={!!data.fieldErrors.role}
                >
                  <Field.Label fontWeight={'bold'} justifyContent={'center'}>
                    種別
                  </Field.Label>
                  <Stack gap={1} flex={1}>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        borderRadius={'12px'}
                        value={data.accountForm.role}
                        onChange={(e) => {
                          handlers.setAccountForm({
                            ...data.accountForm,
                            role: e.target.value as CreateAccountFormInput['role'],
                          })
                        }}
                      >
                        {/* 種別は必ず自分で選ぶ必要があるため、選び直せない空の初期選択肢を用意する */}
                        <option value={''} disabled hidden>
                          選択してください
                        </option>
                        {CreatableUserRoleList.map((role) => (
                          <option key={role} value={role}>
                            {transformUserRoleToJa(role)}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{data.fieldErrors.role}</Field.ErrorText>
                  </Stack>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            {/* ── フッターのCancel/登録ボタン ─────────────────────────── */}
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
                disabled={uiState.isSubmitting}
                onClick={() => {
                  void handlers.onSubmitAccount(data.accountForm)
                }}
              >
                登録
              </Button>
            </Dialog.Footer>

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
