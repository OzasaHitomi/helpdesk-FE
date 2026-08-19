import { type ReactNode } from 'react'
import { Button, Field, HStack, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { TicketStatusList } from '@/share/constants/business/ticketStatusType'
import { TicketStatusDisplayTransitions } from '@/share/constants/business/ticketStatusDisplayTransitions'
import { transformTicketStatusToJa } from '@/share/logic/transform/transformTicketStatusToJa'
import { formatDateToYmdSlash } from '@/share/logic/format/formatDateToYmdSlash'
import { TicketDetailPublishButton } from './Button/TicketDetailPublishButton'
import { TicketDetailUnpublishButton } from './Button/TicketDetailUnpublishButton'
import { type TicketDetailView } from '../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'
import { type TicketStatus } from '@/share/types/ticketStatus'
import { type TicketVisibility } from '@/share/types/ticketVisibility'

interface TicketDetailInfoProps {
  data: {
    ticket: TicketDetailView
    role: UserRole | undefined
  }
  // useUpdateTicketStatusHandlerの戻り値(uiState/handlers)を、
  // そのままステータスボタンのpropsとして渡せる形で受け取る
  statusChange: {
    uiState: {
      isSubmitting: boolean
    }
    handlers: {
      onClick: (status: TicketStatus) => Promise<void>
    }
  }
  // usePublishTicketHandlerの戻り値(uiState/handlers)を、
  // そのまま公開ボタンのpropsとして渡せる形で受け取る
  publish: {
    uiState: {
      isSubmitting: boolean
    }
    handlers: {
      onClick: () => Promise<void>
    }
  }
  // useUnpublishTicketHandlerの戻り値(uiState/handlers)を、
  // そのまま非公開ボタンのpropsとして渡せる形で受け取る
  unpublish: {
    uiState: {
      isSubmitting: boolean
    }
    handlers: {
      onClick: () => Promise<void>
    }
  }
}

// 質問日・要件・詳細の入力欄(Input/Textarea)に共通する「編集不可であることを示す」見た目
// disabledではなくreadOnlyにすることで、hover時の禁止カーソル(not-allowed)を出さずにグレー背景で非活性を表現する
// 文字色もdisabled時と同様にグレーへ見せるため、_readOnly（Buttonの_disabledと同様のpseudo style）で上書きする
const disabledFieldStyle = {
  borderRadius: '12px',
  bg: 'gray.100',
  cursor: 'default',
  _readOnly: { color: 'gray.500' },
}

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
export const TicketDetailInfo = ({
  data,
  statusChange,
  publish,
  unpublish,
}: TicketDetailInfoProps) => {
  const { ticket } = data

  // 質問日は「2026/07/30」形式（スラッシュ区切り）で表示する
  // 一覧(TicketsTable)の質問日表示（半角スペース区切り）とは別仕様のため、専用のformatDateToYmdSlashを使う
  const createdAtText = formatDateToYmdSlash(ticket.createdAt)

  // 引数visibilityは「これから変更しようとしている先の設定（public/private）」を表す
  // 「今すでにその設定ではないか」と「その方向に変更する権限を自分が持っているか」の両方を満たす場合のみtrueを返す
  // （公開: 管理者/サポートのみ／非公開: 管理者/サポート+質問者本人、と方向によって権限ルールが異なるため、
  //  isPublishableByMe/isUnpublishableByMeを方向ごとに使い分けている）
  const isVisibilityClickable = (visibility: TicketVisibility) => {
    return (
      ticket.visibility !== visibility &&
      (visibility === 'public' ? ticket.isPublishableByMe : ticket.isUnpublishableByMe)
    )
  }
  // 公開・非公開どちらかの通信中は、もう一方のボタンも含めて両方クリック不可にするためのフラグ
  // （別々のAPIだが、連打や競合を防ぐため送信中は両方まとめて固める）
  const isVisibilitySubmitting = publish.uiState.isSubmitting || unpublish.uiState.isSubmitting

  // ステータスボタンがクリック可能かどうかを判定する
  // ①すでに選択中のステータスではない ②自分にステータス編集権限がある ③現在のステータスから遷移可能な先である、の3つを満たす場合のみtrue
  const isClickable = (status: TicketStatus) => {
    return (
      !(ticket.status === status) &&
      ticket.isStatusEditableByMe &&
      TicketStatusDisplayTransitions[ticket.status].includes(status)
    )
  }

  return (
    <Stack gap={5}>
      {/* ── 質問日 ───────────────────────────────────────────────── */}
      <LabeledField label={'質問日'}>
        <Input w={'3xs'} {...disabledFieldStyle} value={createdAtText} readOnly />
      </LabeledField>

      {/* ── 公開設定 ─────────────────────────────────────────────── */}
      {/* 各ボタンには役割の異なる3つの真偽値を渡している
          ・isSelected: 現在の公開設定と一致するか（枠線の色だけを決める。権限の有無は関係ない）
          ・isEditable : 「選択中（＝現在の設定）」かつ「反対方向に自分で変更できる」場合のみtrue（背景を白にして操作可能に見せる。
                         選択中でも権限が無ければグレーのまま＝見た目上は選ばれているが変更はできない、と伝える）
          ・disabled   : 実際にクリックできるかどうか（自分がその方向に変更する権限を持ち、かつ送信中でない場合のみクリック可） */}
      <LabeledField label={'公開設定'}>
        <HStack justifyContent={'flex-start'} flex={1}>
          <TicketDetailPublishButton
            // 今の設定が「公開」かどうかだけを見る（権限は無関係）。枠線の色を決める
            isSelected={ticket.visibility === 'public'}
            // 「公開」が選択中であり、かつ自分が「非公開」へ変更できる権限を持つ場合のみtrue。背景を白にするかを決める
            // （選択中でも非公開への変更権限が無ければfalseのまま＝選ばれているのに背景はグレー、という見た目になる）
            isEditable={
              ticket.visibility === 'public' &&
              isVisibilityClickable('private') &&
              !isVisibilitySubmitting
            }
            // 実際にこの「公開」ボタンをクリックしてよいか（自分に公開への変更権限があり、今は公開中ではなく、送信中でもない場合のみtrue）
            disabled={!isVisibilityClickable('public') || isVisibilitySubmitting}
            handlers={publish.handlers}
          />
          <TicketDetailUnpublishButton
            // 今の設定が「非公開」かどうかだけを見る（権限は無関係）。枠線の色を決める
            isSelected={ticket.visibility === 'private'}
            // 「非公開」が選択中であり、かつ自分が「公開」へ変更できる権限を持つ場合のみtrue。背景を白にするかを決める
            // （選択中でも公開への変更権限が無ければfalseのまま＝選ばれているのに背景はグレー、という見た目になる）
            isEditable={
              ticket.visibility === 'private' &&
              isVisibilityClickable('public') &&
              !isVisibilitySubmitting
            }
            // 実際にこの「非公開」ボタンをクリックしてよいか（自分に非公開への変更権限があり、今は非公開ではなく、送信中でもない場合のみtrue）
            disabled={!isVisibilityClickable('private') || isVisibilitySubmitting}
            handlers={unpublish.handlers}
          />
        </HStack>
      </LabeledField>

      {/* ── 要件（タイトル） ─────────────────────────────────────── */}
      <LabeledField label={'要件'}>
        <Input flex={1} {...disabledFieldStyle} value={ticket.title} readOnly />
      </LabeledField>

      {/* ── 詳細 ─────────────────────────────────────────────────── */}
      <LabeledField label={'詳細'} alignItems={'flex-start'} labelPt={2}>
        <Textarea flex={1} rows={3} {...disabledFieldStyle} value={ticket.detail} readOnly />
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

            const statusStyle = {
              w: '12rem',
              whiteSpace: 'nowrap' as const,
              textAlign: 'center' as const,
              px: 2,
              py: 1,
              borderRadius: '8px',
              borderWidth: '2px',
              borderColor: isSelected ? 'green.400' : 'transparent',
              bg: isSelected ? 'white' : 'gray.100',
              color: 'gray.700',
              fontWeight: isSelected ? 'bold' : 'normal',
            }

            return (
              <HStack key={status} gap={2}>
                {isClickable(status) ? (
                  <Button
                    size={'sm'}
                    {...statusStyle}
                    disabled={statusChange.uiState.isSubmitting}
                    _disabled={{ cursor: 'default', opacity: 1 }}
                    onClick={() => {
                      void statusChange.handlers.onClick(status)
                    }}
                  >
                    {transformTicketStatusToJa(status)}
                  </Button>
                ) : (
                  <Text as={'span'} {...statusStyle} aria-current={isSelected}>
                    {transformTicketStatusToJa(status)}
                  </Text>
                )}
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
