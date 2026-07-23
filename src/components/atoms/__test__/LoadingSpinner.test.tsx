import { LoadingSpinner } from '../LoadingSpinner'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

describe('LoadingSpinner', () => {
  describe('正常系', () => {
    it('spinnerが表示されること', () => {
      customRender(<LoadingSpinner />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
})
