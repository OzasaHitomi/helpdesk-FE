// TanStack Queryがキャッシュを識別するための「キー」をまとめておくファイル
// キーを1箇所にまとめておくことで、GET側とinvalidateQueries（キャッシュ無効化）側で
// 同じキーを別々の場所にベタ書きして食い違う、という事故を防げる
export const ticketQueryKeys = {
  // チケット一覧に関するキャッシュ全体を表すキー。invalidateQueriesにこれを指定すると、
  // ['all', 'tickets']から始まるキャッシュ（一覧など）がまとめて無効化される
  all: ['all', 'tickets'],
}
