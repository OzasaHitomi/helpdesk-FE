import { BaseLayout } from '../BaseLayout'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

describe('BaseLayout', () => {
  describe('正常系', () => {
    it('Headerが表示されること', () => {
      customRender(
        <Routes>
          <Route path='/' element={<BaseLayout />}>
            <Route index element={<div>子ページ</div>} />
          </Route>
        </Routes>,
      )
      // 期待するものを書く
      expect(screen.getByRole('heading', { name: 'XXX HELPDESK' })).toBeInTheDocument()
    })

    it('Outletに指定した子ルートの内容が表示されること', () => {
      customRender(
        <Routes>
          <Route path='/' element={<BaseLayout />}>
            <Route index element={<div>子ページ</div>} />
          </Route>
        </Routes>,
      )
      // 期待するものを書く
      expect(screen.getByText('子ページ')).toBeInTheDocument()
    })
  })
})
