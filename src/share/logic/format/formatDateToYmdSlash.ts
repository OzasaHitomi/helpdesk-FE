// Date型を「YYYY/MM/DD」（スラッシュ区切り・0埋め）の表示用文字列に変換する
// 日付の表示形式を1箇所にまとめておくことで、画面ごとに形式が食い違うのを防ぐ
export const formatDateToYmdSlash = (date: Date): string =>
  [
    date.getFullYear(),
    // getMonth()は0始まり（1月=0）なので+1で補正し、padStartで2桁0埋めにする
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('/') // 各要素をスラッシュで連結する
