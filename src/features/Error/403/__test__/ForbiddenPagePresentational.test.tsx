import { ForbiddenPagePresentational } from '../ForbiddenPagePresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

describe('ForbiddenPagePresentational', () => {
  describe('正常系', () => {
    it('403である旨のメッセージが表示されること', () => {
      customRender(<ForbiddenPagePresentational />)
      expect(screen.getByText('403')).toBeInTheDocument()
      expect(screen.getByText('アクセス権限がありません')).toBeInTheDocument()
    })
  })
})
