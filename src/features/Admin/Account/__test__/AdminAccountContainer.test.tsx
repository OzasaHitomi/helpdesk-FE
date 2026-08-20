import { AdminAccountContainer } from '../AdminAccountContainer'
import { AdminAccountPresentational } from '../AdminAccountPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// AdminAccountContainerがAdminAccountPresentationalを表示することのみをテストする
// （表示内容自体はAdminAccountPresentational.test.tsxが担保する）

vi.mock('../AdminAccountPresentational', () => ({
  AdminAccountPresentational: vi.fn(() => <div data-testid='mocked-account-presentational' />),
}))

describe('AdminAccountContainer', () => {
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<AdminAccountContainer />)
      expect(screen.getByTestId('mocked-account-presentational')).toBeInTheDocument()
      expect(AdminAccountPresentational).toHaveBeenCalled()
    })
  })
})
