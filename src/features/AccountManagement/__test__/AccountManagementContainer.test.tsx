import { AccountManagementContainer } from '../AccountManagementContainer'
import { AccountManagementPresentational } from '../AccountManagementPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// AccountManagementContainerがAccountManagementPresentationalを表示することのみをテストする
// （表示内容自体はAccountManagementPresentational.test.tsxが担保する）

vi.mock('../AccountManagementPresentational', () => ({
  AccountManagementPresentational: vi.fn(() => (
    <div data-testid='mocked-account-management-presentational' />
  )),
}))

describe('AccountManagementContainer', () => {
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<AccountManagementContainer />)
      expect(screen.getByTestId('mocked-account-management-presentational')).toBeInTheDocument()
      expect(AccountManagementPresentational).toHaveBeenCalled()
    })
  })
})
