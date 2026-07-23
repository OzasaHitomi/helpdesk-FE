import { LoadingPage } from '../LoadingPage'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

describe('LoadingPage', () => {
  describe('正常系', () => {
    it('spinnerが表示されること', () => {
      customRender(<LoadingPage />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
})
