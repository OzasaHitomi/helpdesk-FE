import { RootContainer } from '../RootContainer'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// RootPresentationalをモック化し、Containerが正しく描画委譲できているかのみをテストする
// （見出しの表示内容などはRootPresentational.test.tsxが担保する）
vi.mock('../RootPresentational', () => ({
  RootPresentational: () => <div data-testid='mocked-root-presentational' />,
}))

describe('RootContainer', () => {
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<RootContainer />)
      expect(screen.getByTestId('mocked-root-presentational')).toBeInTheDocument()
    })
  })
})
