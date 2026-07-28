import { type CreateTicketForm } from '../types/CreateTicketForm'

// ダイアログの初期表示・再オープン時のリセットに使う初期値
// 公開設定は非公開をデフォルトにする（社内向けの質問は非公開が既定の運用のため）
// useCreateTicketHandler内の初期state / onOpenDialogでのリセットの2箇所で参照するため定数化している
// （使用箇所が1箇所だけならuseState内にベタ書きで十分だが、2箇所で値が乖離しないようにここに集約する）
//
// 型定義（types/CreateTicketForm.ts）とは別ファイルにしている理由:
// これは「型」ではなく「非公開がデフォルト」という業務上の既定値（ビジネス定数）であり、
// 参考構成にならい、定数はfeature内のconstants/に置く
export const INITIAL_TICKET_FORM: CreateTicketForm = {
  title: '',
  detail: '',
  visibility: 'private',
}
