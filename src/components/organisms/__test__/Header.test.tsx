import { Header } from '../Header'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

// customRender(<Header />)
describe('Header', () => {
  describe('正常系', () => {
    it('Headerが表示されること', () => {
      customRender(<Header />)
      // 期待するものを書く
      expect(screen.getByRole('heading', { name: 'Novel HELPDESK' })).toBeInTheDocument()
    })
  })
})
