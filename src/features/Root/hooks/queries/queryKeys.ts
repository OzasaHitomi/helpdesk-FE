// TanStack Queryがキャッシュを識別するための「キー」をまとめておくファイル
// キーを1箇所にまとめておくことで、GET側とinvalidateQueries（キャッシュ無効化）側で
// 同じキーを別々の場所にベタ書きして食い違う、という事故を防げる

// チケット一覧実装時、GETのqueryKeyもここに追加する
export const ticketQueryKeys = {
  // チケットに関するキャッシュ全体を表すキー。invalidateQueriesにこれを指定すると、
  // 'tickets'から始まるキャッシュ（一覧・詳細など）がまとめて無効化される
  all: ['tickets'],
}
