import { RootPresentational } from '../RootPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

// RootPresentationalの表示内容のみをテストする（Containerとの連携はRootContainer.test.tsxが担保する）
describe('RootPresentational', () => {
  describe('正常系', () => {
    it('見出し「チケット一覧」が表示されること', () => {
      customRender(<RootPresentational />)
      expect(screen.getByRole('heading', { name: 'チケット一覧' })).toBeInTheDocument()
    })
  })
})
