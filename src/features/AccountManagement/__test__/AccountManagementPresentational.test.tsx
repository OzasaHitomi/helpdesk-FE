import { AccountManagementPresentational } from '../AccountManagementPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

// AccountManagementPresentationalの表示内容（見出し）のみをテストする

describe('AccountManagementPresentational', () => {
  describe('正常系', () => {
    it('見出し「アカウント管理画面」が表示されること', () => {
      customRender(<AccountManagementPresentational />)
      expect(screen.getByText('アカウント管理画面')).toBeInTheDocument()
    })
  })
})
