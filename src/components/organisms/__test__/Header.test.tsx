import { Header } from '../Header'
import { customRender } from '@/tests/helpers/customRender'
import { SYSTEM_NAME } from '@/share/constants/business/systemName'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

// customRender(<Header />)
describe('Header', () => {
  describe('正常系', () => {
    it('Headerが表示されること', () => {
      customRender(<Header />)
      // 期待するものを書く
      expect(screen.getByRole('heading', { name: SYSTEM_NAME })).toBeInTheDocument()
    })

    it('システム名のリンク先がTopページ（/）であること', () => {
      customRender(<Header />)
      expect(screen.getByRole('link', { name: SYSTEM_NAME })).toHaveAttribute('href', '/')
    })

    it('Ticketが表示されること', () => {
      customRender(<Header />)
      expect(screen.getByText('Ticket')).toBeInTheDocument()
    })

    it('Ticketのリンク先がTopページ（/）であること', () => {
      customRender(<Header />)
      expect(screen.getByRole('link', { name: 'Ticket' })).toHaveAttribute('href', '/')
    })
  })
})
