// TanStack Queryがキャッシュを識別するための「キー」をまとめておくファイル
// キーを1箇所にまとめておくことで、GET側とinvalidateQueries（キャッシュ無効化）側で
// 同じキーを別々の場所にベタ書きして食い違う、という事故を防げる
export const userQueryKeys = {
  // アカウント一覧に関するキャッシュ全体を表すキー
  all: ['all', 'users'],
}
