import { type ReactNode } from 'react'
import { Button, Field, HStack, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { TicketVisibilityList } from '@/share/constants/business/ticketVisibilityType'
import { TicketStatusList } from '@/share/constants/business/ticketStatusType'
import { transformTicketVisibilityToJa } from '@/share/logic/transform/transformTicketVisibilityToJa'
import { transformTicketStatusToJa } from '@/share/logic/transform/transformTicketStatusToJa'
import { formatDateToYmdSlash } from '@/share/logic/format/formatDateToYmdSlash'
import { type TicketDetailView } from '../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'

interface TicketDetailInfoProps {
  data: {
    ticket: TicketDetailView
    role: UserRole | undefined
  }
}

// 質問日・要件・詳細の入力欄(Input/Textarea)に共通する「編集不可であることを示す」見た目
const disabledFieldStyle = { borderRadius: '12px', bg: 'gray.100' }

// LabeledFieldPropsはこのコンポーネント専用のレイアウト引数であり、外部(Presentational)から渡される値ではない
interface LabeledFieldProps {
  label: string
  alignItems?: 'center' | 'flex-start'
  labelPt?: number
  children: ReactNode
}

// 質問日・公開設定・要件・詳細に共通する「ラベル+横並び」のField.Root構成をまとめた内部コンポーネント
// （ステータスのみラベル下に枠を置く縦並びレイアウトのため対象外）
const LabeledField = ({ label, alignItems = 'center', labelPt, children }: LabeledFieldProps) => (
  <Field.Root
    orientation={'horizontal'}
    gap={6}
    alignItems={alignItems}
    justifyContent={'flex-start'}
  >
    <Field.Label fontWeight={'bold'} justifyContent={'center'} pt={labelPt}>
      {label}
    </Field.Label>
    {children}
  </Field.Root>
)

// チケット詳細の内容を表示する専用コンポーネント（見た目専用、編集操作は持たない）
// 公開設定は新規登録ダイアログ(CreateTicketDialog)の選択ボタンと同じ見た目にし、現在の値だけをハイライト表示する
// （onClickは持たせていないため、実際の編集操作はまだできない）
export const TicketDetailInfo = ({ data }: TicketDetailInfoProps) => {
  const { ticket, role } = data

  // 質問日は「2026/07/30」形式（スラッシュ区切り）で表示する
  // 一覧(TicketsTable)の質問日表示（半角スペース区切り）とは別仕様のため、専用のformatDateToYmdSlashを使う
  const createdAtText = formatDateToYmdSlash(ticket.createdAt)

  // 公開設定の変更はサポート担当・管理者のみに許可する想定のため、社員アカウントの場合はボタンを無効化する
  // （実際の変更操作自体は別タスクで実装予定。現時点ではdisabledの出し分けのみ）
  const isVisibilityDisabled = role === 'employee'

  return (
    <Stack gap={5}>
      {/* ── 質問日 ───────────────────────────────────────────────── */}
      <LabeledField label={'質問日'}>
        <Input flex={1} {...disabledFieldStyle} value={createdAtText} disabled />
      </LabeledField>

      {/* ── 公開設定 ─────────────────────────────────────────────── */}
      <LabeledField label={'公開設定'}>
        <HStack justifyContent={'flex-start'} flex={1}>
          {TicketVisibilityList.map((visibility) => {
            const isSelected = ticket.visibility === visibility
            return (
              <Button
                key={visibility}
                size={'sm'}
                w={'88px'}
                borderRadius={'12px'}
                aria-pressed={isSelected}
                // 選択中でも、社員アカウント(disabled)の場合は背景をグレーにする（枠線の色はそのまま）
                bg={isSelected && !isVisibilityDisabled ? 'white' : 'gray.100'}
                borderWidth={'2px'}
                borderColor={isSelected ? 'green.400' : 'transparent'}
                color={'gray.700'}
                disabled={isVisibilityDisabled}
              >
                {transformTicketVisibilityToJa(visibility)}
              </Button>
            )
          })}
        </HStack>
      </LabeledField>

      {/* ── 要件（タイトル） ─────────────────────────────────────── */}
      <LabeledField label={'要件'}>
        <Input flex={1} {...disabledFieldStyle} value={ticket.title} disabled />
      </LabeledField>

      {/* ── 詳細 ─────────────────────────────────────────────────── */}
      <LabeledField label={'詳細'} alignItems={'flex-start'} labelPt={2}>
        <Textarea flex={1} rows={3} {...disabledFieldStyle} value={ticket.detail} disabled />
      </LabeledField>

      {/* ── ステータス ───────────────────────────────────────────── */}
      {/* 他の項目(ラベル+横並び)と違い、ラベルの下に枠を置く縦並びレイアウトにする
          枠は中身に合わせず幅いっぱい(w='100%')に確保する。これによりFieldRoot自体の
          左端（他のInputの左端より左）に揃い、右端は他のInputの右端と揃う */}
      <Field.Root gap={2} alignItems={'flex-start'}>
        <Field.Label fontWeight={'bold'}>ステータス</Field.Label>
        <HStack
          w={'100%'}
          justifyContent={'center'}
          bg={'gray.50'}
          borderRadius={'12px'}
          px={4}
          py={2}
          wrap={'wrap'}
        >
          {TicketStatusList.map((status, index) => {
            const isSelected = ticket.status === status
            return (
              <HStack key={status} gap={2}>
                <Text
                  as={'span'}
                  w={'172px'}
                  whiteSpace={'nowrap'}
                  textAlign={'center'}
                  px={2}
                  py={1}
                  borderRadius={'8px'}
                  borderWidth={'2px'}
                  borderColor={isSelected ? 'green.400' : 'transparent'}
                  bg={'white'}
                  color={'gray.700'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  aria-current={isSelected}
                >
                  {transformTicketStatusToJa(status)}
                </Text>
                {/* 最後の要素の後ろには「ー」を付けない */}
                {index < TicketStatusList.length - 1 && (
                  <Text as={'span'} color={'gray.500'}>
                    ー
                  </Text>
                )}
              </HStack>
            )
          })}
        </HStack>
      </Field.Root>
    </Stack>
  )
}
