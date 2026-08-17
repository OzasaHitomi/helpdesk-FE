import { useParams } from 'react-router-dom'
import { TicketDetailPresentational } from './TicketDetailPresentational'
import { useGetTicketHandler } from './hooks/handlers/useGetTicketHandler'
import { useGetTicketCommentsHandler } from './hooks/handlers/useGetTicketCommentsHandler'
import { useCreateTicketCommentHandler } from './hooks/handlers/useCreateTicketCommentHandler'
import { useAssignTicketHandler } from './hooks/handlers/useAssignTicketHandler'
import { useUnassignTicketHandler } from './hooks/handlers/useUnassignTicketHandler'
import { useMeQuery } from '@/share/hooks/queries/useMeQuery'

// Container: 各hookを呼び出して値を集め、Presentational（見た目）に橋渡しするだけの層
// ここにロジックは書かず、「誰から何を受け取って、誰にそのまま渡すか」だけに専念する
export const TicketDetailContainer = () => {
  // ---------------------------
  // チケット情報を取得
  // ルートパラメータ(/tickets/:id)からチケットIDを取得する
  const { id } = useParams<{ id: string }>()
  // ログインしているユーザーの情報を取得
  const { data: meData } = useMeQuery()
  const { data, uiState } = useGetTicketHandler(Number(id), meData?.role, meData?.id)

  // ---------------------------
  // コメント情報を取得
  const { data: commentsData, uiState: commentsUiState } = useGetTicketCommentsHandler(Number(id))

  // ---------------------------
  // コメントフォームを取得
  // 質疑応答フォームの状態・送信処理は、そのままTicketDetailCommentFormのpropsの形で受け取れるため、
  // 分解せずcommentFormとしてひとまとめにPresentationalへ渡す
  const commentForm = useCreateTicketCommentHandler(Number(id))

  // ---------------------------

  // 担当者になるボタンの状態・操作も、同様にひとまとめにPresentationalへ渡す
  const assignment = useAssignTicketHandler(Number(id))

  // 担当解除ボタンの状態・操作も、同様にひとまとめにPresentationalへ渡す
  const unassignment = useUnassignTicketHandler(Number(id))

  // ---------------------------
  return (
    <TicketDetailPresentational
      data={{ role: meData?.role, ticket: data.ticket, comments: commentsData.comments }}
      uiState={{
        isLoading: uiState.isLoading || commentsUiState.isLoading,
        isError: uiState.isError || commentsUiState.isError,
      }}
      commentForm={commentForm}
      assignment={assignment}
      unassignment={unassignment}
    />
  )
}
