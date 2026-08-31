import { NotFoundPageContainer } from '../NotFoundPageContainer'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// ContainerがPresentationalを表示できているかのみをテストする
// （画面表示内容はNotFoundPagePresentational.test.tsxが担保する）

vi.mock('../NotFoundPagePresentational', () => ({
  NotFoundPagePresentational: () => <div data-testid='mocked-not-found-page-presentational' />,
}))

describe('NotFoundPageContainer', () => {
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<NotFoundPageContainer />)
      expect(screen.getByTestId('mocked-not-found-page-presentational')).toBeInTheDocument()
    })
  })
})
