export const authQueryKeys = {
  me: ['me'],
}

// チケットに関するキャッシュ全体を表すキー。invalidateQueriesにこれを指定すると、
// ['all', 'tickets']から始まるキャッシュ（一覧・詳細など）がまとめて無効化される
export const ticketQueryKeys = {
  all: ['all', 'tickets'],
  // 個別チケットのキャッシュキー。allの配下に位置するため、allでのinvalidateQueriesでも一緒に無効化される
  detail: (id: number) => [...ticketQueryKeys.all, id],
}
