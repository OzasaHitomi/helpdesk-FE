// チケット詳細取得のキャッシュキー
export const ticketDetailQueryKeys = {
  detail: (id: number) => ['ticket', id],
  comments: (id: number) => ['ticket', id, 'comments'],
}
