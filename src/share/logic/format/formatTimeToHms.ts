// Date型を「HH:MM:SS」（コロン区切り・0埋め・秒まで）の表示用文字列に変換する
export const formatTimeToHms = (date: Date): string =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
