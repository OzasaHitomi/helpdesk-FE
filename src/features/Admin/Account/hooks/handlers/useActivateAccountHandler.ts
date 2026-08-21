// アカウント再開操作のFE側ロジックを担当するhook（停止操作は別hookの担当）
// ---------------------------------------------------------------------------
// API機能は別タスクで対応するため、現時点ではボタンを配置するためのプレースホルダーとして
// 何もしないonClickを返す（mutationはまだ接続しない）
// 現時点ではHookを呼んでいないためuse-prefixが不要と警告されるが、
// 別タスクでuseActivateAccountMutationを呼ぶ実装に置き換わる想定のため命名は維持する
// ---------------------------------------------------------------------------
// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export const useActivateAccountHandler = () => {
  const onClick = async () => {
    // TODO: 別タスクで再開API呼び出し・トースト表示を実装する
  }

  return {
    uiState: { isSubmitting: false },
    handlers: { onClick },
  }
}
