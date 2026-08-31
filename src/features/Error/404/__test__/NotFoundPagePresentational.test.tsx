import { NotFoundPagePresentational } from '../NotFoundPagePresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

describe('NotFoundPagePresentational', () => {
  describe('正常系', () => {
    it('404である旨のメッセージが表示されること', () => {
      customRender(<NotFoundPagePresentational />)
      expect(screen.getByText('404')).toBeInTheDocument()
      expect(screen.getByText('お探しのページが見つかりません')).toBeInTheDocument()
    })
  })
})
