import { AccountContainer } from '../AccountContainer'
import { AccountPresentational } from '../AccountPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// AccountContainerがAccountPresentationalを表示することのみをテストする
// （表示内容自体はAccountPresentational.test.tsxが担保する）

vi.mock('../AccountPresentational', () => ({
  AccountPresentational: vi.fn(() => <div data-testid='mocked-account-presentational' />),
}))

describe('AccountContainer', () => {
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<AccountContainer />)
      expect(screen.getByTestId('mocked-account-presentational')).toBeInTheDocument()
      expect(AccountPresentational).toHaveBeenCalled()
    })
  })
})
