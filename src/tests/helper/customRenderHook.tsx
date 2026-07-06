import { renderHook, type RenderHookOptions, type RenderHookResult } from '@testing-library/react'
import { CustomRenderProvider } from '@/tests/providers/customRenderProvider'

export const customRenderHook = <Result, Props>(
  callback: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props>,
): RenderHookResult<Result, Props> => {
  return renderHook(callback, {
    wrapper: CustomRenderProvider,
    ...options,
  })
}
