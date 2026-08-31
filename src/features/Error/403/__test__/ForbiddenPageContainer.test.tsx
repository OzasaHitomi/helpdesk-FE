import { ForbiddenPageContainer } from '../ForbiddenPageContainer'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// ContainerがPresentationalを表示できているかのみをテストする
// （画面表示内容はForbiddenPagePresentational.test.tsxが担保する）

vi.mock('../ForbiddenPagePresentational', () => ({
  ForbiddenPagePresentational: () => <div data-testid='mocked-forbidden-page-presentational' />,
}))

describe('ForbiddenPageContainer', () => {
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<ForbiddenPageContainer />)
      expect(screen.getByTestId('mocked-forbidden-page-presentational')).toBeInTheDocument()
    })
  })
})
